import mongoose from "mongoose";

const importSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    importerId: {
      type: String,
      required: [true, "Importer ID (Firebase UID) is required"],
    },
    importerEmail: {
      type: String,
      required: [true, "Importer email is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Import quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: function () {
        return this.quantity * this.productPrice;
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    indexes: [
      { importerId: 1 }, // Filter by importer
      { productId: 1 }, // Filter by product
      { createdAt: -1 }, // Latest imports first
    ],
  },
);

// Calculate total price before saving
importSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.productPrice;
  next();
});

// Populate product details when fetching
importSchema.pre(/^find/, function (next) {
  this.populate({
    path: "productId",
    select: "name image price originCountry rating",
  });
  next();
});

const Import = mongoose.model("Import", importSchema);

export default Import;
