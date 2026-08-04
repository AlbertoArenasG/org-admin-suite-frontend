# Plan

## Objective

Corregir el editor de permisos del CRUD de roles para que renderice operaciones por módulo en función del catálogo real del backend, eliminando la suposición de CRUD uniforme.

## Target Design

- editor de permisos guiado por catálogo real por módulo
- hints de dependencia de `READ` solo donde aplique
- serialización de permisos únicamente sobre combinaciones válidas
- sin cuadrícula CRUD fija ni chips inventados para módulos parciales

## Phases

### Phase 1. Contract Alignment

- cerrar decisión sobre el contrato backend fuente de verdad
- aterrizar el shape final que frontend debe consumir

### Phase 2. Frontend Refactor

- adaptar feature `roles` al nuevo catálogo
- refactorizar `RolePermissionsEditor` y helpers asociados
- ajustar validaciones e hints visuales

### Phase 3. Validation And Cleanup

- validar create y edit con módulos no-CRUD
- actualizar spec y docs relacionadas

## Sequencing Notes

- no conviene tocar primero la UI si el contrato backend final sigue ambiguo
- la refactorización debe concentrarse en el editor y no reabrir el CRUD completo de roles

## Exit Criteria

- frontend ya no renderiza operaciones inválidas
- el editor refleja exactamente las operaciones válidas por módulo
- desaparecen errores de validación derivados de la matriz cuadrada
