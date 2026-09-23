# Technical Design: Customer Service Records Administrative List Migration

## Artifact Registry

| Artifact                                      | Responsibility                                                                         | Boundary                                   |
| --------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------ |
| Contenedor nuevo de Registros de servicio     | Adapta store, URL, permisos, thunks y datos remotos al `DataTable`.                    | Conserva HTTP fuera de presentación.       |
| Column factory nueva de Registros de servicio | Declara `DataTableColumn` y celdas multilínea administrativas.                         | No conoce URL, store ni thunks.            |
| `DataTable`                                   | Renderiza header, toolbar, settings, estados, tabla, scroll y paginación.              | No conoce el módulo ni su API.             |
| `CustomerServiceRecordsFilterDialog`          | Mantiene borrador de filtros y entrega cambios aplicados al contenedor.                | No se mueve ni se incorpora a `DataTable`. |
| Store existente de tabla                      | Conserva estado local neutral de paginación, sorting, búsqueda, filtros y visibilidad. | No conserva colección remota.              |

## Column Model

| Column                    | Presentation                                                        | Sorting                          |
| ------------------------- | ------------------------------------------------------------------- | -------------------------------- |
| Folio                     | Enlace explícito al detalle.                                        | `service_number`                 |
| Cliente y activo          | Cliente destacado; activo e identificador en línea secundaria.      | No en v1.                        |
| Tipo de servicio          | Etiqueta de tipo.                                                   | No en v1.                        |
| Estado                    | Estado operativo.                                                   | `operational_status`             |
| Compromiso con cliente    | Fecha estimada y semáforo recibido.                                 | `estimated_customer_delivery_at` |
| Proveedor y retorno       | Proveedor, fecha estimada y semáforo; estado neutral sin proveedor. | `provider_estimated_return_at`   |
| Solicitud o actualización | Fechas secundarias del registro.                                    | `requested_at`                   |

## DataTable Composition

- `rowLayout="multiline"`, `density="comfortable"`.
- `scrollRegion={{ maxHeight: 'available', desktopOnly: true, overscrollBehavior: 'none' }}`.
- `stickyHeader={{ desktopOnly: true }}`.
- `settingsPlacement="toolbar"` y visibilidad de columnas controlada por el
  store del módulo.
- Header: título, resumen y acción Crear cuando `CREATE` esté permitido.
- Toolbar: búsqueda global, `CustomerServiceRecordsFilterDialog` y settings.
- No se configura expansión, selección, acciones, fullscreen ni edición inline.

## State Translation

El store de Zustand existente se ajusta al patrón de Seguimiento de servicios:
página, límite, búsqueda, búsqueda aplicada, sorting neutro (`columnId` y
`direction`), columnas visibles e inicialización. El contenedor traduce el
orden único al contrato `CustomerServiceRecordsListSort` antes del thunk. La
utilidad de query existente acepta y serializa un máximo de un criterio de
orden y un período.

Redux no cambia: slice, thunks y colección remota continúan siendo propietarios
del ciclo de solicitud, filas, error y metadatos de paginación.

La visibilidad inicial incluye las columnas aprobadas. Las columnas secundarias
pueden ocultarse desde settings, pero Folio conserva visibilidad obligatoria.
