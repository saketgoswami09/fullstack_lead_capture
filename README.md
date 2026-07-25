# Lead Capture — MERN Stack · MVC

> Full-stack lead capture product with a public landing page and a protected admin dashboard.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 · Vite · react-hook-form       |
| Backend    | Node.js · Express 4 · MVC pattern       |
| Database   | MongoDB · Mongoose                      |
| Validation | express-validator (server) · react-hook-form (client) |
| HTTP       | Axios                                   |

---

## Project Structure

```
lead-capture/
├── client/                        # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── StatusBadge.jsx
│   │   │   ├── admin/
│   │   │   │   └── LeadsTable.jsx
│   │   │   └── LeadForm.jsx
│   │   ├── hooks/
│   │   │   └── useLeads.js
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   └── LandingPage.jsx
│   │   │   └── admin/
│   │   │       └── AdminPage.jsx
│   │   ├── services/
│   │   │   ├── leadService.js
│   │   │   └── adminService.js
│   │   ├── utils/
│   │   │   └── formatDate.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── server/                        # Express API (MVC)
    ├── config/
    │   ├── app.js                 # Express factory, middleware, router mounting
    │   └── db.js                  # Mongoose connection
    ├── controllers/
    │   ├── leadController.js      # POST /api/leads
    │   └── adminController.js     # GET + PATCH /api/admin/leads
    ├── middleware/
    │   ├── adminAuth.js           # Secret-key guard
    │   ├── errorHandler.js        # Global error handler
    │   └── validators.js          # express-validator chains
    ├── models/
    │   └── Lead.js                # Mongoose schema
    ├── routes/
    │   ├── leadRoutes.js          # Public routes
    │   └── adminRoutes.js         # Protected admin routes
    ├── utils/
    │   ├── asyncHandler.js
    │   └── apiResponse.js
    ├── server.js                  # Entry point
    ├── .env.example
    └── package.json
```

---

## API Endpoints

| Method | Endpoint                         | Access  | Description              |
|--------|----------------------------------|---------|--------------------------|
| POST   | `/api/leads`                     | Public  | Submit a lead            |
| GET    | `/api/admin/leads`               | Admin   | List all leads + search  |
| PATCH  | `/api/admin/leads/:id/status`    | Admin   | Toggle lead status       |

---

## Getting Started

### 1. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure environment variables

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Edit both `.env` files with your MongoDB URI and secrets.

### 3. Run in development

```bash
# Terminal 1 — API server
cd server
npm run dev

# Terminal 2 — React dev server
cd client
npm run dev
```

- Public page: http://localhost:5173
- Admin page:  http://localhost:5173/admin
- API:         http://localhost:5000/api

---

## Lead Status Flow

```
New  →  Contacted  →  Closed
 ↑__________________________|
```

---

## Lead Schema

| Field        | Type   | Constraints                          |
|--------------|--------|--------------------------------------|
| name         | String | required                             |
| email        | String | required, unique, lowercase          |
| budgetRange  | String | required, enum: <1k/1k-5k/5k-10k/>10k |
| message      | String | required, max 1000 chars             |
| status       | String | enum: New/Contacted/Closed, default New |
| createdAt    | Date   | auto                                 |
| updatedAt    | Date   | auto                                 |
