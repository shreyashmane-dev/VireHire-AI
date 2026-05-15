import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { adminDb } from "@/firebase/admin";

const fallbackNews = [
  {
    title: "Telegram Recruiter Impersonation Wave",
    risk: "High",
    summary: "Scammers are moving candidates off-platform quickly and sending fake interview confirmations through messaging apps. Verify recruiters through the company careers page before sharing documents.",
    target: "Remote Work",
    confidence: 94,
  },
  {
    title: "Fake Offer Letters With Deposit Requests",
    risk: "Critical",
    summary: "Fraud campaigns are using branded offer letters and asking for onboarding, device, or security-deposit payments. Legitimate employers should not charge candidates to start work.",
    target: "Tech",
    confidence: 97,
  },
  {
    title: "Lookalike Domains Used for Hiring Portals",
    risk: "High",
    summary: "Newly registered domains are imitating real employers and collecting resumes plus identity documents. Always compare the sender domain with the company’s official website.",
    target: "Finance",
    confidence: 93,
  },
  {
    title: "Task Job Scams Targeting Entry-Level Applicants",
    risk: "Medium",
    summary: "Short-form data-entry and rating-task roles are promising fast payouts for minimal work. These campaigns often escalate into payment requests once trust is built.",
    target: "Entry Level",
    confidence: 91,
  },
  {
    title: "Document Harvesting During Fake Verification",
    risk: "High",
    summary: "Candidates are being asked for ID cards, banking details, and selfies before any real interview takes place. Delay document sharing until the employer is independently verified.",
    target: "Global Hiring",
    confidence: 95,
  },
];

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ success: true, data: fallbackNews, source: "fallback" });
  }

  const groq = new Groq({ apiKey });
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const dailyNewsRef = adminDb?.collection("daily_intelligence").doc(today) ?? null;

  try {
    // 1. Try to fetch today's news from Firestore first
    if (dailyNewsRef) {
      const cachedDoc = await dailyNewsRef.get();
      if (cachedDoc.exists) {
        return NextResponse.json({ success: true, data: cachedDoc.data()?.items, source: "cache" });
      }
    }

    // 2. If not found, generate new news with Groq
    const prompt = `
      You are an elite cybersecurity intelligence officer specializing in recruitment fraud.
      Generate a list of 5 "Latest Threat Intel" items for ${today}.
      Each item should include:
      - Title (catchy but professional)
      - Risk Level (Critical, High, Medium)
      - Summary (2 sentences about a trending scam type)
      - Target Sector (e.g., Tech, Finance, Remote Work)
      - Confidence Score (90-99%)

      Return ONLY a JSON array of objects.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0].message.content || "{}";
    let news = [];

    try {
      const content = JSON.parse(rawContent);
      news = Array.isArray(content) ? content : (content.news || content.items || []);
    } catch (parseError) {
      console.error("Groq JSON Parse Error:", parseError, "Raw content:", rawContent);
      // Fallback to empty news if AI fails to format correctly
      news = [];
    }

    // 3. Save to Firestore for other users today
    if (news.length > 0 && dailyNewsRef) {
      try {
        await dailyNewsRef.set({
          items: news,
          generatedAt: new Date().toISOString(),
          date: today
        });
      } catch (dbError) {
        console.error("Firestore Cache Save Error:", dbError);
      }
    }

    return NextResponse.json({ success: true, data: news, source: "groq" });
  } catch (error: unknown) {
    console.error("News API Error:", error);

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
        success: true,
        data: fallbackNews,
        source: "fallback",
        warning: `Threat feed fell back to seeded intel: ${message}`,
      },
      { status: 200 }
    );
  }
}
