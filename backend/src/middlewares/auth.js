import { verifyToken } from "../config/firebase.js";

// Verify Firebase JWT Token
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "No authorization token provided",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decodedToken = await verifyToken(token);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || "User",
      photoURL: decodedToken.picture || null,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Authentication failed",
      error: error.message,
    });
  }
};

export default verifyAuth;
