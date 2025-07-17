# myFlashcard API

A modern, full-stack flashcard learning web app backend, built with Node.js, Express, Prisma (MySQL), and JWT authentication.

---

## Features

- User registration & login (JWT, bcryptjs)
- Profile management
- Deck & flashcard CRUD (with soft-delete, restore, copy, like, report)
- Tag system (many-to-many)
- Admin moderation (ban, hard-delete, resolve reports)
- Scheduled cleanup for soft-deleted decks
- Validation with Yup
- Centralized error handling

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in your values.

3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

---

## API Overview

See [`myFlashcard_FULL_PROJECT_LOG.md`](./myFlashcard_FULL_PROJECT_LOG.md) for a full API path summary and backend architecture.

---

## Admin Features

- Protected by `verifyAdmin` middleware (`src/middlewares/verifyAdmin.js`)
- Endpoints:
  - `GET /api/admin/reports` — View all deck reports
  - `POST /api/admin/decks/:id/delete` — Hard delete deck
  - `POST /api/admin/flashcards/:id/delete` — Hard delete flashcard
  - `POST /api/admin/users/:id/ban` — Ban user
  - `PUT /api/admin/reports/:id/resolve` — Resolve report

---

## Project Structure

```
myFlashcard-API/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
├── myFlashcard_FULL_PROJECT_LOG.md
├── README.md
└── package.json
```

---

## Progress

- [x] Core user/deck/flashcard/tag features
- [x] JWT authentication
- [x] Validation & error handling
- [x] Scheduled cleanup
- [x] Admin middleware, routes, controller, and service logic
- [ ] Frontend integration (next)

---

## License

MIT