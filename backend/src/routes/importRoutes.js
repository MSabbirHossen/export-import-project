import express from "express";
import verifyAuth from "../middlewares/auth.js";
import {
  validateImportProduct,
  validateUpdateImportQuantity,
} from "../middlewares/validateImport.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import {
  importProduct,
  getUserImports,
  getAllImports,
  removeImport,
  updateImportQuantity,
  getProductImports,
} from "../controllers/importController.js";

const router = express.Router();

// Protected routes
router.post(
  "/add",
  verifyAuth,
  validateImportProduct,
  asyncHandler(importProduct),
);
router.get("/my-imports", verifyAuth, asyncHandler(getUserImports));
router.delete("/:importId", verifyAuth, asyncHandler(removeImport));
router.put(
  "/:importId",
  verifyAuth,
  validateUpdateImportQuantity,
  asyncHandler(updateImportQuantity),
);

// Public routes
router.get("/product/:productId", asyncHandler(getProductImports));
router.get("/all", asyncHandler(getAllImports));

export default router;
