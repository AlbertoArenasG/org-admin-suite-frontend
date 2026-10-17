# Analisis

## Estado Actual

- La ruta `src/app/dashboard/service-packages-records/page.tsx` ya usa
  `DashboardViewAccessBoundary` con `SERVICE_PACKAGES.READ` y
  `DashboardTableWorkspace`.
- `ServicePackagesRecordsTable` usa `DataTable`; su toolbar ya admite
  `primaryActions` sin ampliar contrato. El contenedor compone tabla y
  dialogo de borrado; el controller dispone de `refetch()` que respeta los
  criterios de lista activos.
- `AttachmentUploadDialog` es un selector local que se cierra en `onConfirm`;
  no sirve sin cambios para una mutacion cuyo resultado debe quedar visible.
  El control `AttachmentUpload` que contiene admite `accept`, `multiple`,
  `maxFiles`, `maxFileSize`, `disabled` y lista controlada.
- `Dialog` y `DialogContent` ya ofrecen estructura, foco y tokens. El
  `Stepper` existe, pero el usuario no navega pasos de negocio independientes.
- `jsonRequest` serializa `body` como JSON; no sirve para `FormData`.
  Los uploads existentes usan `fetch` con `API_BASE_URL` y `FormData`.
- Las mutaciones remotas existentes de este feature, como eliminar, usan
  `createAsyncThunk` y una rama de `servicePackagesRecordsSlice`. La seleccion
  del archivo es efimera y permanece local; el resultado remoto si sigue el
  patron Redux del modulo, sin introducir una slice nueva.

## Contrato Confirmado

`../org-admin-suite-api/docs/frontend/service-package-upload-handoff.md`
documenta el contrato vigente: `POST /v1/service-packages/uploads`, archivo
`package`, `origin` opcional, envelope 201 con `package_id` y `services[]`.
No hay guard de autenticacion ni permiso de creacion en el endpoint. El
procesamiento no es atomico: puede haber registros parciales si falla despues
de comenzar. No hay consulta de intento ni idempotencia.

## Riesgos Y Limites

- Un error de transporte no permite saber si el request llego o si la
  respuesta se perdio. El correo de observabilidad no resuelve ese estado
  dentro de la sesion del navegador.
- Un error HTTP tampoco garantiza que no se hayan guardado registros previos.
- Los limites de proxy/hosting no estan descritos en el contrato API; no
  prometer tamaños ilimitados ni inventar un limite menor de negocio.
- Una lista filtrada podria no mostrar los registros nuevos aun despues de
  refrescar. El resultado del dialogo debe conservar el detalle confirmado.
