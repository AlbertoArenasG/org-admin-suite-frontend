# Decisions: Customer Service Record Documents Migration

## Independent Forms

Los cuatro paneles son formularios independientes porque backend persiste cada
tipo con un PUT diferente. No existe guardado global ni formularios anidados.

## Deferred Upload

La seleccion y el retiro ocurren dentro de un dialogo generico y solo modifican
memoria local. Ese dialogo no conoce endpoints ni puede cargar archivos. La
vista consumidora carga al confirmar Guardar, antes del PUT de su panel. La
limpieza de huerfanos no es alcance.

El dialogo puede comunicar la seleccion con progreso visual local por archivo.
Ese estado no representa transporte ni modifica el momento de carga remota.

## Backend Validation

No se agregan reglas de negocio: 10 archivos por carga, 20 MB por archivo,
referencias anulables y colecciones vacias segun el DTO.

## Shared Previewer

`AttachmentImageGalleryDialog` es un componente de producto reusable. Recibe
imagenes neutrales, sin conocer endpoints, permisos ni documentos.

## Vendor And Feature Boundaries

BeUI queda aislado bajo `vendor/beui/attachment-upload` y solo resuelve la UX
animada de seleccion local dentro del dialogo generico. La carga, mapeo y
mutacion son responsabilidad del feature consumidor.
