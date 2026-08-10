# Property Marketplace

Full-stack property marketplace: Node/Express + PostgreSQL backend, React/Vite (Tailwind) frontend, WhatsApp-first lead handling, Gemini auto-descriptions.

## Stack

- **Backend:** Express, PostgreSQL (pg), dotenv, cors, Cloudinary, Multer
- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **AI:** Gemini 2.0 Flash (description polishing, optional)

## Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, ADMIN_PASSWORD
npm run migrate        # creates schema + seeds locations
npm start              # serves on PORT (default 5000)
```

Health check: `GET /api/health` → `{"status":"ok"}`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev            # http://localhost:5173
```

## API Overview

| Method | Route                                | Purpose                                  |
|--------|--------------------------------------|------------------------------------------|
| GET    | `/api/health`                        | Health check                             |
| GET    | `/api/locations/cities`              | Cities                                   |
| GET    | `/api/locations/societies?city_id=`  | Societies (cascading)                    |
| GET    | `/api/locations/phases?society_id=`  | Phases                                   |
| GET    | `/api/properties`                    | Public search (filters: city/society/phase/type/price) |
| GET    | `/api/properties/:slug`              | Single listing (safe fields only)        |
| POST   | `/api/properties`                    | Create listing (seller)                  |
| POST   | `/api/properties/polish-description` | Gemini description polishing (optional)  |
| GET    | `/api/properties/my-listings/:phone` | Seller's own listings                    |
| POST   | `/api/offers/:propertyCode`          | Buyer submits offer/enquiry              |
| GET    | `/api/admin/offers`                  | Admin: offers w/ buyer + seller contact  |
| PATCH  | `/api/admin/offers/:id`              | Admin: update offer status               |
| GET    | `/api/admin/properties/pending`      | Admin: listings awaiting approval        |
| PATCH  | `/api/admin/properties/:id/approve`  | Admin: approve listing                   |
| GET    | `/api/admin/contacts`                | Admin: export all contacts               |

Admin routes require the `x-admin-password` header (value = `ADMIN_PASSWORD`).

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint** (uses `render.yaml`) or **New → Web Service**.
   - Root directory: `backend`
   - Build: `npm install`, Start: `node src/server.js`
   - Set env vars: `DATABASE_URL`, `ADMIN_PASSWORD`, `GEMINI_API_KEY`, cloudinary vars (if used).
3. Provision a Render PostgreSQL DB (free tier works).
4. Run migrations once: in the Render shell → `node src/db/migrate.js` (the `npm run migrate` script), or locally with `DATABASE_URL` pointing at the production DB.

### Frontend → Vercel

1. In Vercel: **Add New → Project** → import this repo.
2. Root directory: `frontend`.
3. Set env var `VITE_API_URL` to the Render backend URL, e.g. `https://property-marketplace-api.onrender.com/api`.
4. Deploy. Vite auto-detects the build (`npm run build`, output `dist`).

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.

**Never commit `.env` files** — they're gitignored.