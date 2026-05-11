/**
 * Notification Controller
 * Handles notification endpoints and user notification management
 */

import { sendSuccess, sendError } from "../utils/response.js";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllUserNotifications,
  getNotificationStats,
  createNotification,
} from "../utils/notifications.js";
import Notification from "../models/Notification.js";

/**
 * Get user's notifications with pagination
 */
export const getUserNotificationsHandler = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { page = 1, limit = 10, read } = req.query;

    const result = await getUserNotifications(userId, {
      page: parseInt(page),
      limit: Math.min(parseInt(limit) || 10, 50),
      read: read === "true" ? true : read === "false" ? false : null,
    });

    sendSuccess(res, "Notifications retrieved", result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCountHandler = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const count = await getUnreadCount(userId);

    sendSuccess(res, "Unread count retrieved", { unreadCount: count });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark single notification as read
 */
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.uid;

    // Verify ownership
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return sendError(res, "Notification not found", 404);
    }

    if (notification.recipientId !== userId) {
      return sendError(
        res,
        "Unauthorized: You can only update your own notifications",
        403,
      );
    }

    const updated = await markAsRead(notificationId);
    sendSuccess(res, "Notification marked as read", updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const result = await markAllAsRead(userId);

    sendSuccess(res, "All notifications marked as read", {
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete single notification
 */
export const deleteNotificationHandler = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.uid;

    // Verify ownership
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return sendError(res, "Notification not found", 404);
    }

    if (notification.recipientId !== userId) {
      return sendError(
        res,
        "Unauthorized: You can only delete your own notifications",
        403,
      );
    }

    await deleteNotification(notificationId);
    sendSuccess(res, "Notification deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all user notifications
 */
export const deleteAllUserNotificationsHandler = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const result = await deleteAllUserNotifications(userId);

    sendSuccess(res, "All notifications deleted", {
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification statistics
 */
export const getNotificationStatsHandler = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const stats = await getNotificationStats(userId);

    sendSuccess(res, "Notification statistics retrieved", stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single notification
 */
export const getSingleNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.uid;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return sendError(res, "Notification not found", 404);
    }

    if (notification.recipientId !== userId) {
      return sendError(
        res,
        "Unauthorized: You can only view your own notifications",
        403,
      );
    }

    sendSuccess(res, "Notification retrieved", notification);
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications only
 */
export const getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { limit = 10 } = req.query;

    const notifications = await Notification.find({
      recipientId: userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 10)
      .lean();

    const count = await getUnreadCount(userId);

    sendSuccess(res, "Unread notifications retrieved", {
      notifications,
      unreadCount: count,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create test notification (for development)
 */
export const createTestNotification = async (req, res, next) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return sendError(
        res,
        "This endpoint is only available in development",
        403,
      );
    }

    const userId = req.user.uid;
    const { type = "system_alert", title, message } = req.body;

    if (!title || !message) {
      return sendError(res, "Title and message are required", 400);
    }

    const notification = await createNotification({
      recipientId: userId,
      type,
      title,
      message,
      priority: "medium",
    });

    sendSuccess(res, "Test notification created", notification, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get notifications by type
 */
export const getNotificationsByType = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { type, page = 1, limit = 10 } = req.query;

    if (!type) {
      return sendError(res, "Notification type is required", 400);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
      Notification.find({
        recipientId: userId,
        type,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit) || 10)
        .lean(),
      Notification.countDocuments({
        recipientId: userId,
        type,
      }),
    ]);

    sendSuccess(res, `${type} notifications retrieved`, {
      notifications,
      pagination: {
        totalCount: total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear old notifications
 */
export const clearOldNotifications = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { days = 30 } = req.query;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await Notification.deleteMany({
      recipientId: userId,
      createdAt: { $lt: cutoffDate },
    });

    sendSuccess(res, `Old notifications cleared (older than ${days} days)`, {
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};
