# Implementation Breakdown

## Slice 1. Scope And Audit

- cerrar alcance final de la iniciativa
- decidir la relación con la spec previa del editor
- auditar código real impactado

## Slice 2. Catalog Consumption

- aterrizar el catálogo backend como fuente de verdad
- definir shape interno en frontend
- adaptar render del editor de permisos

## Slice 3. Secondary Consumers

- revisar consumers secundarios de operaciones específicas
- alinear contratos afectados por `READ_PUBLIC_ACCESS`
- alinear superficie normal respecto a la salida de `POST /v1/users`

## Slice 4. Validation

- validar editor con catálogo real
- validar absence de supuestos CRUD uniformes
- registrar cierre documental
