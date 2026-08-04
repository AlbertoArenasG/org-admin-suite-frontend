# Implementation Breakdown

## Slice 1. Catalog Contract Consumption

- cerrar contrato final de módulos + operaciones válidas
- adaptar el feature `roles` para consumir ese contrato sin heurísticas cuadradas

## Slice 2. Permissions Editor Refactor

- refactorizar `RolePermissionsEditor`
- refactorizar helpers de toggle y dependencia de `READ`
- ajustar hints y layout para módulos con cardinalidades distintas

## Slice 3. Validation

- validar `new` y `edit`
- actualizar spec y dejar cierre listo
