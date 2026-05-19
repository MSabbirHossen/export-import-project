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
    // Atomically decrement product available quantity if enough stock exists
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, availableQuantity: { $gte: quantity } },
      { $inc: { availableQuantity: -quantity } },
      { new: true },
    );

    if (!updatedProduct) {
      // Not enough stock or product not found
      const existing = await Product.findById(productId).lean();
      if (!existing) return sendError(res, "Product not found", 404);

      return sendError(
        res,
        `Only ${existing.availableQuantity} units available. Requested: ${quantity}`,
        400,
      );
    }

    // Create import record (if this fails, roll back the product decrement)
    let newImport = null;
    try {
      newImport = new Import({
        productId,
        importerId: req.user.uid,
        importerEmail: req.user.email,
        quantity,
        productName: updatedProduct.name,
        productPrice: updatedProduct.price,
      });

      await newImport.save();
    } catch (err) {
      // Rollback product quantity
      await Product.findByIdAndUpdate(productId, {
        $inc: { availableQuantity: quantity },
      });
      throw err;
    }

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

    // Use a transaction when possible to restore product quantity and delete import atomically
    const session = await Import.startSession();
    try {
      let transactionResults = null;

      await session.withTransaction(async () => {
        await Product.findByIdAndUpdate(
          importRecord.productId,
          { $inc: { availableQuantity: importRecord.quantity } },
          { session },
        );

        await Import.findByIdAndDelete(importId, { session });
      });

      session.endSession();

      sendSuccess(res, "Import removed successfully", null);
    } catch (err) {
      session.endSession();
      // Fallback: try sequential operations if transactions unsupported
      try {
        await Product.findByIdAndUpdate(importRecord.productId, {
          $inc: { availableQuantity: importRecord.quantity },
        });
        await Import.findByIdAndDelete(importId);
        sendSuccess(res, "Import removed successfully", null);
      } catch (err2) {
        next(err2);
      }
    }
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

    const productId = importRecord.productId;
    const oldQuantity = importRecord.quantity;
    const quantityDifference = quantity - oldQuantity;

    // If increasing quantity, attempt to atomically decrement product
    if (quantityDifference > 0) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, availableQuantity: { $gte: quantityDifference } },
        { $inc: { availableQuantity: -quantityDifference } },
        { new: true },
      );

      if (!updatedProduct) {
        const existing = await Product.findById(productId).lean();
        if (!existing) return sendError(res, "Product not found", 404);
        return sendError(
          res,
          `Only ${existing.availableQuantity} additional units available. Requested: ${quantityDifference}`,
          400,
        );
      }

      importRecord.quantity = quantity;
      importRecord.totalPrice = quantity * importRecord.productPrice;
      await importRecord.save();
      return sendSuccess(
        res,
        "Import quantity updated successfully",
        importRecord,
      );
    }

    // If decreasing quantity, increment product accordingly and update import
    if (quantityDifference < 0) {
      const incAmount = Math.abs(quantityDifference);
      await Product.findByIdAndUpdate(productId, {
        $inc: { availableQuantity: incAmount },
      });

      importRecord.quantity = quantity;
      importRecord.totalPrice = quantity * importRecord.productPrice;
      await importRecord.save();

      return sendSuccess(
        res,
        "Import quantity updated successfully",
        importRecord,
      );
    }

    // No change
    sendSuccess(res, "No changes made", importRecord);
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
