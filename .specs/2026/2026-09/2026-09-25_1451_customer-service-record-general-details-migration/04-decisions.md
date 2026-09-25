# Decisions: Customer Service Record General Details Migration

## 2026-09-25: Incremental Detail Migration

La migración se divide por bloques backend. Esta spec adopta únicamente
`details`; cliente, proveedor, activos y documentos se definen después en
specs independientes. Cada bloque tendrá formulario, draft, validación,
mutación y modo de edición propios.

Esto evita un formulario global prematuro y permite que el primer bloque sea
referencia verificable de los siguientes.

## 2026-09-25: Route And Authorization

La ruta canónica será `/dashboard/customer-service-records/[recordId]`. El
parámetro conserva el identificador opaco; el breadcrumb presenta el folio
`Registro {serviceNumberDisplay}`. No se agrega header de página.

El `Workspace Header` conserva la propiedad del breadcrumb. Se extiende el
shell con un contexto de segmentos dinámicos: la ruta registra el folio una
vez que carga y restablece los segmentos estáticos al desmontarse. Así no se
duplica contexto de ruta dentro del contenido ni se cambia el contrato de
`Page Header`.

`DashboardViewAccessBoundary` exige `CUSTOMER_SERVICE_RECORDS/READ` y
`useDashboardViewAccess().can('UPDATE')` controla la posibilidad de editar.
No se replica autorización legacy ni se construye un guard local alternativo.

## 2026-09-25: Feature Ownership

Todos los endpoints, mapeos, tipos y estado de la vista individual viven en
`customer-service-records`. Un thunk representa un caso de uso cohesionado del
módulo, no una regla mecánica de un endpoint por thunk ni una dependencia de
otro feature.

El thunk de opciones del bloque consulta tipos de servicio desde este feature.
El catálogo de estado operativo es local, tipado y traducido porque no existe
endpoint backend de opciones. No se leen slices ni se despachan thunks de
clientes, proveedores, usuarios u otros módulos.

## 2026-09-25: Form Behavior

`Detalles generales` adopta la receta de la vista editable de usuario:
`ResourceFormRoute`, `ResourceFormFrame`, `ResourceFormSection`,
`ResourceFormActions`, `MutationFeedback` y `MutationRecovery`. Es una
referencia de UX y composición, no una reutilización de su código o
dependencias.

El éxito mantiene feedback durante 800 ms antes de regresar a lectura. Error
remoto conserva el draft. Cancelar restaura el último valor canónico del bloque.

## 2026-09-25: Deferred Navigation

La navegación de secciones con scroll-spy se aplaza hasta que exista un segundo
bloque. Cuando se adopte será navegación de anclas semánticas, no ARIA tabs,
porque todas las secciones coexistirán en la misma página.
