# Propiedad Inconsistente del Tipo de Rol de Sistema

## Estado

| Campo                   | Valor                                   |
| ----------------------- | --------------------------------------- |
| Estado                  | Identificada                            |
| Prioridad               | Media                                   |
| Fecha de identificación | 9 de septiembre de 2026                 |
| Última revisión         | 9 de septiembre de 2026                 |
| Área                    | Tipos compartidos y dominio de usuarios |
| Alcance actual          | Frontend                                |

## Resumen

El rol de sistema es un concepto de dominio compartido, pero su tipo se
declara actualmente dentro de `features/auth`. El feature de usuarios lo
importa para tipar el payload de actualización y, al mismo tiempo, declara una
unión literal distinta para el payload de creación directa.

## Evidencia Técnica

- `UpdateUserPayload.systemRole` importa y usa `AuthSystemRole` desde
  `@/features/auth/types` en
  [`src/features/users/usersThunks.ts`](../../../src/features/users/usersThunks.ts).
- `CreateUserPayload.systemRole` declara directamente `'ADMIN' | 'USER'` en el
  mismo archivo.
- `AuthSystemRole` está declarado dentro de
  [`src/features/auth/types.ts`](../../../src/features/auth/types.ts), aunque
  representa una regla de dominio usada por más de un feature.

## Impacto

- `features/users` queda acoplado a `features/auth` por un tipo que no es
  específico de autenticación.
- Las uniones literales de roles pueden divergir cuando se agreguen o renombren
  roles de sistema.
- Los límites permitidos en cada operación no quedan expresados como un
  subconjunto del tipo canónico.

## Solución Objetivo

1. Mover el tipo canónico a una ubicación compartida de dominio, por ejemplo
   `src/types/system-role.ts` o un módulo shared equivalente establecido por el
   repositorio.
2. Renombrarlo según el dominio, por ejemplo `SystemRole`, sin asociarlo a
   autenticación.
3. Consumir ese tipo desde `auth`, `users` y cualquier otro feature.
4. Para operaciones que acepten solo algunos roles, derivar el subconjunto del
   tipo canónico, por ejemplo
   `Extract<SystemRole, 'ADMIN' | 'USER'>`, en vez de declarar otra unión.

## Criterios de Cierre

- El tipo canónico de roles de sistema no vive en `features/auth`.
- Ningún feature replica uniones literales de roles de sistema.
- Los payloads de creación y actualización usan el tipo compartido o un
  subconjunto derivado explícitamente.
- `npm run typecheck` termina correctamente después de la migración.

## Historial

| Fecha                   | Estado       | Nota                                                                       |
| ----------------------- | ------------ | -------------------------------------------------------------------------- |
| 9 de septiembre de 2026 | Identificada | Detectada al revisar los payloads de creación y actualización de usuarios. |
