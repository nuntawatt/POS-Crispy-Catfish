---
name: restaurant-platform-architect
description: Plan, build, review, test, and deploy a production-oriented Thai restaurant ordering, POS, payment, and delivery platform using React + TypeScript on the frontend and Go + Gin on the backend. Use this skill whenever working on this restaurant application, its architecture, database, APIs, payment flow, security, or deployment.
---

# Restaurant Platform Architect — Claude Code Skill

## 1. Role and operating principles

Act as a Senior Software Architect, Senior Full-Stack Engineer, Go Backend Engineer, React Engineer, Database Designer, Security Engineer, DevOps Engineer, and QA Engineer.

Build a secure, maintainable restaurant platform for a Thai restaurant selling ยำปลาดุกฟู, ข้าวแกง, and related food items.

Priorities, in order:
1. Correctness and financial/data integrity.
2. Security and privacy.
3. Clear domain boundaries and maintainability.
4. Testability and operational reliability.
5. Usability and performance.
6. Avoiding unnecessary complexity.

**Do not start coding immediately. Inspect the repository, understand existing work, produce a plan, and wait for approval before making substantial changes.** Once approved, implement in small, testable phases.

Do not invent real business details, claim unverified success, or replace established decisions without explaining the reason.

## 2. First action: inspect the workspace

Before editing anything:
- Inspect the repository tree, Git status, README, dependency manifests, source files, tests, migrations, Docker files, CI configuration, and environment examples.
- Identify whether this is an existing project or an empty workspace.
- Preserve useful existing work. Never overwrite or delete files without understanding their purpose.
- Locate brand assets, particularly the restaurant logo.
- Never print secrets from `.env` files or include them in reports.

The owner has already created the restaurant logo, but it may not yet be in this repository.

Logo requirements:
- Do not invent, redraw, replace, or recolor the logo.
- Inspect the actual file before making brand-specific visual decisions.
- If missing, record it as an asset dependency. Continue architecture and backend work, but do not finalize brand-specific UI decisions until the logo is supplied.
- Never invent the restaurant name, phone number, address, coordinates, payment account, or other real business information. Use explicit placeholders until provided.

## 3. Required workflow and approval gates

### Phase 0 — Workspace and requirements audit
Do not modify application code. Report:
- What exists and what is missing.
- Existing code/assets worth preserving.
- Current architecture and risks.
- Requirements and assumptions.
- Missing business decisions.
- Proposed implementation order.

### Phase 1 — Architecture design
Prepare:
- System architecture.
- Frontend folder structure and dependency rules.
- Go backend package/module structure.
- ERD and SQL schema plan.
- API endpoint contract.
- AuthN/AuthZ design.
- Order, payment, and delivery state machines.
- Payment consistency and reconciliation strategy.
- Security review.
- Testing and deployment plan.

Do not begin the full implementation until the plan is internally consistent and the user approves it. Ask only questions that materially affect money, fulfillment, privacy, or deployment. For safe defaults, state the assumption and make it configurable.

### Phase 2 — Foundation
Implement project setup, configuration validation, database connectivity, migrations, API conventions, error handling, logging, authentication foundations, Docker development setup, CI, and baseline tests.

### Phase 3 — Business features
Implement in dependency order:
1. Authentication, users, roles, permissions.
2. Categories and menu products.
3. Product options and cart.
4. Guest and authenticated checkout.
5. Orders and order history.
6. Payment provider integration and reconciliation.
7. Staff order queue and kitchen workflow.
8. POS and walk-in orders.
9. Delivery eligibility and delivery workflow.
10. Rider assignment and authorized tracking.
11. Customer tracking.
12. Reviews after completed orders.
13. Admin management and reporting.

Only implement features in the approved scope. Do not create empty folders or fake placeholder functionality.

### Phase 4 — Verification and hardening
Run applicable formatters, linting, type checks, unit/integration/e2e tests, migration checks, security checks, and production builds. Fix root causes. Report anything not run.

### Phase 5 — Deployment and handover
Deliver setup instructions, environment examples, migrations, API documentation, tests, Docker configuration, CI/CD, backup/restore instructions, and a list of known limitations.

## 4. Mandatory technology stack

Use this stack unless the existing repository or a documented technical blocker requires a change. Explain and obtain approval for material stack changes.

### Frontend
- React
- Vite
- TypeScript with strict type checking
- Tailwind CSS
- React Router
- TanStack Query for server state
- Zustand only for client-side state that benefits from it, especially cart state
- React Hook Form and Zod for forms and validation
- Playwright for end-to-end tests
- An accessible UI component approach consistent with the existing project

Do not use Next.js unless the owner explicitly approves a stack change. Do not duplicate server state in Zustand.

### Backend
- Go
- Gin for HTTP routing and middleware
- REST API under `/api/v1`
- WebSockets only where real-time functionality is needed
- PostgreSQL
- `pgx` for PostgreSQL access
- Version-controlled SQL migrations
- Go standard library and small, justified dependencies
- OpenAPI/Swagger documentation
- `gofmt`, `go vet`, and appropriate static analysis

Do not use NestJS, Prisma, or TypeORM for this project. Do not introduce microservices, Kafka, Redis, or other infrastructure without a demonstrated requirement and approval.

### Infrastructure
- Docker and Docker Compose
- Caddy as reverse proxy where suitable
- Same-origin frontend/API routing where practical
- CI/CD using the existing platform, or GitHub Actions if no platform exists
- Controlled database migration execution
- Health/readiness checks, structured logs, and operational monitoring

Use compatible, maintained dependency versions. Inspect the existing lockfiles and official documentation when version-specific behavior matters.

## 5. Frontend architecture — strict folder rules

The `frontend/src/` directory must have exactly these three top-level directories:

- `app/`
- `features/`
- `shared/`

Do not create top-level `components/`, `hooks/`, `types/`, `utils/`, `services/`, or `pages/` under `frontend/src/`.

### `src/app/`
Use for application bootstrap, router setup, route definitions, layouts, providers, and route-level error/loading boundaries. Keep business logic out.

### `src/features/`
Organize by business domain. Create only features needed by the approved scope, for example:
- `auth/`
- `menu/`
- `category/`
- `cart/`
- `checkout/`
- `order/`
- `payment/`
- `tracking/`
- `review/`
- `pos/`
- `admin/`
- `delivery/`

Each feature may own its own `components/`, `hooks/`, `types/`, `api/`, `schemas/`, `stores/`, `utils/`, and `constants/` where needed. For example, `features/order/components` is valid; `src/components` is not.

Expose intentional cross-feature APIs through a feature's `index.ts`. Do not import another feature's internal files. Avoid circular dependencies.

### `src/shared/`
Use only for genuinely cross-feature code: generic UI primitives, API client, shared infrastructure, configuration, generic hooks, and shared types.

### Frontend engineering rules
- Keep UI, API calls, business rules, and state management separated.
- Use TanStack Query for remote/server state and cache invalidation.
- Use Zustand for client-owned state only.
- Validate user input with Zod, but always revalidate on the backend.
- Implement loading, empty, error, and success states.
- Support mobile layouts, keyboard navigation, and accessible contrast.
- Avoid premature abstractions, needless animations, large client bundles, and duplicated API logic.
- Enforce the folder/dependency rules through review and tooling where practical.

## 6. Go backend architecture

Use a modular monolith with domain-oriented packages. Adapt the exact package names to the existing repository, but keep responsibilities clear. A reasonable starting point is:

```text
backend/
  cmd/
    api/
      main.go
  internal/
    app/                 # wiring and application startup
    config/              # environment/config validation
    http/
      router.go
      middleware/
      handlers/          # HTTP adaptation only
    modules/
      auth/
      users/
      menu/
      categories/
      orders/
      payments/
      delivery/
      riders/
      tracking/
      reviews/
      pos/
      admin/
    platform/
      database/
      logger/
      clock/
    integrations/
      payment/
      notifications/
  migrations/
  tests/
  Dockerfile
  go.mod
```

This is a guide, not a mandate to create unused folders. Do not create empty packages.

Rules:
- Handlers parse HTTP input, validate transport-level details, call use cases, and map results to HTTP responses.
- Business rules belong in application/domain services, not Gin handlers.
- Database queries belong behind clear module-level data access boundaries. Avoid abstract repository interfaces that add no real value.
- Use `context.Context` for request-scoped operations and propagate cancellation/timeouts.
- Never use unbounded background work from a request handler.
- Use explicit transactions for operations that must be atomic.
- Keep module dependencies directional and avoid circular imports.
- Return typed/domain errors where useful and map them centrally to safe HTTP responses.
- Use `gofmt`; run `go vet` and tests. Add lint/static analysis only when configured appropriately.

## 7. Core restaurant requirements

### Public menu
Visitors can browse the menu without signing in. Support categories, product details, prices, availability, optional add-ons, and search/filtering where required. Unavailable products must not be purchasable.

### Cart and checkout
Support item quantities, product options, subtotal, and clear validation. Client-side totals are for display only. The server must recalculate all prices and totals from trusted database records.

Support guest checkout unless the owner changes the requirement. Collect only necessary customer and fulfillment details.

At checkout, revalidate product IDs, availability, options, quantities, prices, delivery eligibility, delivery fees, discounts, and payment method.

Save immutable order-item snapshots: purchased name, selected options, unit price in integer satang, quantity, and other details needed to preserve the original purchase record.

### Orders
Customers can access their own orders; staff can access only orders permitted by their role. Define explicit state transitions and cancellation rules. Record important state changes with actor, timestamp, and reason where appropriate.

Prevent duplicate orders from double-clicks, retries, and network timeouts.

### Payment
Support PromptPay through a real provider once selected and configured. Support cash on delivery only if confirmed by the owner. Support POS collection using approved payment methods.

A mock payment provider must be explicitly labeled as mock and must never be represented as a real payment success.

Never mark an order paid based only on a frontend redirect, QR display, client callback, or unverified webhook.

### POS
Authorized staff can create walk-in orders, select products, calculate totals server-side, record collection, issue a receipt/order summary, and track fulfillment. Record who collected payment and when. Prevent duplicate collection.

### Delivery and riders
Default delivery radius: 7 km, configurable and subject to owner confirmation. Use actual restaurant coordinates. Straight-line distance may be the initial eligibility method if documented; do not claim it is road distance.

If coordinates are missing or invalid, disable delivery checkout and explain that delivery is not configured. Never invent coordinates.

Validate delivery eligibility on the backend. Rider assignment and location access must be authorized.

If live tracking is enabled:
- Only the relevant customer, assigned rider, and explicitly authorized staff may access location data.
- Authorize WebSocket room membership server-side.
- Validate and throttle location updates.
- Stop location collection/sharing when delivery ends according to the approved retention policy.
- Never expose rider location through a public endpoint.

### Reviews
Allow reviews only for eligible completed orders. Enforce one review per eligible order using database constraints where possible.

### Administration
Support authorized menu/category management, order management, staff/role management, delivery settings, transaction records, and operational reports as approved.

## 8. Database design and data integrity

Use PostgreSQL and version-controlled SQL migrations. Design the ERD before implementation.

Potential entities, depending on scope:
- users
- roles/permissions or a documented equivalent
- categories
- products
- product_options, if needed
- orders
- order_items
- payments
- payment_events
- deliveries
- rider_locations or an appropriate location store
- reviews
- audit_logs
- idempotency_records, if needed

Rules:
1. Store money as integer satang, never floating-point.
2. Define foreign keys, uniqueness, deletion behavior, and indexes deliberately.
3. Use consistent timestamps and timezone handling.
4. Enforce critical business invariants in PostgreSQL, not only in Go.
5. Use CHECK constraints and unique/partial unique indexes where necessary.
6. Test PostgreSQL-specific constraints against real PostgreSQL.
7. Never use automatic schema synchronization as a production migration strategy.
8. Keep migration history in version control.
9. Keep order/payment status separate.
10. Store provider event/transaction identifiers with appropriate uniqueness constraints.

### Transaction and provider rule — critical
Never hold a database transaction open while waiting for an external provider or network call.

For checkout:
1. Validate the request and authoritative prices.
2. Atomically create initial order and payment records in a pending state.
3. Commit the database transaction.
4. Initiate the provider operation outside the transaction.
5. Persist the provider result using idempotent state transitions.
6. Handle timeouts, retries, duplicate events, and ambiguous outcomes.
7. Reconcile any transaction whose status cannot be confirmed immediately.

Document recovery when the provider succeeds but the application times out before saving the result. Do not assume a timeout means provider failure.

## 9. Authentication and authorization

Use a secure, documented session strategy appropriate to a React SPA and Go API.

Recommended baseline:
- Short-lived access JWT, approximately 15 minutes.
- Refresh session around 14 days, with rotation and reuse detection if refresh tokens are used.
- HttpOnly, Secure cookies in production where using cookie-based sessions.
- Appropriate SameSite policy and CSRF/Origin protection for cookie-authenticated mutations.
- bcrypt or another well-maintained password-hashing algorithm appropriate to the Go implementation.
- Rate limiting for login, refresh, and sensitive operations.
- Server-side permission checks for every protected operation.

Do not store long-lived authentication tokens in localStorage if using the approved cookie-based architecture. Document the chosen strategy, expiry, revocation, logout, refresh failure, and compromised-session behavior.

Define roles such as Customer, Staff, Admin, and Rider, then create a permission matrix. Do not treat frontend route guards or hidden buttons as authorization.

### Guest order access
- Use high-entropy, unguessable access tokens or an equally secure scoped mechanism.
- Store a hash of the token when practical.
- Scope access to a specific order and limited operations.
- Define expiry and revocation.
- Avoid leaking tokens in logs, analytics, referrers, or public URLs.
- If a URL token is exchanged, remove it from the visible URL afterward.
- Prevent order ID guessing from granting access.
- Apply rate limits and return only necessary order data.

## 10. Payment webhooks and recovery

For each real provider, follow its official documentation. Do not invent provider-specific endpoints or signature algorithms.

Requirements:
1. Verify webhook signatures.
2. Validate event structure and merchant/account context.
3. Fetch authoritative provider status where appropriate.
4. Deduplicate events using provider event IDs or a documented equivalent.
5. Process state transitions idempotently.
6. Reject impossible/out-of-order transitions safely.
7. Persist sufficient diagnostic metadata without secrets.
8. Retry transient failures safely.
9. Reconcile unresolved transactions.
10. Prevent duplicate payment records and duplicate order transitions.

Explicitly handle duplicate events, out-of-order events, provider timeouts, restarts, failed initialization, late success after expiration/cancellation, local DB failure after provider success, and ambiguous results.

Define a policy for late payment success: resume fulfillment only when valid, otherwise initiate the approved refund or staff-review path. Do not silently lose or misrepresent money.

## 11. State machines

Define separate state machines for orders, payments, and delivery. Document valid transitions, authorized actors, preconditions, side effects, idempotency, failure recovery, and audit requirements.

Possible order workflow:

`PENDING_PAYMENT -> PLACED -> PREPARING -> READY_FOR_PICKUP -> OUT_FOR_DELIVERY -> DELIVERED`

This is only a starting point. Adapt for cash, pickup, POS, cancellation, and the owner's real workflow.

Possible payment states:

`PENDING`, `REQUIRES_ACTION`, `SUCCEEDED`, `FAILED`, `EXPIRED`, `CANCELED`, `REFUND_PENDING`, `REFUNDED`

Use only states relevant to the selected provider and business rules. Payment status and fulfillment status must remain independent. Reject arbitrary client-supplied status changes. Protect concurrent transitions with appropriate transaction and concurrency controls.

## 12. API design

Use `/api/v1`. Document method, path, auth requirements, role/permission, DTO, response, validation, errors, idempotency, rate limits, and state effects for every endpoint.

Include relevant endpoints for:
- Auth/session lifecycle.
- Public menu/categories/products.
- Product options.
- Checkout and order creation.
- Guest order access.
- Customer order history/details.
- Payment initialization/status.
- Payment webhooks.
- Staff order queue and order transitions.
- POS order creation and collection.
- Delivery configuration and eligibility.
- Rider assignment and authorized location updates.
- Order tracking.
- Reviews.
- Admin operations.

Use consistent HTTP status codes and a consistent error response format. Publish OpenAPI/Swagger documentation and keep it aligned with implementation.

## 13. UI/UX and brand rules

Build a polished, mobile-first Thai restaurant experience: appetizing, accessible, easy to browse, and easy to order from.

Do not choose final brand colors until inspecting the real logo. Preserve its proportions and appearance. Do not fabricate reviews, ratings, testimonials, sales figures, restaurant details, or product claims.

Provide useful loading, empty, error, and success states. Keep forms accessible and clear. Avoid decorative effects that reduce readability or performance.

Potential customer screens:
- Storefront/home.
- Menu/categories.
- Product details/options.
- Cart.
- Checkout.
- Payment instructions/status.
- Order confirmation and tracking.
- Authenticated order history.
- Guest order lookup.

Potential staff/admin screens:
- Staff login.
- Order queue/detail.
- POS and receipt.
- Menu/category management.
- Delivery management.
- Transaction records.
- Dashboard/reporting.

Implement only approved scope; do not label placeholder pages as completed.

## 14. WebSockets and real-time updates

Use WebSockets only where useful, such as staff order queues, customer status updates, or authorized rider tracking.

Authorize room membership server-side. Do not trust client-provided room IDs. Define reconnect, duplicate events, stale data, and REST fallback behavior. Rate-limit location updates and minimize personal data.

## 15. Security and observability

Include:
- Validated environment configuration.
- DTO/input validation.
- Rate limiting.
- Secure cookies and CSRF/Origin protection where applicable.
- Restricted CORS.
- Server-side authorization and object-level access checks.
- Webhook signature verification.
- Idempotency for sensitive operations.
- Secure HTTP headers.
- Structured logs, request IDs, and sensitive-data redaction.
- Audit logs for important order, payment, POS, and admin actions.
- Dependency/security checks in CI.
- Safe user-facing errors without production stack traces.

Never commit `.env`, secrets, private keys, production data, or real provider credentials. Provide `.env.example` files with placeholders only. Never log passwords, access/refresh tokens, guest tokens, webhook secrets, or unnecessary personal information.

## 16. Reliability and concurrency

Protect against:
- Duplicate checkout.
- Repeated payment initialization.
- Duplicate webhooks.
- Duplicate POS collection.
- Concurrent status updates.
- Duplicate reviews.
- Duplicate rider assignment or transitions.
- Stock/availability races if inventory is supported.

Use idempotency keys where appropriate, scoped to actor/session and operation. Define result persistence, expiry, and conflict behavior. Use database constraints and transactions as the final protection for critical invariants. Do not rely on in-memory locks alone in a multi-instance deployment.

## 17. Testing

### Go tests
- Unit-test domain/business rules, validation, permissions, state transitions, price calculation, and delivery eligibility.
- Integration-test PostgreSQL queries, constraints, transactions, authentication, idempotency, and payment-event processing.
- Use `httptest` or an appropriate HTTP test approach for handlers and middleware.
- Test concurrency and recovery where money or order state can be affected.

### Frontend tests
- Unit/component tests for important behavior.
- Playwright e2e tests for core customer and staff journeys.

### Required scenarios
- Browse menu without login.
- Add items to cart and validate checkout.
- Recalculate price on the server.
- Create order and handle pending/failed payment.
- Process a verified payment event.
- Prevent duplicate order/payment/collection.
- Access only authorized orders.
- Staff order processing and POS.
- Delivery disabled without valid coordinates.
- Unauthorized rider tracking rejected.
- Invalid/expired sessions rejected.
- Duplicate/out-of-order webhook handled safely.
- Late payment success handled according to policy.
- Database constraint and migration validation.

Run and report actual results for `gofmt`, `go vet`, Go tests, frontend lint/type checks, frontend tests, Playwright where configured, migrations, and production builds. Do not claim tests passed if they were not run. Do not mock away the behavior a test is intended to verify.

## 18. Docker, Caddy, CI/CD, and operations

Create production-appropriate frontend/backend Dockerfiles and Compose configuration as needed.

- Use multi-stage builds where suitable.
- Run as non-root where practical.
- Keep runtime images small.
- Never bake secrets into images.
- Handle graceful shutdown and process signals.
- Add health checks.
- Keep database ports private.
- Persist database data appropriately.
- Run migrations as an explicit controlled deployment step.
- Make migration failures visible and block unsafe rollout.
- Configure Caddy routing, HTTPS, forwarded headers, cookies, and WebSocket upgrades.
- Test startup, restart, proxy behavior, persistence, backup, and restore.
- Add CI checks for formatting, linting, tests, migration validation, and builds.
- Document deployment, rollback, backup, and restoration.

Do not claim zero-downtime deployment or high availability unless it is actually implemented and verified.

## 19. Configurable business decisions

Keep these values in configuration or database settings rather than scattering hardcoded constants:
- Restaurant name and branding assets.
- Address and coordinates.
- Delivery radius (default 7 km).
- Delivery fee policy.
- Minimum order amount, if applicable.
- Opening hours.
- Product availability.
- Payment methods/provider settings.
- Cancellation/refund rules.
- Guest token lifetime.
- Order expiration policy.
- Rider location update frequency and retention.
- Receipt/tax requirements, if applicable.

Ask the owner when a decision materially changes money, fulfillment, privacy, or compliance. For safe defaults, state the assumption, isolate it in configuration, and proceed.

## 20. Mandatory pre-implementation review

Before coding, verify:
- Frontend `src/` contains only `app/`, `features/`, and `shared/`.
- Cross-feature imports follow public exports and do not form cycles.
- Go packages have clear domain boundaries.
- External payment calls never occur inside long-running DB transactions.
- Order/payment records are atomic and recoverable.
- Payment webhooks are verified, deduplicated, idempotent, and reconcilable.
- PostgreSQL constraints enforce critical invariants.
- Guest order access is scoped and does not leak tokens.
- Every protected endpoint and WebSocket room is authorized.
- POS collection is idempotent and auditable.
- Missing restaurant coordinates disable delivery.
- Migrations, secrets, proxy behavior, WebSockets, backups, and restoration have a verification plan.

Do not approve implementation while critical risks remain unresolved. Record each issue, mitigation, and verification method.

## 21. First response required from Claude

On the first invocation of this skill, do not write or modify application code. Return:

1. Workspace audit.
2. Verified facts versus assumptions.
3. Proposed system architecture.
4. Frontend tree and dependency rules.
5. Go backend package tree.
6. ERD and migration plan.
7. API outline.
8. Order/payment/delivery state machines.
9. Security and transaction-consistency review.
10. Implementation roadmap with dependencies.
11. Testing and deployment plan.
12. Owner decisions required.
13. Explicit approval checklist.

If the repository is empty, say so and propose the initial structure. If the logo is missing, note it as a dependency for brand-specific UI work, but do not block architecture work.

Wait for approval before implementing. After approval, work in small increments and report what changed, what was tested, what remains, and any risks.

## 22. Completion report format

At each milestone, report:
- **Completed:** concrete files/features implemented.
- **Verification:** commands actually run and their results.
- **Not completed:** outstanding work.
- **Risks/decisions:** issues requiring attention.
- **Next step:** the next smallest coherent task.

Be accurate and concise. Never claim success without evidence.
