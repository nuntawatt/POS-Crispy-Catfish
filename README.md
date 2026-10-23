# POS-Crispy-Catfish

A production-oriented Thai restaurant ordering, POS, payment, and delivery platform.

## Architecture

This is a **monorepo** containing:

- `backend/` — Go + Gin REST API with PostgreSQL
- `frontend/` — React + Vite + TypeScript SPA
- `docs/` — Architecture documentation, ERD, API specs
- `docker/` — Docker and Docker Compose configuration

## Tech Stack

### Backend
- Go, Gin, pgx, PostgreSQL
- REST API under `/api/v1`
- Version-controlled SQL migrations

### Frontend
- React, Vite, TypeScript (strict)
- Tailwind CSS, React Router, TanStack Query
- Zustand (client state only), React Hook Form + Zod
- Playwright for E2E tests

### Infrastructure
- Docker & Docker Compose
- Caddy reverse proxy
- GitHub Actions CI/CD

## Getting Started

### Prerequisites
- Go 1.22+
- Node.js 20+ & pnpm
- PostgreSQL 16+
- Docker & Docker Compose

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd POS-Crispy-Catfish

# Copy environment config
cp .env.example .env
# Edit .env with your actual values

# Start with Docker Compose
docker compose up -d

# Or run locally:
# Backend
cd backend && go run ./cmd/api

# Frontend
cd frontend && pnpm install && pnpm dev
```

## Project Status

🚧 **Phase 0 — Initial scaffolding complete. Architecture planning in progress.**

## License

Private — All rights reserved.
