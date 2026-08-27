# Task List

## Definition

- [x] Cerrar alcance de consumidores del contrato de Contacto.
- [x] Definir representación de `companyNames` en listado, formulario y detalle.
- [x] Confirmar reglas para contactos manuales y vinculados a Usuario.
- [x] Confirmar contrato API de `company_names`.
- [x] Definir normalización del campo repetible de empresas.
- [x] Definir adaptación compatible para grupos de destinatarios.

## Design

- [x] Definir tipos, mapeos, payloads y estrategia de presentación.
- [x] Desglosar slices de implementación.

## Implementation

- [x] Slice 1: contratos y adaptadores de Contactos y Grupos de destinatarios.
- [x] Slice 2: campo repetible y componentes de presentación de empresas.
- [x] Slice 3: tabla, detalle y consumidor de Grupos de destinatarios.

## Validation

- [x] Ejecutar validación manual de las superficies afectadas.
- [x] Ejecutar `npm run build` y `git diff --check`.
