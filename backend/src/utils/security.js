// Security Utilities

import rateLimit from "express-rate-limit";

// Per-user rate limiter (based on Firebase UID)
const createUserRateLimiter = (windowMs = 60 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      // Use Firebase UID if authenticated, otherwise use IP
      return req.user?.uid || req.ip;
    },
    message: "Too many requests from this user, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for public endpoints
      return !req.user;
    },
  });
};

// Endpoint-specific rate limiters
const createEndpointRateLimiter = (windowMs = 15 * 60 * 1000, max = 30) => {
  return rateLimit({
    windowMs,
    max,
    message: "Too many requests to this endpoint, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Write operation rate limiter (stricter)
const writeOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 write operations per hour per user
  keyGenerator: (req) => req.user?.uid || req.ip,
  message: "Too many write operations, please try again later.",
  skip: (req) => !req.user || req.method === "GET",
});

// Search/read operation limiter (more lenient)
const readOperationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 read operations per minute
  keyGenerator: (req) => req.user?.uid || req.ip,
  message: "Too many read operations, please try again later.",
  skip: (req) => req.method !== "GET",
});

// CORS security configuration
const corsSecurityConfig = {
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin);

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5000",
      "https://import-export-hub-bf41a.web.app",
      "https://import-export-hub-bf41a.firebaseapp.com",
    ];

    console.log("Allowed Origins:", allowedOrigins);

    // ✅ DEV SAFE HANDLING (important fix)
    if (!origin && process.env.NODE_ENV !== "production") {
      console.log("CORS Allowed (No Origin - Dev Mode)");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("CORS Allowed");
      return callback(null, true);
    }

    console.log("CORS Blocked:", origin);
    return callback(new Error("Not allowed by CORS"), false);
  },

  credentials: true,

  optionsSuccessStatus: 200,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  maxAge: 86400, // 24 hours
};

// Helmet security headers configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: "deny",
  },
  noSniff: true,
  xssFilter: true,
};

// Check if IP is blocked
const isIPBlocked = (ip, blockedIPs = []) => {
  return blockedIPs.includes(ip);
};

// Sanitize request data
const sanitizeRequest = (req) => {
  // Log suspicious patterns
  const body = JSON.stringify(req.body);

  // Check for common attack patterns
  const suspiciousPatterns = [
    /<script[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /union\s+select/gi,
    /drop\s+table/gi,
    /insert\s+into/gi,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(body)) {
      console.warn(`Suspicious request pattern detected from IP: ${req.ip}`);
      return false;
    }
  }

  return true;
};

export {
  createUserRateLimiter,
  createEndpointRateLimiter,
  writeOperationLimiter,
  readOperationLimiter,
  corsSecurityConfig,
  helmetConfig,
  isIPBlocked,
  sanitizeRequest,
};
