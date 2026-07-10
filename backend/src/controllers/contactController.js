import crypto from "crypto";
import { db, persist } from "../models/db.js";
import { isEmail, isNonEmpty, ApiError } from "../utils/validate.js";

export function contact(req, res, next) {
  try {
    const { name, email, company, message } = req.body || {};
    if (!isNonEmpty(name)) throw new ApiError(400, "Укажите имя");
    if (!isEmail(email)) throw new ApiError(400, "Некорректный email");
    if (!isNonEmpty(message)) throw new ApiError(400, "Введите сообщение");

    db().contacts.push({
      id: "msg_" + crypto.randomBytes(6).toString("hex"),
      name: name.trim(),
      email: email.trim(),
      company: (company || "").trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });
    persist();
    res.status(201).json({ ok: true, message: "Спасибо! Мы свяжемся с вами в ближайшее время." });
  } catch (e) {
    next(e);
  }
}

export function newsletter(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!isEmail(email)) throw new ApiError(400, "Некорректный email");

    const exists = db().subscribers.find((s) => s.email === email.trim());
    if (!exists) {
      db().subscribers.push({ email: email.trim(), createdAt: new Date().toISOString() });
      persist();
    }
    res.status(201).json({ ok: true, message: "Вы подписаны на рассылку." });
  } catch (e) {
    next(e);
  }
}
