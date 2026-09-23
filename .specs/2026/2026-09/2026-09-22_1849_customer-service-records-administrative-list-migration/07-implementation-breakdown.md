# Implementation Breakdown: Customer Service Records Administrative List Migration

## Slice 1. Local State And Columns

- Ajustar store y query existentes al patrón de `DataTable` de Seguimiento.
- Implementar `DataTableColumn` con la composición aprobada de Seguimiento y
  las columnas finales de proveedor.
- Preservar formato de fechas, semáforos, folio, observaciones y campos de
  sorting API.

**Closure:** Redux conserva slice y ciclo remoto; el mapper del thunk expone
campos del endpoint requeridos por las celdas y observaciones. El store de
Zustand conserva estado local neutral y la vista nueva no depende de
componentes de presentación anteriores.

## Slice 2. DataTable Adoption

- Conectar el contenedor y la superficie nuevos a `DataTable`.
- Conectar búsqueda, filtros, conteo, limpieza, settings, header, paginación,
  estados remotos, scroll y sticky header.
- Sustituir la ruta y eliminar los componentes y presentación de la vista
  anterior.

**Closure:** el contenedor nuevo conserva endpoint, fetch, permisos y
navegación; la superficie anterior ya no existe.

## Slice 3. Quality And Promotion

- Validar estados remotos, URL, filtros, sorting, paginación y permisos.
- Validar desktop, móvil, temas, teclado, foco y scroll.
- Registrar la adopción de `DataTable` en documentación viva tras aprobación.
