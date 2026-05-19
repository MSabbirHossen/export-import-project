import express from "express";
import verifyAuth from "../middlewares/auth.js";
import { requireRole } from "../middlewares/authorize.js";
import {
  validateAddProduct,
  validateUpdateProduct,
} from "../middlewares/validateProduct.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import {
  getLatestProducts,
  getAllProducts,
  searchProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getExporterProducts,
  exportExporterProductsToCSV,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/latest", asyncHandler(getLatestProducts));
router.get("/all", asyncHandler(getAllProducts));
router.get("/search", asyncHandler(searchProducts));

// Protected routes
router.post(
  "/add",
  verifyAuth,
  requireRole(["exporter"]),
  validateAddProduct,
  asyncHandler(addProduct),
);
router.get(
  "/exports/my-exports",
  verifyAuth,
  requireRole(["exporter"]),
  asyncHandler(getExporterProducts),
);
router.get(
  "/exports/my-exports/csv",
  verifyAuth,
  requireRole(["exporter"]),
  asyncHandler(exportExporterProductsToCSV),
);
router.put(
  "/:productId",
  verifyAuth,
  requireRole(["exporter"]),
  validateUpdateProduct,
  asyncHandler(updateProduct),
);
router.delete(
  "/:productId",
  verifyAuth,
  requireRole(["exporter"]),
  asyncHandler(deleteProduct),
);

router.get("/:productId", asyncHandler(getProductById));

export default router;
