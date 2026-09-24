# Definition: Customer Service Record Creation Wizard Migration

## Initiative

- Name: `customer-service-record-creation-wizard-migration`
- Date: `2026-09-24`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La creacion de registros de servicio a clientes sigue en una ruta y formulario
legacy. Su payload contiene campos que ya no pertenecen al POST minimo vigente,
la experiencia no adopta el shell ni los componentes de Next Dashboard y la
accion de alta vive fuera del contexto donde se gestionan los registros.

## Expected Outcome

Desde la tabla administrativa, un usuario con `CREATE` abre un dialogo de
creacion breve con wizard controlado de tres pasos. El flujo solicita solo los
datos requeridos por el POST vigente, crea exactamente un equipo y, al tener
exito, informa con `showToast` y navega a la actual ruta legacy de detalle del
registro creado.

## Mandato De Migracion

Esta spec sustituye totalmente la funcionalidad de **creacion** legacy de
registros de servicio a clientes. No conserva su ruta, entrada de navegacion,
modo de formulario, payload, feedback ni componentes de creacion. No se
agregan redirects, wrappers, adaptadores ni compatibilidad con la entrada
legacy.

Los archivos legacy que tambien sirven a la edicion no se eliminan como
archivos: se les retira exclusivamente la rama de creacion y quedan con
contrato de edicion. La ruta de detalle y la de edicion son excepciones
explicitas, fuera de esta migracion, y permanecen sin adoptar sus patrones para
la funcionalidad nueva.

| Retiro legacy obligatorio                                              | Sustitucion Next Dashboard                                            |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `/dashboard/customer-service-records/new`                              | Boton `Nuevo registro` en `DataTableToolbar.primaryActions`.          |
| Entrada lateral `customerServiceRecordsCreate`                         | Ninguna; el toolbar es la unica entrada de alta.                      |
| Rama `mode="create"` de `CustomerServiceRecordFormPageContainer`       | `CustomerServiceRecordCreateDialog` con wizard local.                 |
| Rama `mode="create"` de `CustomerServiceRecordForm`                    | Tres pasos propios del wizard y resumen de solo lectura.              |
| `CustomerServiceRecordMutationPayload` y `buildMutationBody` para POST | `CreateCustomerServiceRecordPayload` y builder exclusivo de creacion. |
| `useSnackbar` del alta legacy                                          | `showToast` tras creacion exitosa.                                    |

Antes de codificar se debe contrastar esta tabla con el repositorio. Al cerrar,
se debe buscar cada retiro listado y confirmar que no subsiste en el flujo de
creacion.

`CustomerServiceRecordMutationPayload` y el mapeo amplio sobreviven solo donde
edicion legacy los requiere. El retiro obligatorio es su uso por el POST de
creacion; no se elimina ni modifica la funcionalidad de actualizacion fuera de
alcance.

## Included Scope

- Agregar una accion primaria `Nuevo registro` al extremo derecho de la
  toolbar de la tabla administrativa, visible solo con `CREATE`.
- Extender el contrato de `DataTableToolbar` con un slot opcional y generico
  para acciones primarias, sin imponer la ubicacion de futuras acciones.
- Crear el dialogo con wizard controlado de tres pasos: solicitud y cliente,
  equipo, y resumen de confirmacion.
- Crear un campo de fecha reutilizable para formularios, independiente de
  `TableFilterDateInput`, con entrada manual `dd/mm/aaaa`, diagonales
  automaticas y calendario de fecha unica.
- Crear un payload de creacion minimo, su schema y su adaptador HTTP sin
  modificar el payload amplio que mantiene la edicion legacy.
- Usar las opciones existentes de tipos de servicio, clientes y usuarios
  relacionados del cliente seleccionado.
- Implementar validacion por paso, envio, error recuperable, descarte de draft
  y navegacion posterior a la creacion.
- Retirar la ruta, acceso lateral y ramas `mode="create"` legacy de creacion;
  los componentes compartidos permanecen solo para edicion.
- Actualizar los contratos vivos de acciones primarias, DataTable y controles
  de formularios.

## Excluded Scope

- Migrar la ruta de detalle o edicion a Next Dashboard.
- Cambiar el endpoint, permisos efectivos o respuesta del backend.
- Crear o editar observaciones generales o del equipo durante el wizard.
- Admitir mas de un equipo en la interfaz, aunque el backend acepte un arreglo.
- Acciones masivas, seleccion de filas o una regla rigida que decida la
  superficie de acciones primarias en todas las tablas.
- Reutilizar, redisenar o conservar el formulario y la ruta legacy de creacion.

## Constraints

- La fecha de solicitud inicia con la fecha vigente y es obligatoria.
- El primer paso contiene tipo de servicio, fecha, cliente y usuarios
  relacionados. Cliente es obligatorio; usuarios es opcional y se envia como
  arreglo vacio cuando no se elige ninguno.
- El selector de usuarios no se muestra hasta que exista cliente. Cambiar de
  cliente limpia usuarios y carga las opciones correspondientes.
- El segundo paso admite exactamente un equipo; nombre, identificador, marca,
  modelo y numero de serie son obligatorios.
- La tercera pantalla es solo resumen y confirmacion: no agrega campos.
- Los campos de los dos pasos de captura usan orientacion horizontal en
  escritorio y se apilan en movil. Cada grupo de campos usa `FieldGroup`, que
  es el contenedor requerido por `FormField orientation="responsive"`.
- Los comboboxes de tipo de servicio, cliente y usuarios relacionados abren de
  forma estable dentro del dialogo y sus listas conservan scroll interno cuando
  exceden la altura disponible.
- El draft vive dentro del wizard mediante React Hook Form; no se persiste en
  Redux, Zustand, URL ni almacenamiento local.
- Si el wizard esta vacio, X, Cancelar o clic exterior lo cierran sin preguntar.
  Si contiene cambios, el mismo dialogo entra temporalmente a confirmacion de
  descarte; no se apila un segundo dialogo.
- Solo confirmar descarte o una creacion exitosa limpia draft, errores y paso
  activo. Un error remoto conserva los datos para reintentar.
- Durante el POST no se puede cerrar, navegar ni enviar dos veces.
- `showToast` es el feedback global del flujo nuevo de Next Dashboard.
  `SnackbarProvider` y `useSnackbar` no participan en la creacion migrada.
- La ruta de detalle legacy permanece como destino temporal de exito hasta la
  siguiente spec de detalle/edicion.

## Acceptance Criteria

- Con `READ` sin `CREATE`, la tabla no muestra `Nuevo registro`; con `CREATE`,
  el boton aparece despues de configuracion de columnas.
- El wizard abre en el primer paso con fecha vigente, conserva sus valores al
  recorrer pasos y bloquea avance hasta validar los campos obligatorios de cada
  paso.
- El input de fecha permite calendario y escritura valida en `dd/mm/aaaa`,
  incluida la insercion automatica de diagonales.
- Los comboboxes no producen parpadeo, cierre ni desplazamiento competitivo
  del dialogo; cliente y usuarios relacionados permiten recorrer listas largas.
- Los usuarios relacionados aparecen solo despues de seleccionar cliente,
  cambian con el cliente y pueden quedar vacios.
- El POST contiene exclusivamente `service_type_code`, `requested_at`,
  `customer`, un arreglo `assets` de un elemento y `observations: null` tanto
  para el registro como para su equipo, conforme al contrato vigente.
- El resumen reproduce los datos a crear sin controles editables y `Crear
registro` ejecuta una sola mutacion.
- Exito muestra toast y navega a `/dashboard/customer-service-records/[id]`.
  Error conserva dialogo y draft.
- Cerrar un draft no vacio requiere confirmacion en el mismo dialogo; confirmar
  descarte limpia el estado. Cerrar uno vacio no pregunta.
- La ruta `/dashboard/customer-service-records/new` y su enlace lateral dejan
  de participar en la experiencia productiva.
- `CustomerServiceRecordFormPageContainer` y `CustomerServiceRecordForm` no
  conservan `mode="create"`, ni el flujo nuevo invoca `useSnackbar`.
- Desktop, movil, teclado, foco, permisos, carga de opciones y errores remotos
  se validan manualmente. No se crean pruebas unitarias.

## Open Decisions

Ninguna. El registro de artefactos, los contratos, las decisiones, las slices
y la matriz de validacion estan completos.
