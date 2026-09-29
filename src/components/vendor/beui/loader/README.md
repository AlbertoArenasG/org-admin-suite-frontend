# BeUI Motion Loader Vendor

## Provenance

- Source: BeUI Loader motion component.
- Source URL: `https://beui.dev/components/motion/loader`.
- Source repository: `https://github.com/starc007/ui-components`.
- Component Lab revision: `e8a567e` (2026-09-10).
- Adapted: 2026-09-28.
- License: MIT.

## Boundary

This directory contains the approved, isolated BeUI loader variants: `dither`,
`bars`, and `dot-matrix`. It does not replace `src/components/ui/spinner.tsx`
or any canonical primitive.

The product consumer owns when loading is active and which accessible label is
announced. This component owns only the visual motion and honors reduced-motion
preferences.

## Dependencies

- `motion`
- `clsx` and `tailwind-merge` through `@/lib/utils`

## Consumers

- `RouteChangeLoader` uses the `dither` variant after its existing delay.

## Update Procedure

1. Review the upstream source and its license.
2. Keep the supported variants and all BeUI-derived source in this boundary.
3. Do not replace canonical loading primitives.
4. Validate reduced motion, accessible labels, themes, and the active consumer.
