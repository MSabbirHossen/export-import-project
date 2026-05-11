/**
 * Analytics Controller
 * Handles analytics endpoints for business intelligence
 */

import { sendSuccess, sendError } from "../utils/response.js";
import {
  getPlatformStats,
  getProductStats,
  getImportStats,
  getTopProductsByImports,
  getTopExporters,
  getImportTrends,
  getSalesByCategory,
  getUserStats,
  getMonthlyRevenue,
  getImportStatusDistribution,
  productsToCSV,
  importsToCSV,
  generateReportData,
} from "../utils/analytics.js";
import Product from "../models/Product.js";
import Import from "../models/Import.js";

/**
 * Get overall platform statistics
 */
export const getPlatformStatistics = async (req, res, next) => {
  try {
    const stats = await getPlatformStats();
    sendSuccess(res, "Platform statistics retrieved", stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed product statistics
 */
export const getProductStatistics = async (req, res, next) => {
  try {
    const stats = await getProductStats();
    sendSuccess(res, "Product statistics retrieved", stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get import statistics
 */
export const getImportStatistics = async (req, res, next) => {
  try {
    const stats = await getImportStats();
    sendSuccess(res, "Import statistics retrieved", stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get top products by imports
 */
export const getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = Math.min(parseInt(limit) || 10, 50);

    const topProducts = await getTopProductsByImports(limitNum);
    sendSuccess(
      res,
      `Retrieved top ${topProducts.length} products`,
      topProducts,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get top exporters
 */
export const getTopExportersAnalytics = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = Math.min(parseInt(limit) || 10, 50);

    const topExporters = await getTopExporters(limitNum);
    sendSuccess(
      res,
      `Retrieved top ${topExporters.length} exporters`,
      topExporters,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get import trends over time
 */
export const getImportTrendsAnalytics = async (req, res, next) => {
  try {
    const { fromDate, toDate, interval = "day" } = req.query;

    if (!fromDate || !toDate) {
      return sendError(res, "fromDate and toDate are required", 400);
    }

    if (!["day", "week", "month"].includes(interval)) {
      return sendError(res, "interval must be day, week, or month", 400);
    }

    const trends = await getImportTrends(
      new Date(fromDate),
      new Date(toDate),
      interval,
    );
    sendSuccess(res, `Import trends retrieved (${interval}ly)`, trends);
  } catch (error) {
    next(error);
  }
};

/**
 * Get sales by category
 */
export const getSalesByCategoryAnalytics = async (req, res, next) => {
  try {
    const sales = await getSalesByCategory();
    sendSuccess(res, "Sales by category retrieved", sales);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user-specific statistics
 */
export const getUserStatisticsAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const stats = await getUserStats(userId);
    sendSuccess(res, "User statistics retrieved", stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly revenue
 */
export const getMonthlyRevenueAnalytics = async (req, res, next) => {
  try {
    const { months = 12 } = req.query;
    const monthsNum = Math.min(Math.max(1, parseInt(months) || 12), 36);

    const revenue = await getMonthlyRevenue(monthsNum);
    sendSuccess(res, `Monthly revenue for last ${monthsNum} months`, revenue);
  } catch (error) {
    next(error);
  }
};

/**
 * Get import status distribution
 */
export const getImportStatusDistributionAnalytics = async (req, res, next) => {
  try {
    const distribution = await getImportStatusDistribution();
    sendSuccess(res, "Import status distribution retrieved", distribution);
  } catch (error) {
    next(error);
  }
};

/**
 * Get comprehensive dashboard data
 */
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      platformStats,
      productStats,
      importStats,
      topProducts,
      topExporters,
      statusDistribution,
    ] = await Promise.all([
      getPlatformStats(),
      getProductStats(),
      getImportStats(),
      getTopProductsByImports(5),
      getTopExporters(5),
      getImportStatusDistribution(),
    ]);

    const dashboardData = {
      platform: platformStats,
      products: productStats,
      imports: importStats,
      topProducts,
      topExporters,
      statusDistribution,
      timestamp: new Date().toISOString(),
    };

    sendSuccess(res, "Dashboard analytics retrieved", dashboardData);
  } catch (error) {
    next(error);
  }
};

/**
 * Export products to CSV
 */
export const exportProductsToCSV = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, minRating } = req.query;

    const filter = {};
    if (category) filter.category = new RegExp(category, "i");
    if (minPrice)
      filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice)
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    const products = await Product.find(filter).lean();
    const csvData = productsToCSV(products);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="products.csv"');
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

/**
 * Export imports to CSV (user's imports)
 */
export const exportImportsToCSV = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { status, fromDate, toDate } = req.query;

    const filter = { importerId: userId };
    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const date = new Date(toDate);
        date.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = date;
      }
    }

    const imports = await Import.find(filter)
      .populate("productId", "name")
      .lean();

    const csvData = importsToCSV(imports);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="imports.csv"');
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate comprehensive report
 */
export const generateComprehensiveReport = async (req, res, next) => {
  try {
    const [
      platformStats,
      productStats,
      importStats,
      topProducts,
      topExporters,
      salesByCategory,
      monthlyRevenue,
    ] = await Promise.all([
      getPlatformStats(),
      getProductStats(),
      getImportStats(),
      getTopProductsByImports(10),
      getTopExporters(10),
      getSalesByCategory(),
      getMonthlyRevenue(12),
    ]);

    const reportData = await generateReportData({
      platform: platformStats,
      products: productStats,
      imports: importStats,
      topProducts,
      topExporters,
      salesByCategory,
      monthlyRevenue,
    });

    sendSuccess(res, "Comprehensive report generated", reportData);
  } catch (error) {
    next(error);
  }
};
