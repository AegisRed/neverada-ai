import { Router } from "express";
import { contact, newsletter } from "../controllers/contactController.js";

const router = Router();

router.post("/contact", contact);
router.post("/newsletter", newsletter);

export default router;
