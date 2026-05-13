import { sendSuccess, sendError, sendResponse } from "../../src/utils/response.js";
import { jest } from "@jest/globals";

describe("Response Utility Tests", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
  });

  describe("sendSuccess", () => {
    test("should send success response with data", () => {
      const data = { id: 1, name: "Product" };
      sendSuccess(res, "Product fetched", data, 200);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.status).toBe("success");
      expect(response.message).toBe("Product fetched");
      expect(response.data).toEqual(data);
    });

    test("should send success response without data", () => {
      sendSuccess(res, "Operation completed");

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.status).toBe("success");
      expect(response.data).toBeUndefined();
    });

    test("should use default status code 200", () => {
      sendSuccess(res, "Success");

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("sendError", () => {
    test("should send error response with message", () => {
      sendError(res, "Product not found", 404);

      expect(res.status).toHaveBeenCalledWith(404);
      const response = res.json.mock.calls[0][0];
      expect(response.status).toBe("error");
      expect(response.message).toBe("Product not found");
    });

    test("should send error response with error data", () => {
      const errors = [{ field: "email", message: "Invalid email" }];
      sendError(res, "Validation failed", 400, errors);

      expect(res.status).toHaveBeenCalledWith(400);
      const response = res.json.mock.calls[0][0];
      expect(response.data).toEqual(errors);
    });

    test("should use default status code 400", () => {
      sendError(res, "Server error");

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("sendResponse", () => {
    test("should send custom response", () => {
      const data = { count: 100 };
      sendResponse(res, 200, "success", "Data retrieved", data);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.status).toBe("success");
      expect(response.message).toBe("Data retrieved");
      expect(response.data).toEqual(data);
    });

    test("should include timestamp in response", () => {
      sendSuccess(res, "Test");

      const response = res.json.mock.calls[0][0];
      expect(response.timestamp).toBeDefined();
      expect(typeof response.timestamp).toBe("string");
    });
  });

  describe("Response format consistency", () => {
    test("all responses should have required fields", () => {
      sendSuccess(res, "Test", { test: "data" }, 200);

      const response = res.json.mock.calls[0][0];
      expect(response).toHaveProperty("status");
      expect(response).toHaveProperty("message");
      expect(response).toHaveProperty("timestamp");
    });

    test('success status should be "success"', () => {
      sendSuccess(res, "Test");

      const response = res.json.mock.calls[0][0];
      expect(response.status).toBe("success");
    });

    test('error status should be "error"', () => {
      sendError(res, "Test", 400);

      const response = res.json.mock.calls[0][0];
      expect(response.status).toBe("error");
    });
  });
});
