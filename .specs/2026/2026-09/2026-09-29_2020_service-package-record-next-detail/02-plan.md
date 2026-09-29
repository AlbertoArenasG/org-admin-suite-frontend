# Plan

## Solución Aprobada

El detalle será una ruta nueva de Next Dashboard protegida por el boundary institucional. El feature `servicePackagesRecords` tendrá una rama individual tipada, separada de listado, filtros y eliminación. La UI usará `ResourceFormRoute` y tres frames de lectura: información general, equipo y archivos recolectados.

## Fases

1. Contrato y estado individual: tipos de detalle, mapper API, thunk GET, estado protegido contra respuestas obsoletas y reset.
2. Ruta y lectura estructurada: shell, permiso, página, breadcrumb, navegación responsive, estados de pantalla e información general/equipo.
3. Archivos y cierre: colección reutilizable, validación manual, documentación viva y cierre formal.

## Límites

- No se restaura ningún artefacto legacy ni MUI.
- No se cambia listado ni se agrega su enlace a detalle.
- No se modifica backend, recipes, primitives, tokens o componentes compartidos.
- No se implementa edición, carga o reordenamiento de adjuntos.
