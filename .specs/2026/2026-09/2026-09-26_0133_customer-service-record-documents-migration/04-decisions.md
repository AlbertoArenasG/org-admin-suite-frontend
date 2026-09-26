# Decisions: Customer Service Record Documents Migration

## Independent Forms

Los cuatro paneles son formularios independientes porque backend persiste cada
tipo con un PUT diferente. No existe guardado global ni formularios anidados.

## Deferred Upload

Seleccionar y retirar archivos solo modifica memoria local. La carga ocurre al
Guardar, antes del PUT del panel. La limpieza de huerfanos no es alcance.

## Backend Validation

No se agregan reglas de negocio: 10 archivos por carga, 20 MB por archivo,
referencias anulables y colecciones vacias segun el DTO.

## Shared Previewer

`AttachmentImageGalleryDialog` es un componente de producto reusable. Recibe
imagenes neutrales, sin conocer endpoints, permisos ni documentos.

## Vendor And Feature Boundaries

BeUI queda aislado bajo `vendor/beui/attachment-upload` y solo resuelve la UX
local de archivos. La carga, mapeo y mutacion son de `customer-service-records`.
