# neverada.ai — Backend API

REST API на Node.js/Express для платформы neverada.ai.

## Запуск

```bash
cp .env.example .env      # Windows: copy .env.example .env
npm install
npm run dev               # авто-перезапуск (node --watch)
# или
npm start                 # прод-режим
```

Сервер по умолчанию: `http://localhost:4000`

## Переменные окружения

См. `.env.example`:

| Переменная       | По умолчанию          | Описание                                  |
|------------------|-----------------------|-------------------------------------------|
| `PORT`           | `4000`                | Порт сервера                              |
| `NODE_ENV`       | `development`         | Режим                                     |
| `JWT_SECRET`     | —                     | Секрет для подписи JWT (**смените в проде!**) |
| `JWT_EXPIRES_IN` | `7d`                  | Срок жизни токена                         |
| `CORS_ORIGIN`    | `*`                   | Разрешённые origin через запятую          |
| `DATA_FILE`      | `./data/db.json`      | Путь к JSON-хранилищу                      |

## Архитектура

```
src/
├── app.js              # Сборка Express-приложения (middleware, CORS, роуты)
├── config/             # Чтение .env
├── routes/             # Определения маршрутов
├── controllers/        # Бизнес-логика обработчиков
├── middleware/         # auth (JWT), обработка ошибок
├── models/             # User + JSON-datastore
└── utils/              # JWT, валидация
```

## Хранилище данных

Для простоты используется JSON-файл (`data/db.json`). Для продакшена замените
модуль `src/models/db.js` на драйвер Postgres/MongoDB — интерфейс `User` останется тем же.

## Смена секрета

Сгенерируйте безопасный `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
