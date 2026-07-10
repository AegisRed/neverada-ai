import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "1mb" }));

  // CORS
  const allowAll = config.corsOrigin.includes("*");
  app.use(
    cors({
      origin: allowAll ? true : config.corsOrigin,
      credentials: true,
    })
  );

  // Health check
  app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

  // API
  app.use("/api", apiRoutes);

  // 404 + error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
