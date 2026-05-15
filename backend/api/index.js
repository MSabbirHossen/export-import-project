import "dotenv/config";
import app from "../src/app.js";
import connectDB from "../src/config/database.js";

const getServiceErrorCode = (error) => {
  if (error.message.includes("MONGODB_URI")) {
    return "MONGODB_URI_MISSING";
  }

  return "DATABASE_CONNECTION_FAILED";
};

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Serverless request failed:", error.message);
    return res.status(503).json({
      status: "error",
      message: "Server failed to connect to required services",
      service: "database",
      code: getServiceErrorCode(error),
    });
  }
}
