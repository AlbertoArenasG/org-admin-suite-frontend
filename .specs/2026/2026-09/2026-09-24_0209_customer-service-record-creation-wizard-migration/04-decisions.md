# Decisions: Customer Service Record Creation Wizard Migration

## 2026-09-24: Creation Surface

`Nuevo registro` se muestra como boton directo al extremo derecho de la
`DataTableToolbar`, despues de configuracion de tabla. Este recurso solo tiene
una accion primaria en esta vista.

Las acciones primarias de una vista de tabla pueden vivir en el header de
vista, `DataTableHeader` o `DataTableToolbar`. La ubicacion se decide en la
spec de cada vista; no se establece una regla que predetermine que tipo de
accion corresponde a cada superficie.

Como convencion tentativa, no obligatoria: una accion primaria se presenta
como boton directo; varias pueden usar un split button que conserva la accion
prioritaria en el segmento principal y agrupa las demas.

El editor de roles garantiza que seleccionar `CREATE`, `UPDATE` o `DELETE` en
un modulo con `READ` incorpora y conserva `READ`. No se crea una entrada
alternativa para `CREATE` sin lectura: esa combinacion no puede existir para
este modulo.

## 2026-09-24: Wizard And Form Scope

La creacion usa dialogo y Stepper controlado de tres pantallas:

1. Solicitud y cliente.
2. Equipo unico.
3. Resumen y confirmacion.

Se justifica el dialogo multi-seccion como una excepcion acotada al recurso:
son dos pasos de captura breves y un resumen, no un formulario largo de ruta.
No se reutiliza `ResourceFormOverlay` ni el formulario legacy, pues sus
contratos y alcance no coinciden con el POST minimo de alta.

## 2026-09-24: Date Field Independence

Se crea un campo de fecha para formularios independiente de
`TableFilterDateInput`. Ambos pueden coincidir hoy en mascara, formato y
calendario, pero los filtros y los formularios evolucionan con contratos
distintos. Esta spec no modifica el campo de filtros.

## 2026-09-24: State Ownership

React Hook Form posee draft, paso activo, errores de campo y suciedad dentro
del wizard. No se introduce store Zustand ni estado Redux para esos valores.
Redux conserva catálogos remotos, usuarios relacionados y estado de mutacion.

La creacion obtiene `CreateCustomerServiceRecordPayload` y
`buildCreateCustomerServiceRecordBody`; la edicion mantiene
`CustomerServiceRecordMutationPayload` y `buildUpdateBody`. Separarlos evita
que cambios futuros de edicion alteren el POST de alta.

## 2026-09-24: Draft Lifecycle

- Draft vacio: cerrar sin confirmacion.
- Draft sucio: mostrar confirmacion in-place dentro del dialogo, sin overlay
  anidado.
- Descartar confirmado: limpiar formulario, errores y paso; despues cerrar.
- Seguir editando: restaurar exactamente el paso y draft anteriores.
- Error remoto: conservar dialogo y draft.
- Exito: limpiar antes de toast y navegacion.

## 2026-09-24: Legacy Replacement

La ruta `/dashboard/customer-service-records/new` y la entrada lateral que la
abre se eliminan; no se conserva redirect. La ruta `/[recordId]` sigue siendo
el destino temporal de exito hasta la siguiente migracion de detalle/edicion.
