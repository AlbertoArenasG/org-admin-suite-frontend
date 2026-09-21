# Shadcn Space Stepper Vendor

## Purpose

Controlled stepper inspired by Shadcn Space `stepper-03`, evaluated in Component
Lab and adapted for product flows that validate and authorize navigation outside
the component.

## Boundaries

- Does not replace primitives in `src/components/ui`.
- Does not own form validation, persistence, modal/page frames, or action buttons.
- Uses the current project tokens, native step triggers, `motion` and Lucide.
- The consumer owns `value`, `onValueChange`, and any forward-navigation rule.

## Source

- Visual reference: Shadcn Space `stepper-03`.
- Reviewed in Component Lab before adoption.
- Update by reviewing source, dependencies, consumers and diff first.
