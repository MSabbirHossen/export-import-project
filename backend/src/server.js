import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   Import Export Hub Backend Server         ║
╠════════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(28)}║
║ Port: ${PORT.toString().padEnd(37)}║
║ Status: Running ✅                         ║
╚════════════════════════════════════════════╝

📍 API Root: http://localhost:${PORT}/api
📍 Health Check: http://localhost:${PORT}/api/health
      `);
    });

    // Graceful Shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
