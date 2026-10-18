# Breakdown De Implementacion

## Slice 1: Contrato Multipart (Fase 1)

- Objetivo: enviar un ZIP con `origin=backoffice` y clasificar lo observado
  sin convertir fallos de transporte en errores definitivos.
- Artefactos: `servicePackageZipUpload.ts`,
  `servicePackagesRecordsThunks.ts`, `servicePackagesRecordsSlice.ts`,
  `index.ts`; handoff API en 06.
- Pasos: definir tipo discriminado; construir `FormData`; usar `API_BASE_URL`;
  analizar 201 y `services[]`; clasificar HTTP no exitoso, red y respuesta
  ilegible; conectar thunk con `rejectWithValue` tipado y rama `upload`
  serializable con `activeRequestId` y reset; exportar contrato del feature.
- Limite: no tocar backend, PWA, `jsonRequest`, DataTable ni UI; no crear
  slice/store nuevo ni guardar el `File` en Redux.
- Validacion: revisar payload y parser contra handoff/ejemplo real, ejecutar
  typecheck/lint pertinentes. Cierre: tres clases de resultado expresadas sin
  supuestos de persistencia ni reintentos automaticos.

## Slice 2: Dialogo Y Accion Primaria (Fase 2)

- Objetivo: seleccionar, confirmar, esperar y leer un resultado persistente
  desde la lista de Next Dashboard.
- Artefactos: `ServicePackageZipUploadDialog.tsx`,
  `ServicePackagesRecordsContainer.tsx`, `ServicePackagesRecordsTable.tsx`,
  textos opcionales de `AttachmentUpload` y locales ES/EN; reuso de DataTable,
  Dialog y Button. `AttachmentUploadDialog` no se modifica.
- Pasos: conectar `primaryActions`; mantener seleccion local del ZIP,
  mostrar la fila y su preparacion animada mediante estado local del dialogo;
  despachar thunk y leer `upload` de Redux; bloquear cierre durante envio,
  mostrar resumen confirmado, warning de parcialidad e incertidumbre; invocar
  `refetch` una vez en exito, resetear al cerrar y traducir.
- Limite: salvo los textos opcionales del selector vendor, no ampliar
  contratos compartidos ni cambiar permisos, ruta o filtros.
- Validacion de implementacion: typecheck/lint y revision estatica de los
  estados. El build y el recorrido con API, teclado, mobile y temas quedan
  registrados en la Slice 3 si no pueden ejecutarse en este entorno. Cierre:
  flujo implementado y resultado visible hasta cierre explicito, sin afirmar
  que los criterios 1-7 ya pasaron la validacion manual.

## Slice 3: Evidencia Y Cierre (Fase 3)

- Objetivo: confirmar que la integracion funciona con la API y cerrar la spec
  solo despues de validacion humana.
- Artefactos: `08-manual-validation.md`, `05-progress.md`,
  `03-task-list.md`, `00-definition.md`, `.specs/index.md`,
  `../org-admin-suite-api/docs/authorization/feature-permission-catalog.md`.
- Pasos: verificar diff y checks; solicitar al usuario ejecutar los casos de
  exito, respuesta HTTP con error y corte de red en su entorno; registrar
  resultado observado, rol, viewport y tema; actualizar el catalogo de
  autorizacion API para mencionar al nuevo consumidor, sin cambiar la
  politica publica; auditar tareas y documentos.
- Limite: no inventar resultados de pruebas ni cerrar con casos pendientes.
- Validacion: evidencia de la matriz y revision final de estados/documentos.
  Cierre: objetivo implementado y validado, todas las tareas `[x]`, statuses
  consistentes y documentacion viva revisada.

## Dependencias Operativas

El usuario inicia o mantiene sus servidores y ejecuta la validacion manual
en navegador. La URL y credenciales de su entorno no se incorporan a la spec.
No se requiere comando de migracion ni despliegue para implementar las slices.
No hacer commit, stage o push sin solicitud explicita.
