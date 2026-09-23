# Implementation Breakdown: DataTable Row Actions

## Slice 1. Contract And Shared Primitives

### Objective

Crear contratos tipados, primitive `ContextMenu` y dialogo destructivo sin
adoptarlos todavia en una tabla productiva.

### Artifacts

- `DataTable.types.ts`
- `src/components/ui/context-menu.tsx`
- `src/components/shared/DestructiveConfirmationDialog.tsx`

### Limits

- No se modifica `DataTableRow` ni la tabla administrativa.
- No se dispara eliminacion, navegacion ni se cambia Redux.

### Verification

- Typecheck y lint dirigido.
- Revisar foco, Escape, clic exterior y botones deshabilitados del dialogo.

## Slice 2. Generic Row Interaction

### Objective

Integrar columna de acciones, dropdown, contexto y doble clic seguro desde el
contrato `rowActions`.

### Artifacts

- `DataTable.tsx`
- `DataTableContent.tsx`
- `DataTableColumnHeaders.tsx`
- `DataTableBody.tsx`
- `DataTableLoadingRows.tsx`
- `DataTableRow.tsx`
- `DataTableRowActions.tsx`
- `DataTableRowContextMenu.tsx`
- `DataTableCatalogPlayground.tsx`

### Limits

- No se modifica el modulo administrativo ni sus permisos.
- No se agregan acciones masivas, edicion de celda ni rutas.

### Verification

- Verificar actions presentes, ausentes y destructivas en Component Lab.
- Verificar dropdown, clic derecho, Escape, foco, doble clic y exclusiones de
  controles interactivos.

## Slice 3. Administrative Adoption

### Objective

Adoptar acciones autorizadas en Registros administrativos y conectar la
eliminacion al dialogo Next Dashboard.

### Artifacts

- `CustomerServiceRecordsContainer.tsx`
- Traducciones `customerServiceRecords` en ambos idiomas
- `docs/ui/patterns/data-table.md`
- `08-manual-validation.md`
- `05-progress.md`

### Limits

- No se modifican API, Redux, thunk, rutas de detalle/edicion ni el Sheet
  legacy.

### Verification

- Validar roles de lectura, actualizacion y eliminacion.
- Validar navegacion por folio, menu y doble clic; eliminacion confirmada,
  pending, exito y error.

### Closure

La primera adopcion usa el patron compartido sin regresiones de filtros,
expansion, scroll, paginacion ni responsive.
