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
} from "../../src/utils/validation.js";

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
      expect(validateProductName("Laptop Computer")).toBe("Laptop Computer");
    });

    test("should reject empty product name", () => {
      const result = validateProductName("");
      expect(result).toBeNull();
    });

    test("should reject product name exceeding 100 characters", () => {
      const longName = "a".repeat(101);
      const result = validateProductName(longName);
      expect(result).toBeNull();
    });

    test("should reject special characters", () => {
      const result = validateProductName(
        'Product <script>alert("xss")</script>',
      );
      expect(result).toBeNull();
    });
  });

  describe("validateEmail", () => {
    test("should validate correct email format", () => {
      expect(validateEmail("user@example.com")).toBe("user@example.com");
    });

    test("should reject invalid email format", () => {
      expect(validateEmail("invalid-email")).toBeNull();
    });

    test("should reject empty email", () => {
      expect(validateEmail("")).toBeNull();
    });
  });

  describe("validateURL", () => {
    test("should validate correct URL format", () => {
      expect(validateURL("https://example.com/image.jpg")).toBe(
        "https://example.com/image.jpg",
      );
    });

    test("should reject invalid URL", () => {
      expect(validateURL("not-a-url")).toBeNull();
    });

    test("should reject empty URL", () => {
      expect(validateURL("")).toBeNull();
    });
  });

  describe("validatePrice", () => {
    test("should validate positive price", () => {
      expect(validatePrice(99.99)).toBe(99.99);
    });

    test("should reject negative price", () => {
      expect(validatePrice(-10)).toBeNull();
    });

    test("should accept zero price", () => {
      expect(validatePrice(0)).toBe(0);
    });
  });

  describe("validateQuantity", () => {
    test("should validate positive quantity", () => {
      expect(validateQuantity(5)).toBe(5);
    });

    test("should reject zero quantity", () => {
      expect(validateQuantity(0)).toBe(0);
    });

    test("should reject negative quantity", () => {
      expect(validateQuantity(-5)).toBeNull();
    });

    test("should reject non-integer quantity", () => {
      expect(validateQuantity(5.5)).toBeNull();
    });
  });

  describe("validateRating", () => {
    test("should validate rating between 0 and 5", () => {
      expect(validateRating(3.5)).toBe(3.5);
    });

    test("should reject rating above 5", () => {
      expect(validateRating(6)).toBeNull();
    });

    test("should reject negative rating", () => {
      expect(validateRating(-1)).toBeNull();
    });

    test("should accept 0 and 5", () => {
      expect(validateRating(0)).toBe(0);
      expect(validateRating(5)).toBe(5);
    });
  });

  describe("validateRole", () => {
    test("should validate allowed roles", () => {
      expect(validateRole("importer")).toBe("importer");
      expect(validateRole("exporter")).toBe("exporter");
      expect(validateRole("both")).toBe("both");
    });

    test("should reject invalid role", () => {
      expect(validateRole("admin")).toBeNull();
    });

    test("should reject empty role", () => {
      expect(validateRole("")).toBeNull();
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
      expect(validatePhone("+8801712345678")).toBe("+8801712345678");
    });

    test("should reject invalid phone", () => {
      expect(validatePhone("abc")).toBeNull();
    });
  });

  describe("validateCountry", () => {
    test("should validate country name", () => {
      expect(validateCountry("Bangladesh")).toBe("Bangladesh");
    });

    test("should handle case insensitive country names", () => {
      expect(validateCountry("bangladesh")).toBe("bangladesh");
    });
  });

  describe("validateObjectId", () => {
    test("should validate MongoDB ObjectId format", () => {
      const validId = "507f1f77bcf86cd799439011";
      expect(validateObjectId(validId)).toBe(validId);
    });

    test("should reject invalid ObjectId", () => {
      expect(validateObjectId("invalid-id")).toBeNull();
    });

    test("should reject empty string", () => {
      expect(validateObjectId("")).toBeNull();
    });
  });
});
