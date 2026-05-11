import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originCountry: {
      type: String,
      required: [true, "Origin country is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Product rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    exporterId: {
      type: String,
      required: [true, "Exporter ID (Firebase UID) is required"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
  },
  {
    timestamps: true,
    indexes: [
      { name: 1 }, // Search by product name
      { exporterId: 1 }, // Filter by exporter
      { createdAt: -1 }, // Sort latest first
      { price: 1 }, // Sort by price
    ],
  },
);

// Index for product search
productSchema.index({ name: "text", description: "text" });

// Virtual for total imports count (can be aggregated if needed)
productSchema.virtual("imports", {
  ref: "Import",
  localField: "_id",
  foreignField: "productId",
  count: true,
});

// Ensure virtuals are included in JSON
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
