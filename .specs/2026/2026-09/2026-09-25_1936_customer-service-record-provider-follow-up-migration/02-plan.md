# Plan: Customer Service Record Provider And Follow-Up Migration

## Slice 1: Feature Contract And Options

- Add provider types, mapper, options thunk, mutation thunk, and mutation state
  under the owning feature.
- Replace canonical detail with the PUT response.

## Slice 2: Provider And Follow-Up Form

- Create schema, independent form, and repeatable follow-up rules.
- Extend section navigation and ES/EN copies.
- Implement read mode, local editing, provider absence, calculated return date,
  and local permissions.

## Slice 3: Verification And Closure

- Run static checks and manually validate provider, return, follow-up, and
  responsive behavior.
- Update progress, adoption log, and index on closure.
