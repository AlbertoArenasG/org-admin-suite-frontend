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
  - `dataTablePagination.ts` concentra el calculo puro de paginas.
  - `DataTable.tsx` reexporta los mismos tipos y conserva el barrel publico.
  - No se modificaron consumidores, rutas, estado ni comportamiento visible.
  - `eslint` dirigido y `npm run typecheck` exitosos.
- Siguiente paso: ejecutar Slice 2 para separar chrome, region de resultados y
  paginacion.
