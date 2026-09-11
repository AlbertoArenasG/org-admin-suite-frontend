# Inconsistencia de la Capability de Roles Asignables

## Estado

| Campo                   | Valor                                          |
| ----------------------- | ---------------------------------------------- |
| Estado                  | Resuelta en frontend; retiro backend pendiente |
| Prioridad               | Alta                                           |
| Fecha de identificación | 9 de septiembre de 2026                        |
| Última revisión         | 10 de septiembre de 2026                       |
| Área                    | Administración de usuarios y autorización      |
| Alcance actual          | Frontend, backend y contrato HTTP              |

## Resumen

Los roles que el actor puede asignar son una capability auxiliar transversal:
dependen del rol del actor y de las reglas de jerarquía, no del mecanismo por
el que se modifica un usuario. La migración frontend ya consolidó sus tres
consumidores en el contrato transversal de backend.

La deuda original afectaba los flujos de invitación, creación directa y
edición de usuarios. La creación directa había añadido un endpoint paralelo en
lugar de normalizar la capability compartida.

## Estado Resuelto En Frontend

| Flujo            | Pantalla                         | Thunk actual               | Endpoint                | Permiso de escritura                   |
| ---------------- | -------------------------------- | -------------------------- | ----------------------- | -------------------------------------- |
| Invitación       | `/dashboard/users/invite`        | `fetchAssignableUserRoles` | `GET /v1/roles/options` | `USER_REGISTRATION_INVITATIONS:CREATE` |
| Creación directa | `/dashboard/users/create`        | `fetchAssignableUserRoles` | `GET /v1/roles/options` | `USERS:CREATE`                         |
| Edición          | `/dashboard/users/[userId]/edit` | `fetchAssignableUserRoles` | `GET /v1/roles/options` | `USERS:UPDATE`                         |

El contrato auxiliar no es paginado. Backend autoriza el lookup con
`ROLES / READ_OPTIONS` y calcula las opciones según la jerarquía del actor.
Frontend no reproduce esa jerarquía.

## Resolución Aplicada

- Se retiraron `fetchUserRoles` y `fetchUserCreationRoles` de frontend.
- Los tres flujos reutilizan `fetchAssignableUserRoles` y
  `state.users.roles`.
- La edición ya no consulta una ruta asociada a invitaciones ni filtra la
  jerarquía en cliente.
- Cada pantalla conserva solo el permiso funcional de su escritura.

## Pendiente De Backend

Backend conserva temporalmente `GET /v1/users/roles` y
`GET /v1/users/creation-roles` por compatibilidad. Su retiro pertenece a una
iniciativa backend posterior, después de confirmar que no quedan consumidores.

## Criterios de Cierre

- [x] Invitación, creación directa y edición consumen el mismo thunk y contrato.
- [x] La carga de opciones de edición no requiere permiso de invitaciones.
- [x] Los endpoints de escritura mantienen sus permisos específicos en UI.
- [ ] Backend retira los endpoints legacy cuando no tenga consumidores.

## Historial

| Fecha                    | Estado               | Nota                                                                                                          |
| ------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| 9 de septiembre de 2026  | Identificada         | Detectada al implementar el alta directa de usuarios y comparar los flujos de invitación, creación y edición. |
| 10 de septiembre de 2026 | Resuelta en frontend | Los tres flujos adoptaron `GET /v1/roles/options`; el retiro de rutas legacy queda pendiente en backend.      |
