import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let query: any = adminDb.collection("reports").orderBy("timestamp", "desc");
    
    if (userId) {
      query = query.where("userId", "==", userId);
    }

    const snapshot = await query.limit(20).get();

    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp ? { seconds: doc.data().timestamp.seconds } : null
    }));

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error("Community API Error:", error);
    return NextResponse.json({ error: "Failed to fetch community intelligence" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, scamType, riskLevel, platform, userId, userName } = body;

    const docRef = await adminDb.collection("reports").add({
      title,
      description,
      scamType,
      riskLevel,
      platform,
      userId,
      userName,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Community POST Error:", error);
    return NextResponse.json({ error: "Failed to publish intelligence" }, { status: 500 });
  }
}
