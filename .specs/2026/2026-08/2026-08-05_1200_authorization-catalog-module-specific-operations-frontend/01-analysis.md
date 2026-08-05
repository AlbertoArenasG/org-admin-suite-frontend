# Analysis

## Context

Backend ya cerró el rediseño del catálogo de autorización hacia un modelo por operaciones específicas por módulo.

Frontend todavía no tiene formalizada la iniciativa espejo para absorber ese cambio de manera integral.

## Dependencia Principal

- backend source spec:
  - `org-admin-suite-api/.specs/2026/2026-08/2026-08-04_1600_authorization-catalog-module-specific-operations`

## Hallazgos Iniciales

- ya existe un antecedente directo de frontend en:
  - `2026-08-04_1200_roles-permissions-editor-catalog-driven`
- ese antecedente parece concentrarse en el editor de permisos guiado por catálogo enriquecido
- todavía no está cerrada en una sola iniciativa la alineación completa de frontend con:
  - operaciones específicas por módulo
  - capacidades sensibles como `READ_PUBLIC_ACCESS`
  - salida de `POST /v1/users` del scope normal

## Superficies Probablemente Afectadas

- `src/app/dashboard/roles/*`
- `src/features/roles/*`
- componentes del editor de permisos de roles
- copy o hints del editor
- posibles consumers secundarios de permisos específicos
- docs frontend de integración si existen consumers activos de contratos afectados

## Riesgos

- dejar frontend parcialmente alineado al nuevo catálogo backend
- sostener copy o comportamiento que aún presuponga CRUD uniforme
- perder coherencia entre spec previa del editor y esta nueva iniciativa espejo

## Criterio De Inicio

Antes de tocar código conviene cerrar:

- alcance exacto del cambio frontend
- rol de la spec previa `roles-permissions-editor-catalog-driven`
- forma deseada de representar operaciones específicas o sensibles en la UI
