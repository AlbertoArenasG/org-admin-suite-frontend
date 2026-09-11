# Plan

## Fase 1. Contrato y estado unificados

Reemplazar `fetchUserRoles` y `fetchUserCreationRoles` por un único thunk que
consume `GET /v1/roles/options`. Mantener el modelo `UserRoleInfo` y el estado
`state.users.roles` para no ampliar el alcance a renombres internos sin valor
funcional.

## Fase 2. Consumidores legacy

Migrar invitación, creación directa y edición al thunk unificado. Se preservan
`UserForm`, sus props y el diseño actual de cada página.

## Fase 3. Documentación y validación

Actualizar la deuda de opciones de roles y crear el handoff del contrato que
consume frontend. Verificar typecheck, lint sin autofix, build y validación
manual de las tres rutas.
