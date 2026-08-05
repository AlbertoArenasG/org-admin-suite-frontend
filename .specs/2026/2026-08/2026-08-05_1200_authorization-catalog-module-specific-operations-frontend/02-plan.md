# Plan

## Objetivo

Adaptar frontend al catálogo backend de autorización por operaciones específicas por módulo, evitando suposiciones CRUD uniformes y alineando las superficies de UI relevantes al nuevo modelo.

## Fases Propuestas

### Phase 1. Definition

- cerrar decisiones de alcance
- aterrizar el contrato backend realmente consumido por frontend

### Phase 2. Analysis

- auditar el editor de permisos actual
- detectar consumers secundarios del catálogo y de operaciones específicas
- ubicar contratos ya afectados por backend, como `READ_PUBLIC_ACCESS` y la salida de `POST /v1/users` del scope normal

### Phase 3. Design

- definir shape interno objetivo para módulos y operaciones del editor
- definir reglas de render y copy para operaciones no-CRUD
- definir criterios de visibilidad o hints para operaciones sensibles

### Phase 4. Implementation

- adaptar editor de permisos
- adaptar consumers secundarios si existen
- alinear docs frontend vivas

### Phase 5. Validation

- validar construcción del editor con catálogo real
- validar ausencia de suposiciones CRUD rotas
- validar contratos de frontend afectados por el nuevo catálogo backend

## Orden Recomendado

1. cerrar definición
2. auditar código real
3. aterrizar diseño técnico
4. implementar por slices pequeños
5. validar y registrar cierre
