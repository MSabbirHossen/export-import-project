// Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Not Found Handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
};

// Async Error Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, notFoundHandler, asyncHandler };
