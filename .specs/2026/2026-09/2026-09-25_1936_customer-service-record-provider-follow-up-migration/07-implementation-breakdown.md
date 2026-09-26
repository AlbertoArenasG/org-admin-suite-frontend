# Implementation Breakdown: Customer Service Record Provider And Follow-Up Migration

## Feature Layer

- Extend customer-service-record types with provider update values and options.
- Add provider payload serialization to the feature mapper.
- Add feature-owned options and provider update thunks.
- Add dedicated provider mutation state to the slice.

## Component Layer

- Create provider-follow-up schema and independent `ResourceForm` component.
- Use a field array for follow-up rules.
- Extend the detail page and section navigation to the fourth anchor.
- Add an absence state in read mode when the record has no provider.

## Locale Layer

- Add ES/EN labels, descriptions, hints, placeholders, actions, and validation
  copies required by the provider form.

## Explicit Non-Changes

- Do not implement attachments, documents, notification sending, history, or
  provider administration.
- Do not import options or state from another feature.
