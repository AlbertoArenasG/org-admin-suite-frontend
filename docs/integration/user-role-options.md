# Opciones De Roles Asignables

## Contrato Consumido

```text
GET /v1/roles/options
```

La respuesta es un arreglo no paginado de opciones que el actor autenticado
puede asignar. Cada elemento contiene:

- `role_id`
- `role_code`
- `role_name`
- `system_role`
- `role_scope`
- `is_system`
- `is_default`

## Responsabilidades

Backend autoriza el lookup mediante `ROLES / READ_OPTIONS` y resuelve la
jerarquía de roles. Frontend adapta el contrato a `UserRoleInfo` mediante
`fetchAssignableUserRoles` y conserva las opciones en `state.users.roles`.

Las pantallas conservan únicamente el gating de su operación de escritura:

- invitación: `USER_REGISTRATION_INVITATIONS / CREATE`;
- creación directa: `USERS / CREATE`;
- edición: `USERS / UPDATE`.

Frontend no implementa ni reproduce reglas de jerarquía para filtrar las
opciones recibidas.

## Consumidores

- `/dashboard/users/invite`
- `/dashboard/users/create`
- `/dashboard/users/[userId]/edit`

Los endpoints legacy permanecen en backend hasta que una iniciativa posterior
confirme que no existen consumidores y pueda retirarlos.
