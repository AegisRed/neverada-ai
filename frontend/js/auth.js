/* ============================================================
   neverada.ai — Auth page logic (login / signup / contact)
   ============================================================ */

(function () {
  "use strict";

  function showMsg(form, text, type) {
    let box = form.querySelector(".form-msg");
    if (!box) { box = document.createElement("div"); box.className = "form-msg"; form.prepend(box); }
    box.textContent = text;
    box.className = "form-msg " + type;
  }

  function setLoading(btn, on) {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = "Пожалуйста, подождите…"; btn.disabled = true; }
    else { btn.textContent = btn.dataset.label || btn.textContent; btn.disabled = false; }
  }

  /* ---- Signup ---- */
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = signupForm.querySelector('button[type="submit"]');
      const name = signupForm.name.value.trim();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value;
      if (password.length < 6) return showMsg(signupForm, "Пароль должен быть не менее 6 символов", "error");
      setLoading(btn, true);
      try {
        const { token, user } = await NEVERADA.api("/api/auth/register", { method: "POST", body: { name, email, password } });
        NEVERADA.token.set(token); NEVERADA.user.set(user);
        showMsg(signupForm, "Аккаунт создан! Перенаправляем…", "success");
        setTimeout(() => (location.href = "dashboard.html"), 700);
      } catch (err) {
        showMsg(signupForm, err.message, "error"); setLoading(btn, false);
      }
    });
  }

  /* ---- Login ---- */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      setLoading(btn, true);
      try {
        const { token, user } = await NEVERADA.api("/api/auth/login", { method: "POST", body: { email, password } });
        NEVERADA.token.set(token); NEVERADA.user.set(user);
        showMsg(loginForm, "Вход выполнен! Перенаправляем…", "success");
        setTimeout(() => (location.href = "dashboard.html"), 600);
      } catch (err) {
        showMsg(loginForm, err.message, "error"); setLoading(btn, false);
      }
    });
  }

  /* ---- Contact ---- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const body = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        company: contactForm.company?.value.trim(),
        message: contactForm.message.value.trim(),
      };
      setLoading(btn, true);
      try {
        const res = await NEVERADA.api("/api/contact", { method: "POST", body });
        showMsg(contactForm, res.message || "Сообщение отправлено!", "success");
        contactForm.reset();
      } catch (err) {
        showMsg(contactForm, err.message, "error");
      } finally { setLoading(btn, false); }
    });
  }

  /* ---- Newsletter (footer) ---- */
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.querySelector("input").value.trim();
      try {
        const res = await NEVERADA.api("/api/newsletter", { method: "POST", body: { email } });
        window.toast(res.message || "Подписка оформлена!", "success");
        form.reset();
      } catch (err) { window.toast(err.message, "error"); }
    });
  });

  /* ---- Redirect if already logged in ---- */
  if ((location.pathname.endsWith("login.html") || location.pathname.endsWith("signup.html")) && NEVERADA.token.get()) {
    location.href = "dashboard.html";
  }
})();
