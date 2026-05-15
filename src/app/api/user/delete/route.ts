import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: "Firebase Admin not initialized" }, { status: 500 });
    }

    // 1. Delete user reports from Firestore
    const reportsSnapshot = await adminDb.collection("reports").where("userId", "==", userId).get();
    const batch = adminDb.batch();
    reportsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // 2. Delete user from Firebase Auth
    await adminAuth.deleteUser(userId);

    return NextResponse.json({ success: true, message: "Account and data purged successfully." });
  } catch (error: any) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete account." }, { status: 500 });
  }
}
