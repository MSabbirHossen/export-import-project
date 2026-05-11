import {
  trimString,
  validateProductName,
  validateCountry,
  validateEmail,
  validateURL,
  validatePhone,
  validateRating,
  validateQuantity,
  validatePrice,
  validateRole,
  validateObjectId,
  sanitizeObject,
} from "../src/utils/validation.js";

describe("Validation Utility Tests", () => {
  describe("trimString", () => {
    test("should trim whitespace from string", () => {
      expect(trimString("  hello world  ")).toBe("hello world");
    });

    test("should handle empty strings", () => {
      expect(trimString("")).toBe("");
    });

    test("should not modify strings without whitespace", () => {
      expect(trimString("hello")).toBe("hello");
    });
  });

  describe("validateProductName", () => {
    test("should validate a valid product name", () => {
      expect(validateProductName("Laptop Computer")).toEqual({ valid: true });
    });

    test("should reject empty product name", () => {
      const result = validateProductName("");
      expect(result.valid).toBe(false);
    });

    test("should reject product name exceeding 100 characters", () => {
      const longName = "a".repeat(101);
      const result = validateProductName(longName);
      expect(result.valid).toBe(false);
    });

    test("should reject special characters", () => {
      const result = validateProductName(
        'Product <script>alert("xss")</script>',
      );
      expect(result.valid).toBe(false);
    });
  });

  describe("validateEmail", () => {
    test("should validate correct email format", () => {
      expect(validateEmail("user@example.com")).toEqual({ valid: true });
    });

    test("should reject invalid email format", () => {
      expect(validateEmail("invalid-email").valid).toBe(false);
    });

    test("should reject empty email", () => {
      expect(validateEmail("").valid).toBe(false);
    });
  });

  describe("validateURL", () => {
    test("should validate correct URL format", () => {
      expect(validateURL("https://example.com/image.jpg")).toEqual({
        valid: true,
      });
    });

    test("should reject invalid URL", () => {
      expect(validateURL("not-a-url").valid).toBe(false);
    });

    test("should reject empty URL", () => {
      expect(validateURL("").valid).toBe(false);
    });
  });

  describe("validatePrice", () => {
    test("should validate positive price", () => {
      expect(validatePrice(99.99)).toEqual({ valid: true });
    });

    test("should reject negative price", () => {
      expect(validatePrice(-10).valid).toBe(false);
    });

    test("should accept zero price", () => {
      expect(validatePrice(0)).toEqual({ valid: true });
    });
  });

  describe("validateQuantity", () => {
    test("should validate positive quantity", () => {
      expect(validateQuantity(5)).toEqual({ valid: true });
    });

    test("should reject zero quantity", () => {
      expect(validateQuantity(0).valid).toBe(false);
    });

    test("should reject negative quantity", () => {
      expect(validateQuantity(-5).valid).toBe(false);
    });

    test("should reject non-integer quantity", () => {
      expect(validateQuantity(5.5).valid).toBe(false);
    });
  });

  describe("validateRating", () => {
    test("should validate rating between 0 and 5", () => {
      expect(validateRating(3.5)).toEqual({ valid: true });
    });

    test("should reject rating above 5", () => {
      expect(validateRating(6).valid).toBe(false);
    });

    test("should reject negative rating", () => {
      expect(validateRating(-1).valid).toBe(false);
    });

    test("should accept 0 and 5", () => {
      expect(validateRating(0)).toEqual({ valid: true });
      expect(validateRating(5)).toEqual({ valid: true });
    });
  });

  describe("validateRole", () => {
    test("should validate allowed roles", () => {
      expect(validateRole("importer")).toEqual({ valid: true });
      expect(validateRole("exporter")).toEqual({ valid: true });
      expect(validateRole("both")).toEqual({ valid: true });
    });

    test("should reject invalid role", () => {
      expect(validateRole("admin").valid).toBe(false);
    });

    test("should reject empty role", () => {
      expect(validateRole("").valid).toBe(false);
    });
  });

  describe("sanitizeObject", () => {
    test("should sanitize HTML in object values", () => {
      const obj = {
        name: '<script>alert("xss")</script>',
        description: "Normal text",
      };
      const result = sanitizeObject(obj, ["name", "description"]);
      expect(result.name).not.toContain("<script>");
    });

    test("should only sanitize whitelisted fields", () => {
      const obj = {
        name: "<b>Bold</b>",
        price: 100,
      };
      const result = sanitizeObject(obj, ["price"]);
      expect(result.price).toBe(100);
    });
  });

  describe("validatePhone", () => {
    test("should validate phone number", () => {
      expect(validatePhone("+8801712345678")).toEqual({ valid: true });
    });

    test("should reject invalid phone", () => {
      expect(validatePhone("abc").valid).toBe(false);
    });
  });

  describe("validateCountry", () => {
    test("should validate country name", () => {
      expect(validateCountry("Bangladesh")).toEqual({ valid: true });
    });

    test("should handle case insensitive country names", () => {
      expect(validateCountry("bangladesh")).toEqual({ valid: true });
    });
  });

  describe("validateObjectId", () => {
    test("should validate MongoDB ObjectId format", () => {
      const validId = "507f1f77bcf86cd799439011";
      expect(validateObjectId(validId)).toEqual({ valid: true });
    });

    test("should reject invalid ObjectId", () => {
      expect(validateObjectId("invalid-id").valid).toBe(false);
    });

    test("should reject empty string", () => {
      expect(validateObjectId("").valid).toBe(false);
    });
  });
});
