import express from "express";
import verifyAuth from "../middlewares/auth.js";
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
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/latest", asyncHandler(getLatestProducts));
router.get("/all", asyncHandler(getAllProducts));
router.get("/search", asyncHandler(searchProducts));

// Protected routes
router.post("/add", verifyAuth, validateAddProduct, asyncHandler(addProduct));
router.get(
  "/exports/my-exports",
  verifyAuth,
  asyncHandler(getExporterProducts),
);
router.put(
  "/:productId",
  verifyAuth,
  validateUpdateProduct,
  asyncHandler(updateProduct),
);
router.delete("/:productId", verifyAuth, asyncHandler(deleteProduct));

router.get("/:productId", asyncHandler(getProductById));

export default router;
