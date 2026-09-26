# Analysis: Customer Service Record Documents Migration

## Baseline

- La ruta individual cuenta con boundary `READ`, breadcrumb, scroll spy y
  cuatro bloques `ResourceForm` independientes.
- El GET canonico ya expone `quotation`, `purchaseOrder`, `invoice` y
  `otherFiles`, con URLs de descarga y preview.
- BeUI attachment-upload ya esta aislado en
  `src/components/vendor/beui/attachment-upload` y no tiene consumidor.

## Backend Contract

```text
POST /v1/files
PUT /v1/customer-service-records/:recordId/documents/:documentType
```

La carga acepta 10 archivos y 20 MB por archivo. El PUT acepta `quotation`,
`purchase-order`, `invoice` u `other-files` y devuelve el registro completo.
Los tres primeros requieren la presencia de `reference_number`, aunque acepta
`null`; todos aceptan `file_ids` vacio. `other-files` no admite referencia.

## Composition And Ownership

`Documentos` es la quinta ancla, no un formulario global. Renderiza cuatro
`ResourceFormFrame` independientes en cuadrícula. El feature dueño agrega sus
propios thunks de carga y mutacion; los modos, drafts y recuperacion son
locales a cada panel.

El dialogo generico de adjuntos conserva los archivos seleccionados en memoria
hasta que el formulario consumidor confirma Guardar. No conoce endpoints ni
ejecuta cargas. Solo entonces el panel carga archivos nuevos, combina sus IDs
con archivos existentes no retirados y llama su PUT. La limpieza de archivos
sin asociar esta excluida.

El bloque BeUI descargado simula visualmente una carga y abre un preview
individual al seleccionar una imagen. El dialogo adaptador conserva un progreso
visual local de preparacion para hacer visible la seleccion, pero no lo vincula
a una carga remota: los archivos siguen pendientes hasta Guardar. La imagen se
delega a la galeria compartida. Tampoco se reutiliza
`normalizeFilesForUpload`, pues transforma HEIC antes de la carga.

## Preview

La galeria compartida recibe una coleccion neutral de imagenes y el indice
inicial. Ofrece carrusel, swipe, flechas, contador, descarga, foco y teclado;
solo escritorio presenta miniaturas.
