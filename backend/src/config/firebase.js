import admin from "firebase-admin";

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log("✅ Firebase Admin SDK already initialized");
      return admin;
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    // Validate credentials
    if (
      !serviceAccount.projectId ||
      !serviceAccount.privateKey ||
      !serviceAccount.clientEmail
    ) {
      throw new Error(
        "Missing Firebase Admin credentials in environment variables",
      );
    }

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
    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid or expired token: ${error.message}`);
  }
};

export { initializeFirebase, verifyToken };
export default admin;
