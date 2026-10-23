# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Caddy (Reverse Proxy)             │
│                  :80 / :443 (HTTPS)                 │
├──────────────────────┬──────────────────────────────┤
│   /api/* → Backend   │   /* → Frontend              │
│   /ws/*  → Backend   │                              │
└──────────┬───────────┴──────────┬───────────────────┘
           │                      │
    ┌──────▼──────┐       ┌───────▼───────┐
    │  Go + Gin   │       │ React + Vite  │
    │  REST API   │       │  TypeScript   │
    │  WebSocket  │       │  Tailwind CSS │
    └──────┬──────┘       └───────────────┘
           │
    ┌──────▼──────┐
    │ PostgreSQL  │
    │    16       │
    └─────────────┘
```

## Frontend Structure

```
frontend/src/
├── app/          # Bootstrap, router, layouts, providers
├── features/     # Business domain modules
│   ├── auth/
│   ├── menu/
│   ├── category/
│   ├── cart/
│   ├── checkout/
│   ├── order/
│   ├── payment/
│   ├── tracking/
│   ├── review/
│   ├── pos/
│   ├── admin/
│   └── delivery/
└── shared/       # Cross-feature utilities, API client, UI primitives
```

## Backend Structure

```
backend/
├── cmd/api/          # Application entrypoint
├── internal/
│   ├── app/          # Wiring and startup
│   ├── config/       # Config validation
│   ├── http/         # Router, middleware, handlers
│   ├── modules/      # Business domain packages
│   │   ├── auth/
│   │   ├── users/
│   │   ├── menu/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── delivery/
│   │   ├── riders/
│   │   ├── tracking/
│   │   ├── reviews/
│   │   ├── pos/
│   │   └── admin/
│   ├── platform/     # Database, logger, clock
│   └── integrations/ # External providers
├── migrations/       # SQL migrations
└── tests/            # Integration tests
```

## Key Design Decisions

- **Money**: Stored as integer satang (1 THB = 100 satang), never floating-point
- **State Machines**: Separate for order, payment, and delivery
- **Auth**: JWT (short-lived access) + refresh session with HttpOnly cookies
- **API**: REST under `/api/v1`, WebSocket only where real-time is needed
- **Transactions**: Never hold DB transaction open during external calls

## Status

🚧 Phase 0 — Architecture planning
