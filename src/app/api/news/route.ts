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
    // 1. Try Cache First (Cache for 6 hours to keep it fresh)
    if (dailyNewsRef) {
      const cachedDoc = await dailyNewsRef.get();
      if (cachedDoc.exists) {
        const data = cachedDoc.data();
        const lastUpdated = new Date(data?.generatedAt || 0).getTime();
        const now = new Date().getTime();
        
        // If less than 6 hours old, return cache
        if (now - lastUpdated < 6 * 60 * 60 * 1000) {
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
      throw new Error("No real-world news found today");
    }

    // 3. Use Groq to transform real news into Threat Intel format
    const groq = new Groq({ apiKey: groqApiKey });
    
    // Provide titles, descriptions, URLs and images to Groq
    const newsContext = newsData.articles.map((a: any, i: number) => 
      `ARTICLE ${i}:
      Title: ${a.title}
      Desc: ${a.description}
      URL: ${a.url}
      Image: ${a.urlToImage}`
    ).join("\n\n");

    const prompt = `
      You are an elite cybersecurity intelligence officer. Transform these real-world news articles into 6 "Threat Intel" objects.
      
      For each object, you MUST include:
      - title (concise, professional)
      - risk (Critical, High, Medium)
      - summary (2 sentences max)
      - target (Sector targeted)
      - confidence (90-99)
      - url (MUST use the exact URL from the corresponding article)
      - image (MUST use the exact Image URL from the corresponding article)

      News Source Articles:
      ${newsContext}

      Return ONLY a JSON array of objects.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
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

    // 4. Cache the results
    if (news.length > 0 && dailyNewsRef) {
      await dailyNewsRef.set({
        items: news.slice(0, 6),
        generatedAt: new Date().toISOString(),
        source: "NewsAPI + Groq Real-Time",
        date: today
      });
    }

    return NextResponse.json({ success: true, data: news.slice(0, 6), source: "real-time intelligence" });

  } catch (error: any) {
    console.error("Global News API Error:", error);
    return NextResponse.json({ success: true, data: fallbackNews, source: "fallback" });
  }
}
