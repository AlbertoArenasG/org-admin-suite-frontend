# Slices

## Slice 1 → tarea Vendor

Integrar Kibo Gantt/Calendar/List/Kanban bajo vendor aislado; adaptar modo de lectura, semana/mes, eventos no ocultos, tokens, dependencias y compatibilidad. Cerrar con typecheck de integración mínima. Conservar DataTable y shell.

## Slice 2 → tarea Datos

Agregar tipo, mapper, thunk de paginación completa y estado timeline independiente. Coordinar periodo, match y respuestas obsoletas. Cerrar con typecheck y revisión de rango/fronteras. No cambiar backend ni listado existente.

## Slice 3 → tarea Vistas temporales

Crear ruta READ, contenedor, Gantt agrupado y Calendario con hitos, semana/mes, navegación y estados completos. Cerrar al revisar manualmente periodos, colores, tramos parciales, errores y móvil.

## Slice 4 → tarea Vistas de listado

Componer Lista, Kanban y Tabla embebida con estado paginado, navegación, URL/preferencias, permisos; agregar entrada al menú y ES/EN. Cerrar al confirmar tabla actual, acciones y cambio de vistas sin interferencia.

## Slice 5 → tarea Verificación

Ejecutar typecheck, lint enfocado y build, corregir problemas, actualizar `docs/ui/adoption-log.md` y registrar evidencia en `05-progress.md`. Entregar matriz manual al usuario. No ejecutar pruebas unitarias/integración/e2e por iniciativa propia. No cerrar la spec ni hacer commit de código antes de validación manual.
