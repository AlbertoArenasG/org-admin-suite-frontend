# Progress: DataTable Responsibility Separation

## 2026-09-23

- Se abrio la iniciativa y se registro su definicion inicial.
- Se confirmo que el alcance es exclusivamente una reestructuracion interna y
  preservadora de comportamiento de `DataTable`.
- Se excluyeron de forma expresa las acciones de fila y toda capacidad futura
  de edicion de celdas.
- Se aprobo una separacion por superficies: `DataTableChrome` para header y
  toolbar, y `DataTableContent` para la tabla semantica.
- Se aprobaron nombres que distinguen header superior y encabezados de
  columnas, sin redundancia en `DataTableBody`.
- Se completo definicion, diseno tecnico, registro de artefactos, plan,
  tareas, slices y matriz de validacion.
- Se realizo un barrido final contra el contrato publico, los dos consumidores
  productivos, Component Lab y la guia de specs. Se precisaron artefactos con
  rutas exactas, dependencias y superficies no aplicables; no hay decisiones
  criticas abiertas.
- Se completo Slice 1:
  - `DataTable.types.ts` concentra contrato, labels y defaults.
  - `dataTableHighlight.tsx` concentra el resaltado sin distincion de acentos.
  - `dataTablePageNumbers.ts` concentra el calculo puro de paginas.
  - `DataTable.tsx` reexporta los mismos tipos y conserva el barrel publico.
  - No se modificaron consumidores, rutas, estado ni comportamiento visible.
  - `eslint` dirigido y `npm run typecheck` exitosos.
- Siguiente paso: ejecutar Slice 2 para separar chrome, region de resultados y
  paginacion.
- Se implemento Slice 2:
  - `DataTableChrome` compone header superior, toolbar y settings.
  - `DataTableHeader`, `DataTableToolbar` y `DataTableSettingsMenu` preservan
    sus condiciones de montaje, copy, clases y placements actuales.
  - `DataTableResultsRegion` conserva la region scrollable, sus atributos
    accesibles, ref y estilos derivados por el coordinador.
  - `DataTablePagination` conserva paginacion, filas por pagina y numeros con
    elipsis.
  - La utilidad se renombro a `dataTablePageNumbers.ts` para evitar una
    colision de mayusculas/minusculas con `DataTablePagination.tsx` en macOS.
  - No se modificaron vistas consumidoras ni la tabla semantica.
  - Lint dirigido, `npm run typecheck`, `npm run build` y `git diff --check`
    exitosos. El build conserva dos warnings preexistentes fuera de alcance.
- La validacion manual de Slice 2 se integro a la matriz integral final de
  Component Lab, Seguimiento y Registros administrativos.
- Se implemento Slice 3:
  - `DataTableContent` compone la tabla semantica y el `colgroup`.
  - `DataTableColumnHeaders` concentra seleccion total, sorting y resize.
  - `DataTableBody` concentra loading, estados vacios, filas, indicadores,
    seleccion y expansion con reduced motion.
  - `DataTable` conserva la instancia TanStack, efectos, refs, medicion de
    altura, estado derivado y callbacks controlados.
  - No se modificaron consumidores, rutas, estado, permisos ni contratos
    publicos.
  - Lint dirigido, `npm run typecheck`, `npm run build` y `git diff --check`
    exitosos. El build conserva dos warnings preexistentes fuera de alcance.
- Se completo la validacion manual integral en Component Lab, Seguimiento y
  Registros administrativos. Toolbar, settings, fullscreen, scroll,
  paginacion, sorting, resize, seleccion, estados, expansion y responsive se
  conservan sin regresiones reportadas.
- La spec queda completada: todas las tareas, slices, documentacion viva y
  evidencia de validacion estan cerradas.
