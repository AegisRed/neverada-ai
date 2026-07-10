import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db, persist } from "./db.js";

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

export const User = {
  findByEmail(email) {
    return db().users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  },

  findById(id) {
    return db().users.find((u) => u.id === id);
  },

  async create({ name, email, password }) {
    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: "usr_" + crypto.randomBytes(8).toString("hex"),
      name,
      email,
      password: hash,
      plan: "Free",
      createdAt: new Date().toISOString(),
    };
    db().users.push(user);
    persist();
    return publicUser(user);
  },

  async verify(email, password) {
    const user = this.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? publicUser(user) : null;
  },

  public: publicUser,
};
