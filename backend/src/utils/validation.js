// Input Sanitization and Validation Utilities

// Trim and validate string
const trimString = (str) => {
  if (typeof str !== "string") return "";
  return str.trim().substring(0, 1000); // Max 1000 chars
};

// Validate and sanitize email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = trimString(email).toLowerCase();
  return emailRegex.test(sanitized) ? sanitized : null;
};

// Validate URL
const validateURL = (url) => {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return null;
    }
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return null;
  }
};

// Validate positive number
const validatePositiveNumber = (num, max = Infinity, min = 0) => {
  const parsed = parseFloat(num);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    return null;
  }
  return parsed;
};

// Validate integer
const validateInteger = (num, max = Infinity, min = 0) => {
  const parsed = parseInt(num);
  if (
    isNaN(parsed) ||
    parsed < min ||
    parsed > max ||
    !Number.isInteger(parsed)
  ) {
    return null;
  }
  return parsed;
};

// Validate rating (0-5)
const validateRating = (rating) => {
  const parsed = parseFloat(rating);
  if (isNaN(parsed) || parsed < 0 || parsed > 5) {
    return null;
  }
  return parsed;
};

// Validate product quantity
const validateQuantity = (qty) => {
  return validateInteger(qty, 1000000, 0);
};

// Validate price
const validatePrice = (price) => {
  const parsed = parseFloat(price);
  if (isNaN(parsed) || parsed < 0 || !isFinite(parsed)) {
    return null;
  }
  return Math.round(parsed * 100) / 100; // Round to 2 decimals
};

// Validate country name
const validateCountry = (country) => {
  const sanitized = trimString(country);
  if (sanitized.length === 0 || sanitized.length > 100) {
    return null;
  }
  return sanitized;
};

// Validate product name
const validateProductName = (name) => {
  const sanitized = trimString(name);
  if (sanitized.length < 2 || sanitized.length > 100) {
    return null;
  }
  return sanitized;
};

// Validate phone number (basic validation)
const validatePhone = (phone) => {
  const sanitized = trimString(phone);
  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(sanitized) ? sanitized : null;
};

// Validate role
const validateRole = (role) => {
  const validRoles = ["importer", "exporter", "both"];
  return validRoles.includes(role) ? role : null;
};

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  if (typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return null;
  }
  return id;
};

// Sanitize object (remove extra fields, trim strings)
const sanitizeObject = (obj, allowedFields) => {
  const sanitized = {};
  for (const field of allowedFields) {
    if (field in obj) {
      const value = obj[field];
      if (typeof value === "string") {
        sanitized[field] = trimString(value);
      } else {
        sanitized[field] = value;
      }
    }
  }
  return sanitized;
};

export {
  trimString,
  validateEmail,
  validateURL,
  validatePositiveNumber,
  validateInteger,
  validateRating,
  validateQuantity,
  validatePrice,
  validateCountry,
  validateProductName,
  validatePhone,
  validateRole,
  validateObjectId,
  sanitizeObject,
};
