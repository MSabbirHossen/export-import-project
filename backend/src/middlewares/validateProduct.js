// Product Validation Middleware

import {
  validateProductName,
  validatePrice,
  validateRating,
  validateQuantity,
  validateURL,
  validateCountry,
  trimString,
  sanitizeObject,
  validateObjectId,
} from "../utils/validation.js";

const validateAddProduct = (req, res, next) => {
  try {
    const {
      name,
      image,
      price,
      originCountry,
      rating,
      availableQuantity,
      description,
      category,
    } = req.body;

    const errors = [];

    // Validate name
    const validatedName = validateProductName(name);
    if (!validatedName) {
      errors.push("Product name is required and must be 2-100 characters");
    }

    // Validate image URL
    const validatedImage = validateURL(image);
    if (!validatedImage) {
      errors.push("Product image must be a valid URL (http:// or https://)");
    }

    // Validate price
    const validatedPrice = validatePrice(price);
    if (validatedPrice === null) {
      errors.push("Product price must be a valid number >= 0");
    }

    // Validate originCountry
    const validatedOrigin = validateCountry(originCountry);
    if (!validatedOrigin) {
      errors.push("Origin country is required and must be 1-100 characters");
    }

    // Validate rating
    const validatedRating = validateRating(rating);
    if (validatedRating === null) {
      errors.push("Product rating must be between 0 and 5");
    }

    // Validate availableQuantity
    const validatedQty = validateQuantity(availableQuantity);
    if (validatedQty === null) {
      errors.push("Available quantity must be a positive integer");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Product validation failed",
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    // Attach validated data to request
    req.validatedData = {
      name: validatedName,
      image: validatedImage,
      price: validatedPrice,
      originCountry: validatedOrigin,
      rating: validatedRating,
      availableQuantity: validatedQty,
      description: trimString(description || ""),
      category: trimString(category || "General"),
    };

    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Product validation error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const validateUpdateProduct = (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      name,
      image,
      price,
      originCountry,
      rating,
      availableQuantity,
      description,
      category,
    } = req.body;

    // Validate productId
    if (!validateObjectId(productId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid product ID format",
        timestamp: new Date().toISOString(),
      });
    }

    const validatedData = {};
    const errors = [];

    // Validate only provided fields
    if (name !== undefined) {
      const validatedName = validateProductName(name);
      if (!validatedName) {
        errors.push("Product name must be 2-100 characters");
      } else {
        validatedData.name = validatedName;
      }
    }

    if (image !== undefined) {
      const validatedImage = validateURL(image);
      if (!validatedImage) {
        errors.push("Product image must be a valid URL");
      } else {
        validatedData.image = validatedImage;
      }
    }

    if (price !== undefined) {
      const validatedPrice = validatePrice(price);
      if (validatedPrice === null) {
        errors.push("Product price must be a valid number >= 0");
      } else {
        validatedData.price = validatedPrice;
      }
    }

    if (originCountry !== undefined) {
      const validatedOrigin = validateCountry(originCountry);
      if (!validatedOrigin) {
        errors.push("Origin country must be 1-100 characters");
      } else {
        validatedData.originCountry = validatedOrigin;
      }
    }

    if (rating !== undefined) {
      const validatedRating = validateRating(rating);
      if (validatedRating === null) {
        errors.push("Product rating must be between 0 and 5");
      } else {
        validatedData.rating = validatedRating;
      }
    }

    if (availableQuantity !== undefined) {
      const validatedQty = validateQuantity(availableQuantity);
      if (validatedQty === null) {
        errors.push("Available quantity must be a positive integer");
      } else {
        validatedData.availableQuantity = validatedQty;
      }
    }

    if (description !== undefined) {
      validatedData.description = trimString(description);
    }

    if (category !== undefined) {
      validatedData.category = trimString(category);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Product validation failed",
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    req.validatedData = validatedData;
    req.validatedParams = { productId };
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Product validation error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export { validateAddProduct, validateUpdateProduct };
