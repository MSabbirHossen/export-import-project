import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    productName: {
      type: String,
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    image: {
      type: String,
    },
    images: [String],
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    unitPrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      trim: true,
      default: "USD",
    },
    originCountry: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    availableQuantity: {
      type: Number,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    quantity: {
      type: Number,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    unit: {
      type: String,
      trim: true,
      default: "unit",
    },
    exporterId: {
      type: String,
      required: [true, "Exporter ID (Firebase UID) is required"],
    },
    exporterName: {
      type: String,
      trim: true,
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
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    indexes: [
      { name: 1 }, // Search by product name
      { productName: 1 }, // Search by legacy product name
      { exporterId: 1 }, // Filter by exporter
      { createdAt: -1 }, // Sort latest first
      { price: 1 }, // Sort by price
      { unitPrice: 1 }, // Sort by legacy price
    ],
  },
);

productSchema.pre("validate", function normalizeProductFields(next) {
  const firstImage = Array.isArray(this.images) ? this.images[0] : undefined;

  this.name = this.name || this.productName;
  this.productName = this.productName || this.name;
  this.image = this.image || firstImage;
  this.images = this.images?.length ? this.images : this.image ? [this.image] : [];
  this.price = this.price ?? this.unitPrice;
  this.unitPrice = this.unitPrice ?? this.price;
  this.originCountry = this.originCountry || this.country;
  this.country = this.country || this.originCountry;

  if (this.quantity !== undefined && !this.isModified("availableQuantity")) {
    this.availableQuantity = this.quantity;
  }

  if (this.availableQuantity !== undefined && !this.isModified("quantity")) {
    this.quantity = this.availableQuantity;
  }

  next();
});

// Index for product search
productSchema.index({
  name: "text",
  productName: "text",
  description: "text",
});

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
