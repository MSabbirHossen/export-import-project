/**
 * Analytics Routes
 * All analytics endpoints
 */

import express from "express";
import verifyAuth from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import {
  getPlatformStatistics,
  getProductStatistics,
  getImportStatistics,
  getTopProducts,
  getTopExportersAnalytics,
  getImportTrendsAnalytics,
  getSalesByCategoryAnalytics,
  getUserStatisticsAnalytics,
  getMonthlyRevenueAnalytics,
  getImportStatusDistributionAnalytics,
  getDashboardAnalytics,
  exportProductsToCSV,
  exportImportsToCSV,
  generateComprehensiveReport,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Public analytics endpoints
router.get("/platform-stats", asyncHandler(getPlatformStatistics));
router.get("/product-stats", asyncHandler(getProductStatistics));
router.get("/import-stats", asyncHandler(getImportStatistics));
router.get("/top-products", asyncHandler(getTopProducts));
router.get("/top-exporters", asyncHandler(getTopExportersAnalytics));
router.get("/sales-by-category", asyncHandler(getSalesByCategoryAnalytics));
router.get("/import-trends", asyncHandler(getImportTrendsAnalytics));
router.get("/monthly-revenue", asyncHandler(getMonthlyRevenueAnalytics));
router.get(
  "/status-distribution",
  asyncHandler(getImportStatusDistributionAnalytics),
);
router.get("/dashboard", asyncHandler(getDashboardAnalytics));
router.get("/comprehensive-report", asyncHandler(generateComprehensiveReport));

// Protected analytics endpoints
router.get("/user-stats", verifyAuth, asyncHandler(getUserStatisticsAnalytics));

// Export endpoints
router.get("/export/products", asyncHandler(exportProductsToCSV));
router.get("/export/imports", verifyAuth, asyncHandler(exportImportsToCSV));

export default router;
