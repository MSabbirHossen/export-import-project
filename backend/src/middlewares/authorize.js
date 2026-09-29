// Role-based authorization middleware
import { canAccessRole } from "../utils/roles.js";

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role || req.user?.db?.role || "importer";

      if (!allowedRoles || allowedRoles.length === 0) return next();

      if (allowedRoles.some((role) => canAccessRole(userRole, role))) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Authorization error" });
    }
  };
};

export { requireRole };
