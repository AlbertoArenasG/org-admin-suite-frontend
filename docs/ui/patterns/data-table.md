# DataTable

El componente compartido `src/components/data-table/DataTable.tsx` usa
`@tanstack/react-table` v9 y es la base para nuevas colecciones remotas. No
reemplaza una primitive de shadcn ni recibe una instancia de TanStack creada
por el consumidor.

La vista conserva API client, thunks, slice y permisos. Su contenedor adapta
la respuesta, mantiene query y preferencias locales, y entrega filas,
columnas y callbacks controlados al componente. `DataTable` no ejecuta HTTP,
no interpreta permisos ni guarda colecciones remotas.

## Celdas reutilizables

`src/components/data-table/cells/` concentra contenido de celda que no conoce
el dominio. `BadgeCell` recibe etiqueta, color e icono opcionales, y expone las
variantes `outline`, `subtle` y `solid`. La vista decide el significado del
estado y el color; el componente no codifica semaforos ni reglas de negocio.

Las tablas legacy continúan importando exclusivamente
`@tanstack/react-table-v8`. No se migran ni se cambian sus contratos al añadir
una tabla nueva. La densidad global vive en
`useDataTablePreferencesStore`; los anchos de columna no se persisten en v1.

La vista puede declarar una altura numérica o `stickyHeader: { maxHeight:
'available' }`. El modo `available` mide el espacio real desde las filas hasta
el borde inferior del scroller de página, descontando su padding inferior; no
usa una resta fija ligada al shell.

## Resaltado De Búsqueda

`searchHighlight` es una capacidad visual de `DataTable`. La vista le entrega
el término aplicado y, opcionalmente, los `columnIds` que deben resaltar; sus
celdas lo reciben mediante `context.highlight(value)`. No filtra datos ni
conoce el origen de la búsqueda.

La comparación ignora mayúsculas y acentos, pero el marcado conserva el texto
original. Por ejemplo, una búsqueda `traccion` resalta `tracción`. Las vistas
que adopten una búsqueda remota con esa semántica deben reutilizar este
contrato en lugar de implementar su propio resaltado.

## Altura de filas

Solo existen dos alturas estandar: `compact` y `comfortable`. Las filas con
contenido de dos líneas usan siempre `comfortable`; una celda no puede crecer
como tarjeta ni introducir una tercera altura. Distribuir datos adicionales en
columnas horizontales, expansión o detalle de fila.

Antes de adoptar el patrón, consultar la spec
`generic-data-table-foundation`: define estados remotos, toolbar, expansión,
selección, sticky header, fullscreen y los puntos de extensión diferidos para
virtualización e infinite scrolling.
