/**
 * Error handling middleware for Mediterranean College Alumni Network
 * Centralizes error handling and standardizes error responses
 */

const config = require('../config/config');

// NotFoundError for routes that don't exist
class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

// ValidationError for invalid input data
class ValidationError extends Error {
  constructor(message = 'Invalid input data', errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

// AuthenticationError for auth-related issues
class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

// AuthorizationError for permission issues
class AuthorizationError extends Error {
  constructor(message = 'Not authorized to perform this action') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

// Generic error handler middleware
const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';
  
  // Log the error (but not in test environment)
  if (config.server.env !== 'test') {
    console.error(`Error ${statusCode}: ${message}`);
    
    // In development, log the full error stack
    if (config.server.env === 'development' && err.stack) {
      console.error(err.stack);
    }
  }
  
  // Prepare the response
  const errorResponse = {
    error: {
      message,
      status: statusCode
    }
  };
  
  // Add validation errors if available
  if (err.errors) {
    errorResponse.error.details = err.errors;
  }
  
  // Don't expose error stack in production
  if (config.server.env === 'development' && err.stack) {
    errorResponse.error.stack = err.stack;
  }
  
  // Send the error response
  res.status(statusCode).json(errorResponse);
};

// 404 handler - must be used after all other routes
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = {
  errorHandler,
  notFoundHandler,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError
};