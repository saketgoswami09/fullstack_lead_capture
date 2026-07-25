# Aura (Lead Capture CRM)

> Full-stack lead capture product with a public landing page and a highly secure, protected admin dashboard built for Digital Heroes.

**Live Demo (Vercel):** [https://fullstack-lead-capture.vercel.app/](https://fullstack-lead-capture.vercel.app/)
**Loom Walkthrough:** [Link to your Loom Video]

---

## Architecture & Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 · Vite · RTK Query · TailwindCSS |
| Backend    | Node.js · Express 4 · MVC pattern       |
| Database   | MongoDB Atlas · Mongoose                |
| Security   | JWT · HTTP-Only Cookies · bcryptjs      |

---

## Authentication Approach (JWT & HTTP-Only Cookies)

Instead of relying on fragile, hardcoded headers or exposing tokens to `localStorage` (which is vulnerable to Cross-Site Scripting (XSS) attacks), Aura utilizes a highly secure session strategy:

1. **Login:** When an admin logs in with valid credentials, the backend generates a signed JSON Web Token (JWT).
2. **HTTP-Only Cookie:** The backend attaches this JWT to an `HttpOnly` cookie and sends it back to the client. The browser automatically stores it.
3. **Stateless Sessions:** Because the cookie is `HttpOnly`, malicious frontend scripts cannot read it. However, the browser automatically attaches it to all subsequent requests to the `/api/admin/*` routes.
4. **Validation:** The `adminAuth` middleware decrypts the token, verifies the signature using a strict `JWT_SECRET`, fetches the `Admin` user from MongoDB, and attaches it to the request object.
5. **Cross-Domain:** For production deployment (Vercel frontend -> Render backend), cookies are strictly configured with `SameSite: 'none'` and `Secure: true`.

---

## Data Models

### Lead Schema
Captures prospects from the public landing page.

| Field        | Type   | Constraints                          |
|--------------|--------|--------------------------------------|
| name         | String | required                             |
| email        | String | required, unique, lowercase          |
| budgetRange  | String | required, enum: <1k/1k-5k/5k-10k/>10k |
| message      | String | required, max 1000 chars             |
| status       | String | enum: New/Contacted/Closed, default New |
| createdAt    | Date   | auto                                 |
| updatedAt    | Date   | auto                                 |

### Admin Schema
Manages secure access to the dashboard.

| Field        | Type   | Constraints                          |
|--------------|--------|--------------------------------------|
| email        | String | required, unique, lowercase          |
| password     | String | required (hashed via bcryptjs)       |

*(Note: On initial database connection, if the Admin collection is empty, the server automatically seeds a default admin account to streamline deployments).*

---

## API Endpoints

### Public Routes
| Method | Endpoint                         | Access  | Description              |
|--------|----------------------------------|---------|--------------------------|
| POST   | `/api/leads`                     | Public  | Submit a lead            |
| POST   | `/api/auth/login`                | Public  | Auth admin & set cookie  |
| POST   | `/api/auth/logout`               | Public  | Clear JWT cookie         |

### Protected Routes (Requires JWT Cookie)
| Method | Endpoint                         | Access  | Description              |
|--------|----------------------------------|---------|--------------------------|
| GET    | `/api/auth/me`                   | Admin   | Get current admin session|
| GET    | `/api/admin/leads`               | Admin   | List all leads + search  |
| PATCH  | `/api/admin/leads/:id/status`    | Admin   | Toggle lead status       |

---

## Getting Started Locally

### 1. Install dependencies
```bash
# Install concurrently at the root
npm install

# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` in both the `server/` and `client/` directories.
Fill in your local `MONGO_URI` and `JWT_SECRET`.

### 3. Run the Full Stack
From the root of the repository:
```bash
npm run dev
```

- Public page: http://localhost:5173
- Admin page:  http://localhost:5173/admin
- API:         http://localhost:5000/api
