# Matriz de aceptación

El usuario pidió marcar la matriz y la spec como validadas el 2026-10-27 tras revisar la vista. Los checks indican aceptación para el cierre; no documentan una prueba individual de cada escenario.

- [x] Usuario con READ ve menú y ruta; sin READ no ve entrada y la ruta redirige.
- [x] Gantt semana/mes, navegación entre periodos y consulta correcta de hasta 42 días; cliente, proveedor, fechas parciales, proveedor aislado, color y enlace a detalle.
- [x] Calendario semana/mes, hitos separados de recepción y entrega, múltiples eventos del día accesibles y enlace a detalle.
- [x] Lista y Kanban muestran página actual, agrupación por estado operativo y navegación; no hay drag que altere datos.
- [x] Tabla embebida conserva búsqueda, filtros, columnas, paginación, menú, doble clic y permisos de acciones; ruta administrativa original permanece usable.
- [x] Carga, vacío, error y reintento de timeline/listado; cambio rápido de periodo no muestra respuesta vieja.
- [x] Español/inglés, tema claro/oscuro y demás temas, móvil/escritorio, zoom, teclado, foco, lector de pantalla y scroll.

Estado: completado por aceptación expresa del usuario. La mejora visual del Gantt se trabajará fuera de la spec.
