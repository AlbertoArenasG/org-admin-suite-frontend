# Migración De Consumidores De Opciones De Roles

## Estado

- Definition status: completed
- Implementation status: completed
- Spec status: closed

## Problema

El backend ya expone el contrato transversal y no paginado:

```text
GET /v1/roles/options
Capability: ROLES / READ_OPTIONS
```

Al iniciar la iniciativa, el frontend conservaba tres consumidores de rutas
legacy y dos thunks duplicados:

- invitación: `fetchUserRoles` hacia `GET /v1/users/roles`;
- creación directa: `fetchUserCreationRoles` hacia
  `GET /v1/users/creation-roles`;
- edición: `fetchUserRoles` hacia `GET /v1/users/roles`.

Esto mantiene el flujo de edición acoplado temporalmente al permiso de
invitaciones, aunque el backend ya resolvió esa frontera.

## Resultado mínimo obligatorio

- Un único thunk de opciones asignables consume `GET /v1/roles/options`.
- Invitación, creación y edición reutilizan ese thunk y el mismo estado.
- Se retiran `fetchUserRoles` y `fetchUserCreationRoles` cuando no tengan
  consumidores.
- Cada pantalla conserva su permiso funcional para su acción de escritura; el
  frontend no usa capabilities auxiliares para gating de UI.
- El contrato de opciones sigue sin paginación y mantiene la jerarquía resuelta
  exclusivamente por backend.

## Dependencia aprobada

La implementación backend está cerrada en:

`org-admin-suite-api/.specs/2026/2026-09/2026-09-09_1800_role-options-auxiliary-capability/`

Frontend consume el contrato aprobado; no redefine capability, derivación,
jerarquía ni autorización backend.

## Alcance incluido

- Capa de datos de `features/users` para el lookup unificado.
- Estado Redux de opciones asignables.
- Pantallas legacy de invitación, creación y edición de usuarios.
- Actualización de documentación frontend sobre el contrato consumido y la
  deuda técnica resuelta o pendiente.
- Validación manual de carga, error y envío de los tres flujos.

## Alcance excluido por ahora

- Separar o migrar `UserForm` y sus páginas legacy.
- Crear el componente genérico de formularios requerido antes de esa futura
  migración hacia Next Dashboard.
- Cambiar endpoints, capabilities, seeds o rutas legacy en backend.
- Retirar rutas legacy de backend.
- Crear o ejecutar pruebas unitarias, salvo instrucción explícita de la persona
  usuaria.
- Rediseño visual general de las páginas legacy.

## Decisiones cerradas

1. Esta spec adopta la opción 1: migración pequeña y acotada del lookup, sin
   modificar formularios ni diseño de páginas.
2. La separación de formularios se trabajará en una spec futura, después de
   crear un componente genérico de formularios y durante la migración de esos
   flujos a Next Dashboard.
3. Frontend consume la capability resuelta por backend; no implementa gating
   de interfaz por `ROLES/READ_OPTIONS`.

## Criterios de aceptación

- Las tres rutas consumen exclusivamente `GET /v1/roles/options` mediante un
  thunk unificado.
- La edición carga opciones para un actor con `USERS/UPDATE` sin depender del
  permiso de invitaciones.
- Estados de carga, error y reintento conservan la experiencia actual.
- `UserForm`, `UserFormValues` y sus modos no se modifican en esta iniciativa.
- No se introducen componentes, estilos, dependencias ni cambios de UI.

## Cierre

La validación manual confirmó los flujos de invitación, creación directa y
edición. Los tres consumen `GET /v1/roles/options` mediante
`fetchAssignableUserRoles`, sin modificar `UserForm`. El retiro de las rutas
legacy de backend queda fuera de esta spec.
