/**
 * Notification Schema
 * Tracks notifications for users (imports, alerts, messages)
 */

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Recipient user
    recipientId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "import_confirmed",
        "import_shipped",
        "import_delivered",
        "product_available",
        "product_price_changed",
        "stock_low",
        "new_import",
        "system_alert",
        "message",
      ],
      required: true,
      index: true,
    },

    // Title
    title: {
      type: String,
      required: true,
    },

    // Message body
    message: {
      type: String,
      required: true,
    },

    // Related entity
    relatedEntity: {
      entityType: {
        type: String,
        enum: ["Product", "Import", "User"],
      },
      entityId: String,
    },

    // Action URL (for frontend navigation)
    actionUrl: String,

    // Is read
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Read at timestamp
    readAt: Date,

    // Priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Additional data
    data: mongoose.Schema.Types.Mixed,

    // Expiry (notifications auto-delete after 30 days)
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

// Indexes
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

// TTL Index - automatically delete after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
