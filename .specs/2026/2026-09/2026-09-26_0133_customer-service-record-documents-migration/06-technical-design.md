# Technical Design: Customer Service Record Documents Migration

## Route And Forms

`CustomerServiceRecordDetailPage` agrega `#documents` despues de
`#provider-follow-up`. La seccion tiene encabezado propio y cuadrícula de
cuatro paneles, no un formulario global.

`CustomerServiceRecordDocumentForm` es configurable por tipo, copy, visibilidad
de referencia y coleccion canonica. Cada instancia monta su propio
`ResourceFormFrame`; sus drafts, modos, errores y feedback son aislados.

## Shared Components

La adaptacion de BeUI expone seleccion, listado local, retiro, limites y estado
visual, pero no thunks ni URLs de API. Desactiva la simulacion de carga propia
del bloque: los archivos seleccionados permanecen `pending` hasta que el
formulario inicia Guardar. Tambien delega el click de imagen a la galeria de
producto en lugar de abrir su preview individual.

```ts
type AttachmentImage = {
  id: string;
  name: string;
  previewUrl: string;
  downloadUrl: string;
};
```

`AttachmentImageGalleryDialog` recibe esa lista y un indice inicial. Renderiza
carrusel, swipe, flechas, contador, descarga y cierre accesible. En escritorio
incluye miniaturas; en movil no.

## Feature Contract

El feature agrega carga propia para `POST /v1/files` y mutacion generica:

```text
PUT /v1/customer-service-records/:recordId/documents/:documentType
```

Al enviar, el panel carga archivos nuevos, combina sus IDs con existentes no
retirados y persiste el documento. Los tres tipos con referencia mandan texto
recortado o `null`; `other-files` omite la propiedad. Todos mandan `file_ids`.
La respuesta reemplaza el detalle canonico.

La carga usa `FormData` y `fetch` autenticado en el thunk del feature, porque
`jsonRequest` no transporta objetos `File`. Los archivos seleccionados se
envian sin pasar por `normalizeFilesForUpload`, que transforma HEIC y no forma
parte del contrato documental.

## Permissions And States

El boundary de ruta conserva `READ`; la capacidad local `UPDATE` controla solo
Editar del panel. En lectura se ven paneles vacios, archivos, descargas y
galeria. Guardar bloquea solo el panel activo; error mantiene draft y exito usa
toast y feedback de 800 ms.
