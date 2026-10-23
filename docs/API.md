# API Specification

Base URL: `/api/v1`

## Endpoints (Planned)

### Health
- `GET /health` — Health check
- `GET /ready` — Readiness check

### Auth
- `POST /api/v1/auth/register` — Register
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/refresh` — Refresh token
- `POST /api/v1/auth/logout` — Logout
- `GET /api/v1/auth/me` — Current user

### Menu & Categories
- `GET /api/v1/categories` — List categories
- `GET /api/v1/categories/:id` — Get category
- `GET /api/v1/products` — List products (with filters)
- `GET /api/v1/products/:id` — Get product details

### Cart & Checkout
- `POST /api/v1/checkout` — Create order

### Orders
- `GET /api/v1/orders` — Customer order history
- `GET /api/v1/orders/:id` — Order detail
- `GET /api/v1/orders/guest/:token` — Guest order access

### Payments
- `POST /api/v1/payments/:id/initialize` — Initialize payment
- `GET /api/v1/payments/:id/status` — Payment status
- `POST /api/v1/webhooks/payment` — Payment webhook

### Staff
- `GET /api/v1/staff/orders` — Order queue
- `PATCH /api/v1/staff/orders/:id/status` — Update order status

### POS
- `POST /api/v1/pos/orders` — Create walk-in order
- `POST /api/v1/pos/orders/:id/collect` — Record payment collection

### Delivery
- `GET /api/v1/delivery/eligibility` — Check delivery eligibility
- `POST /api/v1/delivery/:id/assign` — Assign rider
- `POST /api/v1/delivery/:id/location` — Update rider location

### Reviews
- `POST /api/v1/orders/:id/review` — Submit review
- `GET /api/v1/products/:id/reviews` — Get product reviews

### Admin
- `GET /api/v1/admin/dashboard` — Dashboard metrics
- CRUD for categories, products, users, delivery settings

> ⚠️ This is a planned outline. Full request/response DTOs, validation, error codes, and auth requirements will be documented per endpoint during Phase 1.
