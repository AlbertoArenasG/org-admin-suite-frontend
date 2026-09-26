# Manual Validation: Customer Service Record Provider And Follow-Up Migration

## Access And Rendering

- [ ] `READ` shows four section anchors and provider data without edit controls.
- [ ] `UPDATE` edits only this local block without changing other block drafts.
- [ ] The absence state is readable and can enter edit mode only with `UPDATE`.

## Provider And Return

- [ ] Disabling provider persists `provider: null`.
- [ ] Enabling provider from absence defaults follow-up to disabled with no rules.
- [ ] Provider, reference, dates, interval, and policies respect backend-nullable
      fields.
- [ ] Estimated return date calculates, can be overridden, and can be cleared.

## Follow-Up

- [ ] The enabled control and rules are included in one PUT with provider data.
- [ ] Rules can be added and removed locally.
- [ ] A rule persists its interval, recipient IDs, and copy recipient IDs.
- [ ] Empty rule arrays and empty recipient arrays remain valid when backend
      permits them.

## Recovery And Boundaries

- [ ] Cancel restores canonical state and clears local draft.
- [ ] Saving prevents duplicate requests and displays standard success feedback.
- [ ] Server error retains draft and supports retry.
- [ ] Options, state, and thunks remain owned by `customer-service-records`.
- [ ] Desktop fields are horizontal and mobile fields stack correctly.
