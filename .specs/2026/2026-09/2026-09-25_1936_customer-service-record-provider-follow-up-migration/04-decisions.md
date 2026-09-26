# Decisions: Customer Service Record Provider And Follow-Up Migration

## Complete Provider Object

Provider and follow-up migrate together because the same backend PUT persists
both. The UI will not preserve editable follow-up state without rendering it.

## Backend-Only Validation

The form follows the DTO exactly. It does not require a rule when follow-up is
enabled, nor a recipient group inside a rule, because backend permits empty
arrays.

## Provider Absence

The provider toggle persists `provider: null`. Turning it on from an absent
provider starts the required follow-up structure as disabled with no rules.

## Feature Boundary

All option endpoints, state, serialization, and the update mutation belong to
`customer-service-records`. No other feature becomes a dependency.
