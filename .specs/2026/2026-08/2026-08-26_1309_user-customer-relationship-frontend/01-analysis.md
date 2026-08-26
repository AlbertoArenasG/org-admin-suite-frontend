# Analysis

## Initiative

- Name: `user-customer-relationship-frontend`
- Date: `2026-08-26`

## Current State

- La administracion de invitaciones ya vive bajo `Usuarios`.
- El formulario de invitacion es la via funcional para crear usuarios de negocio.
- Backend resuelve relaciones, validaciones de clientes activos, transacciones y sincronizacion de contactos.
- El frontend debe consumir el handoff de relaciones usuario-cliente de la API como contrato fuente.

## Findings

- Las relaciones no son un permiso ni un nuevo system role.
- El catalogo de clientes es un lookup reutilizable y no una lista administrativa paginada.
- El detalle de invitacion y el detalle administrativo de usuario son las superficies que exponen los resumentes de clientes.
- El listado de usuarios puede filtrarse por `customer_id` sin parametro booleano complementario.
- Clientes cuenta con endpoints contextuales propios para listar, buscar candidatos, asociar y desasociar usuarios, protegidos por `CUSTOMERS/READ` y `CUSTOMERS/UPDATE`.
- Clientes inactivos conservan consulta de relaciones, pero no permiten mutaciones contextuales.

## Risks

- Duplicar en frontend reglas que backend ya valida.
- Sobrecargar la tabla de usuarios con datos relacionales no incluidos por su contrato ligero.
- Duplicar reglas de permisos de Clientes o de elegibilidad de candidatos que ya resuelve backend.
- Mezclar estado de invitaciones con estado de usuarios registrados.

## Constraints

- Mantener la separacion actual de features y componentes.
- No condicionar selects o vistas con capabilities auxiliares; backend ya resuelve ese acceso.
- Mantener localizacion en espanol e ingles.
