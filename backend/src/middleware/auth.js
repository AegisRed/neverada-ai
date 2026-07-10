import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Требуется авторизация" });

  try {
    const payload = verifyToken(token);
    const user = User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "Пользователь не найден" });
    req.user = User.public(user);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Недействительный или истёкший токен" });
  }
}
