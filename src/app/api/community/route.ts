import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const MOCK_REPORTS = [
  {
    id: "rep_1",
    title: "Fake Google HR Interview via WhatsApp",
    description: "Recruiter posing as Google HR moved the conversation to WhatsApp immediately. Asked for a $200 'security deposit' for a MacBook Pro. Classic identity theft attempt.",
    scamType: "Identity Theft",
    riskLevel: "Critical",
    platform: "WhatsApp / LinkedIn",
    userName: "CyberSentinel",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 3600 }
  },
  {
    id: "rep_2",
    title: "Upfront Training Fee for Remote Data Entry",
    description: "Received an offer for $35/hr. They required a $150 training fee to be paid via Zelle before 'onboarding' could begin. Blocked immediately.",
    scamType: "Financial Fraud",
    riskLevel: "High",
    platform: "Indeed",
    userName: "AgentZero",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 7200 }
  },
  {
    id: "rep_3",
    title: "Phishing Link in 'Urgent' Adobe Offer",
    description: "Email claimed I was selected for a designer role. The 'Offer Letter' link directed to a lookalike Microsoft login page to steal credentials.",
    scamType: "Phishing",
    riskLevel: "Critical",
    platform: "Email",
    userName: "DesignShield",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 14400 }
  },
  {
    id: "rep_4",
    title: "Check Overpayment Scam - Device Procurement",
    description: "Company sent a digital check for $3000 to 'buy equipment' from their 'vendor'. Asked me to send back the surplus. Bank confirmed check was fraudulent.",
    scamType: "Check Fraud",
    riskLevel: "Critical",
    platform: "Direct Outreach",
    userName: "SecureDev",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 86400 }
  },
  {
    id: "rep_5",
    title: "Impersonation of Meta Talent Acquisition",
    description: "Profile used Meta branding but the email domain was @meta-careers.io instead of @meta.com. Tried to collect SSN for 'background check' early.",
    scamType: "Impersonation",
    riskLevel: "High",
    platform: "LinkedIn",
    userName: "PrivacyFirst",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 172800 }
  },
  {
    id: "rep_6",
    title: "Crypto-based 'Task' Scam on Telegram",
    description: "Promised $500/day for 'liking YouTube videos'. Required a crypto wallet connection that requested full access permissions. Highly dangerous.",
    scamType: "Wallet Drainer",
    riskLevel: "Critical",
    platform: "Telegram",
    userName: "CryptoGuard",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 200000 }
  },
  {
    id: "rep_7",
    title: "Fake UPS Logistics Manager Role",
    description: "Interview conducted entirely via text. They 'hired' me in 10 minutes and asked for my banking details for 'payroll setup' before a contract was signed.",
    scamType: "Data Mining",
    riskLevel: "High",
    platform: "CareerBuilder",
    userName: "LogiWatch",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 250000 }
  },
  {
    id: "rep_8",
    title: "Skype Interview impersonating Microsoft",
    description: "Video was off, audio sounded like a voice changer. Asked for a scan of my passport to 'verify my identity' for a cloud architect position.",
    scamType: "Identity Theft",
    riskLevel: "Critical",
    platform: "Skype",
    userName: "CloudDefender",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 300000 }
  },
  {
    id: "rep_9",
    title: "Paid Background Check Scam",
    description: "Job looked real, but required a 'certified' background check from a specific link that cost $45. Link was a payment-trap for credit card theft.",
    scamType: "Credit Card Fraud",
    riskLevel: "High",
    platform: "ZipRecruiter",
    userName: "CardProtector",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 350000 }
  },
  {
    id: "rep_10",
    title: "Fake Amazon Flex Driver Recruitment",
    description: "Scammers running ads for Amazon drivers. Directed to a site requesting driver's license photos and home address for a 'free vest'.",
    scamType: "Identity Theft",
    riskLevel: "High",
    platform: "Facebook Ads",
    userName: "DriverSafety",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 400000 }
  },
  {
    id: "rep_11",
    title: "Remote Assistant 'Mystery Shopper' Scam",
    description: "Asked to purchase gift cards and send photos of the codes to 'test' the local retailer's service. Classic money mule/gift card scam.",
    scamType: "Gift Card Scam",
    riskLevel: "High",
    platform: "Glassdoor",
    userName: "ShopSentry",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 450000 }
  },
  {
    id: "rep_12",
    title: "Unsolicited 'Executive' Job Offer",
    description: "Recruiter offered a $250k salary for a role I never applied for. Required a 'membership fee' to join their 'exclusive talent pool'.",
    scamType: "Advance Fee Fraud",
    riskLevel: "High",
    platform: "Direct Email",
    userName: "ExecShield",
    timestamp: { seconds: Math.floor(Date.now() / 1000) - 500000 }
  }
];

export async function GET(req: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: true, data: MOCK_REPORTS });
    }
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let reports = [];

    if (userId) {
      const snapshot = await adminDb.collection("reports").where("userId", "==", userId).limit(50).get();
      reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? { seconds: doc.data().timestamp.seconds } : null,
      }));
    } else {
      const snapshot = await adminDb.collection("reports").orderBy("timestamp", "desc").limit(20).get();
      reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? { seconds: doc.data().timestamp.seconds } : null,
      }));
    }

    // Combine with mock reports if the DB is empty or has very few items
    if (reports.length < 5 && !userId) {
      reports = [...reports, ...MOCK_REPORTS].slice(0, 20);
    }

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error("Community API Error:", error);
    return NextResponse.json({ success: true, data: MOCK_REPORTS, source: "fallback" });
  }
}

export async function POST(req: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Firebase Admin not initialized." }, { status: 500 });
    }
    const body = await req.json();
    const { title, description, scamType, riskLevel, platform, userId, userName } = body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !scamType?.trim() ||
      !riskLevel?.trim() ||
      !platform?.trim() ||
      !userId?.trim()
    ) {
      return NextResponse.json({ error: "Missing required report fields." }, { status: 400 });
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      scamType: scamType.trim(),
      riskLevel: riskLevel.trim(),
      platform: platform.trim(),
      userId: userId.trim(),
      userName: typeof userName === "string" && userName.trim() ? userName.trim() : "Anonymous Agent",
      timestamp: FieldValue.serverTimestamp(),
    };
    const docRef = await adminDb.collection("reports").add(payload);
    const createdDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      id: docRef.id,
      data: {
        id: docRef.id,
        ...createdDoc.data(),
        timestamp: createdDoc.data()?.timestamp ? { seconds: createdDoc.data()?.timestamp.seconds } : null,
      },
    });
  } catch (error) {
    console.error("Community POST Error:", error);
    return NextResponse.json({ error: "Failed to publish intelligence" }, { status: 500 });
  }
}
