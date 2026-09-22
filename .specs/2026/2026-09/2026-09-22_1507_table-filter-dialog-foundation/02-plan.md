# Plan: Table Filter Dialog Foundation

## Phase 1. Close Shared Boundary

1. Crear los artefactos aprobados bajo `src/components/table-filter/`.
2. Implementar el contrato controlado, incluido borrador y detección de
   cambios sin representar criterios heredados como cambios nuevos.
3. Mantener actualizados el registro de artefactos y decisiones ante cualquier
   desviación.

## Phase 2. Build The Foundation

1. Implementar diálogo, selector configurable y período de dos pickers.
2. Validar borrador, descarte, teclado, foco, responsive y temas en un preview
   oficial del frontend.

## Phase 3. Migrate Customer Service Records

1. Reemplazar controles directos de toolbar por trigger y composición.
2. Adaptar el único período activo a las claves URL/API actuales.
3. Verificar fetch, URL, paginación, carga, error y permiso READ.

## Phase 4. Verify And Document

1. Ejecutar typecheck, lint y build.
2. Realizar la matriz manual.
3. Actualizar `docs/ui/` solo si la fundación aprobada se convierte en patrón
   operativo para otros consumidores.
