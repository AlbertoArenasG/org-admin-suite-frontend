# Validación Manual

## Validación Estática

- [x] `npm run typecheck` termina sin errores.
- [x] `npx eslint .` termina sin errores y sin aplicar autofix.
      Reporta cuatro warnings preexistentes fuera del alcance de esta spec.
- [x] `npm run build` termina sin errores.

## Contrato Unificado

- [x] Invitación consulta `GET /v1/roles/options`.
- [x] Creación directa consulta `GET /v1/roles/options`.
- [x] Edición consulta `GET /v1/roles/options`.
- [x] Ninguna de esas páginas solicita `/v1/users/roles` ni
      `/v1/users/creation-roles`.

## Flujos Existentes

- [x] Invitación conserva carga, error, reintento y envío actuales.
- [x] Creación directa conserva contraseña inicial, límite de un cliente y
      envío actuales.
- [x] Edición conserva carga, valores iniciales, error, reintento y envío
      actuales.
- [x] Un actor con `USERS/UPDATE` y sin permiso de invitación puede cargar las
      opciones en edición si backend autoriza `ROLES/READ_OPTIONS`.

## Límites De Alcance

- [x] `UserForm.tsx`, `UserFormValues`, sus props y sus modos no cambiaron.
- [x] No se agregaron componentes visuales, dependencias ni estilos.
- [x] No se crearon ni ejecutaron pruebas unitarias.
