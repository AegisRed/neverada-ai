import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { isEmail, isNonEmpty, ApiError } from "../utils/validate.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (!isNonEmpty(name)) throw new ApiError(400, "Укажите имя");
    if (!isEmail(email)) throw new ApiError(400, "Некорректный email");
    if (!password || password.length < 6) throw new ApiError(400, "Пароль должен быть не менее 6 символов");
    if (User.findByEmail(email)) throw new ApiError(409, "Этот email уже зарегистрирован");

    const user = await User.create({ name: name.trim(), email: email.trim(), password });
    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({ token, user });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!isEmail(email) || !isNonEmpty(password)) throw new ApiError(400, "Укажите email и пароль");

    const user = await User.verify(email, password);
    if (!user) throw new ApiError(401, "Неверный email или пароль");

    const token = signToken({ sub: user.id, email: user.email });
    res.json({ token, user });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
