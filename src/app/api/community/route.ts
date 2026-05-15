import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

type CommunityReportRecord = {
  id: string;
  timestamp?: { seconds?: number } | null;
};

function getTimestampSeconds(value: CommunityReportRecord["timestamp"]) {
  return typeof value?.seconds === "number" ? value.seconds : 0;
}

export async function GET(req: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Firebase Admin not initialized." }, { status: 500 });
    }
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const snapshot = await adminDb.collection("reports").where("userId", "==", userId).limit(50).get();
      const reports = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp ? { seconds: doc.data().timestamp.seconds } : null,
        }) as CommunityReportRecord)
        .sort((a, b) => getTimestampSeconds(b.timestamp) - getTimestampSeconds(a.timestamp));

      return NextResponse.json({ success: true, data: reports });
    }

    const snapshot = await adminDb.collection("reports").orderBy("timestamp", "desc").limit(20).get();

    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp ? { seconds: doc.data().timestamp.seconds } : null,
    }));

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error("Community API Error:", error);
    return NextResponse.json({ error: "Failed to fetch community intelligence" }, { status: 500 });
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
