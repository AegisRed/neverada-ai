# neverada.ai 🤖

> Полноценный SaaS-сайт для вымышленного AI-продукта **neverada.ai** — платформы автономных AI-агентов, которые автоматизируют бизнес-процессы.

Современный, адаптивный, тёмная/светлая тема, готов к деплою на **GitHub Pages** из коробки. Включает статический фронтенд и полноценный REST API на Node.js/Express.

![stack](https://img.shields.io/badge/frontend-vanilla%20JS-7c5cff) ![stack](https://img.shields.io/badge/backend-Express-22d3ee) ![deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-a3e635)

---

## ✨ Возможности

**Фронтенд**
- 8 готовых страниц: главная, возможности, тарифы, о нас, контакты, вход, регистрация, дашборд + 404
- Современный дизайн: glassmorphism, градиенты, orb-подсветка, анимации появления
- 🌙 Переключение тёмной/светлой темы (сохраняется в localStorage)
- 📱 Полностью адаптивный (мобильное меню, адаптивные сетки)
- Анимированные счётчики, FAQ-аккордеон, переключатель тарифов, тосты
- **Demo-режим**: авторизация, регистрация и дашборд работают полностью на статике (localStorage) — идеально для GitHub Pages без бэкенда
- Без сборки и зависимостей — чистый HTML/CSS/JS

**Бэкенд** (`/backend`)
- REST API на Express (ES-модули)
- JWT-авторизация + хеширование паролей (bcrypt)
- Регистрация / вход / профиль / дашборд / контакты / рассылка
- Rate-limiting на auth-эндпоинтах, CORS, обработка ошибок
- Простое JSON-хранилище (легко заменить на Postgres/Mongo)

---

## 📁 Структура

```
neverada-ai/
├── frontend/                 # Статический сайт (деплой на GitHub Pages)
│   ├── index.html            # Главная (лендинг)
│   ├── features.html         # Возможности
│   ├── pricing.html          # Тарифы
│   ├── about.html            # О нас
│   ├── contact.html          # Контакты
│   ├── login.html            # Вход
│   ├── signup.html           # Регистрация
│   ├── dashboard.html        # Личный кабинет (защищён)
│   ├── 404.html
│   ├── css/styles.css        # Дизайн-система
│   ├── js/
│   │   ├── config.js         # API-обёртка + demo-mock
│   │   ├── main.js           # Тема, навигация, анимации
│   │   ├── auth.js           # Формы входа/регистрации/контактов
│   │   └── dashboard.js      # Логика дашборда
│   ├── assets/favicon.svg
│   ├── robots.txt
│   └── .nojekyll
├── backend/                  # REST API на Node.js/Express
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── utils/
└── .github/workflows/deploy.yml   # Автодеплой на GitHub Pages
```

---

## 🚀 Быстрый старт

### Вариант 1: только фронтенд (demo-режим)

Ничего устанавливать не нужно — сайт работает полностью на статике.

```bash
cd frontend
# любой статический сервер, например:
python -m http.server 8080
# затем откройте http://localhost:8080
```

Регистрация, вход и дашборд будут работать через localStorage.

### Вариант 2: фронтенд + реальный бэкенд

```bash
# 1. Запустите API
cd backend
cp .env.example .env        # (Windows: copy .env.example .env)
npm install
npm run dev                 # → http://localhost:4000

# 2. Свяжите фронтенд с API
# откройте frontend/js/config.js и укажите:
#   NEVERADA.API_BASE = "http://localhost:4000";

# 3. Запустите фронтенд (см. Вариант 1)
```

---

## 🌐 Деплой на GitHub Pages

Сайт готов к GitHub Pages сразу. Все пути относительные, добавлен `.nojekyll`.

### Способ A — GitHub Actions (рекомендуется)

1. Запушьте репозиторий на GitHub.
2. Откройте **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. При каждом пуше в `main` воркфлоу `.github/workflows/deploy.yml` автоматически опубликует папку `frontend/`.

### Способ B — деплой из папки `/docs`

Если предпочитаете классический способ:

```bash
# переименуйте/скопируйте frontend в docs
cp -r frontend docs
```

Затем **Settings → Pages → Source: Deploy from a branch → main / docs**.

> ⚠️ **Важно про GitHub Pages:** это статический хостинг — он не запускает бэкенд. На Pages сайт работает в **demo-режиме** (localStorage). Чтобы подключить реальный API, задеплойте `backend/` отдельно (Render, Railway, Fly.io, VPS) и пропишите URL в `frontend/js/config.js` → `NEVERADA.API_BASE`.

---

## 🔌 API-эндпоинты

| Метод | Путь                    | Описание                    | Auth |
|-------|-------------------------|-----------------------------|------|
| GET   | `/health`               | Проверка состояния          | —    |
| GET   | `/api`                  | Список эндпоинтов           | —    |
| POST  | `/api/auth/register`    | Регистрация                 | —    |
| POST  | `/api/auth/login`       | Вход                        | —    |
| GET   | `/api/auth/me`          | Текущий пользователь        | ✅   |
| GET   | `/api/dashboard`        | Данные дашборда             | ✅   |
| POST  | `/api/contact`          | Форма обратной связи        | —    |
| POST  | `/api/newsletter`       | Подписка на рассылку        | —    |

Пример:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","email":"ivan@test.com","password":"secret123"}'
```

---

## 🛠 Технологии

- **Frontend:** HTML5, CSS3 (custom properties, grid/flex), ванильный JavaScript (ES6+)
- **Backend:** Node.js 18+, Express 4, JWT, bcryptjs, express-rate-limit
- **Шрифты:** Inter, JetBrains Mono (Google Fonts)
- **CI/CD:** GitHub Actions → GitHub Pages

## 📝 Лицензия

MIT. Продукт вымышленный, создан в демонстрационных целях.
