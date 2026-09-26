# Technical Design: Customer Service Record Provider And Follow-Up Migration

## Endpoint

```text
PUT /v1/customer-service-records/:recordId/provider
```

The feature serializes either:

```ts
{
  provider: null;
}
```

or the complete provider object required by backend. A successful response is
mapped to `CustomerServiceRecordDetail` and replaces the feature's canonical
detail.

## Feature State

The feature owns provider options for providers, status policies, notification
policies, and recipient groups. Provider mutation status and error are separate
from general details, customer delivery, and equipment mutations.

## Form Values

The form has `hasProvider` as a UI-only control. When false, it serializes null.
When true, it serializes the full provider body. Its two visual sections are:

- `Proveedor y retorno`: provider, order reference, three dates, return
  interval, and two optional policy IDs.
- `Seguimiento al proveedor`: enabled boolean and field-array rules. A rule has
  four interval units, recipient group IDs, and copy group IDs.

Dates accept empty values as null. The estimated return date is locally derived
from delivery date and interval until the user specifies a value. The existing
responsive horizontal field pattern is used.

## Permissions And Navigation

The page boundary remains unchanged. The section exposes edit controls only for
the local `UPDATE` capability. Navigation adds `#provider-follow-up` to the
existing semantic anchor list.
