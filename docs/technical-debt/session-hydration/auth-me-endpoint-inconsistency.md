# Inconsistencia del Endpoint para Recuperar la Sesión

## Estado

| Campo                   | Valor                                  |
| ----------------------- | -------------------------------------- |
| Estado                  | Identificada                           |
| Prioridad               | Media                                  |
| Fecha de identificación | 3 de septiembre de 2026                |
| Última revisión         | 3 de septiembre de 2026                |
| Área                    | Autenticación y persistencia de sesión |
| Alcance actual          | Frontend y contrato HTTP con API       |

## Resumen

Durante la restauración de una sesión persistida, el frontend solicita el
usuario actual mediante `GET /v1/auth/me`. El backend no expone esa ruta: el
recurso equivalente está disponible en `GET /v1/users/me`.

La inconsistencia solo afecta el flujo donde existe un token válido en
`localStorage`, pero no existe el usuario persistido. En ese caso, la
hidratación intenta recuperar el usuario antes de cargar sus permisos y la
solicitud actual puede responder con `404`.

## Evidencia Técnica

- El thunk `fetchCurrentUser` usa `GET /v1/auth/me` en
  [`src/features/auth/authThunks.ts`](../../../src/features/auth/authThunks.ts).
- La hidratación invoca ese thunk cuando recupera un token sin usuario local en
  [`src/features/auth/persistence.ts`](../../../src/features/auth/persistence.ts).
- El backend expone `GET /v1/users/me` en
  [`src/internal/infra/api/controllers/user/user.controller.ts`](../../../org-admin-suite-api/src/internal/infra/api/controllers/user/user.controller.ts).
- El controlador de autenticación expone `GET /v1/auth/me/permissions`, pero
  no `GET /v1/auth/me`, en
  [`src/internal/infra/api/controllers/auth/auth.controller.ts`](../../../org-admin-suite-api/src/internal/infra/api/controllers/auth/auth.controller.ts).

## Impacto

- Un usuario con token persistido y sin perfil persistido no puede completar la
  hidratación normal de sesión.
- Los permisos no se solicitan después del fallo de recuperación del usuario.
- El comportamiento depende del contenido residual de `localStorage`, por lo
  que puede manifestarse tras limpieza parcial de almacenamiento, cambios de
  versión o una persistencia incompleta.

## Decisión Pendiente

Definir un único contrato para recuperar el usuario autenticado y alinear ambos
repositorios. Las alternativas son actualizar el frontend para usar
`GET /v1/users/me` o incorporar y mantener `GET /v1/auth/me` en el backend.
La decisión debe considerar la convención pública de rutas de autenticación y
usuarios antes de implementar el cambio.

## Criterios de Cierre

- El frontend y el backend usan el mismo endpoint para recuperar el usuario
  autenticado.
- El flujo con token persistido y sin usuario local termina hidratado y carga
  permisos correctamente.
- Existe cobertura automatizada, o una prueba manual documentada, para ese
  escenario de recuperación de sesión.
- Este expediente se actualiza con la decisión tomada, fecha de resolución y
  referencia al cambio implementado.

## Historial

| Fecha                   | Estado       | Nota                                                                                                           |
| ----------------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| 3 de septiembre de 2026 | Identificada | Detectada durante la revisión integral de los repositorios `org-admin-suite-frontend` y `org-admin-suite-api`. |
