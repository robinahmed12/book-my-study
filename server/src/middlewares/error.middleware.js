/**
 * 404 Not Found handler
 */
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  // Log full error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    // In production log minimal info
    console.error(`❌ ${statusCode} - ${err.message} - ${req.originalUrl}`);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * Async handler wrapper — eliminates try/catch boilerplate in controllers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create a standardized AppError
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { notFound, errorHandler, asyncHandler, AppError };
