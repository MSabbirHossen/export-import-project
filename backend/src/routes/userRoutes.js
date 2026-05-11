import express from "express";
import verifyAuth from "../middlewares/auth.js";
import { validateSaveUserProfile } from "../middlewares/validateUser.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { sendSuccess, sendError } from "../utils/response.js";
import User from "../models/User.js";

const router = express.Router();

// Get current authenticated user info
router.get(
  "/profile",
  verifyAuth,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      status: "success",
      message: "User profile retrieved",
      user: req.user,
    });
  }),
);

// Save/create user info to database
router.post(
  "/save-profile",
  verifyAuth,
  validateSaveUserProfile,
  asyncHandler(async (req, res) => {
    const validatedData = req.validatedData;

    try {
      let user = await User.findOne({ uid: req.user.uid });

      if (user) {
        // Update existing user
        Object.assign(user, validatedData);
        await user.save();
        return sendSuccess(res, "User profile updated", user);
      }

      // Create new user
      user = new User({
        uid: req.user.uid,
        email: req.user.email,
        displayName: validatedData.displayName || req.user.displayName,
        photoURL: req.user.photoURL,
        role: validatedData.role || "both",
        phone: validatedData.phone || "",
        address: validatedData.address || {},
      });

      await user.save();
      sendSuccess(res, "User profile saved", user, 201);
    } catch (error) {
      if (error.code === 11000) {
        return sendError(res, "User already exists", 409);
      }
      throw error;
    }
  }),
);

// Get user profile from database
router.get(
  "/db-profile",
  verifyAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return sendError(res, "User profile not found in database", 404);
    }

    sendSuccess(res, "User profile retrieved", user);
  }),
);

export default router;
