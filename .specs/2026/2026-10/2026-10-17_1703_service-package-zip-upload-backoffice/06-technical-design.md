# Diseno Tecnico: Carga ZIP Desde Backoffice

## Ruta Y Composicion

Se conserva `/dashboard/service-packages-records`, su
`DashboardViewAccessBoundary` READ y el mismo workspace. El contenedor agrega
un `Button` primario `Cargar ZIP`, lo pasa como `primaryActions` a la toolbar
del `DataTable` y monta un `ServicePackageZipUploadDialog`. La tabla no ejecuta
fetching ni conoce el ZIP. No se agregan rutas, breadcrumbs, layouts o
settings nuevos.

## Integracion Y Modelo

`servicePackageZipUpload.ts` contiene el cliente del feature y usa
`fetch(\`${API_BASE_URL}/v1/service-packages/uploads?origin=backoffice\`,
{ method: 'POST', body: formData })`, con `formData.append('package', file)`.
No fijar `Content-Type`: el navegador debe incluir el boundary multipart. El
endpoint es publico; no se envia token por necesidad contractual ni se usa
`jsonRequest`, que serializa `body` como JSON. La ruta de la tabla, no esta
mutacion, exige READ.

`uploadServicePackageZip` en `servicePackagesRecordsThunks.ts` coordina el
cliente con `createAsyncThunk`. Una rama `upload` en la slice existente posee
`status: idle | loading | settled`, `outcome` y `activeRequestId`. El thunk
devuelve un resultado confirmado en `fulfilled`; error HTTP e incertidumbre
entran como `rejectWithValue` tipado, sin convertirlos en mensaje plano. La
slice solo almacena objetos serializables: nunca el `File`, `FormData` ni el
objeto nativo `Error`. Un `requestId` activo impide que una respuesta tardia
repueble estado reseteado o sobreescriba otro intento. La UI bloquea un
segundo envio mientras `loading`; el thunk tambien lo impide mediante
`condition` para cubrir doble disparo programatico.

La funcion devuelve una union discriminada de resultados observados:

```ts
type ServicePackageZipUploadOutcome =
  | {
      kind: 'confirmed';
      packageId: string;
      services: { recordId: string; serviceOrder: string; fileCount: number }[];
    }
  | { kind: 'server-error'; status: number; message: string }
  | { kind: 'uncertain'; reason: 'network' | 'unreadable-response' };
```

HTTP 201/2xx solo confirma cuando hay envelope `success: true`, `data` con
`package_id` y `services[]` interpretables. Si la respuesta exitosa no se
puede interpretar, `uncertain`; no inventar conteos. HTTP no exitoso es
`server-error` aunque el cuerpo no sea JSON; extraer el mensaje estandar si
existe y usar fallback localizado si no. Error de `fetch`/corte de red es
`uncertain`. No introducir timeout propio ni reintento automatico. En
`server-error` advertir posible persistencia parcial, tambien ante 4xx si
el ZIP incluyo varios servicios.

Contrato vivo: `../org-admin-suite-api/docs/frontend/service-package-upload-handoff.md`.
El backend no cambia; el nuevo consumidor envia el query opcional. La PWA
permanece igual. Responsable de validar integracion real: usuario en
backoffice contra API accesible.

## Dialogo Y Estado

`ServicePackageZipUploadDialog` usa `Dialog`, `DialogContent`, `Button` y
directamente el control visual `AttachmentUpload` del vendor. No se usa
`AttachmentUploadDialog` porque ese wrapper descarta el archivo y cierra al
confirmar. El dialogo ZIP guarda
localmente solo seleccion, rechazo de archivo y foco; obtiene `loading` y el
resultado remoto de `servicePackagesRecords.upload`. La presentacion deriva
`selecting | submitting | confirmed | server-error | uncertain` de ese
estado. `accept=".zip,application/zip"`,
`multiple={false}`, `maxFiles={1}` y `maxFileSize={Infinity}` para no aplicar
el default de 500 MB del vendor; pasar descripcion propia en lugar del texto
de tamano maximo. Validar ademas extension `.zip` sin
sensibilidad a mayusculas y tamaño mayor a cero antes de habilitar envio.
No inspeccionar ni modificar el contenido del ZIP en navegador. El selector
mantiene la fila visible y coordina localmente la misma animacion
`uploading -> complete -> idle` del dialogo de adjuntos; el
boton de envio se habilita al terminar. Esto no representa progreso del
backend. El vendor solo recibe props opcionales para traducir el estado de
limite y el nombre accesible del input; sus defaults existentes no cambian.
El limite efectivo de infraestructura sigue sin confirmarse y no se promete
tamano ilimitado extremo a extremo.

Antes de enviar, mostrar nombre y tamaño del ZIP, descripcion clara de que
puede contener varios registros y confirmacion explicita. Durante
`submitting`, usar `Button` con `loading`/`loadingLabel`, deshabilitar
selector y segundo envio, impedir cierre por Escape, click fuera o boton X.
El resultado reemplaza el contenido de seleccion y permanece visible hasta
que el usuario pulsa `Cerrar`. No volver a `selecting` desde el mismo intento;
para otra carga se reabre el dialogo en estado limpio. Al cerrar se despacha
`resetServicePackageZipUpload`; una peticion tardia no reabre ni repuebla el
resultado. En error e incertidumbre el cierre conserva la recomendacion de
comprobar el listado; el archivo no se borra mientras el dialogo permanezca
abierto.

En `confirmed`, mostrar `packageId`, conteo `services.length` y folios
`serviceOrder` en lista con overflow interno si son muchos. El contenedor
llama `controller.refetch()` una sola vez al confirmar; conserva URL,
criterios y preferencias. No navegar automaticamente: filtros activos pueden
ocultar los nuevos registros. En `server-error`, mostrar status y mensaje
legible, advirtiendo posible carga parcial. En `uncertain`, explicar que no
se sabe si llego, se proceso o se perdio la respuesta; indicar revisar el
listado antes de repetir. En error e incertidumbre una accion `Verificar en el
listado` cierra el dialogo y ejecuta `controller.refetch()` sin reenviar el
ZIP. No usar toast como unico feedback.

## Accesibilidad, Responsive Y Tema

`DialogTitle` y `DialogDescription` identifican accion y contexto.
`aria-live="polite"` para progreso y exito; `role="alert"` para error o
incertidumbre. Al terminar, mover foco al encabezado del resultado o al boton
de cierre; al cerrar, restaurar foco al trigger. El dialogo controla su
overflow interno en movil sin crear segundo scroll de pagina. Usar clases y
tokens semanticos existentes (`background`, `foreground`, `muted`,
`destructive`, `border`, etc.), sin colores ni assets hardcodeados. Validar
temas activos y objetivos tactiles. No se instala otro vendor ni dependencia.

## Registro De Artefactos

| Artefacto                    | Tipo                          | Ubicacion                                                                                           | Responsabilidad                                                                 | Dependencias                                    | Estado         |
| ---------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- | -------------- |
| Ruta de listado              | Ruta App Router               | `src/app/dashboard/service-packages-records/page.tsx`                                               | Conserva READ y workspace existentes.                                           | Boundary, container.                            | reuse          |
| Shell, breadcrumb y scroll   | Configuracion                 | `src/components/dashboard-shell/migration/dashboardShellMigration.ts`                               | Sin cambios de ruta ni scroll.                                                  | Dashboard shell.                                | not_applicable |
| Contenedor de listado        | Componente de modulo          | `src/components/servicePackagesRecords/ServicePackagesRecordsContainer.tsx`                         | Compone accion, dialogo y refetch.                                              | List controller, table, dialog.                 | modify         |
| Tabla de listado             | Componente de modulo          | `src/components/servicePackagesRecords/ServicePackagesRecordsTable.tsx`                             | Recibe `primaryActions` y lo pasa a toolbar.                                    | DataTable.                                      | modify         |
| Dialogo ZIP                  | Componente de modulo          | `src/components/servicePackagesRecords/ServicePackageZipUploadDialog.tsx`                           | Seleccion, animacion local, despacho de thunk, feedback y accesibilidad.        | Dialog, AttachmentUpload, Button, Redux upload. | new            |
| Dialogo de adjuntos          | Componente compartido         | `src/components/attachments/AttachmentUploadDialog.tsx`, `index.ts`                                 | Conserva el flujo existente de seleccion local y confirmacion.                  | Sin cambios.                                    | reuse          |
| Cliente ZIP                  | Cliente API del feature       | `src/features/servicePackagesRecords/servicePackageZipUpload.ts`                                    | POST multipart y clasificacion de respuesta.                                    | API_BASE_URL, handoff API.                      | new            |
| Thunk de upload              | Thunk de feature              | `src/features/servicePackagesRecords/servicePackagesRecordsThunks.ts`                               | Coordina mutacion y resultado tipado.                                           | Cliente ZIP, `createAsyncThunk`.                | modify         |
| Estado de upload             | Slice de feature              | `src/features/servicePackagesRecords/servicePackagesRecordsSlice.ts`                                | Rama serializable `upload`, requestId y reset.                                  | Thunk de upload.                                | modify         |
| Export publico del feature   | Barrel                        | `src/features/servicePackagesRecords/index.ts`                                                      | Expone thunk, reset y tipo de resultado.                                        | Thunk, slice, tipos.                            | modify         |
| Copia ES                     | i18n                          | `src/locales/es/servicePackagesRecords.json`                                                        | Mensajes del flujo en espanol.                                                  | Claves del dialogo.                             | modify         |
| Copia EN                     | i18n                          | `src/locales/en/servicePackagesRecords.json`                                                        | Mensajes del flujo en ingles.                                                   | Claves del dialogo.                             | modify         |
| DataTable y toolbar          | Componente compartido         | `src/components/data-table/DataTable.tsx`, `DataTableToolbar.tsx`, `DataTable.types.ts`             | Contrato `primaryActions` existente.                                            | Ninguna modificacion.                           | reuse          |
| Selector vendor              | Componente vendor reutilizado | `src/components/vendor/beui/attachment-upload/motion/attachment-upload.tsx`                         | Seleccion local; textos opcionales para el limite y accesibilidad.              | Defaults existentes conservados.                | modify         |
| Dialog y botones             | Primitives UI                 | `src/components/ui/dialog.tsx`, `src/components/ui/button.tsx`                                      | Foco, modal y accion en carga.                                                  | Tokens semanticos.                              | reuse          |
| Controller de lista          | Hook de modulo                | `src/components/servicePackagesRecords/useServicePackagesRecordsListController.ts`                  | `refetch` existente sin alterar criterios.                                      | Redux y tabla existentes.                       | reuse          |
| Boundary de permisos         | Acceso existente              | `src/app/dashboard/service-packages-records/page.tsx`                                               | READ de la vista, no auth del POST.                                             | `SERVICE_PACKAGES.READ`.                        | reuse          |
| Tokens y tema                | Estilo existente              | `docs/ui/tokens.md`                                                                                 | Reglas actuales; no nuevos tokens.                                              | Temas activos.                                  | reuse          |
| Handoff de carga             | Documento vivo API            | `../org-admin-suite-api/docs/frontend/service-package-upload-handoff.md`                            | Contrato remoto consumido.                                                      | Controller y presenter API vigentes.            | new            |
| Catalogo de autorizacion API | Documento vivo API            | `../org-admin-suite-api/docs/authorization/feature-permission-catalog.md`                           | Al implementar, indicar que tambien lo consume backoffice sin atribuirle guard. | Endpoint publico vigente.                       | modify         |
| Matriz manual                | Verificacion                  | `.specs/2026/2026-10/2026-10-17_1703_service-package-zip-upload-backoffice/08-manual-validation.md` | Evidencia por escenario, rol y viewport.                                        | Usuario y API accesible.                        | new            |
| Playgrounds y experiments    | UI de laboratorio             | `src/app/dashboard-playground/`                                                                     | No se necesitan; patron ya adoptado.                                            | Ninguna.                                        | not_applicable |
| Legacy y limpieza diferida   | Compatibilidad                | Ninguna ruta nueva                                                                                  | No hay artefactos legacy a mantener ni limpiar.                                 | PWA sin cambios.                                | not_applicable |
| Normas UI compartidas        | Documentacion viva            | `docs/ui/`                                                                                          | Sin cambio de contrato compartido; no actualizar por caso local.                | Guidelines vigentes.                            | not_applicable |

No se crean schema, cache, store, slice independiente, token, theme, asset ni
capa de estado transversal. La coordinacion de la animacion del ZIP queda
dentro de su dialogo especializado.

## Validacion Por Riesgo

| Riesgo                        | Evidencia                                                                                          | Responsable       |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | ----------------- |
| Payload o envelope incorrecto | Inspeccion de request y resultado real; `FormData` sin Content-Type manual.                        | Agente y usuario. |
| Duplicados por incertidumbre  | Simular corte, comprobar copy y ausencia de reintento automatico.                                  | Usuario.          |
| Carga parcial                 | Error HTTP tras procesamiento si es reproducible; confirmar advertencia sin atribuir conteo falso. | Usuario.          |
| Acceso y refetch              | Cuenta READ, ruta, lista filtrada y refresco tras 201.                                             | Usuario.          |
| Foco, movil y temas           | Matriz en `08-manual-validation.md`.                                                               | Usuario.          |

Build y lint verifican integracion estatica; no sustituyen las pruebas
manuales de red y procesamiento real. No se introducen unit tests en esta
iniciativa; el riesgo se cubre con inspeccion de contrato y escenarios
manuales reproducibles.
