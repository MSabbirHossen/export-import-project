// Import Validation Middleware

import {
  validateObjectId,
  validateInteger,
  validateQuantity,
} from "../utils/validation.js";

const validateImportProduct = (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const errors = [];

    // Validate productId
    if (!productId) {
      errors.push("Product ID is required");
    } else if (!validateObjectId(productId)) {
      errors.push("Product ID must be a valid MongoDB ObjectId");
    }

    // Validate quantity
    if (quantity === undefined || quantity === null) {
      errors.push("Quantity is required");
    } else {
      const validatedQty = validateQuantity(quantity);
      if (validatedQty === null) {
        errors.push("Quantity must be a positive integer");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Import validation failed",
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    req.validatedData = {
      productId,
      quantity: validateQuantity(quantity),
    };

    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Import validation error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const validateUpdateImportQuantity = (req, res, next) => {
  try {
    const { importId } = req.params;
    const { quantity } = req.body;

    const errors = [];

    // Validate importId
    if (!validateObjectId(importId)) {
      errors.push("Import ID must be a valid MongoDB ObjectId");
    }

    // Validate quantity
    if (quantity === undefined || quantity === null) {
      errors.push("Quantity is required");
    } else {
      const validatedQty = validateQuantity(quantity);
      if (validatedQty === null) {
        errors.push("Quantity must be a positive integer");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Update import validation failed",
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    req.validatedData = {
      quantity: validateQuantity(quantity),
    };
    req.validatedParams = { importId };

    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Import validation error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export { validateImportProduct, validateUpdateImportQuantity };
