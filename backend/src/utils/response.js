// API Response Formatter - standardized schema
// { success: boolean, message: string, data: object|null, pagination: object|null, timestamp }
const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
  pagination = null,
) => {
  const response = {
    success: !!success,
    message: message || "",
    ...(data !== null ? { data } : { data: null }),
    ...(pagination ? { pagination } : {}),
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

// Success Response
const sendSuccess = (res, message, payload = null, statusCode = 200) => {
  // payload may be either data or { data, pagination }
  let data = null;
  let pagination = null;

  if (payload && typeof payload === "object" && "data" in payload) {
    data = payload.data;
    pagination = payload.pagination || null;
  } else if (payload !== null) {
    data = payload;
  }

  sendResponse(res, statusCode, true, message, data, pagination);
};

// Error Response
const sendError = (res, message, statusCode = 400, data = null) => {
  sendResponse(res, statusCode, false, message, data, null);
};

export { sendResponse, sendSuccess, sendError };
