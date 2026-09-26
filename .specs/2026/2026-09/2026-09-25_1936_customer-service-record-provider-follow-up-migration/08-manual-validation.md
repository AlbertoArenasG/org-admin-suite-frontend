# Manual Validation: Customer Service Record Provider And Follow-Up Migration

## Access And Rendering

- [x] `READ` shows four section anchors and provider data without edit controls.
- [x] `UPDATE` edits only this local block without changing other block drafts.
- [x] The absence state is readable and can enter edit mode only with `UPDATE`.

## Provider And Return

- [x] Disabling provider persists `provider: null`.
- [x] Enabling provider from absence defaults follow-up to disabled with no rules.
- [x] Provider, reference, dates, interval, and policies respect backend-nullable
      fields.
- [x] Estimated return date calculates, can be overridden, and can be cleared.

## Follow-Up

- [x] The enabled control and rules are included in one PUT with provider data.
- [x] Rules can be added and removed locally.
- [x] A rule persists its interval, recipient IDs, and copy recipient IDs.
- [x] Empty rule arrays and empty recipient arrays remain valid when backend
      permits them.

## Recovery And Boundaries

- [x] Cancel restores canonical state and clears local draft.
- [x] Saving prevents duplicate requests and displays standard success feedback.
- [x] Server error retains draft and supports retry.
- [x] Options, state, and thunks remain owned by `customer-service-records`.
- [x] Desktop fields are horizontal and mobile fields stack correctly.
