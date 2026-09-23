# Technical Design: Customer Service Records Administrative List Migration

## Artifact Registry

| Artifact                                      | Responsibility                                                                         | Boundary                                   |
| --------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------ |
| Contenedor nuevo de Registros de servicio     | Adapta store, URL, permisos, thunks y datos remotos al `DataTable`.                    | Conserva HTTP fuera de presentación.       |
| Column factory nueva de Registros de servicio | Replica las celdas de Seguimiento y añade proveedor al final.                          | No conoce URL, store ni thunks.            |
| `DataTable`                                   | Renderiza header, toolbar, settings, estados, tabla, scroll y paginación.              | No conoce el módulo ni su API.             |
| `CustomerServiceRecordsFilterDialog`          | Mantiene borrador de filtros y entrega cambios aplicados al contenedor.                | No se mueve ni se incorpora a `DataTable`. |
| Store existente de tabla                      | Conserva estado local neutral de paginación, sorting, búsqueda, filtros y visibilidad. | No conserva colección remota.              |

## Column Model

| Column                    | Presentation                                                 | Sorting                          |
| ------------------------- | ------------------------------------------------------------ | -------------------------------- |
| Folio                     | Enlace explícito con la celda monoespaciada de Seguimiento.  | `service_number`                 |
| Equipo y servicio         | Equipo destacado y tipo de servicio en línea secundaria.     | No en v1.                        |
| Estado                    | Badge con el mismo icono de estado operativo de Seguimiento. | No en v1.                        |
| Seguimiento               | Badge de semáforo.                                           | No en v1.                        |
| Recolección               | Fecha relativa.                                              | `received_at`                    |
| Entrega                   | Fecha relativa y etiqueta Estimada o Entregada.              | `estimated_customer_delivery_at` |
| Detalles de equipo        | Marca/modelo y serie en la misma composición de Seguimiento. | No en v1.                        |
| Cliente                   | Texto truncado.                                              | No en v1.                        |
| Seguimiento con proveedor | Badge de semáforo o estado sin proveedor.                    | No en v1.                        |
| Retorno de proveedor      | Fecha relativa; columna final.                               | `provider_estimated_return_at`   |

## DataTable Composition

- `rowLayout="multiline"`, `density="comfortable"`.
- `scrollRegion={{ maxHeight: 'available', desktopOnly: true, overscrollBehavior: 'none' }}`.
- `stickyHeader={{ desktopOnly: true }}`.
- `settingsPlacement="toolbar"` y visibilidad de columnas controlada por el
  store del módulo.
- La ruta se registra en Next Dashboard con `scrollMode="table-workspace"` y
  usa `DashboardTableWorkspace`; no añade header local a `DataTable`.
- Toolbar: búsqueda global, `CustomerServiceRecordsFilterDialog` y settings,
  sin icono decorativo adicional junto al filtro.
- La expansión se habilita solo para filas con observaciones generales o de
  equipo; conserva el mismo detalle visual de Seguimiento. No se configuran
  selección, acciones, fullscreen ni edición inline.

## State Translation

El store de Zustand existente se ajusta al patrón de Seguimiento de servicios:
página, límite, búsqueda, búsqueda aplicada, sorting neutro (`columnId` y
`direction`), columnas visibles e inicialización. El contenedor traduce el
orden único al contrato `CustomerServiceRecordsListSort` antes del thunk. La
utilidad de query existente acepta y serializa un máximo de un criterio de
orden y un período.

Redux conserva el mismo slice y ciclo de solicitud. El mapper de respuesta del
thunk de listado se amplía para proyectar campos ya presentes en el endpoint:
recolección, entrega real, marca, modelo y serie. La colección remota, error y
metadatos de paginación mantienen su responsabilidad actual.

La visibilidad inicial incluye las columnas aprobadas. Las columnas secundarias
pueden ocultarse desde settings, pero Folio conserva visibilidad obligatoria.
