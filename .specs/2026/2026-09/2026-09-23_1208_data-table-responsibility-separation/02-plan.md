# Plan: DataTable Responsibility Separation

## Architecture

`DataTable` conserva la coordinacion: instancia de TanStack v9, conversion de
columnas de dominio, estado interno de fullscreen y anchos, calculo de altura
disponible, callbacks controlados y composicion final.

La presentacion se separa por superficie:

```text
DataTable
  |- DataTableChrome
  |    |- DataTableHeader
  |    |- DataTableToolbar
  |    `- DataTableSettingsMenu
  |- DataTableResultsRegion
  |    `- DataTableContent
  |         |- DataTableColumnHeaders
  |         `- DataTableBody
  `- DataTablePagination
```

`DataTableChrome` y `DataTableContent` son padres pequenos de composicion.
No crean instancia de TanStack, no ejecutan efectos de ciclo de vida ni
redefinen contratos de las vistas.

## Planned Changes

1. Trasladar el contrato de tipos y las utilidades puras a modulos dedicados,
   preservando los exports publicos actuales.
2. Extraer header, toolbar y settings hacia `DataTableChrome` y sus hijos.
3. Extraer paginacion y region de resultados sin alterar scroll, sticky header
   ni fullscreen.
4. Separar la tabla semantica en contenido, encabezados de columnas y cuerpo.
5. Recomponer `DataTable`, validar los consumidores vigentes y documentar la
   estructura en la guia viva.

## Compatibility

- Las vistas no se refactorizan: conservan imports desde
  `@/components/data-table`, props y callbacks actuales.
- No cambian rutas, Redux, Zustand, permisos, API ni modelos de dominio.
- Los archivos CSS y temas existentes no cambian de responsabilidad ni de
  resultado visual.

## Verification

- `npm run typecheck`, lint dirigido, `npm run build` y `git diff --check`.
- Component Lab: toolbar, settings, sorting, resize, seleccion, expansion,
  fullscreen, loading, error, vacio y paginacion.
- Seguimiento y tabla administrativa: busqueda, filtro, highlight, scroll
  disponible, encabezado sticky, expansion de observaciones y paginacion.
