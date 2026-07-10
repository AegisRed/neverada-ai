import { config } from "../config/index.js";

export function notFound(req, res) {
  res.status(404).json({ error: "Маршрут не найден: " + req.originalUrl });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  if (config.env !== "test") {
    console.error(`[${status}] ${err.message}`);
  }
  res.status(status).json({
    error: status === 500 ? "Внутренняя ошибка сервера" : err.message,
    ...(config.env === "development" && status === 500 ? { stack: err.stack } : {}),
  });
}
