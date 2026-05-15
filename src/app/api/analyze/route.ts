import { NextResponse } from "next/server";
import { recognize } from "tesseract.js";
import { analyzeJobFraud, type AnalysisInput } from "@/ai/groq";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_FETCH_CHARS = 12000;

function normalizeInput(body: unknown): AnalysisInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as Record<string, unknown>;
  const content = typeof candidate.content === "string" ? candidate.content.trim() : "";

  if (!content) {
    return null;
  }

  return {
    content,
    sourceType:
      candidate.sourceType === "text" ||
      candidate.sourceType === "upload" ||
      candidate.sourceType === "url" ||
      candidate.sourceType === "email" ||
      candidate.sourceType === "chat"
        ? candidate.sourceType
        : "text",
    url: typeof candidate.url === "string" ? candidate.url.trim() : undefined,
    companyName: typeof candidate.companyName === "string" ? candidate.companyName.trim() : undefined,
    recruiterName:
      typeof candidate.recruiterName === "string" ? candidate.recruiterName.trim() : undefined,
    channel: typeof candidate.channel === "string" ? candidate.channel.trim() : undefined,
    locale: typeof candidate.locale === "string" ? candidate.locale.trim() : undefined,
  };
}

function ensureHttpUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchUrlText(rawUrl: string) {
  const url = ensureHttpUrl(rawUrl.trim());
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "VeriHireAI/3.0 URL scanner",
        accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Unable to open the URL (${response.status}).`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!/text\/html|text\/plain|application\/json/i.test(contentType)) {
      throw new Error("This URL does not expose readable page content.");
    }

    const rawText = await response.text();
    const titleMatch = rawText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch?.[1] ? stripHtml(titleMatch[1]) : "";
    const pageText = /text\/html/i.test(contentType) ? stripHtml(rawText) : rawText.replace(/\s+/g, " ").trim();
    const combined = [title, pageText].filter(Boolean).join(". ");

    if (!combined) {
      throw new Error("No readable text was found on the page.");
    }

    return {
      url,
      content: combined.slice(0, MAX_FETCH_CHARS),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function extractPdfText(arrayBuffer: ArrayBuffer) {
  const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
  const document = await pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    useWorkerFetch: false,
    isEvalSupported: false,
  }).promise;

  const pages: string[] = [];

  for (let index = 1; index <= document.numPages; index += 1) {
    const page = await document.getPage(index);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      pages.push(pageText);
    }

    if (pages.join(" ").length >= MAX_FETCH_CHARS) {
      break;
    }
  }

  return pages.join(" ").slice(0, MAX_FETCH_CHARS).trim();
}

async function extractImageText(arrayBuffer: ArrayBuffer) {
  const result = await recognize(Buffer.from(arrayBuffer), "eng");
  return result.data.text.replace(/\s+/g, " ").trim();
}

async function extractUploadInput(file: File): Promise<AnalysisInput> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File size exceeds the 5MB upload limit.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  let content = "";

  if (mimeType.startsWith("image/")) {
    content = await extractImageText(arrayBuffer);
  } else if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
    content = await extractPdfText(arrayBuffer);
  } else if (mimeType.startsWith("text/") || fileName.endsWith(".txt")) {
    content = Buffer.from(arrayBuffer).toString("utf-8").replace(/\s+/g, " ").trim();
  } else {
    throw new Error("Unsupported upload type. Please use an image, PDF, or text file.");
  }

  if (!content) {
    throw new Error("No readable text could be extracted from this upload.");
  }

  return {
    content: content.slice(0, MAX_FETCH_CHARS),
    sourceType: "upload",
    channel: `upload:${file.name}`,
  };
}

async function parseRequestInput(request: Request): Promise<AnalysisInput | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return null;
    }

    return extractUploadInput(fileEntry);
  }

  const body = await request.json();
  const normalized = normalizeInput(body);

  if (!normalized) {
    return null;
  }

  if (normalized.sourceType === "url") {
    const fetched = await fetchUrlText(normalized.content);
    return {
      ...normalized,
      content: fetched.content,
      url: fetched.url,
      channel: normalized.channel ?? "url-fetch",
    };
  }

  return normalized;
}

function validateInput(input: AnalysisInput) {
  const minimumLength = input.sourceType === "chat" ? 6 : 20;

  if (input.sourceType !== "url" && input.content.length < minimumLength) {
    return input.sourceType === "chat"
      ? "Please provide a slightly longer question so I can assess it properly."
      : "Please provide more detail so the detector can assess the content reliably.";
  }

  if (input.sourceType === "url" && !input.url) {
    return "Please provide a valid company or job URL.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const input = await parseRequestInput(request);

    if (!input) {
      return NextResponse.json({ error: "Content is required for analysis." }, { status: 400 });
    }

    const validationError = validateInput(input);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const analysisResult = await analyzeJobFraud(input).catch((err) => {
      console.error("Inner Analysis Error:", err);
      throw err;
    });

    return NextResponse.json({
      success: true,
      data: analysisResult,
      meta: {
        sourceType: input.sourceType,
        analyzedCharacters: input.content.length,
        usedUrl: Boolean(input.url),
      },
    });
  } catch (error: unknown) {
    console.error("Top-level Analysis API Error:", error);

    const status = typeof error === "object" && error !== null && "status" in error ? (error as { status?: number }).status : undefined;
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: unknown }).message ?? "Unknown error")
        : "Unknown error";

    if (status === 401) {
      return NextResponse.json({ error: "Invalid Groq API Key or Credits Exhausted" }, { status: 401 });
    }
    if (status === 429) {
      return NextResponse.json({ error: "Groq API Rate Limit Reached" }, { status: 429 });
    }

    return NextResponse.json(
      {
        error: "An internal server error occurred during analysis.",
        details: message,
      },
      { status: 500 }
    );
  }
}
