# BeUI Attachment Upload

## Provenance

- Source: BeUI `@beui/attachment-upload` registry block.
- Download command: `npx shadcn add @beui/attachment-upload`.
- Downloaded: 2026-09-25.
- Registry author: Saurabh (`saurabh10102@gmail.com`).
- License: the downloaded registry manifest does not declare one; verify it
  before promoting this family beyond the approved product adoption.

## Boundary

This directory is the isolated BeUI attachment-upload family. Its motion,
tooltip, and overlay helpers remain private dependencies of the block; they do
not replace or modify primitives in `src/components/ui`.

The block owns only file-selection presentation, local attachment rows, and
preview interaction. Product modules own upload timing, remote mutations,
permissions, localization, and domain validation.

## Dependencies

- `motion`
- `@floating-ui/dom`
- `lucide-react`
- `clsx` and `tailwind-merge` through the canonical `@/lib/utils` helper

## Consumers

No business view consumes this family yet. Its first intended adoption is the
customer-service-record documents section.

## Update Procedure

1. Inspect the registry diff before applying an update.
2. Keep every BeUI-owned source inside this directory.
3. Do not overwrite canonical primitives or utilities.
4. Validate keyboard navigation, focus, portal behavior, mobile layout, and
   reduced motion in every active consumer.
