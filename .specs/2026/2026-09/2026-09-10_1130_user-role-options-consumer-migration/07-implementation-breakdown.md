# Desglose De Implementación

## Slice 1. Lookup y estado compartido

1. Sustituir `fetchUserRoles` y `fetchUserCreationRoles` por
   `fetchAssignableUserRoles`.
2. Consultar `GET /v1/roles/options` y conservar el mapeo hacia
   `UserRoleInfo`.
3. Consolidar los reducers `pending`, `fulfilled` y `rejected` en el nuevo
   thunk, manteniendo `state.users.roles`.

**Cierre:** no existe una ruta legacy ni un ciclo Redux duplicado para el
lookup.

## Slice 2. Tres páginas legacy

1. Migrar la carga de roles en invitación al thunk unificado.
2. Migrar la carga de roles en creación directa al thunk unificado.
3. Migrar la carga de roles en edición al thunk unificado.
4. Conservar permisos de escritura, estados visuales, submit y props de
   `UserForm` sin modificaciones.

**Cierre:** las tres pantallas obtienen las mismas opciones del contrato
transversal; edición no depende de la ruta legacy vinculada a invitaciones.

## Slice 3. Handoff y verificación

1. Crear el documento de integración frontend del contrato de opciones.
2. Actualizar la deuda de opciones de roles con la adopción correcta y el
   retiro backend diferido.
3. Ejecutar validaciones estáticas sin autofix y realizar validación manual.

**Cierre:** documentación vigente, verificaciones estáticas aprobadas y flujos
confirmados por la persona usuaria.

## Límites Invariables

- No modificar `UserForm`, `UserFormValues`, modos, validaciones ni estilos.
- No crear componentes genéricos de formularios en esta iniciativa.
- No modificar el contrato, autorización o rutas de backend.
- No crear ni ejecutar pruebas unitarias.
