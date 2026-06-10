# 🚚 BDCourier — Smart Delivery Intelligence Platform

A full-stack web application for checking customer delivery history across major Bangladeshi courier services.

---

## 📁 Project Structure

```
bdcourier/
├── frontend/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page components
│       │   ├── dashboard/  # User dashboard pages
│       │   └── admin/      # Admin panel pages
│       ├── store/        # Zustand state management
│       ├── lib/          # API client & utilities
│       └── types/        # TypeScript types
└── backend/           # NestJS + Prisma + MongoDB
    └── src/
        ├── modules/      # Feature modules
        │   ├── auth/
        │   ├── users/
        │   ├── search/
        │   ├── plans/
        │   ├── payments/
        │   ├── couriers/
        │   └── dashboard/
        └── prisma/       # Database service
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Data Fetching | TanStack Query v5 |
| Notifications | React Hot Toast |
| Selects | React Select |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | NestJS 10 |
| ORM | Prisma 5 |
| Database | MongoDB (Atlas) |
| Auth | JWT + Passport |
| API Docs | Swagger/OpenAPI |
| Validation | class-validator |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and Install

```bash
git clone <repo>
cd bdcourier

# Install root deps
npm install

# Install frontend deps
cd frontend && npm install && cd ..

# Install backend deps
cd backend && npm install && cd ..
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret
```

### 3. Setup Database

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Run Development Servers

```bash
# From root (runs both)
npm run dev

# Or individually:
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000/api
```

---

## 🔑 Environment Variables (Backend)

```env
DATABASE_URL=mongodb+srv://...    # MongoDB connection string
JWT_SECRET=your-secret-key        # JWT signing secret
JWT_EXPIRES_IN=7d                 # Token expiry
PORT=4000                         # Server port
APP_URL=http://localhost:3000     # Frontend URL (for CORS)

# Payment Gateways (configure when ready)
BKASH_APP_KEY=
BKASH_APP_SECRET=
NAGAD_MERCHANT_ID=
SSLCOMMERZ_STORE_ID=
```

---

## 📱 Pages & Features

### User Dashboard
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | Create account |
| `/login` | Sign in |
| `/dashboard` | Overview & stats |
| `/dashboard/check` | ✅ Check customer phone |
| `/dashboard/history` | Search history |
| `/dashboard/billing` | Plans & payments |
| `/dashboard/api-token` | API key management |
| `/dashboard/settings` | Profile settings |

### Admin Panel
| Route | Description |
|-------|-------------|
| `/admin` | Platform overview & charts |
| `/admin/users` | User management |
| `/admin/payments` | Transaction history |
| `/admin/search-logs` | All platform searches |
| `/admin/couriers` | Courier integrations |
| `/admin/plans` | Plan management |
| `/admin/settings` | Platform settings |

---

## 🔌 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/search/check
GET    /api/search/history

GET    /api/users              [Admin]
PATCH  /api/users/:id          [Admin]
DELETE /api/users/:id          [Super Admin]
POST   /api/users/generate-token

GET    /api/plans
POST   /api/plans              [Admin]
PATCH  /api/plans/:id          [Admin]

POST   /api/payments/initiate
GET    /api/payments/billing-history
GET    /api/payments/transactions   [Admin]
POST   /api/payments/:id/refund     [Admin]

GET    /api/couriers
PATCH  /api/couriers/:id       [Admin]
POST   /api/couriers/:id/toggle [Admin]

GET    /api/dashboard/stats
GET    /api/dashboard/revenue-chart
GET    /api/dashboard/search-chart
```

Full Swagger docs: `http://localhost:4000/api/docs`

---

## 💰 Plans

| Plan | Price | Searches/day | API |
|------|-------|-------------|-----|
| Free | ৳0/mo | 20 | ❌ |
| Starter | ৳199/mo | 200 | ✅ |
| Pro | ৳499/mo | Unlimited | ✅ |
| Enterprise | Custom | Custom | ✅ |

---

## 💳 Payment Methods
- bKash
- Nagad
- Rocket / DBBL
- Visa/Mastercard (via SSLCommerz)
- Net Banking (via SSLCommerz)

---

## 🛡️ Security Features
- JWT Bearer token auth
- bcrypt password hashing (12 rounds)
- Role-based access control (USER / ADMIN / SUPER_ADMIN)
- API rate limiting (100 req/min)
- Request validation with class-validator
- Daily search limit enforcement per plan

---

## 📞 Support
For integration help or questions, contact: support@bdcourier.com
