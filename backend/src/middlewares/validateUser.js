// User Profile Validation Middleware

import {
  validateEmail,
  validatePhone,
  validateRole,
  trimString,
  validateCountry,
} from "../utils/validation.js";

const validateSaveUserProfile = (req, res, next) => {
  try {
    const { displayName, role, phone, address } = req.body;
    const validatedData = {};
    const errors = [];

    // Validate displayName
    if (displayName !== undefined) {
      const sanitized = trimString(displayName);
      if (sanitized.length < 2 || sanitized.length > 100) {
        errors.push("Display name must be 2-100 characters");
      } else {
        validatedData.displayName = sanitized;
      }
    }

    // Validate role
    if (role !== undefined) {
      const validatedRole = validateRole(role);
      if (!validatedRole) {
        errors.push("Role must be one of: importer, exporter, both");
      } else {
        validatedData.role = validatedRole;
      }
    }

    // Validate phone
    if (phone !== undefined && phone !== "") {
      const validatedPhone = validatePhone(phone);
      if (!validatedPhone) {
        errors.push("Phone number format is invalid");
      } else {
        validatedData.phone = validatedPhone;
      }
    }

    // Validate address
    if (address !== undefined) {
      const validatedAddress = {};

      if (address.country !== undefined) {
        const validCountry = validateCountry(address.country);
        if (validCountry) {
          validatedAddress.country = validCountry;
        }
      }

      if (address.city !== undefined) {
        const city = trimString(address.city);
        if (city.length > 0 && city.length <= 100) {
          validatedAddress.city = city;
        }
      }

      if (address.details !== undefined) {
        const details = trimString(address.details);
        if (details.length <= 500) {
          validatedAddress.details = details;
        }
      }

      if (Object.keys(validatedAddress).length > 0) {
        validatedData.address = validatedAddress;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "User profile validation failed",
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    req.validatedData = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "User profile validation error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export { validateSaveUserProfile };
