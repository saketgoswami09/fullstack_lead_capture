# Aura (Lead Capture CRM)

> Full-stack lead capture product with a public landing page and a highly secure, protected admin dashboard built for Digital Heroes.

## Live Links

🌐 **Landing Page:** [https://fullstack-lead-capture.vercel.app/](https://fullstack-lead-capture.vercel.app/)

🔐 **Admin Login:** [https://fullstack-lead-capture.vercel.app/admin](https://fullstack-lead-capture.vercel.app/admin)

📦 **Backend API:** [https://aura-backend-xhx5.onrender.com/api](https://aura-backend-xhx5.onrender.com/api)

🎥 **Loom Walkthrough:** [Link to your Loom Video]

---

## Test Credentials
To access the Admin Dashboard, use the following seeded credentials:

**Email:** `admin@leaddesk.com`
**Password:** `password123`

---

## AI Usage Statement

AI was used as a development assistant for scaffolding repetitive boilerplate, explaining implementation approaches, and accelerating development. All application architecture, authentication strategy, API design, deployment, debugging, and UI decisions were implemented and validated by me.

---

## Assignment Checklist

✅ Public Landing Page
✅ Client-side validation
✅ Server-side validation
✅ MongoDB persistence
✅ Search leads
✅ Status updates
✅ Secure JWT authentication
✅ HTTP-only cookies
✅ Deployment
✅ Responsive UI
✅ README
✅ Loom walkthrough

---

## Screenshots

### Landing Page
*(Screenshot of the beautiful public landing page goes here)*

### Admin Dashboard
*(Screenshot of the admin leads table goes here)*

### Login
*(Screenshot of the secure login portal goes here)*

---

## Architecture & Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 · Vite · RTK Query · TailwindCSS |
| Backend    | Node.js · Express 4 · MVC pattern       |
| Database   | MongoDB Atlas · Mongoose                |

---

## Security

- **JWT Authentication:** Stateless, signed sessions
- **HTTP-Only Cookies:** Prevents Cross-Site Scripting (XSS) attacks
- **bcrypt Password Hashing:** Secure credential storage
- **Helmet:** HTTP header security configurations
- **CORS Configuration:** Strictly scoped to frontend origin
- **Rate Limiting:** Prevents brute force login attempts
- **MongoDB Sanitization:** Protection against NoSQL injection
- **Server-side Validation:** Prevents malformed data processing

### Authentication Flow (JWT & HTTP-Only)
Instead of relying on fragile, hardcoded headers or exposing tokens to `localStorage`, Aura utilizes a highly secure session strategy:
1. When an admin logs in, the backend generates a signed JSON Web Token (JWT).
2. The backend attaches this JWT to an `HttpOnly` cookie. Malicious frontend scripts cannot read it.
3. The browser automatically attaches this cookie to all subsequent requests to `/api/admin/*` routes.
4. The `adminAuth` middleware decrypts the token, verifies the signature, fetches the `Admin` from MongoDB, and grants access.
5. For cross-origin production deployment, cookies are strictly configured with `SameSite: 'none'` and `Secure: true`.

---

## Validation

### Client-side
- **React Hook Form:** Performant, un-controlled form state
- **Instant field validation:** Immediate user feedback without server roundtrips

### Server-side
- **express-validator:** Robust schema validation before controller execution
- **Sanitized requests:** XSS prevention and data normalization
- **Duplicate email prevention:** MongoDB unique indexes
- **Consistent API error responses:** Standardized structure

---

## Project Structure

```
fullstack_lead_capture/
├── client/                 # React + Vite frontend
│   ├── components/         # Reusable UI elements
│   ├── pages/              # Route-level components
│   ├── store/              # RTK Query API slice
│   └── main.jsx
│
└── server/                 # Express API (MVC)
    ├── config/             # DB and App configuration
    ├── controllers/        # Request handling logic
    ├── middleware/         # Auth, validation, errors, security
    ├── models/             # Mongoose schemas
    ├── routes/             # API routing
    └── server.js
```

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

*(Note: On initial database connection, if the Admin collection is empty, the server automatically seeds a default admin account).*

---

## API Response Example

Standardized JSON responses ensure consistent frontend parsing:

**POST `/api/leads`**
```json
{
  "success": true,
  "message": "Thank you! We will be in touch soon.",
  "data": {
    "lead": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "budgetRange": "1k-5k",
      "status": "New",
      "id": "60d5ecb8b392d700153b9abc"
    }
  }
}
```

---

## Future Improvements

- Email notifications on new lead submission
- Notes system per lead
- Activity timeline (tracking status changes)
- Role-based authentication
- Analytics dashboard
- Export leads to CSV
