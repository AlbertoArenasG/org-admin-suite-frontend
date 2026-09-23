# Decisions: DataTable Responsibility Separation

## Decision 01. Refactor Preservador De Comportamiento

### Decision Final

La iniciativa solo reorganiza responsabilidades internas. No agrega, elimina
ni modifica capacidades de `DataTable`, incluidos `getRowActions`, seleccion,
expansion, settings, scroll, fullscreen y highlight.

Las vistas consumidoras no se modifican: el barrel publico conserva
`DataTable`, `DataTableColumn` y `DataTableProps` con la misma semantica.

### Status

`approved`

## Decision 02. Padres De Composicion

### Options

1. Extraer solo hojas y dejar todo el JSX estructural en `DataTable`.
2. Crear padres pequenos de composicion para las dos superficies principales.
3. Extraer una cantidad mecanica de archivos sin una jerarquia definida.

### Decision Final

Se aprueba la opcion 2. `DataTableChrome` compone header superior, toolbar y
settings. `DataTableContent` compone la tabla semantica, encabezados de
columnas y cuerpo. Estos padres no coordinan TanStack ni efectos; su proposito
es limitar y hacer visible la composicion de cada superficie.

### Status

`approved`

## Decision 03. Nombres De Superficies

### Decision Final

Los nombres distinguen el header superior de los encabezados de columnas:

- `DataTableHeader`: titulo, acciones primarias, estado de carga y controles
  superiores entregados por el padre.
- `DataTableToolbar`: busqueda, filtros y regiones `leading` y `trailing`.
- `DataTableColumnHeaders`: `<thead>`, sorting, resize y seleccion total.
- `DataTableBody`: `<tbody>`, estados de filas, seleccion, expansion e
  indicadores visuales.

No se repite `Table` en nombres como `DataTableTableBody`; el prefijo
`DataTable` ya identifica el contexto.

### Status

`approved`

## Decision 04. Limites Para Acciones De Fila

### Decision Final

Menus de acciones, boton de tres puntos, clic secundario, permisos de accion y
navegacion desde filas pertenecen a una spec posterior. Esta iniciativa solo
preserva el slot `getRowActions` existente sin introducir ningun contrato
nuevo.

### Status

`approved`
