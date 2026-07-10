/* ============================================================
   neverada.ai — Dashboard logic
   Route guard, data loading, rendering
   ============================================================ */

(function () {
  "use strict";

  // Route guard
  const user = NEVERADA.user.get();
  const token = NEVERADA.token.get();
  if (!token || !user) { location.href = "login.html"; return; }

  // Fill user info
  const initials = (user.name || "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  document.querySelectorAll("[data-user-name]").forEach((el) => (el.textContent = user.name));
  document.querySelectorAll("[data-user-email]").forEach((el) => (el.textContent = user.email));
  document.querySelectorAll("[data-user-plan]").forEach((el) => (el.textContent = "Тариф " + (user.plan || "Free")));
  document.querySelectorAll("[data-user-initials]").forEach((el) => (el.textContent = initials));

  const hour = new Date().getHours();
  const greeting = hour < 6 ? "Доброй ночи" : hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
  const greetEl = document.querySelector("[data-greeting]");
  if (greetEl) greetEl.textContent = `${greeting}, ${(user.name || "").split(" ")[0]}! Вот сводка по вашим агентам.`;

  // Logout
  document.querySelectorAll("[data-logout]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      NEVERADA.token.clear();
      location.href = "index.html";
    })
  );

  // Mobile sidebar toggle
  document.querySelectorAll("[data-dash-menu]").forEach((btn) =>
    btn.addEventListener("click", () => document.querySelector(".dash-side")?.classList.toggle("hidden"))
  );

  const ICONS = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M12 20V4M20 20v-6"/></svg>',
  };

  async function load() {
    let data;
    try {
      data = await NEVERADA.api("/api/dashboard", { method: "GET", auth: true });
    } catch (e) {
      data = NEVERADA.demoDashboard();
    }

    // KPIs
    const kpiGrid = document.getElementById("kpi-grid");
    if (kpiGrid) {
      kpiGrid.innerHTML = data.kpis.map((k) => `
        <div class="kpi reveal in">
          <div class="top">
            <div class="ico">${ICONS[k.icon] || ICONS.chart}</div>
            <span class="trend ${k.up ? "up" : "down"}">${k.trend}</span>
          </div>
          <div class="val">${k.value}</div>
          <div class="lbl">${k.key}</div>
        </div>`).join("");
    }

    // Chart
    const chart = document.getElementById("chart-area");
    if (chart) {
      const max = Math.max(...data.activity);
      const months = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
      chart.innerHTML = data.activity.map((v, i) => `
        <div class="col" title="${v} задач">
          <div class="b" style="height:${(v / max) * 100}%"></div>
          <div class="cl">${months[i]}</div>
        </div>`).join("");
    }

    // Agents
    const agentList = document.getElementById("agent-list");
    if (agentList) {
      const labels = { active: "активен", paused: "пауза", draft: "черновик" };
      agentList.innerHTML = data.agents.map((a) => `
        <div class="agent-item">
          <div class="ai-ico">${a.initials}</div>
          <div class="meta"><div class="nm">${a.name}</div><div class="desc">${a.desc}</div></div>
          <span class="status-pill ${a.status}">${labels[a.status] || a.status}</span>
        </div>`).join("");
    }
  }

  load();

  // "New agent" demo button
  document.querySelectorAll("[data-new-agent]").forEach((btn) =>
    btn.addEventListener("click", () => window.toast("Демо: конструктор агентов откроется в полной версии 🚀", "success"))
  );
})();
