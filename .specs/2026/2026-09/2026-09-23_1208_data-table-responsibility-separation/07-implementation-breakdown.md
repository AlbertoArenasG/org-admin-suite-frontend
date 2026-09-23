# Implementation Breakdown: DataTable Responsibility Separation

## Slice 1. Contratos Y Utilidades

Task reference: `Cerrar contratos y utilidades puras del catalogo data-table`.

Status: `completed`

### Objective

Separar tipos, labels, highlight y calculo de paginas sin alterar el barrel ni
la salida visible de `DataTable`.

### Artifacts

- `DataTable.tsx`
- `DataTable.types.ts`
- `dataTableHighlight.tsx`
- `dataTablePageNumbers.ts`
- `index.ts`

### Limits

- No se extrae JSX estructural todavia.
- No se modifica ninguna vista consumidora.
- No se modifica `getRowActions`.

### Verification

- Typecheck y lint dirigido.
- Confirmar imports publicos iguales desde el barrel.
- Confirmar highlight exacto y sin acentos en Component Lab y ambas tablas de
  registros.

### Closure

Los helpers dejan de vivir en el componente raiz y la API publica no cambia.

## Slice 2. Chrome, Resultados Y Paginacion

Task reference: `Separar superficies superiores y region de resultados sin alterar su comportamiento`.

Status: `implemented_pending_manual_validation`

### Objective

Extraer superficies de presentacion que no requieren una instancia TanStack:
chrome, settings, region de resultados y paginacion.

### Artifacts

- `DataTable.tsx`
- `DataTableChrome.tsx`
- `DataTableHeader.tsx`
- `DataTableToolbar.tsx`
- `DataTableSettingsMenu.tsx`
- `DataTableResultsRegion.tsx`
- `DataTablePagination.tsx`

### Implementation Note

La utilidad de paginas usa el nombre `dataTablePageNumbers.ts`, en lugar de
`dataTablePagination.ts`, para evitar una colision de nombres que solo difieren
por mayusculas/minusculas con `DataTablePagination.tsx` en sistemas de archivos
no sensibles a casing.

### Limits

- Tabla, encabezados de columnas y filas siguen temporalmente en el raiz.
- No cambian clases, labels ni comportamiento de fullscreen, scroll o settings.

### Verification

- Validar toolbar y header con y sin contenido.
- Validar settings en ambos placements, fullscreen, scroll disponible y
  paginacion.

### Closure

Cada superficie se renderiza por un componente responsable sin cambiar props
de consumo.

## Slice 3. Tabla Semantica Y Recomposicion

Task reference: `Separar tabla semantica, recomponer el coordinador y validar todos los consumidores actuales`.

Status: `implemented_pending_manual_validation`

### Objective

Separar contenido de tabla, encabezados de columnas y cuerpo, y dejar
`DataTable` como coordinador compacto.

### Artifacts

- `DataTable.tsx`
- `DataTableContent.tsx`
- `DataTableColumnHeaders.tsx`
- `DataTableBody.tsx`
- `docs/ui/patterns/data-table.md`
- `08-manual-validation.md`
- `05-progress.md`

### Limits

- No se introduce menu de acciones, contexto, cambios de permisos o edicion.
- No se alteran columnas, celdas, datos ni visuales de los consumidores.

### Verification

- Typecheck, lint dirigido, build y `git diff --check`.
- Ejecutar la matriz manual en Component Lab, Seguimiento y Registros
  administrativos.

### Closure

La estructura final esta documentada, todas las validaciones estan registradas
y no existen regresiones de los consumidores actuales.
