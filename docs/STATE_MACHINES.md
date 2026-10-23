# State Machines

## Order States

```
PENDING_PAYMENT → PLACED → PREPARING → READY_FOR_PICKUP → OUT_FOR_DELIVERY → DELIVERED
                                      → READY_FOR_PICKUP → PICKED_UP (customer pickup)
                → CANCELED
```

- POS orders may skip PENDING_PAYMENT
- Cash orders may skip PENDING_PAYMENT
- Cancellation rules TBD with owner

## Payment States

```
PENDING → REQUIRES_ACTION → SUCCEEDED
        → FAILED
        → EXPIRED
        → CANCELED
        → REFUND_PENDING → REFUNDED
```

## Delivery States

```
PENDING_ASSIGNMENT → ASSIGNED → RIDER_PICKED_UP → IN_TRANSIT → DELIVERED
                   → CANCELED
                   → FAILED
```

> ⚠️ Transitions, authorized actors, preconditions, side effects, and recovery procedures will be fully documented in Phase 1.
