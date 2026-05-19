import { verifyToken } from "../config/firebase.js";
import User from "../models/User.js";
import { sendError } from "../utils/response.js";

// Verify Firebase JWT Token and attach database user profile (if exists)
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "No authorization token provided", 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decodedToken = await verifyToken(token);

    // Attach firebase user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email || "User",
      photoURL: decodedToken.picture || null,
    };

    // Try to attach DB user profile (role, etc.) if exists
    try {
      const dbUser = await User.findOne({ uid: req.user.uid }).lean();
      if (dbUser) {
        req.user.db = dbUser;
        req.user.role = dbUser.role || "importer";
      } else {
        req.user.role = "importer"; // safest default until a profile exists
      }
    } catch (err) {
      // Non-fatal - proceed with token info
      req.user.role = "importer";
    }

    next();
  } catch (error) {
    return sendError(res, `Authentication failed: ${error.message}`, 401);
  }
};

export default verifyAuth;
