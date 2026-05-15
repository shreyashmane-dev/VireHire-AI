import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { adminDb } from "@/firebase/admin";

export async function GET() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const groqApiKey = process.env.GROQ_NEWS_API_KEY || process.env.GROQ_API_KEY;
  const today = new Date().toISOString().split("T")[0];
  const dailyNewsRef = adminDb?.collection("daily_intelligence").doc(today) ?? null;

  try {
    // 1. Try Cache First (1 hour for dev/testing)
    if (dailyNewsRef) {
      const cachedDoc = await dailyNewsRef.get();
      if (cachedDoc.exists) {
        const data = cachedDoc.data();
        const lastUpdated = new Date(data?.generatedAt || 0).getTime();
        if (Date.now() - lastUpdated < 1 * 60 * 60 * 1000) {
          return NextResponse.json({ success: true, data: data?.items, source: "cache" });
        }
      }
    }

    if (!newsApiKey || !groqApiKey) {
      throw new Error("Keys missing");
    }

    // 2. Fetch News - Broader query for better image coverage
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=("job scam" OR "recruitment fraud" OR "phishing")&language=en&sortBy=relevancy&pageSize=20&apiKey=${newsApiKey}`
    );
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      throw new Error("No news articles");
    }

    // Filter articles that MUST have a URL and Title
    const validRaw = newsData.articles.filter((a: any) => a.title && a.url && a.title !== "[Removed]").slice(0, 12);

    // 3. AI Analysis
    const groq = new Groq({ apiKey: groqApiKey });
    const prompt = `
      Analyze these news items. Pick the 6 most relevant job-scam/threat intelligence stories.
      For each, return:
      - index (from source list)
      - risk_level (Critical, High, Medium)
      - punchy_summary (12 words max)
      - industry (1-2 words)

      SOURCES:
      ${validRaw.map((a: any, i: number) => `[${i}] ${a.title}`).join('\n')}

      RETURN ONLY JSON: {"selections": [{"index": 0, "risk_level": "...", "punchy_summary": "...", "industry": "..."}]}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"selections": []}');
    const selections = result.selections || [];

    // 4. Deterministic Assembly - USE ORIGINAL API STRINGS
    const finalData = selections.map((sel: any) => {
      const source = validRaw[sel.index];
      if (!source) return null;

      return {
        title: source.title,
        risk: sel.risk_level || "High",
        summary: sel.punchy_summary || source.description?.substring(0, 80),
        target: sel.industry || "Global",
        confidence: 90 + Math.floor(Math.random() * 10),
        url: source.url, // EXACT URL from NewsAPI
        image: source.urlToImage || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&sig=${sel.index}` // EXACT Image or HQ Fallback
      };
    }).filter(Boolean);

    // 5. Cache and Return
    if (finalData.length > 0 && dailyNewsRef) {
      await dailyNewsRef.set({
        items: finalData,
        generatedAt: new Date().toISOString(),
        source: "NewsAPI + Determinstic Logic"
      });
    }

    return NextResponse.json({ success: true, data: finalData, source: "real-time intelligence" });

  } catch (error) {
    console.error("API Failure:", error);
    return NextResponse.json({ success: true, data: [], source: "error-fallback" });
  }
}
