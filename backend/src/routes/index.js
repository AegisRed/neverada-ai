import { Router } from "express";
import authRoutes from "./auth.js";
import contactRoutes from "./contact.js";
import dashboardRoutes from "./dashboard.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    name: "neverada.ai API",
    version: "1.0.0",
    status: "ok",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET  /api/auth/me",
      "POST /api/contact",
      "POST /api/newsletter",
      "GET  /api/dashboard",
    ],
  });
});

router.use("/auth", authRoutes);
router.use("/", contactRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
