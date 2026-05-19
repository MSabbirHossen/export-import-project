import admin from "firebase-admin";

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log("✅ Firebase Admin SDK already initialized");
      return admin;
    }

    // Build service account from environment variables. Do NOT read files.
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error(
        "Missing Firebase Admin credentials in environment variables. Ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL are set",
      );
    }

    const serviceAccount = {
      projectId,
      privateKey,
      clientEmail,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
    return admin;
  } catch (error) {
    console.error("❌ Firebase Admin SDK initialization error:", error.message);
    throw error;
  }
};

const verifyToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Basic checks - ensure token audience/project matches
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (projectId) {
      const aud = decodedToken.aud || decodedToken.audience;
      const iss = decodedToken.iss || decodedToken.issuer;
      if (
        aud &&
        aud !== projectId &&
        aud !== `${projectId}@appspot.gserviceaccount.com`
      ) {
        throw new Error("Token audience mismatch");
      }

      if (iss && !iss.includes(projectId)) {
        // allow tokens where issuer contains projectId
        // some tokens may not include issuer in same format; this is a best-effort check
        console.warn("Token issuer does not include expected project id");
      }
    }

    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid or expired token: ${error.message}`);
  }
};

export { initializeFirebase, verifyToken };
export default admin;
