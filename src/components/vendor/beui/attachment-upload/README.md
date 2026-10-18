# BeUI Attachment Upload

## Provenance

- Source: BeUI `@beui/attachment-upload` registry block.
- Source URL: `https://beui.dev/components/blocks/file-upload`.
- Download command: `npx shadcn add @beui/attachment-upload`.
- Downloaded: 2026-09-25.
- Registry author: Saurabh (`saurabh10102@gmail.com`).
- License: MIT. Preserve the BeUI source attribution in copied files.

## Boundary

This directory is the isolated BeUI attachment-upload family. Its motion and
tooltip helpers remain private dependencies of the block; they do not replace
or modify primitives in `src/components/ui`.

The block owns only animated file-selection presentation, local attachment
rows, local selection-progress feedback, and preview interaction. It is
normally consumed through a generic product dialog that keeps `File` objects
in memory and never calls remote endpoints. The service-package ZIP upload
dialog uses the selector directly because its result must remain visible
while a remote mutation completes. Product modules own dialog confirmation,
upload timing, remote mutations, permissions, localization, and domain
validation. Optional selector labels retain their original defaults.

## Dependencies

- `motion`
- `@floating-ui/dom`
- `lucide-react`
- `clsx` and `tailwind-merge` through the canonical `@/lib/utils` helper

## Consumers

- `CustomerServiceRecordDocumentForm` consumes the product-level
  `AttachmentUploadDialog`; it does not import this family directly.
- `ServicePackageZipUploadDialog` consumes `AttachmentUpload` directly for its
  specialized ZIP selection and upload flow.

## Update Procedure

1. Inspect the registry diff before applying an update.
2. Keep every BeUI-owned source inside this directory.
3. Do not overwrite canonical primitives or utilities.
4. Validate keyboard navigation, focus, portal behavior, mobile layout, and
   reduced motion in every active consumer.
