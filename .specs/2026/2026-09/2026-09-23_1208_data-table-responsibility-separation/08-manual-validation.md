# Manual Validation: DataTable Responsibility Separation

## Technical Checks

- [x] `npm run typecheck`
- [x] Lint dirigido a los artefactos modificados.
- [x] `npm run build`
- [x] `git diff --check`

## Component Lab

- [x] Toolbar con busqueda, limpiar busqueda, filtros, leading y trailing.
- [x] Header con titulo, acciones, loading, settings y fullscreen.
- [x] Settings en header y toolbar, con densidad y visibilidad de columnas.
- [x] Sorting, resize por puntero y teclado, seleccion y acciones masivas.
- [x] Loading, error con retry, vacio y vacio filtrado.
- [x] Expansion con cada trigger y reduced motion.
- [x] Paginacion, filas por pagina y elipsis.

## Seguimiento De Servicios

- [x] Busqueda remota y highlight, incluida coincidencia sin acento.
- [x] Dialogo de filtros, toolbar compacta, scroll disponible y sticky header.
- [x] Observaciones expandibles, paginacion y mobile con scroll horizontal.

## Registros Administrativos

- [x] Busqueda remota y highlight, incluida coincidencia sin acento.
- [x] Dialogo de filtros, toolbar compacta, scroll disponible y sticky header.
- [x] Observaciones expandibles, columnas de proveedor, paginacion y mobile
      con scroll horizontal.

## Non-Applicable

- No se validan mutaciones, rutas, permisos, endpoints, acciones de fila ni
  edicion de celdas: estan fuera de alcance y no deben cambiar.
