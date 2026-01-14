import mongoose from "mongoose";
import app from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

/**
 * Bootstrap function to start the server.
 * Keeps startup logic isolated and clean.
 */
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();

/**
 * Graceful shutdown handling
 */
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
