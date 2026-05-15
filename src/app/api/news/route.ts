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
];

export async function GET() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const groqApiKey = process.env.GROQ_NEWS_API_KEY || process.env.GROQ_API_KEY;
  const today = new Date().toISOString().split("T")[0];
  const dailyNewsRef = adminDb?.collection("daily_intelligence").doc(today) ?? null;

  try {
    // 1. Try Cache First
    if (dailyNewsRef) {
      const cachedDoc = await dailyNewsRef.get();
      if (cachedDoc.exists) {
        return NextResponse.json({ success: true, data: cachedDoc.data()?.items, source: "cache" });
      }
    }

    if (!newsApiKey || !groqApiKey) {
      return NextResponse.json({ success: true, data: fallbackNews, source: "fallback" });
    }

    // 2. Fetch Real News from NewsAPI
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q="job scam" OR "recruitment fraud" OR "employment scam"&language=en&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`
    );
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      throw new Error("No real-world news found today");
    }

    // 3. Use Groq to transform real news into Threat Intel format
    const groq = new Groq({ apiKey: groqApiKey });
    const newsContext = newsData.articles.map((a: any) => `- ${a.title}: ${a.description}`).join("\n");

    const prompt = `
      You are an elite cybersecurity intelligence officer. I will provide you with real news headlines about job scams.
      Transform these into exactly 5 "Threat Intel" objects for our dashboard.
      Use the real news content as the source.
      
      Each object must have:
      - title (concise, professional)
      - risk (Critical, High, Medium)
      - summary (2 sentences max)
      - target (Sector/Industry targeted)
      - confidence (90-99)

      Real News Context:
      ${newsContext}

      Return ONLY a JSON array of objects.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0].message.content || "{}";
    let news = [];

    try {
      const content = JSON.parse(rawContent);
      news = Array.isArray(content) ? content : (content.items || content.news || Object.values(content)[0]);
      if (!Array.isArray(news)) news = [];
    } catch (e) {
      console.error("News Transformation Error:", e);
      news = fallbackNews;
    }

    // 4. Cache the real-world intelligence
    if (news.length > 0 && dailyNewsRef) {
      await dailyNewsRef.set({
        items: news.slice(0, 5),
        generatedAt: new Date().toISOString(),
        source: "NewsAPI + Groq Intelligence",
        date: today
      });
    }

    return NextResponse.json({ success: true, data: news.slice(0, 5), source: "real-time intelligence" });

  } catch (error: any) {
    console.error("Global News API Error:", error);
    return NextResponse.json({ success: true, data: fallbackNews, source: "fallback" });
  }
}
