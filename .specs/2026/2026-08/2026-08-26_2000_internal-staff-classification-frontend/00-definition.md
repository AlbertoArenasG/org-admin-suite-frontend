# Definition

## Purpose

Esta spec define la integracion frontend de la clasificacion explicita de personal interno mediante `is_internal_staff`.

Reglas de trabajo:

- no iniciar implementacion mientras existan decisiones criticas pendientes
- las decisiones se revisan y aprueban una por una
- frontend consume los contratos y reglas resueltas por backend; no infiere clasificacion desde relaciones o nombres de empresa
- las decisiones aprobadas quedan documentadas antes del diseno tecnico y el breakdown de implementacion

## Overall Status

- Initiative: `internal-staff-classification-frontend`
- Definition status: `complete`
- Technical design status: `complete`
- Implementation ready: `yes`
- Implementation status: `pending`
- Validation status: `pending`

## Confirmed Backend Contract

La API ya soporta:

- `is_internal_staff` obligatorio al crear invitaciones `USER`
- `is_internal_staff` opcional en `PATCH /v1/users/:userId`
- `ADMIN` y `MASTER_ADMIN` siempre internos; backend rechaza el valor `false`
- `is_internal_staff` en listados y detalles protegidos de Usuarios e Invitaciones
- `is_internal_staff` obligatorio al crear Contactos manuales y actualizable solo en Contactos sin `user_id`
- `is_internal_staff` en listados, detalle y busqueda protegidos de Contactos
- sin campo ni query derivado `type` para Contactos; `is_internal_staff` es el unico contrato de clasificacion
- sincronizacion exclusiva de backend para Contactos vinculados a Usuarios

Consultar los contratos fuente en:

- `org-admin-suite-api/docs/frontend/user-customer-relationship-handoff.md`
- `org-admin-suite-api/docs/frontend/user-registration-invitations-management-handoff.md`
- `org-admin-suite-api/docs/frontend/roles-permissions-refactor-handoff.md`

## Initial Scope

- Captura de la clasificacion al invitar Usuarios.
- Consulta y edicion de la clasificacion de Usuarios.
- Captura y edicion de la clasificacion de Contactos manuales.
- Representacion clara de la clasificacion en superficies administrativas pertinentes.
- Filtro de personal interno o externo en los listados administrativos de Usuarios y Contactos.

## Out Of Scope For Now

- Cambios a endpoints o reglas de negocio de backend.
- Inferencias de frontend desde `company_names`, `user_id` o Clientes relacionados.
- Compatibilidad con el campo o filtro eliminado `type` de Contactos.
- Edicion de Contactos vinculados a Usuarios.

## Confirmed Frontend Decisions

- Los formularios usan `Pertenece a Implementos Cientificos` como control Si/No, con ayuda de negocio.
- `ADMIN` y `MASTER_ADMIN` se presentan como internos fijos, sin exponer una seleccion invalida.
- Las consultas usaran una zona extensible de insignias: `Microscope` para personal interno y `UserStar` exclusivamente para `ADMIN`.
- Las insignias son informativas; la edicion usa un campo independiente de opciones Si/No y conserva el selector de rol existente.
- Los listados de Usuarios y Contactos usan el selector reutilizable del proyecto con las opciones Todo el personal, Personal de Implementos Cientificos y Personal externo.
