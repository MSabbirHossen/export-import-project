/**
 * Notification Routes
 * All notification endpoints
 */

import express from "express";
import verifyAuth from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import {
  getUserNotificationsHandler,
  getUnreadCountHandler,
  getUnreadNotifications,
  getSingleNotification,
  getNotificationsByType,
  getNotificationStatsHandler,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationHandler,
  deleteAllUserNotificationsHandler,
  clearOldNotifications,
  createTestNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes are protected
router.use(verifyAuth);

// Get notifications
router.get("/", asyncHandler(getUserNotificationsHandler));
router.get("/unread", asyncHandler(getUnreadNotifications));
router.get("/unread-count", asyncHandler(getUnreadCountHandler));
router.get("/stats", asyncHandler(getNotificationStatsHandler));
router.get("/type/:type", asyncHandler(getNotificationsByType));
router.get("/:notificationId", asyncHandler(getSingleNotification));

// Update notifications
router.put("/:notificationId/read", asyncHandler(markNotificationAsRead));
router.put("/read-all", asyncHandler(markAllNotificationsAsRead));

// Delete notifications
router.delete("/:notificationId", asyncHandler(deleteNotificationHandler));
router.delete("/", asyncHandler(deleteAllUserNotificationsHandler));
router.delete("/clear/old", asyncHandler(clearOldNotifications));

// Test endpoint (dev only)
router.post("/test", asyncHandler(createTestNotification));

export default router;
