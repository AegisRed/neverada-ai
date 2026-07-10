/* ============================================================
   neverada.ai — Frontend config
   Central place for API endpoint + tiny fetch wrapper.
   On GitHub Pages there is no backend, so we fall back to a
   local mock ("demo mode") that persists to localStorage.
   ============================================================ */

window.NEVERADA = window.NEVERADA || {};

// Set this to your deployed backend URL (e.g. https://api.neverada.ai)
// Leave empty to run in DEMO mode (works fully on GitHub Pages).
NEVERADA.API_BASE = "";

NEVERADA.DEMO = !NEVERADA.API_BASE;

/* -------- token helpers -------- */
NEVERADA.token = {
  get: () => { try { return localStorage.getItem("neverada-token"); } catch (e) { return null; } },
  set: (t) => { try { localStorage.setItem("neverada-token", t); } catch (e) {} },
  clear: () => { try { localStorage.removeItem("neverada-token"); localStorage.removeItem("neverada-user"); } catch (e) {} },
};

NEVERADA.user = {
  get: () => { try { return JSON.parse(localStorage.getItem("neverada-user") || "null"); } catch (e) { return null; } },
  set: (u) => { try { localStorage.setItem("neverada-user", JSON.stringify(u)); } catch (e) {} },
};

/* -------- fetch wrapper -------- */
NEVERADA.api = async function (path, { method = "GET", body, auth = false } = {}) {
  if (NEVERADA.DEMO) return NEVERADA.mock(path, method, body);

  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const t = NEVERADA.token.get();
    if (t) headers.Authorization = "Bearer " + t;
  }
  const res = await fetch(NEVERADA.API_BASE + path, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
};

/* -------- DEMO mock backend (localStorage) -------- */
NEVERADA.mock = async function (path, method, body) {
  await new Promise((r) => setTimeout(r, 450)); // simulate latency
  const db = JSON.parse(localStorage.getItem("neverada-demo-db") || '{"users":[]}');
  const save = () => localStorage.setItem("neverada-demo-db", JSON.stringify(db));

  if (path === "/api/auth/register" && method === "POST") {
    if (db.users.find((u) => u.email === body.email)) throw new Error("Этот email уже зарегистрирован");
    const user = { id: "usr_" + Math.random().toString(36).slice(2, 10), name: body.name, email: body.email, plan: "Free", createdAt: Date.now() };
    db.users.push({ ...user, password: body.password });
    save();
    return { token: "demo." + btoa(user.email), user };
  }

  if (path === "/api/auth/login" && method === "POST") {
    const found = db.users.find((u) => u.email === body.email && u.password === body.password);
    if (!found) throw new Error("Неверный email или пароль");
    const { password, ...user } = found;
    return { token: "demo." + btoa(user.email), user };
  }

  if (path === "/api/contact" && method === "POST") {
    return { ok: true, message: "Спасибо! Мы свяжемся с вами в ближайшее время." };
  }

  if (path === "/api/newsletter" && method === "POST") {
    return { ok: true, message: "Вы подписаны на рассылку." };
  }

  if (path === "/api/dashboard" && method === "GET") {
    return NEVERADA.demoDashboard();
  }

  throw new Error("Demo: неизвестный запрос " + path);
};

NEVERADA.demoDashboard = function () {
  return {
    kpis: [
      { key: "Задач выполнено", value: "12 847", trend: "+18%", up: true, icon: "check" },
      { key: "Активных агентов", value: "7", trend: "+2", up: true, icon: "bot" },
      { key: "Сэкономлено часов", value: "342", trend: "+27%", up: true, icon: "clock" },
      { key: "Успешность", value: "99.2%", trend: "+0.4%", up: true, icon: "chart" },
    ],
    activity: [42, 58, 51, 73, 66, 89, 78, 95, 84, 102, 96, 118],
    agents: [
      { name: "Sales Outreach", desc: "Автоматизация холодных писем", status: "active", initials: "SO" },
      { name: "Support Triage", desc: "Классификация тикетов", status: "active", initials: "ST" },
      { name: "Content Writer", desc: "Генерация статей блога", status: "paused", initials: "CW" },
      { name: "Data Analyst", desc: "Отчёты по метрикам", status: "active", initials: "DA" },
      { name: "Lead Scorer", desc: "Скоринг входящих лидов", status: "draft", initials: "LS" },
    ],
  };
};
