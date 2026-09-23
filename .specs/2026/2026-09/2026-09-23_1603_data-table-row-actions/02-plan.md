# Plan: DataTable Row Actions

## Phase 1: Contracts And Primitives

1. Crear primitive local `ContextMenu` sobre Radix con slots y estilos
   coherentes con `DropdownMenu`.
2. Reemplazar `getRowActions` por tipos `DataTableRowAction` y `rowActions`.
3. Crear `DestructiveConfirmationDialog` compartido sobre `Dialog`.

## Phase 2: Generic DataTable Interaction

1. Crear los componentes internos de actions para renderizar dropdown y menu
   contextual desde la misma lista.
2. Integrar columna, celda de acciones, tooltip y estado sin acciones.
3. Integrar doble clic seguro sobre la fila, conservando expansion, seleccion,
   enlaces y controles internos.
4. Extender Component Lab con acciones de ejemplo y variantes de visibilidad.

## Phase 3: Administrative Adoption

1. Resolver capacidades desde `useDashboardViewAccess`.
2. Declarar acciones `Ver detalle`, `Editar` y `Eliminar` en el contenedor.
3. Conectar dialogo destructivo, thunk existente y snackbar sin modificar
   Redux, endpoint ni rutas.
4. Conservar el enlace de folio y rutas actuales.

## Phase 4: Verification And Documentation

1. Ejecutar lint dirigido, typecheck, build y `git diff --check`.
2. Validar Component Lab y tabla administrativa por permisos y viewport.
3. Actualizar guia viva de DataTable y cerrar evidencia de la spec.
