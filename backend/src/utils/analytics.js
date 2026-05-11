/**
 * Analytics Utility Functions
 * Calculate statistics, trends, and aggregations for business intelligence
 */

import Product from "../models/Product.js";
import Import from "../models/Import.js";
import User from "../models/User.js";

/**
 * Get overall platform statistics
 * @returns {Object} Platform statistics
 */
export const getPlatformStats = async () => {
  try {
    const [
      totalProducts,
      totalImports,
      totalUsers,
      totalExporters,
      totalImporters,
    ] = await Promise.all([
      Product.countDocuments(),
      Import.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: { $in: ["exporter", "both"] } }),
      User.countDocuments({ role: { $in: ["importer", "both"] } }),
    ]);

    return {
      totalProducts,
      totalImports,
      totalUsers,
      totalExporters,
      totalImporters,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to get platform statistics: ${error.message}`);
  }
};

/**
 * Get product statistics
 * @returns {Object} Product statistics
 */
export const getProductStats = async () => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$availableQuantity" },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          averageRating: { $avg: "$rating" },
          highestRatedProduct: { $max: "$rating" },
          totalExporters: { $addToSet: "$exporterId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalQuantity: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          minPrice: 1,
          maxPrice: 1,
          averageRating: { $round: ["$averageRating", 2] },
          highestRatedProduct: 1,
          uniqueExporters: { $size: "$totalExporters" },
        },
      },
    ]);

    return (
      stats[0] || {
        totalProducts: 0,
        totalQuantity: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        averageRating: 0,
        highestRatedProduct: 0,
        uniqueExporters: 0,
      }
    );
  } catch (error) {
    throw new Error(`Failed to get product statistics: ${error.message}`);
  }
};

/**
 * Get import statistics
 * @returns {Object} Import statistics
 */
export const getImportStats = async () => {
  try {
    const stats = await Import.aggregate([
      {
        $group: {
          _id: null,
          totalImports: { $sum: 1 },
          totalQuantityImported: { $sum: "$quantity" },
          totalValue: { $sum: "$totalPrice" },
          averageImportValue: { $avg: "$totalPrice" },
          uniqueImporters: { $addToSet: "$importerId" },
          statusCounts: {
            $push: "$status",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalImports: 1,
          totalQuantityImported: 1,
          totalValue: { $round: ["$totalValue", 2] },
          averageImportValue: { $round: ["$averageImportValue", 2] },
          uniqueImporters: { $size: "$uniqueImporters" },
          statusCounts: 1,
        },
      },
    ]);

    if (stats[0]) {
      const statusCounts = {
        pending: stats[0].statusCounts.filter((s) => s === "pending").length,
        confirmed: stats[0].statusCounts.filter((s) => s === "confirmed")
          .length,
        shipped: stats[0].statusCounts.filter((s) => s === "shipped").length,
        delivered: stats[0].statusCounts.filter((s) => s === "delivered")
          .length,
      };

      return {
        ...stats[0],
        statusCounts,
      };
    }

    return {
      totalImports: 0,
      totalQuantityImported: 0,
      totalValue: 0,
      averageImportValue: 0,
      uniqueImporters: 0,
      statusCounts: { pending: 0, confirmed: 0, shipped: 0, delivered: 0 },
    };
  } catch (error) {
    throw new Error(`Failed to get import statistics: ${error.message}`);
  }
};

/**
 * Get top products by imports
 * @param {number} limit - Number of top products to return
 * @returns {Array} Top imported products
 */
export const getTopProductsByImports = async (limit = 10) => {
  try {
    const topProducts = await Import.aggregate([
      {
        $group: {
          _id: "$productId",
          totalImports: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: "$totalPrice" },
          productName: { $first: "$productName" },
          productPrice: { $first: "$productPrice" },
        },
      },
      { $sort: { totalImports: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          totalImports: 1,
          totalQuantity: 1,
          totalValue: { $round: ["$totalValue", 2] },
          productPrice: 1,
          rating: { $arrayElemAt: ["$productDetails.rating", 0] },
          category: { $arrayElemAt: ["$productDetails.category", 0] },
        },
      },
    ]);

    return topProducts;
  } catch (error) {
    throw new Error(`Failed to get top products: ${error.message}`);
  }
};

/**
 * Get top exporters by product count
 * @param {number} limit - Number of top exporters to return
 * @returns {Array} Top exporters
 */
export const getTopExporters = async (limit = 10) => {
  try {
    const topExporters = await Product.aggregate([
      {
        $group: {
          _id: "$exporterId",
          productCount: { $sum: 1 },
          totalQuantity: { $sum: "$availableQuantity" },
          averagePrice: { $avg: "$price" },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { productCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "uid",
          as: "exporterInfo",
        },
      },
      {
        $project: {
          _id: 1,
          productCount: 1,
          totalQuantity: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          averageRating: { $round: ["$averageRating", 2] },
          exporterName: { $arrayElemAt: ["$exporterInfo.displayName", 0] },
          exporterEmail: { $arrayElemAt: ["$exporterInfo.email", 0] },
        },
      },
    ]);

    return topExporters;
  } catch (error) {
    throw new Error(`Failed to get top exporters: ${error.message}`);
  }
};

/**
 * Get import trends by date range
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @param {string} interval - 'day', 'week', 'month'
 * @returns {Array} Import trends
 */
export const getImportTrends = async (fromDate, toDate, interval = "day") => {
  try {
    let groupBy;
    let formatString;

    switch (interval) {
      case "week":
        groupBy = { $week: "$createdAt" };
        formatString = "Week %U";
        break;
      case "month":
        groupBy = { $month: "$createdAt" };
        formatString = "Month %m";
        break;
      default: // day
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }

    const trends = await Import.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        },
      },
      {
        $group: {
          _id:
            interval === "day"
              ? groupBy
              : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalImports: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: "$totalPrice" },
          uniqueImporters: { $addToSet: "$importerId" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalImports: 1,
          totalQuantity: 1,
          totalValue: { $round: ["$totalValue", 2] },
          uniqueImporters: { $size: "$uniqueImporters" },
        },
      },
    ]);

    return trends;
  } catch (error) {
    throw new Error(`Failed to get import trends: ${error.message}`);
  }
};

/**
 * Get sales by category
 * @returns {Array} Sales statistics by category
 */
export const getSalesByCategory = async () => {
  try {
    const sales = await Import.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalImports: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: "$totalPrice" },
          averageValue: { $avg: "$totalPrice" },
        },
      },
      { $sort: { totalValue: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalImports: 1,
          totalQuantity: 1,
          totalValue: { $round: ["$totalValue", 2] },
          averageValue: { $round: ["$averageValue", 2] },
        },
      },
    ]);

    return sales;
  } catch (error) {
    throw new Error(`Failed to get sales by category: ${error.message}`);
  }
};

/**
 * Get user activity statistics
 * @param {string} userId - Firebase UID
 * @returns {Object} User statistics
 */
export const getUserStats = async (userId) => {
  try {
    const [productsCreated, importsCreated, totalImportValue] =
      await Promise.all([
        Product.countDocuments({ exporterId: userId }),
        Import.countDocuments({ importerId: userId }),
        Import.aggregate([
          { $match: { importerId: userId } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
      ]);

    const totalValue = totalImportValue[0]?.total || 0;

    return {
      userId,
      productsCreated,
      importsCreated,
      totalImportValue: parseFloat(totalValue.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to get user statistics: ${error.message}`);
  }
};

/**
 * Get monthly revenue
 * @param {number} months - Number of months to include
 * @returns {Array} Monthly revenue data
 */
export const getMonthlyRevenue = async (months = 12) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const revenue = await Import.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: "delivered", // Only count delivered imports as revenue
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalPrice" },
          totalImports: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: 1,
            },
          },
          totalRevenue: { $round: ["$totalRevenue", 2] },
          totalImports: 1,
          totalQuantity: 1,
        },
      },
    ]);

    return revenue;
  } catch (error) {
    throw new Error(`Failed to get monthly revenue: ${error.message}`);
  }
};

/**
 * Get import status distribution
 * @returns {Object} Distribution of import statuses
 */
export const getImportStatusDistribution = async () => {
  try {
    const distribution = await Import.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          totalValue: { $round: ["$totalValue", 2] },
        },
      },
    ]);

    // Format with all statuses
    const result = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
    };

    distribution.forEach((item) => {
      result[item.status] = item.count;
    });

    return result;
  } catch (error) {
    throw new Error(
      `Failed to get import status distribution: ${error.message}`,
    );
  }
};

/**
 * Export products to CSV format
 * @param {Array} products - Products array
 * @returns {string} CSV data
 */
export const productsToCSV = (products) => {
  if (!products || products.length === 0) {
    return "No products to export";
  }

  const headers = [
    "ID",
    "Name",
    "Price",
    "Category",
    "Origin Country",
    "Rating",
    "Available Quantity",
    "Created At",
  ];
  const rows = products.map((product) => [
    product._id,
    product.name,
    product.price,
    product.category || "",
    product.originCountry || "",
    product.rating || 0,
    product.availableQuantity,
    new Date(product.createdAt).toISOString(),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
};

/**
 * Export imports to CSV format
 * @param {Array} imports - Imports array
 * @returns {string} CSV data
 */
export const importsToCSV = (imports) => {
  if (!imports || imports.length === 0) {
    return "No imports to export";
  }

  const headers = [
    "ID",
    "Product Name",
    "Quantity",
    "Unit Price",
    "Total Price",
    "Status",
    "Importer Email",
    "Created At",
  ];
  const rows = imports.map((imp) => [
    imp._id,
    imp.productName,
    imp.quantity,
    imp.productPrice,
    imp.totalPrice,
    imp.status,
    imp.importerEmail,
    new Date(imp.createdAt).toISOString(),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
};

/**
 * Generate PDF-ready data for reports
 * @param {Object} stats - Statistics object
 * @returns {Object} Formatted report data
 */
export const generateReportData = async (stats) => {
  return {
    generatedAt: new Date().toISOString(),
    platform: stats.platform || {},
    products: stats.products || {},
    imports: stats.imports || {},
    topProducts: stats.topProducts || [],
    topExporters: stats.topExporters || [],
    salesByCategory: stats.salesByCategory || [],
    monthlyRevenue: stats.monthlyRevenue || [],
  };
};
