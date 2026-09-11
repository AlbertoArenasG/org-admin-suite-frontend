# Diseño Técnico

## Contrato consumido

```text
GET /v1/roles/options
```

El endpoint no recibe parámetros y responde un arreglo no paginado con
`role_id`, `role_code`, `role_name`, `system_role`, `role_scope`, `is_system`
e `is_default`. Backend resuelve capability y jerarquía; frontend no reproduce
ninguna regla de autorización por `systemRole`.

Cada página conserva su permiso funcional actual para enviar su operación:

- invitación: `USER_REGISTRATION_INVITATIONS / CREATE`;
- creación directa: `USERS / CREATE`;
- edición: `USERS / UPDATE`.

## Estado

`fetchAssignableUserRoles` adaptará el payload remoto a `UserRoleInfo` y
mantendrá el estado existente `state.users.roles`. Se conserva ese nombre para
limitar la iniciativa al cambio de contrato; un renombre a
`assignableRoles` no aporta comportamiento y queda fuera de este alcance.

## Registro de Artefactos

| Artefacto                     | Tipo                        | Ubicación                                                                                   | Responsabilidad                                                                        | Dependencias                                 | Estado         |
| ----------------------------- | --------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------- | -------------- |
| `fetchAssignableUserRoles`    | thunk remoto                | `src/features/users/usersThunks.ts`                                                         | Consultar y adaptar `GET /v1/roles/options`.                                           | `jsonRequest`, token auth, contrato backend. | modify         |
| `ApiUserRole`                 | tipo de integración privado | `src/features/users/usersThunks.ts`                                                         | Tipar la respuesta HTTP antes del mapeo a frontend.                                    | contrato backend.                            | reuse          |
| reducers de roles             | estado Redux                | `src/features/users/usersSlice.ts`                                                          | Sustituir los dos ciclos legacy por el del thunk unificado.                            | `fetchAssignableUserRoles`, `UserRoleInfo`.  | modify         |
| `InviteUserPage`              | página consumidora          | `src/app/dashboard/users/invite/page.tsx`                                                   | Obtener opciones con el thunk unificado.                                               | permiso de invitación, `state.users.roles`.  | modify         |
| `CreateUserPage`              | página consumidora          | `src/app/dashboard/users/create/page.tsx`                                                   | Obtener opciones con el thunk unificado.                                               | `USERS/CREATE`, `state.users.roles`.         | modify         |
| `UserEditPage`                | página consumidora          | `src/app/dashboard/users/[userId]/edit/page.tsx`                                            | Obtener opciones con el thunk unificado.                                               | `USERS/UPDATE`, `state.users.roles`.         | modify         |
| `UserForm` y `UserFormValues` | formulario legacy           | `src/components/users2/UserForm.tsx`                                                        | Preservar formularios y contratos UI actuales.                                         | tres páginas legacy.                         | reuse          |
| `useAuthorization`            | autorización UI             | `src/features/auth/`                                                                        | Mantener gating por permisos funcionales.                                              | permisos efectivos actuales.                 | reuse          |
| capability auxiliar           | autorización backend        | `org-admin-suite-api`                                                                       | Autorizar el lookup sin exposición a UI.                                               | `ROLES/READ_OPTIONS`.                        | reuse          |
| handoff de contrato           | documentación viva          | `docs/integration/user-role-options.md`                                                     | Documentar endpoint, payload y límites frontend.                                       | contrato backend cerrado.                    | new            |
| deuda de opciones             | documentación viva          | `docs/technical-debt/user-role-assignment-options/role-options-capability-inconsistency.md` | Registrar adopción frontend y retiro backend pendiente.                                | implementación y validación.                 | modify         |
| deuda de formularios          | documentación viva          | `docs/technical-debt/user-form-boundary/user-form-flow-coupling.md`                         | Mantener explícita la dependencia de componente genérico y migración a Next Dashboard. | iniciativa futura.                           | reuse          |
| rutas, shell, temas y estilos | composición y estilos       | no aplica                                                                                   | No se cambian rutas, composición, componentes visuales ni tokens.                      | páginas existentes.                          | not_applicable |
| pruebas unitarias             | verificación                | no aplica                                                                                   | No se crean ni ejecutan sin instrucción explícita de la persona usuaria.               | validación estática y manual.                | not_applicable |

## Compatibilidad diferida

Frontend deja de consumir `/v1/users/roles` y
`/v1/users/creation-roles`. Backend las conserva hasta que una iniciativa
posterior confirme que no existen consumidores y pueda retirarlas. Esta spec no
modifica API ni formularios.

## Verificación

- `npm run typecheck`.
- `npx eslint .` sin `--fix`.
- `npm run build`.
- Validación manual de loading, error/reintento y submit en invitación,
  creación y edición; la edición se valida con un actor que tenga
  `USERS/UPDATE` sin permiso de invitaciones.
