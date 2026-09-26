# Plan: Customer Service Record Documents Migration

## Slice 1: Shared Attachment Foundation

- Exponer una API de producto acotada sobre el selector BeUI, sin simulacion de
  carga ni preview interno.
- Crear `AttachmentImageGalleryDialog` reusable con navegacion, descarga y
  accesibilidad.

## Slice 2: Feature Document Contract

- Extender tipos, mapper y slice con payload documental.
- Crear thunks propios para carga y PUT generico.
- Reemplazar el detalle canonico al guardar.

## Slice 3: Documents Section Adoption

- Crear formulario configurable y cuatro paneles independientes.
- Integrar ancla, permisos, lectura, vacio, carga diferida, galeria y copy.

## Slice 4: Verification And Closure

- Ejecutar verificaciones estaticas, validacion manual y actualizacion
  documental de cierre.
