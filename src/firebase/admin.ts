import * as admin from "firebase-admin";

function normalizePrivateKey(privateKey: string) {
  const startTag = "-----BEGIN PRIVATE KEY-----";
  const endTag = "-----END PRIVATE KEY-----";

  let formattedKey = privateKey.trim().replace(/^["']|["']$/g, "");

  if (formattedKey.includes("\\n")) {
    formattedKey = formattedKey.replace(/\\n/g, "\n");
  }

  if (!formattedKey.includes(startTag)) {
    formattedKey = `${startTag}\n${formattedKey}`;
  }

  if (!formattedKey.includes(endTag)) {
    formattedKey = `${formattedKey}\n${endTag}`;
  }

  const body = formattedKey
    .replace(startTag, "")
    .replace(endTag, "")
    .replace(/\s+/g, "")
    .match(/.{1,64}/g)
    ?.join("\n");

  return body ? `${startTag}\n${body}\n${endTag}` : formattedKey;
}

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin credentials are incomplete.");
    return null;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: normalizePrivateKey(privateKey),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Firebase Admin error";
    console.error("Firebase Admin Initialization Error:", message);
    return null;
  }
}

const adminApp = initializeAdminApp();

const adminDb = adminApp ? admin.firestore(adminApp) : null;
const adminAuth = adminApp ? admin.auth(adminApp) : null;
const adminStorage = adminApp ? admin.storage(adminApp) : null;

export { adminApp, adminDb, adminAuth, adminStorage };
