import { NextResponse } from "next/server";
import { analyzeJobFraud, type AnalysisInput } from "@/ai/groq";

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const input = normalizeInput(body);

    if (!input) {
      return NextResponse.json(
        { error: "Content is required for analysis." },
        { status: 400 }
      );
    }

    if (input.sourceType !== "url" && input.content.length < 20) {
      return NextResponse.json(
        { error: "Please provide more detail so the detector can assess the content reliably." },
        { status: 400 }
      );
    }

    if (input.sourceType === "url" && !/^https?:\/\/|^[a-z0-9.-]+\.[a-z]{2,}/i.test(input.content)) {
      return NextResponse.json(
        { error: "Please provide a valid company or job URL." },
        { status: 400 }
      );
    }

    const analysisResult = await analyzeJobFraud(input);

    return NextResponse.json({
      success: true,
      data: analysisResult,
      meta: {
        sourceType: input.sourceType,
        analyzedCharacters: input.content.length,
        usedUrl: Boolean(input.url),
      },
    });
  } catch (error) {
    console.error("Analysis API Error:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred during analysis." },
      { status: 500 }
    );
  }
}
