import mongoose from "mongoose";

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    if (cachedConnection && mongoose.connection.readyState === 1) {
      return cachedConnection;
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(mongoURI, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 10000,
      });
    }

    const conn = await connectionPromise;
    cachedConnection = conn;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cachedConnection = null;
    connectionPromise = null;
  }
};

export default connectDB;
