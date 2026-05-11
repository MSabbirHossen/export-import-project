// API Response Formatter
const sendResponse = (res, statusCode, status, message, data = null) => {
  const response = {
    status,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

// Success Response
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  sendResponse(res, statusCode, "success", message, data);
};

// Error Response
const sendError = (res, message, statusCode = 400, data = null) => {
  sendResponse(res, statusCode, "error", message, data);
};

export { sendResponse, sendSuccess, sendError };
