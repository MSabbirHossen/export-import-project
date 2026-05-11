/**
 * Activity Log Schema
 * Tracks user activities like imports, exports, and system events
 */

import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    // User who performed the action
    userId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },

    // Type of activity
    type: {
      type: String,
      enum: [
        "product_created",
        "product_updated",
        "product_deleted",
        "import_created",
        "import_updated",
        "import_deleted",
        "profile_updated",
        "login",
        "logout",
      ],
      required: true,
      index: true,
    },

    // Description of activity
    description: String,

    // Related entity information
    entityId: {
      type: String, // Product ID or Import ID
      index: true,
    },

    // Entity type (Product, Import, User)
    entityType: {
      type: String,
      enum: ["Product", "Import", "User"],
    },

    // Old values (for updates)
    oldValues: mongoose.Schema.Types.Mixed,

    // New values (for updates)
    newValues: mongoose.Schema.Types.Mixed,

    // Additional metadata
    metadata: {
      ipAddress: String,
      userAgent: String,
      details: mongoose.Schema.Types.Mixed,
    },

    // Status
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },

    // Error message if failed
    errorMessage: String,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  },
);

// Indexes
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ entityId: 1, entityType: 1 });
activitySchema.index({ createdAt: -1 });

// TTL Index - automatically delete logs after 90 days
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
