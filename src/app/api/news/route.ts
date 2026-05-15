import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { adminDb } from "@/firebase/admin";

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const groq = new Groq({ apiKey });
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const dailyNewsRef = adminDb.collection("daily_intelligence").doc(today);

  try {
    // 1. Try to fetch today's news from Firestore first
    const cachedDoc = await dailyNewsRef.get();
    if (cachedDoc.exists) {
      return NextResponse.json({ success: true, data: cachedDoc.data()?.items, source: "cache" });
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

    const content = JSON.parse(completion.choices[0].message.content || "{}");
    const news = Array.isArray(content) ? content : (content.news || content.items || []);

    // 3. Save to Firestore for other users today
    if (news.length > 0) {
      await dailyNewsRef.set({
        items: news,
        generatedAt: new Date().toISOString(),
        date: today
      });
    }

    return NextResponse.json({ success: true, data: news, source: "groq" });
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ error: "Failed to fetch threat intel" }, { status: 500 });
  }
}
