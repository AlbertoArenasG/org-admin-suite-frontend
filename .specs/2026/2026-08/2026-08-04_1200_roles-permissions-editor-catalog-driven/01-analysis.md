# Analysis

## Initiative

- Name: `roles-permissions-editor-catalog-driven`
- Date: `2026-08-04`

## Current State

- el CRUD de roles en frontend ya existe y usa un editor de permisos agrupado por módulo
- el editor hoy renderiza una cuadrícula uniforme de operaciones tipo CRUD
- el backend ya valida combinaciones reales `module + operation` contra el catálogo central
- backend ya expone `GET /v1/roles/modules` enriquecido con `operations[]` por módulo
- `GET /v1/roles/operations` ya fue eliminado en backend

## Findings

- no todos los módulos del catálogo tienen operaciones CRUD completas
- el frontend actual puede intentar serializar permisos inválidos aunque el backend los rechace correctamente
- la regla automática de `READ` hoy está implementada como regla global y no por capacidad real del módulo
- el problema no es solo visual; es una desalineación entre contrato backend y modelo UI

## Risks

- seguir editando roles con una matriz cuadrada introduce errores de validación evitables
- si frontend reconstruye localmente el catálogo por módulo, puede volver a desalinearse con backend
- adaptar el contrato del catálogo impacta `new` y `edit` del módulo de roles

## Constraints

- el proyecto ya tiene una implementación funcional de CRUD de roles que no conviene romper
- el backend debe seguir siendo la fuente de verdad de combinaciones válidas
- la solución debe preservar el patrón limpio de componentes ya aprobado en frontend
