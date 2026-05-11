import Product from "../models/Product.js";
import { sendSuccess, sendError } from "../utils/response.js";
import {
  buildCompleteFilter,
  buildSort,
  getPaginationParams,
  formatPaginatedResponse,
  sanitizeQueryParams,
  isValidSort,
} from "../utils/filterAndPaginate.js";

// Get latest products with pagination (for homepage)
export const getLatestProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const {
      skip,
      limit: paginationLimit,
      page: paginationPage,
    } = getPaginationParams(page, limit);

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(paginationLimit)
      .lean();

    const total = await Product.countDocuments();

    if (!products || products.length === 0) {
      return sendSuccess(
        res,
        "No products found",
        formatPaginatedResponse([], total, paginationPage, paginationLimit),
      );
    }

    sendSuccess(
      res,
      "Latest products retrieved",
      formatPaginatedResponse(products, total, paginationPage, paginationLimit),
    );
  } catch (error) {
    next(error);
  }
};

// Get all products with advanced filtering and pagination
export const getAllProducts = async (req, res, next) => {
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
    const filter = buildCompleteFilter("", filterParams, "product");
    const sort = buildSort(sortBy);
    const {
      skip,
      limit: paginationLimit,
      page: paginationPage,
    } = getPaginationParams(page, limit);

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(paginationLimit).lean(),
      Product.countDocuments(filter),
    ]);

    if (!products || products.length === 0) {
      return sendSuccess(
        res,
        "No products found matching filters",
        formatPaginatedResponse([], total, paginationPage, paginationLimit),
      );
    }

    sendSuccess(
      res,
      `Retrieved ${products.length} products`,
      formatPaginatedResponse(products, total, paginationPage, paginationLimit),
    );
  } catch (error) {
    next(error);
  }
};

// Search products with advanced filtering and pagination
export const searchProducts = async (req, res, next) => {
  try {
    const {
      query,
      page = 1,
      limit = 10,
      sortBy = "createdAt:desc",
      ...filterParams
    } = req.query;

    if (!query || query.trim().length === 0) {
      return sendError(res, "Search query is required", 400);
    }

    // Validate sort parameter
    if (!isValidSort(sortBy)) {
      return sendError(
        res,
        "Invalid sort parameter. Use format: field:asc or field:desc",
        400,
      );
    }

    // Build combined search and filter query
    const filter = buildCompleteFilter(query, filterParams, "product");
    const sort = buildSort(sortBy);
    const {
      skip,
      limit: paginationLimit,
      page: paginationPage,
    } = getPaginationParams(page, limit);

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(paginationLimit).lean(),
      Product.countDocuments(filter),
    ]);

    if (!products || products.length === 0) {
      return sendSuccess(
        res,
        "No products found matching search criteria",
        formatPaginatedResponse([], total, paginationPage, paginationLimit),
      );
    }

    sendSuccess(
      res,
      `Found ${total} products matching search`,
      formatPaginatedResponse(products, total, paginationPage, paginationLimit),
    );
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
export const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid product ID format", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    sendSuccess(res, "Product details retrieved", product);
  } catch (error) {
    next(error);
  }
};

// Add new product (only by exporter)
export const addProduct = async (req, res, next) => {
  try {
    // Use validated data from middleware
    const {
      name,
      image,
      price,
      originCountry,
      rating,
      availableQuantity,
      description,
      category,
    } = req.validatedData;

    const newProduct = new Product({
      name,
      image,
      price,
      originCountry,
      rating,
      availableQuantity,
      description,
      category,
      exporterId: req.user.uid,
    });

    await newProduct.save();

    sendSuccess(res, "Product added successfully", newProduct, 201);
  } catch (error) {
    next(error);
  }
};

// Update product (only by exporter who created it)
export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.validatedParams;
    const validatedData = req.validatedData;

    const product = await Product.findById(productId);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    // Check if user is the exporter
    if (product.exporterId !== req.user.uid) {
      return sendError(
        res,
        "Unauthorized: You can only update your own products",
        403,
      );
    }

    // Update with validated data
    Object.assign(product, validatedData);
    await product.save();

    sendSuccess(res, "Product updated successfully", product);
  } catch (error) {
    next(error);
  }
};

// Delete product (only by exporter who created it)
export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, "Invalid product ID format", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    // Check if user is the exporter
    if (product.exporterId !== req.user.uid) {
      return sendError(
        res,
        "Unauthorized: You can only delete your own products",
        403,
      );
    }

    await Product.findByIdAndDelete(productId);

    sendSuccess(res, "Product deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

// Get products by exporter (user's exports)
export const getExporterProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ exporterId: req.user.uid }).sort({
      createdAt: -1,
    });

    sendSuccess(res, "Exporter products retrieved", products);
  } catch (error) {
    next(error);
  }
};
