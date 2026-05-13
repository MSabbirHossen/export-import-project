import Import from "../models/Import.js";
import Product from "../models/Product.js";
import { sendSuccess, sendError } from "../utils/response.js";
import {
  buildImportFilter,
  buildSort,
  getPaginationParams,
  formatPaginatedResponse,
  sanitizeQueryParams,
  isValidSort,
} from "../utils/filterAndPaginate.js";

// Import a product (add to user's imports)
export const importProduct = async (req, res, next) => {
  try {
    const { productId, quantity } = req.validatedData;

    // Get product details
    const product = await Product.findById(productId);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    // Check available quantity
    if (product.availableQuantity < quantity) {
      return sendError(
        res,
        `Only ${product.availableQuantity} units available. Requested: ${quantity}`,
        400,
      );
    }

    // Create import record
    const newImport = new Import({
      productId,
      importerId: req.user.uid,
      importerEmail: req.user.email,
      quantity,
      productName: product.name,
      productPrice: product.price,
    });

    // Save import
    await newImport.save();

    // Decrease product available quantity using $inc operator
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { availableQuantity: -quantity } },
      { new: true },
    );

    sendSuccess(res, "Product imported successfully", newImport, 201);
  } catch (error) {
    next(error);
  }
};

// Get user's imports with filtering and pagination
export const getUserImports = async (req, res, next) => {
  try {
    // Sanitize query parameters
    const queryParams = sanitizeQueryParams(req.query);
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt:desc",
      ...filterParams
    } = queryParams;

    // Validate sort parameter
    if (!isValidSort(sortBy)) {
      return sendError(
        res,
        "Invalid sort parameter. Use format: field:asc or field:desc",
        400,
      );
    }

    // Build filter with importer ID
    filterParams.importerId = req.user.uid;
    const filter = buildImportFilter(filterParams);
    const sort = buildSort(sortBy);
    const {
      skip,
      limit: paginationLimit,
      page: paginationPage,
    } = getPaginationParams(page, limit);

    // Execute queries in parallel
    const [imports, total] = await Promise.all([
      Import.find(filter)
        .populate("productId")
        .sort(sort)
        .skip(skip)
        .limit(paginationLimit)
        .lean(),
      Import.countDocuments(filter),
    ]);

    if (!imports || imports.length === 0) {
      return sendSuccess(
        res,
        "No imports found",
        formatPaginatedResponse([], total, paginationPage, paginationLimit),
      );
    }

    sendSuccess(
      res,
      "User imports retrieved",
      formatPaginatedResponse(imports, total, paginationPage, paginationLimit),
    );
  } catch (error) {
    next(error);
  }
};

// Get one import record owned by the current user
export const getImportById = async (req, res, next) => {
  try {
    const { importId } = req.params;

    if (!importId.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid import ID format", 400);
    }

    const importRecord = await Import.findById(importId).lean();

    if (!importRecord) {
      return sendError(res, "Import record not found", 404);
    }

    if (importRecord.importerId !== req.user.uid) {
      return sendError(
        res,
        "Unauthorized: You can only view your own imports",
        403,
      );
    }

    sendSuccess(res, "Import retrieved", importRecord);
  } catch (error) {
    next(error);
  }
};

// Get all imports with advanced filtering and pagination
export const getAllImports = async (req, res, next) => {
  try {
    // Sanitize query parameters
    const queryParams = sanitizeQueryParams(req.query);
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt:desc",
      ...filterParams
    } = queryParams;

    // Validate sort parameter
    if (!isValidSort(sortBy)) {
      return sendError(
        res,
        "Invalid sort parameter. Use format: field:asc or field:desc",
        400,
      );
    }

    // Build filter query
    const filter = buildImportFilter(filterParams);
    const sort = buildSort(sortBy);
    const {
      skip,
      limit: paginationLimit,
      page: paginationPage,
    } = getPaginationParams(page, limit);

    // Execute queries in parallel
    const [imports, total] = await Promise.all([
      Import.find(filter)
        .populate("productId")
        .sort(sort)
        .skip(skip)
        .limit(paginationLimit)
        .lean(),
      Import.countDocuments(filter),
    ]);

    if (!imports || imports.length === 0) {
      return sendSuccess(
        res,
        "No imports found matching filters",
        formatPaginatedResponse([], total, paginationPage, paginationLimit),
      );
    }

    sendSuccess(
      res,
      `Retrieved ${imports.length} imports`,
      formatPaginatedResponse(imports, total, paginationPage, paginationLimit),
    );
  } catch (error) {
    next(error);
  }
};

// Remove import (delete from user's imports and restore quantity)
export const removeImport = async (req, res, next) => {
  try {
    const { importId } = req.params;

    if (!importId.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid import ID format", 400);
    }

    const importRecord = await Import.findById(importId);

    if (!importRecord) {
      return sendError(res, "Import record not found", 404);
    }

    // Check if user is the importer
    if (importRecord.importerId !== req.user.uid) {
      return sendError(
        res,
        "Unauthorized: You can only remove your own imports",
        403,
      );
    }

    // Restore product quantity
    await Product.findByIdAndUpdate(
      importRecord.productId,
      { $inc: { availableQuantity: importRecord.quantity } },
      { new: true },
    );

    // Delete import record
    await Import.findByIdAndDelete(importId);

    sendSuccess(res, "Import removed successfully", null);
  } catch (error) {
    next(error);
  }
};

// Update import quantity
export const updateImportQuantity = async (req, res, next) => {
  try {
    const { importId } = req.validatedParams;
    const { quantity } = req.validatedData;

    const importRecord = await Import.findById(importId);

    if (!importRecord) {
      return sendError(res, "Import record not found", 404);
    }

    // Check if user is the importer
    if (importRecord.importerId !== req.user.uid) {
      return sendError(
        res,
        "Unauthorized: You can only update your own imports",
        403,
      );
    }

    const product = await Product.findById(importRecord.productId);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    // Calculate quantity difference
    const oldQuantity = importRecord.quantity;
    const quantityDifference = quantity - oldQuantity;

    // Check if enough quantity available
    if (
      quantityDifference > 0 &&
      product.availableQuantity < quantityDifference
    ) {
      return sendError(
        res,
        `Only ${product.availableQuantity} additional units available. Requested: ${quantityDifference}`,
        400,
      );
    }

    // Update import quantity
    importRecord.quantity = quantity;
    importRecord.totalPrice = quantity * importRecord.productPrice;
    await importRecord.save();

    // Update product quantity using $inc
    await Product.findByIdAndUpdate(
      importRecord.productId,
      { $inc: { availableQuantity: -quantityDifference } },
      { new: true },
    );

    sendSuccess(res, "Import quantity updated successfully", importRecord);
  } catch (error) {
    next(error);
  }
};

// Get imports by product with filtering and pagination
export const getProductImports = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const queryParams = sanitizeQueryParams(req.query);
    const { page = 1, limit = 10, sortBy = "createdAt:desc" } = queryParams;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid product ID format", 400);
    }

    // Validate sort parameter
    if (!isValidSort(sortBy)) {
      return sendError(
        res,
        "Invalid sort parameter. Use format: field:asc or field:desc",
        400,
      );
    }

    const filter = { productId };
    const sort = buildSort(sortBy);
    const {
      skip,
      limit: paginationLimit,
      page: paginationPage,
    } = getPaginationParams(page, limit);

    // Execute queries in parallel
    const [imports, total] = await Promise.all([
      Import.find(filter)
        .populate("productId")
        .sort(sort)
        .skip(skip)
        .limit(paginationLimit)
        .lean(),
      Import.countDocuments(filter),
    ]);

    if (!imports || imports.length === 0) {
      return sendSuccess(
        res,
        "No imports found for this product",
        formatPaginatedResponse([], total, paginationPage, paginationLimit),
      );
    }

    sendSuccess(
      res,
      "Product imports retrieved",
      formatPaginatedResponse(imports, total, paginationPage, paginationLimit),
    );
  } catch (error) {
    next(error);
  }
};
