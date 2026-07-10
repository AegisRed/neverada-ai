/**
 * Tiny JSON-file datastore.
 * Good enough for a demo / MVP. Swap for Postgres/Mongo in production.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "../../", config.dataFile);

let store = { users: [], contacts: [], subscribers: [] };

function ensureDir() {
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function loadDB() {
  try {
    ensureDir();
    if (fs.existsSync(dataPath)) {
      store = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      store.users ||= [];
      store.contacts ||= [];
      store.subscribers ||= [];
    } else {
      persist();
    }
  } catch (e) {
    console.error("Failed to load DB, starting fresh:", e.message);
  }
  return store;
}

export function persist() {
  try {
    ensureDir();
    fs.writeFileSync(dataPath, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error("Failed to persist DB:", e.message);
  }
}

export function db() {
  return store;
}
