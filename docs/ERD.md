# Database Entity-Relationship Design

## Planned Entities

| Entity | Purpose |
|---|---|
| users | Customer, staff, admin, rider accounts |
| roles | Role definitions (customer, staff, admin, rider) |
| user_roles | User-role assignments |
| categories | Menu categories |
| products | Menu products |
| product_options | Optional add-ons/variations |
| orders | Customer and POS orders |
| order_items | Immutable snapshots of purchased items |
| payments | Payment records (separate from order status) |
| payment_events | Provider event log for dedup and audit |
| deliveries | Delivery assignments and status |
| rider_locations | Time-series rider location data |
| reviews | Customer reviews (one per eligible order) |
| audit_logs | Important action audit trail |
| idempotency_records | Idempotency key tracking |

## Key Constraints

- Money stored as integer satang (CHECK >= 0)
- Foreign keys with appropriate ON DELETE behavior
- Unique constraints on: provider event IDs, one review per order
- Partial unique indexes where needed
- CHECK constraints for valid status values
- Timestamps in UTC

> ⚠️ Full ERD with columns, types, indexes, and relationships will be designed in Phase 1 before any migration is created.
