import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { initializeFirebase } from "./config/firebase.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import swaggerRoutes from "./routes/swaggerRoutes.js";
import {
  corsSecurityConfig,
  helmetConfig,
  writeOperationLimiter,
  readOperationLimiter,
} from "./utils/security.js";

const app = express();

// Initialize Firebase Admin SDK
initializeFirebase();

// Security Middleware - Helmet
app.use(helmet(helmetConfig));

// CORS Configuration (Enhanced Security)
app.use(cors(corsSecurityConfig));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Operation-specific rate limiting
app.use(writeOperationLimiter);
app.use(readOperationLimiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Swagger Documentation Route
app.use("/api/docs", swaggerRoutes);

// Root API Route
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Import Export Hub API v1.0",
    endpoints: {
      health: "/api/health",
      products: "/api/products",
      imports: "/api/imports",
      users: "/api/users",
    },
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/imports", importRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Handler (must be before error handler)
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

export default app;
