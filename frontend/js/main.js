/* ============================================================
   neverada.ai — Shared frontend logic
   Navigation, theme, reveal-on-scroll, FAQ, pricing toggle, toasts
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const THEME_KEY = "neverada-theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    document.querySelectorAll("[data-theme-icon]").forEach((el) => {
      el.innerHTML = theme === "light" ? MOON : SUN;
    });
  }

  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';

  const saved = (function () { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } })();
  applyTheme(saved || "dark");

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-theme-toggle]");
    if (t) {
      const cur = root.getAttribute("data-theme");
      applyTheme(cur === "light" ? "dark" : "light");
    }
  });

  /* ---------- Navbar scroll + mobile menu ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-nav-toggle]")) {
      document.querySelector(".nav-links")?.classList.toggle("open");
    } else if (!e.target.closest(".nav-links")) {
      document.querySelector(".nav-links")?.classList.remove("open");
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- FAQ accordion ---------- */
  document.addEventListener("click", (e) => {
    const q = e.target.closest(".faq-q");
    if (q) q.parentElement.classList.toggle("open");
  });

  /* ---------- Pricing billing toggle ---------- */
  const toggle = document.querySelector("[data-billing-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const on = toggle.classList.toggle("on");
      document.querySelectorAll("[data-price]").forEach((el) => {
        const m = el.getAttribute("data-price");
        const y = el.getAttribute("data-price-year");
        el.firstChild.textContent = on ? y : m;
      });
      document.querySelectorAll("[data-period]").forEach((el) => {
        el.textContent = on ? "/год" : "/мес";
      });
    });
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1400; const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Set active nav link ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "index.html" && href === "index.html")) a.classList.add("active");
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Global toast helper ---------- */
  window.toast = function (msg, type = "success") {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 300); }, 3600);
  };
})();
