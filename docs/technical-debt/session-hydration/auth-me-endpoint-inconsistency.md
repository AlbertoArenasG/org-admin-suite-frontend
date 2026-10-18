# Inconsistencia del Endpoint para Recuperar la Sesión

## Estado

| Campo                   | Valor                                  |
| ----------------------- | -------------------------------------- |
| Estado                  | Resuelta                               |
| Prioridad               | Media                                  |
| Fecha de identificación | 3 de septiembre de 2026                |
| Última revisión         | 17 de octubre de 2026                  |
| Fecha de cierre         | 17 de octubre de 2026                  |
| Área                    | Autenticación y persistencia de sesión |
| Alcance actual          | Frontend y contrato HTTP con API       |

## Resumen

Durante la restauración de una sesión persistida, el frontend solicitaba el
usuario actual mediante `GET /v1/auth/me`. El backend no expone esa ruta: el
recurso equivalente está disponible en `GET /v1/users/me`. El frontend ya usa
esta última ruta, sin requerir cambios en el backend.

La inconsistencia afectaba el flujo donde existía un token válido en
`localStorage`, pero no el usuario persistido. En ese caso, la hidratación
intentaba recuperar el usuario antes de cargar sus permisos y recibía un
`404`.

## Evidencia Técnica

- El thunk `fetchCurrentUser` usa ahora `GET /v1/users/me` en
  [`src/features/auth/authThunks.ts`](../../../src/features/auth/authThunks.ts).
- La hidratación invoca ese thunk cuando recupera un token sin usuario local en
  [`src/features/auth/persistence.ts`](../../../src/features/auth/persistence.ts).
- El backend expone `GET /v1/users/me` en
  [`src/internal/infra/api/controllers/user/user.controller.ts`](../../../../org-admin-suite-api/src/internal/infra/api/controllers/user/user.controller.ts).
- El controlador de autenticación expone `GET /v1/auth/me/permissions`, pero
  no `GET /v1/auth/me`, en
  [`src/internal/infra/api/controllers/auth/auth.controller.ts`](../../../../org-admin-suite-api/src/internal/infra/api/controllers/auth/auth.controller.ts).

## Impacto

- Antes del ajuste, un usuario con token persistido y sin perfil persistido no
  podía completar la hidratación normal de sesión.
- Los permisos no se solicitaban después del fallo de recuperación del usuario.
- El comportamiento dependía del contenido residual de `localStorage`, por lo
  que podía manifestarse tras limpieza parcial de almacenamiento, cambios de
  versión o una persistencia incompleta.

## Decisión Aplicada

Reutilizar `GET /v1/users/me` sin añadir una ruta duplicada al backend. Si
la recuperación falla por red o servidor, conservar el token y ofrecer
reintento; si falla con `401`, invalidar la sesión.

## Cierre y Verificación

- El frontend y el backend usan `GET /v1/users/me` para recuperar el usuario
  autenticado; el flujo continúa con la carga de permisos.
- La hidratación conserva la sesión y ofrece reintento ante fallos transitorios;
  una respuesta `401` invalida la sesión actual.
- Se ejecutaron `npm run typecheck`, ESLint de los archivos modificados y
  `git diff --check` sin errores.
- No se realizó validación manual contra el entorno desplegado. La corrección
  del contrato queda cerrada en código; su comportamiento en despliegue debe
  comprobarse después de publicar frontend y backend.

## Historial

| Fecha                   | Estado       | Nota                                                                                                               |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------ |
| 3 de septiembre de 2026 | Identificada | Detectada durante la revisión integral de los repositorios `org-admin-suite-frontend` y `org-admin-suite-api`.     |
| 17 de octubre de 2026   | Resuelta     | Frontend alineado con `GET /v1/users/me`; verificaciones estáticas correctas, sin validación manual en despliegue. |
