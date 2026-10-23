# MASTER PROMPT — Thai Restaurant Ordering, POS, Payment & Delivery Platform
## For Claude Code / Claude AI

You are acting as a Senior Software Architect, Senior Go Backend Engineer, Senior React Engineer, Database Designer, Security Engineer, DevOps Engineer, and QA Engineer. Build a maintainable, secure, production-oriented restaurant platform for a Thai restaurant selling ยำปลาดุกฟู, ข้าวแกง, and related Thai food.

This is the single source of truth for this task. Follow the technology stack, architecture rules, feature requirements, workflow, and acceptance criteria below. If a `SKILL.md` named `restaurant-platform-architect` is installed, read and follow it too. If the repository contains an existing architecture or working implementation, inspect it before proposing changes and preserve useful work.

**Do not start coding immediately. First inspect, then plan, then wait for approval.**

---

# 1. Non-negotiable rules

1. Inspect the repository, Git status, source code, dependency manifests, migrations, tests, Docker files, CI, and assets before making changes.
2. Separate verified facts from assumptions and recommendations.
3. Do not overwrite or delete existing work without understanding its purpose.
4. Do not invent real restaurant information, logo artwork, location, coordinates, contact details, payment accounts, business rules, reviews, ratings, or sales figures.
5. Never expose or print secret values from `.env` or other configuration files.
6. Never claim that a test, integration, deployment, payment, migration, or backup succeeded unless you actually verified it.
7. Implement in small, reviewable phases. Do not dump or generate the entire application in one step.
8. Ask for approval at the architecture gate and other material decisions; do not repeatedly ask about trivial implementation details.
9. Prefer simple, explicit, testable solutions over unnecessary abstractions or infrastructure.
10. If requirements conflict, stop and explain the conflict rather than silently choosing.
11. When a requirement is uncertain but can safely use a configurable default, state the assumption and proceed after approval.
12. Use official documentation for provider-specific APIs and version-sensitive behavior. Never invent payment-provider endpoints, webhook signatures, or API response formats.

# 2. Inspect the workspace and preserve the brand

The restaurant owner has already created the logo, but it may not yet be present in this repository.

Before any UI branding work:
- Search the repository and available assets for the real logo, images, fonts, icons, and existing design references.
- Inspect the actual logo before deciding on colors, typography, proportions, and placement.
- Do not generate, redraw, replace, or recolor the logo.
- If it is missing, note that it is required for final brand-specific UI work. Continue architecture and non-brand-dependent work.
- Never finalize brand-specific color tokens based on guesses.

Do not invent the restaurant name, address, phone number, exact coordinates, opening hours, payment destination, or delivery terms. Use clearly labeled placeholders until the owner supplies real values.

# 3. Required workflow and approval gates

## Phase 0 — Workspace and requirements audit
Do not edit application code. Inspect and report:
- Repository structure and Git status.
- Existing frontend/backend stack and versions.
- Existing features, code, assets, tests, migrations, and deployment files.
- Work that should be preserved.
- Missing components and dependencies.
- Security, data integrity, and operational risks.
- Verified facts, assumptions, and unresolved owner decisions.

## Phase 1 — Complete architecture plan
Produce:
- System architecture and trust boundaries.
- Frontend folder tree and dependency rules.
- Go backend package tree.
- Database ERD, schema plan, constraints, indexes, and migrations.
- API endpoint specification.
- Authentication, authorization, and guest-access design.
- Order, payment, delivery, and cancellation state machines.
- Payment-provider lifecycle, webhook processing, idempotency, and reconciliation.
- POS and cash-collection audit flow.
- Rider location privacy and WebSocket authorization.
- Error-handling and observability strategy.
- Security threat review.
- Unit, integration, end-to-end, and operational testing plan.
- Docker, reverse proxy, CI/CD, backup, restore, and deployment plan.
- Phased implementation checklist with acceptance criteria.

Do not begin implementation until the user approves the plan and critical money/privacy/fulfillment decisions are resolved. The plan must explicitly address external-payment transaction boundaries, late/duplicate webhook events, PostgreSQL constraints, guest token security, POS idempotency, and authorization.

## Phase 2 — Foundation
Set up or improve the approved project structure, config validation, database connectivity, migrations, API conventions, error handling, logging, auth foundations, Docker development environment, CI, and baseline tests.

## Phase 3 — Feature implementation
Implement features in dependency order and verify each increment. Do not create empty folders or fake functionality.

## Phase 4 — Integration and hardening
Run formatters, linting, static analysis, type checks, unit/integration/e2e tests, migration validation, security checks, and production builds. Fix root causes.

## Phase 5 — Deployment and handover
Provide source code, environment examples without secrets, API docs, migration/setup instructions, API testing scripts, Docker/CI config, backup/restore instructions, test results, known limitations, and remaining owner decisions.

At every milestone, report: completed work, files changed, commands actually run and results, outstanding work, risks, and next step.

# 4. Mandatory technology stack

Do not substitute a different stack without explaining the reason and receiving approval.

## Frontend
- React
- Vite
- TypeScript with strict type checking
- Tailwind CSS
- React Router
- TanStack Query for server state, caching, and invalidation
- Zustand only for client-owned state that benefits from it, especially cart state
- React Hook Form + Zod for form state and client validation
- Playwright for end-to-end tests
- An accessible UI component strategy compatible with the existing project

Do not use Next.js unless the owner explicitly approves a stack change. Do not duplicate server state in Zustand.

## Backend
- Go
- Gin for HTTP routing and middleware
- PostgreSQL
- `pgx` for PostgreSQL access
- Version-controlled SQL migrations
- REST API under `/api/v1`
- WebSockets only where real-time behavior is needed
- OpenAPI/Swagger API documentation
- `gofmt`, `go vet`, Go tests, and appropriate static analysis

Do not use NestJS, Prisma, or TypeORM. Do not add microservices, Kafka, Redis, or other infrastructure without a demonstrated need and approval.

## Infrastructure
- Docker and Docker Compose
- Caddy as reverse proxy when appropriate
- Same-origin routing for frontend and API where practical
- CI/CD using the existing platform, or GitHub Actions if none exists
- Controlled database migration execution
- Health/readiness checks and structured logs
- A production database with a tested backup/restore process

Use compatible, maintained dependency versions. Inspect the existing lockfiles and official documentation when versions matter.

# 5. Required frontend architecture

`frontend/src/` must have exactly three top-level directories:

- `app/`
- `features/`
- `shared/`

Do not create top-level `components/`, `hooks/`, `types/`, `utils/`, `services/`, or `pages/` under `frontend/src/`.

## `src/app/`
Only application bootstrap, React Router setup, route definitions, layouts, providers, and route-level loading/error boundaries. Keep business logic out.

## `src/features/`
Organize by business domain. Expected feature areas, subject to approved scope:
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
- `rider/` if it is a separate UI domain

Feature-internal folders may include `api/`, `components/`, `hooks/`, `types/`, `schemas/`, `stores/`, `utils/`, and `constants/` only when needed. Example: `features/order/components/` is valid; `src/components/` is not.

Expose intentional cross-feature APIs through public `index.ts` exports. A feature must not import another feature's internal implementation files. Avoid circular dependencies.

## `src/shared/`
Only genuinely reusable infrastructure: generic UI primitives, API client, shared config, generic hooks, and cross-feature types/utilities.

## Frontend rules
- TanStack Query owns remote/server state.
- Zustand owns client-side state only.
- Validate input in the browser for UX and independently on the backend for security.
- Keep UI, API access, state, and business rules separated.
- Provide loading, empty, error, disabled, and success states.
- Build mobile-first responsive layouts, accessible forms, keyboard navigation, and adequate contrast.
- Avoid unnecessary animation, premature abstractions, duplicated API clients, and oversized bundles.
- Enforce folder/dependency rules through review and tooling where practical.

# 6. Go backend architecture

Use a modular monolith with domain-oriented packages. Adapt to existing code where justified, but keep responsibilities clear. A starting point:

```text
backend/
  cmd/
    api/
      main.go
  internal/
    app/
    config/
    http/
      router.go
      middleware/
      handlers/
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

This is a guide, not a mandate to create unused packages. Create no empty folders.

Backend rules:
- Gin handlers deal with HTTP transport and delegate use cases.
- Business rules belong in domain/application services, not handlers.
- Keep SQL/data-access boundaries clear. Do not create interfaces that merely wrap a single implementation without a real testing or substitution need.
- Propagate `context.Context`, request cancellation, and timeouts.
- Do not launch unbounded background goroutines from request handlers.
- Use explicit transactions for operations that must be atomic.
- Avoid circular imports and unclear cross-module ownership.
- Map domain errors to consistent safe HTTP errors.
- Use `gofmt`, `go vet`, tests, and appropriate static analysis.

# 7. Complete feature scope

Implement the following features where applicable and approved. For each feature, include backend enforcement, frontend states, permissions, error cases, tests, and documentation.

## 7.1 Public storefront and menu
- Browse menu without login.
- Browse categories and products.
- Product details, descriptions, price, images, availability, and optional add-ons/options.
- Search and category filtering where appropriate.
- Clearly indicate unavailable products.
- Never allow an unavailable product to be ordered.
- Use real content/assets when supplied; mark temporary sample content as sample.

## 7.2 Cart
- Add/remove items.
- Change quantities.
- Select product options/add-ons.
- Show item subtotal, cart subtotal, delivery fee when applicable, and estimated total.
- Validate quantity and option combinations.
- Persist the cart in a sensible way for the chosen UX, without treating it as authoritative.
- Revalidate availability, options, and prices on the server at checkout.
- Use Zustand only for client-owned cart state; do not store trusted prices there.

## 7.3 Customer accounts and authentication
- Registration only if approved/needed by the product requirements.
- Login, logout, session/refresh lifecycle, and current-user endpoint.
- Password hashing using a well-maintained Go-compatible password-hashing algorithm.
- Rate limiting and generic login errors to reduce account enumeration.
- Session expiry, revocation, refresh rotation/reuse detection if refresh tokens are used.
- Secure cookies in production for cookie-based auth.
- Role and permission checks on every protected backend endpoint.
- Clear frontend handling of expired sessions and forbidden actions.

## 7.4 Guest checkout and guest order access
- Allow public menu browsing and guest checkout by default.
- Collect only required customer/contact/fulfillment details.
- Provide a secure way for a guest to access the correct order and tracking status.
- Use high-entropy unguessable tokens or an equally secure scoped mechanism.
- Store token hashes where practical; define expiration and revocation.
- Scope access to one order and limited actions.
- Avoid token leakage in URLs, logs, analytics, and referrer headers. If a URL token is exchanged, remove it from the visible URL afterward.
- Prevent order-ID guessing from granting access.
- Rate-limit lookup attempts and minimize returned personal data.

## 7.5 Checkout and pricing
- Validate product IDs, availability, option selections, quantities, customer details, fulfillment type, delivery eligibility, payment method, and any discount rules.
- Recalculate prices and totals on the server from database records.
- Never trust client-submitted prices, totals, delivery fees, discounts, or payment state.
- Save immutable order-item snapshots including purchased name/options, unit price in satang, quantity, and relevant details.
- Define idempotency behavior for repeated checkout requests.
- Display clear pending, failed, and confirmed states.

## 7.6 Order management and history
- Customer order history for authenticated customers.
- Secure guest order lookup.
- Order detail and status history.
- Staff order queue and order detail.
- Validated status transitions and cancellation rules.
- Record actor, timestamp, reason, and relevant status changes.
- Prevent duplicate orders and concurrent incompatible transitions.
- Support appropriate fulfillment variations for delivery, pickup, and POS.

## 7.7 Payment integration
- PromptPay through an actual provider once selected/configured.
- Cash on delivery only if confirmed by the owner.
- POS cash or other approved in-person payment methods.
- Payment initialization, status, transaction references, webhook processing, and reconciliation.
- Provider adapter isolated from domain logic.
- Mock provider only for development/testing, clearly labeled and never represented as real payment success.

Never treat QR display, a frontend redirect, a client callback, or an unverified webhook as proof of payment.

## 7.8 Staff workflow and kitchen order queue
- Staff login and permission checks.
- View incoming orders.
- View order details and selected options.
- Accept/process orders and move them through permitted states.
- Mark preparation and readiness only when valid.
- Support real-time queue updates where useful, with REST fallback.
- Record staff actions for important transitions.
- Prevent staff from accessing admin-only functions unless explicitly permitted.

## 7.9 POS and walk-in orders
- Authorized staff can create walk-in orders without customer checkout.
- Select products, options, and quantities.
- Recalculate all prices server-side.
- Record the staff actor and payment method.
- Support cash collection and only other owner-approved methods.
- Produce a printable receipt/order summary as required.
- Track fulfillment and payment independently.
- Make payment collection idempotent and auditable.
- Prevent duplicate collection and unauthorized edits/refunds.
- Do not invent tax/receipt compliance rules; ask the owner when needed.

## 7.10 Delivery eligibility and delivery operations
- Default delivery radius is 7 km, configurable and subject to owner confirmation.
- Use the actual restaurant coordinates as the origin.
- Straight-line distance may be the initial method if clearly documented; do not describe it as road distance.
- If restaurant coordinates are absent or invalid, disable delivery checkout and clearly explain that delivery is not configured.
- Never invent coordinates.
- Validate eligibility and fee on the backend.
- Keep delivery fee and minimum-order rules configurable.
- Support assignment, pickup, en-route, completion, and approved failure/cancellation states.
- Define how unavailable riders, failed delivery, customer unreachable, and order cancellation are handled.

## 7.11 Rider management and live tracking
- Assign a rider to an eligible order.
- Restrict rider views to their assigned orders.
- Validate location payloads and throttle update frequency.
- Authorize access to every location update and WebSocket room on the backend.
- Customers can see the rider only for their own eligible active order.
- Authorized staff can access only as allowed by the permission matrix.
- Stop collection/sharing when delivery completes or is canceled, according to the retention policy.
- Do not publish rider coordinates through public APIs.
- Define stale location, disconnect, reconnect, and REST fallback behavior.

## 7.12 Customer order tracking and notifications
- Show current order status and useful timestamps.
- Provide real-time updates where available.
- Recover by fetching current state when the connection drops.
- Do not expose other customers' orders or personal data.
- Notifications may include in-app status updates and other channels only if configured.
- Never claim email/SMS/push notifications work if no real provider is configured.

## 7.13 Reviews and ratings
- Reviews only after an eligible order is completed/delivered according to the approved policy.
- One review per eligible order unless owner approves otherwise.
- Validate eligibility and ownership on the backend.
- Enforce uniqueness in PostgreSQL where appropriate.
- Do not fabricate reviews, ratings, or testimonials.

## 7.14 Admin dashboard and management
- Overview of orders and operational metrics.
- Manage categories and products.
- Manage prices, options, availability, and images if supported.
- Manage orders and fulfillment.
- Manage delivery configuration.
- Manage users, staff, roles, and permissions.
- View payment/POS records and audit trails.
- Sales summaries with clearly defined date/time and calculation rules.
- Protect every action with backend authorization.
- Do not invent sales figures or show misleading demo metrics in production.

## 7.15 Optional features — only after core approval
Do not add these automatically; list them as optional decisions:
- Inventory/stock deduction.
- Promotions, coupons, and loyalty points.
- Scheduled/preorders.
- Multiple branches.
- Table management/dine-in.
- Printer integration and hardware POS.
- SMS/email/push notifications.
- Refund automation.
- Tax invoices and jurisdiction-specific compliance.
- Analytics beyond basic operational reporting.
- Multiple languages.
- Delivery route optimization.

# 8. Order, payment, and delivery state machines

Design separate state machines for order fulfillment, payment, and delivery. For every transition document valid source state, target state, authorized actor, preconditions, side effects, idempotency, and recovery.

Possible order workflow:

`PENDING_PAYMENT -> PLACED -> PREPARING -> READY_FOR_PICKUP -> OUT_FOR_DELIVERY -> DELIVERED`

Adapt it for cash, pickup, POS, cancellation, and actual restaurant operations. Do not force every order through delivery states.

Possible payment states:

`PENDING`, `REQUIRES_ACTION`, `SUCCEEDED`, `FAILED`, `EXPIRED`, `CANCELED`, `REFUND_PENDING`, `REFUNDED`

Use only states relevant to the provider and business rules. Order status and payment status are independent. Reject arbitrary status updates from clients.

Delivery states should be modeled independently where it makes the domain clearer, including assignment, pickup, in-transit, delivered, failed, and canceled as appropriate.

Define an explicit policy for late payment success after order expiration/cancellation: resume fulfillment only if valid; otherwise use the approved refund or staff-review workflow.

# 9. Database and data integrity

Use PostgreSQL, SQL migrations, and an ERD designed before feature implementation.

Possible entities:
- users
- roles/permissions or equivalent
- categories
- products
- product_options (if needed)
- orders
- order_items
- payments
- payment_events
- deliveries
- rider_locations or an appropriate location store
- reviews
- audit_logs
- idempotency_records (if needed)
- sessions/refresh_tokens if required by auth design

Do not create tables without a use case.

Requirements:
- Store money as integer satang, never floating point.
- Define foreign keys, uniqueness, delete behavior, indexes, and constraints.
- Use consistent UTC storage and documented display timezone behavior.
- Enforce critical invariants in PostgreSQL, not only in Go.
- Use CHECK constraints and partial unique indexes where required.
- Test PostgreSQL-specific constraints against real PostgreSQL.
- Keep schema changes in version-controlled migrations.
- Do not rely on automatic schema synchronization.
- Store immutable item snapshots.
- Store payment and order state separately.
- Give provider event/transaction IDs appropriate uniqueness constraints.
- Define data retention and deletion behavior for personal and rider location data.

## Critical transaction rule
Never keep a database transaction open while waiting for a payment provider or another external network call.

Checkout sequence:
1. Validate the request and authoritative current prices.
2. Atomically create initial order and payment records in a pending state.
3. Commit the database transaction.
4. Initiate provider operation outside the transaction.
5. Persist provider results through idempotent state transitions.
6. Handle timeouts, retries, duplicate/out-of-order events, and ambiguous outcomes.
7. Reconcile transactions whose state cannot be confirmed.

Document recovery if provider success occurs but the app times out before saving it. A timeout is not proof of failure. Ensure duplicate requests/events cannot create duplicate payments or order transitions.

# 10. Payment webhook security and reconciliation

Follow the selected provider's official specification.

- Verify webhook signatures.
- Validate event schema and merchant/account context.
- Retrieve authoritative provider status when appropriate.
- Deduplicate events using stable provider event IDs or a documented equivalent.
- Process events idempotently.
- Handle out-of-order events safely.
- Reject impossible transitions.
- Persist useful diagnostic metadata without secrets.
- Retry transient processing failures safely.
- Reconcile pending/unknown transactions.
- Prevent duplicate payment records and fulfillment transitions.

Test duplicate events, out-of-order events, provider timeout, app restart, failed initialization, late success, database failure after provider success, and ambiguous outcomes. Do not silently lose or misrepresent money.

# 11. Authentication, authorization, and privacy

Define a permission matrix for Customer, Staff, Admin, and Rider. The backend independently enforces permissions on every protected endpoint and sensitive operation.

Recommended baseline:
- Short-lived access JWT (around 15 minutes) if JWT is chosen.
- Refresh session around 14 days if needed, with rotation and reuse detection.
- HttpOnly, Secure cookies in production for cookie-based auth.
- Appropriate SameSite settings and CSRF/Origin protection.
- A well-maintained password hashing algorithm appropriate to Go.
- Rate limiting for login, refresh, guest lookup, and sensitive actions.
- Explicit logout, revocation, expiry, and compromised-session handling.

Do not store long-lived auth tokens in localStorage when using cookie-based auth. Document the selected session strategy rather than blindly mixing JWT and cookie approaches.

Security controls:
- Strict CORS allowlist.
- Secure HTTP headers.
- DTO/request validation.
- Object-level authorization to prevent IDOR.
- Rate limiting.
- Safe upload handling if uploads exist.
- Request IDs and structured logs.
- Redaction of personal/sensitive data.
- Audit logs for order, payment, POS, and admin actions.
- Dependency/vulnerability checks in CI.
- Never log passwords, tokens, guest access secrets, webhook secrets, or unnecessary personal data.
- Never commit secrets or production data.
- Provide `.env.example` with placeholders only.
- Never return stack traces or secrets to production clients.

# 12. API design

All application endpoints use `/api/v1` unless a documented exception is necessary. Design and document endpoints for:
- Auth/session lifecycle.
- Public menu, categories, products, and options.
- Checkout/order creation.
- Guest order access.
- Customer order history/detail.
- Payment initialization/status.
- Provider webhooks.
- Staff order queue and state transitions.
- POS order creation and payment collection.
- Delivery eligibility/configuration.
- Rider assignment and location updates.
- Customer order tracking.
- Reviews.
- Admin management and reporting.

For every endpoint document:
- Method/path.
- Auth and role/permission.
- Request/response DTO.
- Validation.
- Error codes and consistent error body.
- Idempotency requirements.
- Rate limiting.
- State changes and side effects.

Use consistent HTTP status codes. Publish OpenAPI/Swagger docs that match implementation. Use pagination for potentially large collections. Do not invent provider-specific API contracts.

# 13. UI/UX and branding

Build a polished, mobile-first Thai restaurant experience that makes food discovery and ordering easy.

- Inspect the actual logo before choosing brand tokens.
- Preserve the existing logo; never replace it.
- Use Thai-friendly typography and readable Thai content.
- Use real menu images and restaurant information when supplied.
- Clearly label temporary sample content.
- Make menu, prices, product options, cart, checkout, payment state, and order status easy to understand.
- Provide loading, empty, error, disabled, pending, success, and retry states.
- Ensure keyboard navigation, contrast, responsive layouts, and accessible forms.
- Avoid unnecessary animation/3D/decorative elements that hurt readability or performance.
- Do not fabricate testimonials, ratings, review counts, sales metrics, or restaurant details.

Customer screens as applicable:
- Home/storefront.
- Menu/category browsing.
- Product details/options.
- Cart.
- Checkout.
- Payment instructions/status.
- Order confirmation.
- Live/status tracking.
- Guest order lookup.
- Authenticated order history and account.

Staff/admin screens as applicable:
- Login.
- Incoming order queue.
- Order detail/status controls.
- POS and receipt.
- Menu/category management.
- Delivery and rider assignment.
- Payment and POS records.
- User/role management.
- Dashboard and reports.

Do not mark placeholder screens as complete functionality.

# 14. WebSockets and real-time behavior

Use WebSockets only where useful. Examples: staff order queue, customer order status, rider location.

- Authorize every room join on the server.
- Never trust a client-provided room ID as permission.
- Recheck permissions before exposing sensitive events.
- Define reconnect, duplicate events, stale data, and REST fallback.
- Throttle rider location updates.
- Minimize personal data in broadcasts.
- Stop location sharing when delivery ends according to policy.

# 15. Reliability, idempotency, and concurrency

Protect:
- Double-click/retried checkout.
- Repeated payment initialization.
- Duplicate webhooks.
- Duplicate POS collection.
- Concurrent order state changes.
- Duplicate reviews.
- Duplicate rider assignment.
- Availability/stock races if inventory is included.

Use idempotency keys where appropriate, scoped to actor/session and operation. Define key persistence, expiry, and conflict behavior. Use PostgreSQL constraints, transactions, and suitable concurrency control as the final defense. Do not rely on in-memory locks alone in a multi-instance deployment.

If background jobs are later needed, define retry policy, duplicate processing, failure visibility, and recovery. Do not introduce a queue without a real use case.

# 16. Errors, logs, and operational visibility

Implement:
- Consistent structured logs.
- Request/correlation IDs.
- Centralized safe error mapping.
- Useful validation messages.
- No secrets or unnecessary personal data in logs.
- Health/readiness endpoints where appropriate.
- Visible payment-provider/database failures.
- Audit trails for important transitions.
- Appropriate timeouts and graceful shutdown.

Do not silently swallow errors or return internal stack traces in production.

# 17. Testing and acceptance criteria

## Backend
- Unit tests for business rules, state transitions, validation, permissions, price calculation, and delivery eligibility.
- Integration tests for PostgreSQL queries, constraints, transactions, auth, idempotency, and webhook processing.
- HTTP tests for Gin handlers/middleware.
- Concurrency/recovery tests for money and state transitions.

## Frontend
- Component/unit tests for important interactions and states.
- Playwright end-to-end tests for key customer and staff workflows.

## Required end-to-end scenarios
1. Browse menu without logging in.
2. Add/remove items and choose options.
3. Server recalculates prices.
4. Invalid/unavailable products cannot be ordered.
5. Guest checkout and scoped guest order access work.
6. Authenticated order history only returns the user's orders.
7. Checkout creates one order under retries.
8. Payment pending/failure/success states behave correctly.
9. Verified webhook updates state exactly once.
10. Duplicate/out-of-order webhooks do not corrupt state.
11. Late payment success follows the documented policy.
12. Staff can process authorized orders only.
13. POS can create a walk-in order and record collection once.
14. Unauthorized collection/refund/state transition is rejected.
15. Delivery is unavailable when restaurant coordinates are missing.
16. Delivery radius is enforced server-side.
17. Customer cannot view another order's rider location.
18. Rider cannot view orders not assigned to them.
19. Tracking stops after delivery completion/cancellation according to policy.
20. Review eligibility and one-review-per-order constraints work.
21. Admin endpoints reject unauthorized users.
22. Database migrations and constraints work on PostgreSQL.

Run and report actual results for `gofmt`, `go vet`, Go tests, frontend lint/type checks, frontend tests, Playwright where configured, migration validation, and production builds. Clearly list checks that were not run and why. Do not mock away the behavior that the test must verify.

# 18. Docker, Caddy, CI/CD, and deployment

- Multi-stage Docker builds where appropriate.
- Non-root runtime user where practical.
- Minimal runtime images.
- No secrets baked into images.
- Graceful shutdown and signal handling.
- Health checks.
- Private database networking and persistent storage.
- Controlled migrations as an explicit deployment step.
- Migration failures block unsafe rollout.
- Caddy routing, HTTPS, proxy headers, cookies, and WebSocket upgrades verified.
- CI checks for formatting, lint/static analysis, tests, migrations, and builds.
- Document deployment, rollback, backup, and restore.
- Test actual database restoration, not just backup creation.
- Do not claim high availability or zero downtime unless implemented and verified.

# 19. Configurable business settings

Do not scatter hardcoded business rules. Make these configurable:
- Restaurant name and brand assets.
- Restaurant address and coordinates.
- Delivery radius (initial default 7 km).
- Delivery fee policy.
- Minimum order, if any.
- Opening hours.
- Product availability.
- Payment methods/provider settings.
- Cancellation and refund rules.
- Guest access lifetime.
- Order expiration policy.
- Rider location update frequency and retention.
- Receipt/tax requirements where applicable.

Ask the owner about decisions that materially affect money, fulfillment, privacy, or compliance. State safe defaults explicitly.

# 20. Optional features — do not silently include in MVP

List as separate decisions and implement only after approval:
- Inventory/stock deduction.
- Coupons, promotions, loyalty points.
- Scheduled orders/preorders.
- Multiple branches.
- Dine-in/table management.
- Hardware receipt printer integration.
- SMS/email/push notifications.
- Automated refunds.
- Tax invoices or jurisdiction-specific compliance.
- Route optimization.
- Multiple languages.
- Advanced analytics.

# 21. Definition of done

A feature is not complete until:
- Backend validation and authorization exist.
- Relevant data constraints and state transitions are implemented.
- Frontend loading/empty/error/success states exist.
- Tests cover expected behavior and important failures.
- API/docs/configuration are updated.
- No secrets are committed.
- Relevant checks have actually run.
- Remaining limitations are documented.

A whole release is not ready until critical payment consistency, guest access, database constraints, permissions, migrations, and backup/restore have been verified.

# 22. Required first response from Claude

For the first response, **do not write or modify application code**.

Return:
1. Workspace audit.
2. Verified facts vs assumptions.
3. Proposed system architecture.
4. Exact frontend folder tree.
5. Go backend package tree.
6. ERD and migration/constraint plan.
7. API outline.
8. Order/payment/delivery state machines.
9. Auth and permission matrix.
10. Payment transaction/webhook/reconciliation design.
11. Delivery/rider privacy model.
12. Security review.
13. Implementation roadmap with dependencies and acceptance criteria.
14. Testing and deployment plan.
15. Owner decisions required.
16. Approval checklist.

If the repository is empty, say so and propose the initial structure. If the logo is missing, record it as a dependency for brand-specific UI work without blocking architecture and backend planning.

Clearly distinguish repository facts, assumptions, recommendations, and unresolved questions. Do not start Phase 2 until the user explicitly approves the plan.

# 23. Instructions after approval

Once approved:
- Work phase by phase in small increments.
- Inspect files before editing.
- Explain material design choices briefly.
- Keep changes focused and testable.
- Run the relevant tests after each meaningful change.
- Fix root causes.
- Update docs and migrations alongside code.
- Do not add unapproved optional features.
- Report completed work, files changed, verification results, unfinished items, risks, and next step.
- Never state a payment, deployment, integration, or test succeeded without evidence.

**Final objective:** Deliver a secure, maintainable React + Go restaurant platform for public menu browsing, guest/customer ordering, payment, staff order handling, POS, delivery, rider tracking, reviews, and administration, while preserving the owner's existing logo and protecting money, personal data, and operational integrity.
