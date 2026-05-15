import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { adminDb } from "@/firebase/admin";

const fallbackNews = [
  {
    title: "Telegram Recruiter Impersonation Wave",
    risk: "High",
    summary: "Scammers are moving candidates off-platform quickly and sending fake interview confirmations through messaging apps.",
    target: "Remote Work",
    confidence: 94,
    url: "https://virehire.ai/threats",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Fake Offer Letters With Deposit Requests",
    risk: "Critical",
    summary: "Fraud campaigns are using branded offer letters and asking for onboarding or security-deposit payments.",
    target: "Tech",
    confidence: 97,
    url: "https://virehire.ai/threats",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  },
];

export async function GET() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const groqApiKey = process.env.GROQ_NEWS_API_KEY || process.env.GROQ_API_KEY;
  const today = new Date().toISOString().split("T")[0];
  const dailyNewsRef = adminDb?.collection("daily_intelligence").doc(today) ?? null;

  try {
    // 1. Try Cache First (Cache for 2 hours to ensure freshness)
    if (dailyNewsRef) {
      const cachedDoc = await dailyNewsRef.get();
      if (cachedDoc.exists) {
        const data = cachedDoc.data();
        const lastUpdated = new Date(data?.generatedAt || 0).getTime();
        const now = new Date().getTime();
        
        if (now - lastUpdated < 2 * 60 * 60 * 1000) {
          return NextResponse.json({ success: true, data: data?.items, source: "cache" });
        }
      }
    }

    if (!newsApiKey || !groqApiKey) {
      return NextResponse.json({ success: true, data: fallbackNews, source: "fallback" });
    }

    // 2. Fetch Real News from NewsAPI
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q="job scam" OR "recruiter scam" OR "employment fraud"&language=en&sortBy=publishedAt&pageSize=12&apiKey=${newsApiKey}`
    );
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      throw new Error("No news found");
    }

    // 3. Use Groq to transform real news
    const groq = new Groq({ apiKey: groqApiKey });
    
    // Explicitly pass data as a list of possibilities
    const newsContext = newsData.articles.slice(0, 10).map((a: any, i: number) => 
      `SOURCE_${i}:
      TITLE: ${a.title}
      DESC: ${a.description}
      LINK: ${a.url}
      IMG: ${a.urlToImage || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}`
    ).join("\n\n");

    const prompt = `
      You are a cybersecurity analyst. Transform these news sources into 6 structured Threat Intel objects.
      
      CRITICAL RULES:
      1. You MUST use the LINK from the SOURCE for the "url" field.
      2. You MUST use the IMG from the SOURCE for the "image" field.
      3. Do NOT invent URLs or Images.
      4. If a SOURCE has no IMG, use 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'.

      Response Format (JSON):
      {
        "items": [
          {
            "title": "...",
            "risk": "Critical|High|Medium",
            "summary": "...",
            "target": "...",
            "confidence": 95,
            "url": "...",
            "image": "..."
          }
        ]
      }

      Sources:
      ${newsContext}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Low temperature for higher accuracy
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0].message.content || "{}";
    let news = [];

    try {
      const content = JSON.parse(rawContent);
      news = content.items || content.news || (Array.isArray(content) ? content : []);
    } catch (e) {
      console.error("Parse Error:", e);
      news = fallbackNews;
    }

    // Ensure all items have required fields
    const validNews = news.map((item: any, idx: number) => ({
      ...item,
      url: item.url || item.link || "https://virehire.ai/threats",
      image: item.image || item.img || fallbackNews[idx % 2].image
    })).slice(0, 6);

    // 4. Cache the results
    if (validNews.length > 0 && dailyNewsRef) {
      await dailyNewsRef.set({
        items: validNews,
        generatedAt: new Date().toISOString(),
        source: "NewsAPI + Groq Real-Time",
        date: today
      });
    }

    return NextResponse.json({ success: true, data: validNews, source: "real-time intelligence" });

  } catch (error: any) {
    console.error("Global News API Error:", error);
    return NextResponse.json({ success: true, data: fallbackNews, source: "fallback" });
  }
}
