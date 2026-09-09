# Inconsistencia de la Capability de Roles Asignables

## Estado

| Campo                   | Valor                                     |
| ----------------------- | ----------------------------------------- |
| Estado                  | Identificada                              |
| Prioridad               | Alta                                      |
| Fecha de identificación | 9 de septiembre de 2026                   |
| Última revisión         | 9 de septiembre de 2026                   |
| Área                    | Administración de usuarios y autorización |
| Alcance actual          | Frontend, backend y contrato HTTP         |

## Resumen

Los roles que el actor puede asignar son una capability auxiliar transversal:
dependen del rol del actor y de las reglas de jerarquía, no del mecanismo por
el que se modifica un usuario. Sin embargo, el frontend consume actualmente
dos endpoints distintos para obtener la misma información.

Esta deuda afecta los flujos de invitación, creación directa y edición de
usuarios. La creación directa añadió un endpoint paralelo en lugar de
normalizar la capability compartida.

## Estado Actual

| Flujo            | Pantalla                         | Thunk actual             | Endpoint                       | Permiso que protege el endpoint        |
| ---------------- | -------------------------------- | ------------------------ | ------------------------------ | -------------------------------------- |
| Invitación       | `/dashboard/users/invite`        | `fetchUserRoles`         | `GET /v1/users/roles`          | `USER_REGISTRATION_INVITATIONS:CREATE` |
| Creación directa | `/dashboard/users/create`        | `fetchUserCreationRoles` | `GET /v1/users/creation-roles` | `USERS:CREATE`                         |
| Edición          | `/dashboard/users/[userId]/edit` | `fetchUserRoles`         | `GET /v1/users/roles`          | `USER_REGISTRATION_INVITATIONS:CREATE` |

Los dos endpoints ejecutan la misma consulta de backend y devuelven el mismo
contrato de roles. En edición esto introduce una dependencia incorrecta: un
actor con `USERS:UPDATE`, pero sin permiso para invitar, no puede cargar las
opciones de rol necesarias para editar.

## Impacto

- Se duplica la capacidad de obtener roles asignables por cada flujo.
- La autorización de una consulta auxiliar queda acoplada a acciones de
  producto no equivalentes.
- La edición puede fallar o quedar sin opciones de rol por requerir el permiso
  de invitación.
- Agregar futuros flujos que asignen roles invita a crear más endpoints y
  thunks duplicados.

## Solución Objetivo

Crear una capability auxiliar transversal, con una única ruta y un único thunk:

- Backend: `GET /v1/users/assignable-roles`.
- Autorización: una permission de lectura dedicada para esa capability, por
  ejemplo `USER_ROLE_ASSIGNMENT_OPTIONS:READ`, otorgada a los roles que pueden
  invitar, crear o editar usuarios según la matriz de permisos.
- Resultado: solo los roles que el actor puede asignar, calculados por la
  jerarquía de roles existente.
- Frontend: un único thunk, por ejemplo `fetchAssignableUserRoles`, y un
  estado compartido claramente nombrado para la capability.
- Consumidores: invitación, creación directa y edición. Cada pantalla conserva
  su validación de acción propia al enviar (`INVITATIONS:CREATE`,
  `USERS:CREATE` o `USERS:UPDATE`).

La consulta auxiliar no debe depender del permiso de una pantalla concreta. La
acción de invitar, crear o actualizar sigue protegida de forma independiente
por su endpoint de escritura.

## Plan de Migración

1. Definir y asignar la permission transversal en backend y en la matriz de
   autorización.
2. Exponer `GET /v1/users/assignable-roles` con su guard dedicado.
3. Añadir el thunk compartido y migrar los tres consumidores frontend.
4. Verificar que cada flujo conserva su permiso de escritura y recibe el mismo
   conjunto de roles asignables para un mismo actor.
5. Eliminar `GET /v1/users/roles`, `GET /v1/users/creation-roles`,
   `fetchUserRoles` y `fetchUserCreationRoles` cuando no tengan consumidores.

## Criterios de Cierre

- Existe una sola capability HTTP para obtener roles asignables.
- Invitación, creación directa y edición consumen el mismo thunk y contrato.
- La carga de opciones de edición no requiere permiso de invitaciones.
- Los endpoints de escritura mantienen sus permisos específicos.
- Existen pruebas de autorización para actores con permisos de invitación,
  creación y edición, incluyendo combinaciones parciales.
- Este expediente registra la fecha de resolución, la decisión final y las
  pruebas realizadas.

## Historial

| Fecha                   | Estado       | Nota                                                                                                          |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| 9 de septiembre de 2026 | Identificada | Detectada al implementar el alta directa de usuarios y comparar los flujos de invitación, creación y edición. |
