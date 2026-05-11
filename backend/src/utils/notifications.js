/**
 * Notification Utility Functions
 * Handle notification creation, retrieval, and management
 */

import Notification from "../models/Notification.js";

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @returns {Object} Created notification
 */
export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

/**
 * Create import notification
 * @param {string} importerId - Importer Firebase UID
 * @param {string} importId - Import ID
 * @param {string} productName - Product name
 * @param {string} status - Import status
 * @returns {Object} Created notification
 */
export const createImportNotification = async (
  importerId,
  importId,
  productName,
  status,
) => {
  const statusMessages = {
    confirmed: {
      title: "Import Confirmed",
      message: `Your import of "${productName}" has been confirmed.`,
      priority: "high",
    },
    shipped: {
      title: "Import Shipped",
      message: `Your import of "${productName}" has been shipped and is on the way.`,
      priority: "high",
    },
    delivered: {
      title: "Import Delivered",
      message: `Your import of "${productName}" has been delivered successfully.`,
      priority: "high",
    },
  };

  const statusConfig = statusMessages[status] || {
    title: "Import Updated",
    message: `Your import status has been updated to ${status}.`,
    priority: "medium",
  };

  return createNotification({
    recipientId: importerId,
    type: `import_${status}`,
    title: statusConfig.title,
    message: statusConfig.message,
    priority: statusConfig.priority,
    relatedEntity: {
      entityType: "Import",
      entityId: importId,
    },
    actionUrl: `/imports/${importId}`,
    data: {
      importId,
      productName,
      status,
    },
  });
};

/**
 * Create product alert notification
 * @param {string} userId - User Firebase UID
 * @param {string} productId - Product ID
 * @param {string} productName - Product name
 * @param {string} alertType - 'price_changed', 'back_in_stock', 'low_stock'
 * @param {Object} details - Additional details
 * @returns {Object} Created notification
 */
export const createProductAlertNotification = async (
  userId,
  productId,
  productName,
  alertType,
  details,
) => {
  const alertMessages = {
    price_changed: {
      title: "Price Changed",
      message: `The price of "${productName}" has changed from ${details.oldPrice} to ${details.newPrice}.`,
      priority: "medium",
    },
    back_in_stock: {
      title: "Product Back in Stock",
      message: `"${productName}" is now back in stock!`,
      priority: "high",
    },
    low_stock: {
      title: "Low Stock Alert",
      message: `Only ${details.quantity} units of "${productName}" remaining.`,
      priority: "medium",
    },
  };

  const alertConfig = alertMessages[alertType] || {
    title: "Product Update",
    message: `There's an update on "${productName}".`,
    priority: "low",
  };

  return createNotification({
    recipientId: userId,
    type: `product_${alertType}`,
    title: alertConfig.title,
    message: alertConfig.message,
    priority: alertConfig.priority,
    relatedEntity: {
      entityType: "Product",
      entityId: productId,
    },
    actionUrl: `/products/${productId}`,
    data: {
      productId,
      productName,
      alertType,
      ...details,
    },
  });
};

/**
 * Get user notifications
 * @param {string} userId - User Firebase UID
 * @param {Object} options - Query options (page, limit, read status)
 * @returns {Object} Notifications and metadata
 */
export const getUserNotifications = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 10, read = null } = options;
    const skip = (page - 1) * limit;

    const filter = { recipientId: userId };
    if (read !== null) {
      filter.isRead = read;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    return {
      notifications,
      pagination: {
        totalCount: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    throw new Error(`Failed to get user notifications: ${error.message}`);
  }
};

/**
 * Get unread notification count
 * @param {string} userId - User Firebase UID
 * @returns {number} Unread count
 */
export const getUnreadCount = async (userId) => {
  try {
    return await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });
  } catch (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Object} Updated notification
 */
export const markAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true },
    );
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

/**
 * Mark all user notifications as read
 * @param {string} userId - User Firebase UID
 * @returns {Object} Update result
 */
export const markAllAsRead = async (userId) => {
  try {
    return await Notification.updateMany(
      {
        recipientId: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  } catch (error) {
    throw new Error(
      `Failed to mark all notifications as read: ${error.message}`,
    );
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Object} Delete result
 */
export const deleteNotification = async (notificationId) => {
  try {
    return await Notification.findByIdAndDelete(notificationId);
  } catch (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

/**
 * Delete all user notifications
 * @param {string} userId - User Firebase UID
 * @returns {Object} Delete result
 */
export const deleteAllUserNotifications = async (userId) => {
  try {
    return await Notification.deleteMany({
      recipientId: userId,
    });
  } catch (error) {
    throw new Error(`Failed to delete user notifications: ${error.message}`);
  }
};

/**
 * Get notification statistics
 * @param {string} userId - User Firebase UID
 * @returns {Object} Notification statistics
 */
export const getNotificationStats = async (userId) => {
  try {
    const [total, unread, byType] = await Promise.all([
      Notification.countDocuments({ recipientId: userId }),
      Notification.countDocuments({ recipientId: userId, isRead: false }),
      Notification.aggregate([
        { $match: { recipientId: userId } },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const typeBreakdown = {};
    byType.forEach((item) => {
      typeBreakdown[item._id] = item.count;
    });

    return {
      total,
      unread,
      typeBreakdown,
    };
  } catch (error) {
    throw new Error(`Failed to get notification statistics: ${error.message}`);
  }
};

/**
 * Batch create notifications for multiple users
 * @param {Array} userIds - Array of user Firebase UIDs
 * @param {Object} notificationData - Notification data (without recipientId)
 * @returns {Array} Created notifications
 */
export const batchCreateNotifications = async (userIds, notificationData) => {
  try {
    const notifications = userIds.map((userId) => ({
      ...notificationData,
      recipientId: userId,
    }));

    return await Notification.insertMany(notifications);
  } catch (error) {
    throw new Error(`Failed to batch create notifications: ${error.message}`);
  }
};
