# Analysis: DataTable Row Actions

## Current State

- `DataTable` tiene el prop publico `getRowActions`, pero no tiene consumidores
  ni contrato tipado de acciones, menu contextual o activacion primaria.
- `DataTableContent`, `DataTableColumnHeaders`, `DataTableBody`,
  `DataTableLoadingRows` y `DataTableRow` ya separan el ownership necesario
  para integrar una columna y una interaccion de fila sin concentrar codigo en
  el coordinador.
- El folio de Registros administrativos ya es un enlace a
  `/dashboard/customer-service-records/[recordId]`; conserva su papel como
  acceso primario de detalle.
- La pagina administrativa se ejecuta dentro de `DashboardViewAccessBoundary`
  con `READ`. Su contenedor puede obtener `UPDATE` y `DELETE` mediante
  `useDashboardViewAccess().can(operation)` sin duplicar la resolucion de
  permisos.
- `deleteCustomerServiceRecord` y su slice ya resuelven la mutacion: al
  completarse elimina la fila del listado y conserva mensajes/error de la
  mutacion. No se requieren endpoints, thunks, reducers ni stores nuevos.

## Existing UI Foundations

- `DropdownMenu` y `Dialog` ya son primitives locales basadas en Radix.
- `@radix-ui/react-context-menu` ya es una dependencia transitiva disponible
  a traves de `radix-ui`; se creara un wrapper local para mantener clases,
  slots y variantes consistentes con `DropdownMenu`.
- El modulo tiene un `CustomerServiceRecordDeleteDialog` legacy basado en
  `Sheet`. Permanece sin modificar para rutas legacy; no se reutiliza en Next
  Dashboard.
- `Dialog` presenta overlay, foco, Escape y cierre exterior mediante Radix.

## Risks And Controls

| Riesgo                                        | Control                                                                                                          |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Dos menus difieren en permisos u orden        | Una lista resuelta de `rowActions` alimenta dropdown y menu contextual.                                          |
| Doble clic activa detalle al operar controles | El handler ignora eventos originados en elementos interactivos.                                                  |
| Columna sin acciones visibles                 | Solo se monta cuando se entrega `rowActions`; una fila sin acciones deja su celda vacia sin trigger ni contexto. |
| Confirmacion destructiva acoplada a tabla     | `DataTable` ejecuta handlers; dialogo, thunk, snackbar y estado de carga pertenecen al contenedor de modulo.     |
| Regresion mobile/scroll                       | Trigger visible en la columna; contexto es complemento de escritorio y el scroll horizontal local se conserva.   |

## Compatibility

- Las rutas actuales de detalle y edicion no cambian.
- El `getRowActions` sin consumidores se elimina a favor de `rowActions`.
- Las dos tablas productivas existentes y Component Lab mantienen el mismo
  barrel `@/components/data-table`.
- Tablas que no entreguen `rowActions` no renderizan columna de acciones,
  context menu ni doble clic de detalle.
