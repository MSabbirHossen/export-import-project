/**
 * Filter and Pagination Utilities
 * Handles complex filtering, sorting, and pagination for API queries
 */

/**
 * Build filter object for MongoDB query
 * @param {Object} filterParams - Filter parameters from request
 * @returns {Object} MongoDB filter query
 */
export const buildProductFilter = (filterParams) => {
  const filter = {};

  // Price range filter
  if (filterParams.minPrice || filterParams.maxPrice) {
    filter.price = {};
    if (filterParams.minPrice) {
      filter.price.$gte = parseFloat(filterParams.minPrice);
    }
    if (filterParams.maxPrice) {
      filter.price.$lte = parseFloat(filterParams.maxPrice);
    }
  }

  // Rating filter
  if (filterParams.minRating) {
    filter.rating = { $gte: parseFloat(filterParams.minRating) };
  }

  // Origin country filter
  if (filterParams.country) {
    filter.originCountry = new RegExp(filterParams.country, "i");
  }

  // Category filter
  if (filterParams.category) {
    filter.category = new RegExp(filterParams.category, "i");
  }

  // Availability filter
  if (filterParams.availability === "inStock") {
    filter.availableQuantity = { $gt: 0 };
  } else if (filterParams.availability === "outOfStock") {
    filter.availableQuantity = { $lte: 0 };
  }

  // Exporter filter (for specific exporter's products)
  if (filterParams.exporterId) {
    filter.exporterId = filterParams.exporterId;
  }

  // Date range filter
  if (filterParams.fromDate || filterParams.toDate) {
    filter.createdAt = {};
    if (filterParams.fromDate) {
      filter.createdAt.$gte = new Date(filterParams.fromDate);
    }
    if (filterParams.toDate) {
      const toDate = new Date(filterParams.toDate);
      toDate.setHours(23, 59, 59, 999); // End of day
      filter.createdAt.$lte = toDate;
    }
  }

  return filter;
};

/**
 * Build filter object for Import queries
 * @param {Object} filterParams - Filter parameters from request
 * @returns {Object} MongoDB filter query
 */
export const buildImportFilter = (filterParams) => {
  const filter = {};

  // Status filter
  if (filterParams.status) {
    filter.status = filterParams.status;
  }

  // Importer ID filter
  if (filterParams.importerId) {
    filter.importerId = filterParams.importerId;
  }

  // Product ID filter
  if (filterParams.productId) {
    filter.productId = filterParams.productId;
  }

  // Price range filter (for product price)
  if (filterParams.minPrice || filterParams.maxPrice) {
    filter.productPrice = {};
    if (filterParams.minPrice) {
      filter.productPrice.$gte = parseFloat(filterParams.minPrice);
    }
    if (filterParams.maxPrice) {
      filter.productPrice.$lte = parseFloat(filterParams.maxPrice);
    }
  }

  // Total price range filter
  if (filterParams.minTotal || filterParams.maxTotal) {
    filter.totalPrice = {};
    if (filterParams.minTotal) {
      filter.totalPrice.$gte = parseFloat(filterParams.minTotal);
    }
    if (filterParams.maxTotal) {
      filter.totalPrice.$lte = parseFloat(filterParams.maxTotal);
    }
  }

  // Quantity range filter
  if (filterParams.minQuantity || filterParams.maxQuantity) {
    filter.quantity = {};
    if (filterParams.minQuantity) {
      filter.quantity.$gte = parseInt(filterParams.minQuantity);
    }
    if (filterParams.maxQuantity) {
      filter.quantity.$lte = parseInt(filterParams.maxQuantity);
    }
  }

  // Date range filter
  if (filterParams.fromDate || filterParams.toDate) {
    filter.createdAt = {};
    if (filterParams.fromDate) {
      filter.createdAt.$gte = new Date(filterParams.fromDate);
    }
    if (filterParams.toDate) {
      const toDate = new Date(filterParams.toDate);
      toDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = toDate;
    }
  }

  return filter;
};

/**
 * Build sort object based on sortBy parameter
 * @param {string} sortBy - Sort field and direction (e.g., "price:asc", "rating:desc")
 * @returns {Object} MongoDB sort query
 */
export const buildSort = (sortBy = "createdAt:desc") => {
  const sort = {};

  // Parse sortBy parameter (format: "field:direction")
  const [field, direction] = sortBy.split(":");
  const validFields = [
    "price",
    "rating",
    "createdAt",
    "name",
    "availableQuantity",
    "totalPrice",
    "quantity",
  ];

  if (validFields.includes(field)) {
    sort[field] = direction === "asc" ? 1 : -1;
  } else {
    // Default sort
    sort.createdAt = -1;
  }

  return sort;
};

/**
 * Calculate pagination parameters
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Skip and limit for MongoDB query
 */
export const getPaginationParams = (page = 1, limit = 10) => {
  // Validate page
  const pageNum = Math.max(1, Math.floor(page));

  // Validate and limit page size
  let limitNum = Math.floor(limit);
  limitNum = Math.max(1, Math.min(limitNum, 100)); // Max 100 items per page

  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

/**
 * Build pagination metadata
 * @param {number} totalCount - Total documents matching filter
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const getPaginationMeta = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    totalCount,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Build search filter for full-text and field search
 * @param {string} searchQuery - Search query string
 * @returns {Object} MongoDB filter for search
 */
export const buildSearchFilter = (searchQuery) => {
  const filter = {};

  if (!searchQuery || searchQuery.trim() === "") {
    return filter;
  }

  const query = searchQuery.trim();

  // Use $or for multiple field search
  filter.$or = [
    { name: { $regex: query, $options: "i" } },
    { description: { $regex: query, $options: "i" } },
    { category: { $regex: query, $options: "i" } },
    { originCountry: { $regex: query, $options: "i" } },
  ];

  return filter;
};

/**
 * Combine search and filter into single query
 * @param {string} search - Search query
 * @param {Object} filters - Filter parameters
 * @param {string} type - 'product' or 'import'
 * @returns {Object} Combined MongoDB filter
 */
export const buildCompleteFilter = (search, filters, type = "product") => {
  let query = {};

  // Add search filter
  if (search && search.trim() !== "") {
    const searchFilter = buildSearchFilter(search);
    query = { ...query, ...searchFilter };
  }

  // Add type-specific filters
  const filterObj =
    type === "import"
      ? buildImportFilter(filters)
      : buildProductFilter(filters);

  // Merge filters
  if (Object.keys(filterObj).length > 0) {
    if (query.$or) {
      // If we have search query, wrap filters
      query = { $and: [{ $or: query.$or }, filterObj] };
    } else {
      query = { ...query, ...filterObj };
    }
  }

  return query;
};

/**
 * Apply multiple filters with proper AND/OR logic
 * @param {Object} filterParams - Individual filter objects
 * @returns {Object} Merged filter with proper logic
 */
export const mergeFilters = (...filterParams) => {
  const nonEmptyFilters = filterParams.filter((f) => Object.keys(f).length > 0);

  if (nonEmptyFilters.length === 0) {
    return {};
  }

  if (nonEmptyFilters.length === 1) {
    return nonEmptyFilters[0];
  }

  // Merge multiple filters with AND logic
  return { $and: nonEmptyFilters };
};

/**
 * Validate and sanitize query parameters
 * @param {Object} queryParams - Query parameters from request
 * @returns {Object} Sanitized query parameters
 */
export const sanitizeQueryParams = (queryParams) => {
  const sanitized = {};

  if (queryParams.page) {
    sanitized.page = Math.max(1, parseInt(queryParams.page) || 1);
  }

  if (queryParams.limit) {
    sanitized.limit = Math.min(
      100,
      Math.max(1, parseInt(queryParams.limit) || 10),
    );
  }

  if (queryParams.search) {
    sanitized.search = queryParams.search.toString().substring(0, 200);
  }

  if (queryParams.sortBy) {
    sanitized.sortBy = queryParams.sortBy.toString().substring(0, 50);
  }

  if (queryParams.minPrice) {
    sanitized.minPrice = Math.max(0, parseFloat(queryParams.minPrice) || 0);
  }

  if (queryParams.maxPrice) {
    sanitized.maxPrice = Math.max(0, parseFloat(queryParams.maxPrice) || 0);
  }

  if (queryParams.minRating) {
    sanitized.minRating = Math.max(
      0,
      Math.min(5, parseFloat(queryParams.minRating) || 0),
    );
  }

  if (queryParams.country) {
    sanitized.country = queryParams.country.toString().substring(0, 100);
  }

  if (queryParams.category) {
    sanitized.category = queryParams.category.toString().substring(0, 100);
  }

  if (queryParams.status) {
    const validStatuses = ["pending", "confirmed", "shipped", "delivered"];
    if (validStatuses.includes(queryParams.status)) {
      sanitized.status = queryParams.status;
    }
  }

  if (queryParams.availability) {
    const validAvailability = ["inStock", "outOfStock", "all"];
    if (validAvailability.includes(queryParams.availability)) {
      sanitized.availability = queryParams.availability;
    }
  }

  if (queryParams.fromDate) {
    const date = new Date(queryParams.fromDate);
    if (!isNaN(date)) {
      sanitized.fromDate = date.toISOString();
    }
  }

  if (queryParams.toDate) {
    const date = new Date(queryParams.toDate);
    if (!isNaN(date)) {
      sanitized.toDate = date.toISOString();
    }
  }

  return sanitized;
};

/**
 * Format query response with pagination metadata
 * @param {Array} data - Result data
 * @param {number} totalCount - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Formatted response data
 */
export const formatPaginatedResponse = (data, totalCount, page, limit) => {
  const pagination = getPaginationMeta(totalCount, page, limit);

  return {
    data,
    pagination,
  };
};

/**
 * Validate sort parameter
 * @param {string} sortBy - Sort parameter
 * @returns {boolean} Is valid sort
 */
export const isValidSort = (sortBy) => {
  if (!sortBy) return true; // Default sort is valid

  const [field, direction] = sortBy.split(":");
  const validFields = [
    "price",
    "rating",
    "createdAt",
    "name",
    "availableQuantity",
    "totalPrice",
    "quantity",
  ];
  const validDirections = ["asc", "desc"];

  return validFields.includes(field) && validDirections.includes(direction);
};

/**
 * Build aggregation pipeline for advanced analytics
 * @param {Object} filters - Filter parameters
 * @returns {Array} MongoDB aggregation pipeline
 */
export const buildAggregationPipeline = (filters) => {
  const pipeline = [];

  // Add match stage
  const filterObj = buildProductFilter(filters);
  if (Object.keys(filterObj).length > 0) {
    pipeline.push({ $match: filterObj });
  }

  return pipeline;
};
