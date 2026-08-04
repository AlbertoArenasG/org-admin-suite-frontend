# Task List

## Phase 1. Contract Alignment

- [x] Cerrar la decisión del contrato catálogo por módulo
      Status: done

- [x] Alinear la spec frontend al contrato backend ya implementado
      Status: done

- [x] Ajustar tipos y thunks del feature `roles` al nuevo shape de `GET /v1/roles/modules`
      Status: done

- [x] Eliminar el consumo frontend de `GET /v1/roles/operations`
      Status: done

## Phase 2. Implementation

- [ ] Refactorizar el editor de permisos para renderizar solo operaciones válidas por módulo
      Status: pending

- [ ] Ajustar la regla automática de `READ` a los módulos donde realmente aplique y ocultarla donde no exista `READ`
      Status: pending

- [ ] Asegurar que create y edit serialicen solo combinaciones válidas sin reconstrucción cuadrada local
      Status: pending

- [ ] Ajustar el layout visual para módulos con 1, 2, 4 o cualquier cardinalidad válida de operaciones
      Status: pending

## Phase 3. Validation

- [ ] Validar create y edit con módulos no-CRUD como `USER_REGISTRATION_INVITATIONS`, `FILES`, `SERVICE_ENTRY_SURVEYS` y `SERVICE_PACKAGES`
      Status: pending

- [ ] Verificar que la UI ya no permita enviar combinaciones inválidas que backend rechaza
      Status: pending

- [ ] Actualizar progreso y breakdown al cierre
      Status: pending
