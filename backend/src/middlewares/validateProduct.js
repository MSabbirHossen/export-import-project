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
      productName,
      image,
      images,
      price,
      unitPrice,
      originCountry,
      country,
      rating,
      availableQuantity,
      quantity,
      description,
      category,
      currency,
      unit,
      exporterName,
      specifications,
    } = req.body;

    const errors = [];
    const rawName = name ?? productName;
    const rawImage = image ?? images?.[0];
    const rawPrice = price ?? unitPrice;
    const rawOrigin = originCountry ?? country;
    const rawRating = rating ?? 0;
    const rawQuantity = availableQuantity ?? quantity;

    // Validate name
    const validatedName = validateProductName(rawName);
    if (!validatedName) {
      errors.push("Product name is required and must be 2-100 characters");
    }

    // Validate image URL
    const validatedImage = validateURL(rawImage);
    if (!validatedImage) {
      errors.push("Product image must be a valid URL (http:// or https://)");
    }

    // Validate price
    const validatedPrice = validatePrice(rawPrice);
    if (validatedPrice === null) {
      errors.push("Product price must be a valid number >= 0");
    }

    // Validate originCountry
    const validatedOrigin = validateCountry(rawOrigin);
    if (!validatedOrigin) {
      errors.push("Origin country is required and must be 1-100 characters");
    }

    // Validate rating
    const validatedRating = validateRating(rawRating);
    if (validatedRating === null) {
      errors.push("Product rating must be between 0 and 5");
    }

    // Validate availableQuantity
    const validatedQty = validateQuantity(rawQuantity);
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
      productName: validatedName,
      image: validatedImage,
      images: [validatedImage],
      price: validatedPrice,
      unitPrice: validatedPrice,
      originCountry: validatedOrigin,
      country: validatedOrigin,
      rating: validatedRating,
      availableQuantity: validatedQty,
      quantity: validatedQty,
      currency: trimString(currency || "USD"),
      unit: trimString(unit || "unit"),
      exporterName: trimString(exporterName || ""),
      specifications: specifications || {},
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
      productName,
      image,
      images,
      price,
      unitPrice,
      originCountry,
      country,
      rating,
      availableQuantity,
      quantity,
      description,
      category,
      currency,
      unit,
      exporterName,
      specifications,
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
    const rawName = name ?? productName;
    if (rawName !== undefined) {
      const validatedName = validateProductName(rawName);
      if (!validatedName) {
        errors.push("Product name must be 2-100 characters");
      } else {
        validatedData.name = validatedName;
        validatedData.productName = validatedName;
      }
    }

    const rawImage = image ?? images?.[0];
    if (rawImage !== undefined) {
      const validatedImage = validateURL(rawImage);
      if (!validatedImage) {
        errors.push("Product image must be a valid URL");
      } else {
        validatedData.image = validatedImage;
        validatedData.images = [validatedImage];
      }
    }

    const rawPrice = price ?? unitPrice;
    if (rawPrice !== undefined) {
      const validatedPrice = validatePrice(rawPrice);
      if (validatedPrice === null) {
        errors.push("Product price must be a valid number >= 0");
      } else {
        validatedData.price = validatedPrice;
        validatedData.unitPrice = validatedPrice;
      }
    }

    const rawOrigin = originCountry ?? country;
    if (rawOrigin !== undefined) {
      const validatedOrigin = validateCountry(rawOrigin);
      if (!validatedOrigin) {
        errors.push("Origin country must be 1-100 characters");
      } else {
        validatedData.originCountry = validatedOrigin;
        validatedData.country = validatedOrigin;
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

    const rawQuantity = availableQuantity ?? quantity;
    if (rawQuantity !== undefined) {
      const validatedQty = validateQuantity(rawQuantity);
      if (validatedQty === null) {
        errors.push("Available quantity must be a positive integer");
      } else {
        validatedData.availableQuantity = validatedQty;
        validatedData.quantity = validatedQty;
      }
    }

    if (description !== undefined) {
      validatedData.description = trimString(description);
    }

    if (category !== undefined) {
      validatedData.category = trimString(category);
    }

    if (currency !== undefined) {
      validatedData.currency = trimString(currency || "USD");
    }

    if (unit !== undefined) {
      validatedData.unit = trimString(unit || "unit");
    }

    if (exporterName !== undefined) {
      validatedData.exporterName = trimString(exporterName);
    }

    if (specifications !== undefined) {
      validatedData.specifications = specifications || {};
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
