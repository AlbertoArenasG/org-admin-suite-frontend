# Analysis: Customer Service Record Provider And Follow-Up Migration

## Current Baseline

- The individual page has the institutional access boundary, dynamic breadcrumb,
  and independent `ResourceForm` blocks.
- Its semantic anchor navigation and scroll spy will add `#provider-follow-up`.
- The canonical detail already exposes `provider` as an object or `null`.

## Backend Contract

```text
PUT /v1/customer-service-records/:recordId/provider
```

The request body accepts `provider: null` or the full provider object. Its
object includes provider ID, work order reference, provider dates, return
interval, policies, and `follow_up`. Each follow-up rule has an interval,
recipient group IDs, and copy recipient group IDs.

The endpoint validates that the provider is active, normalizes intervals, and
returns the full refreshed canonical record. `follow_up` has no separate update
endpoint; it is part of this PUT.

## Options Ownership

This block needs providers, status policies, notification policies, and
recipient groups. The `customer-service-records` feature loads all of them
through its own thunk without consuming another feature's state or thunks.

## Composition

One independent form has two sections: `Proveedor y retorno` and
`Seguimiento al proveedor`. With provider disabled, it persists `provider:
null`. With a newly enabled provider, it starts follow-up as disabled with no
rules. The frontend will not add validation rules beyond the backend DTO.
