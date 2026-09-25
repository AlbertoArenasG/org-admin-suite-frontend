# DataTable

El componente compartido `src/components/data-table/DataTable.tsx` usa
`@tanstack/react-table` v9 y es la base para nuevas colecciones remotas. No
reemplaza una primitive de shadcn ni recibe una instancia de TanStack creada
por el consumidor.

La vista conserva API client, thunks, slice y permisos. Su contenedor adapta
la respuesta, mantiene query y preferencias locales, y entrega filas,
columnas y callbacks controlados al componente. `DataTable` no ejecuta HTTP,
no interpreta permisos ni guarda colecciones remotas.

## Estructura Interna

`DataTable` es el coordinador del patron: crea la instancia TanStack, conserva
efectos, refs y estado derivado, y entrega props ya resueltas a superficies de
presentacion. La separacion interna es intencional y no modifica el contrato
publico del barrel:

```text
DataTable
  |- DataTableChrome
  |    |- DataTableHeader
  |    |- DataTableToolbar
  |    `- DataTableSettingsMenu
  |- DataTableResultsRegion
  |    |- DataTableScrollControls
  |    `- DataTableContent
  |         |- DataTableColumnHeaders
  |         `- DataTableBody
  |              |- DataTableLoadingRows
  |              `- DataTableRow
  |                   |- DataTableRowActions
  |                   `- DataTableRowContextMenu
  |              `- DataTableEmptyState
  |- DataTableErrorState
  `- DataTablePagination
```

Los subcomponentes no crean instancias de TanStack, no hacen HTTP, no conocen
permisos ni interpretan el dominio de una vista. Las vistas continuan
consumiendo exclusivamente `@/components/data-table`.

## Toolbar

`DataTableToolbar` admite `primaryActions?: ReactNode` como slot opcional al
extremo derecho, despues de configuracion de columnas. La vista decide si
entrega acciones y resuelve sus permisos; una toolbar sin el slot conserva su
composicion actual. El contrato no prescribe que una accion primaria deba vivir
en la toolbar: una vista puede elegir otra superficie aprobada por su spec.

`dataTableColumns.ts` concentra la transformacion pura desde el contrato de
columnas hacia TanStack y `dataTableLayout.ts` los calculos puros de layout,
anchos y clases. Los efectos de navegador, refs, fullscreen y estado React se
mantienen en `DataTable`.

## Filtros En Dialogo

`TableFilterDialogContent` concentra el ancho, padding y overflow del patron
de filtros; no se incorporan esas reglas al dialogo base. `TableFilterSelect`
conserva orientacion `vertical` por defecto y admite `responsive` para mostrar
etiqueta a la izquierda y control a la derecha desde escritorio. Cada dialogo
de filtros decide si adopta esa orientacion; no se fuerza sobre otros
consumidores.

## Acciones Por Fila

`rowActions` es un contrato opcional y tipado. La vista resuelve para cada
registro la lista ya autorizada de `DataTableRowAction`; `DataTable` no conoce
recursos, rutas, permisos ni mutaciones. Si no se entrega `rowActions`, no se
agrega una columna, trigger, menu contextual ni atajo de doble clic.

Cuando existe, la misma lista alimenta el dropdown de tres puntos y el menu
contextual de clic derecho. El trigger permanece visible, tiene `aria-label` y
tooltip, mientras que los labels, iconos, handlers y variante destructiva
pertenecen a la vista. Una fila puede resolver una lista vacia: conserva la
columna, pero no muestra trigger ni menu.

La vista puede marcar una sola accion con `isPrimary`. Esa accion se ejecuta
con doble clic solo sobre zonas no interactivas de la fila. Un clic simple no
navega y la fila no usa `cursor-pointer`; enlaces, botones, inputs, controles
de expansion y el menu de acciones excluyen el doble clic. El menu explicito
es siempre la via descubrible y accesible.

Las mutaciones destructivas se confirman mediante
`DestructiveConfirmationDialog`, componente compartido de Next Dashboard. El
dialogo compone la primitive visual, foco y estado pendiente; la vista es duena
del sujeto, copy, mutacion y feedback. No reutilizar Sheets legacy para nuevas
migraciones.

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

## Desplazamiento

Cuando el viewport de resultados tiene overflow horizontal o vertical,
`DataTable` conserva las barras nativas y agrega controles compactos en un
overlay adyacente a ellas, en sus extremos. En escritorio, las flechas aparecen
solo en el eje con contenido oculto, se deshabilitan en cada límite y desplazan
una fracción visible del viewport con animación suave. El overlay no reserva
una columna, riel ni franja adicional: no reduce el área útil de encabezados,
filas o paginación. En móvil se ocultan: el gesto táctil y las barras nativas
son el mecanismo de desplazamiento.

## Altura de filas

Solo existen dos alturas estandar: `compact` y `comfortable`. Las filas con
contenido de dos líneas usan siempre `comfortable`; una celda no puede crecer
como tarjeta ni introducir una tercera altura. Distribuir datos adicionales en
columnas horizontales, expansión o detalle de fila.

Antes de adoptar el patrón, consultar la spec
`generic-data-table-foundation`: define estados remotos, toolbar, expansión,
selección, sticky header, fullscreen y los puntos de extensión diferidos para
virtualización e infinite scrolling.
