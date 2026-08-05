# Analysis

## Context

Backend ya cerró el rediseño del catálogo de autorización hacia un modelo por operaciones específicas por módulo.

Frontend todavía no tiene formalizada la iniciativa espejo para absorber ese cambio de manera integral.

## Fuente De Cambio

- backend source spec:
  - `org-admin-suite-api/.specs/2026/2026-08/2026-08-04_1600_authorization-catalog-module-specific-operations`

## Hallazgos Iniciales

- todavía no está aterrizada en una sola iniciativa la alineación completa de frontend con:
  - operaciones específicas por módulo
  - capacidades sensibles como `READ_PUBLIC_ACCESS`
  - salida de `POST /v1/users` del scope normal
- en `customers` y `providers` ya no aplica asumir que el permiso funcional `READ` incluye la visibilidad de datos de acceso público:
  - `public_access_url` y `public_access_token` salieron de los responses normales de listado y detalle
  - esos datos ahora viven detrás de endpoints específicos
  - esos endpoints dependen de una operación separada `READ_PUBLIC_ACCESS`

## Superficies Probablemente Afectadas

- `src/app/dashboard/roles/*`
- `src/features/roles/*`
- componentes del editor de permisos de roles
- copy o hints del editor
- posibles consumers secundarios de permisos específicos
- docs frontend de integración si existen consumers activos de contratos afectados
- vistas autenticadas de `customers` y `providers` que en algún momento necesiten revelar o consumir acceso público sensible

## Riesgos

- dejar frontend parcialmente alineado al nuevo catálogo backend
- sostener copy o comportamiento que aún presuponga CRUD uniforme
- reintroducir desde frontend la idea equivocada de que cualquier usuario con `READ` puede ver URLs o tokens de acceso público sensible

## Criterio De Inicio

Antes de tocar código conviene cerrar:

- alcance exacto del cambio frontend
- forma deseada de representar operaciones específicas o sensibles en la UI
- alcance exacto de los consumers que deberán migrar de `READ` hacia `READ_PUBLIC_ACCESS` en `customers` y `providers`
