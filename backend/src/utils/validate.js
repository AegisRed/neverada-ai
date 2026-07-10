export const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
