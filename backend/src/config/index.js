import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  env: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "dev-insecure-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  corsOrigin: (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  dataFile: process.env.DATA_FILE || "./data/db.json",
};

if (config.env === "production" && config.jwt.secret.includes("change-me")) {
  console.warn("⚠️  JWT_SECRET is not set to a secure value in production!");
}
