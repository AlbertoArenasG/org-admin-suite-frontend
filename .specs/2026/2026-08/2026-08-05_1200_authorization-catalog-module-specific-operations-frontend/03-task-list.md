# Task List

## Phase 1. Definition

- [x] Cerrar el alcance exacto de la iniciativa frontend
      Status: completed

- [x] Aterrizar los contratos backend relevantes para frontend
      Status: completed

## Phase 2. Analysis

- [x] Auditar el editor de permisos actual contra el catálogo backend vigente
      Status: completed

- [ ] Identificar consumers secundarios de operaciones específicas por módulo
      Status: pending

- [ ] Identificar ajustes de frontend requeridos por `READ_PUBLIC_ACCESS` y por la salida de `POST /v1/users` del scope normal
      Status: pending

- [ ] Identificar en `customers` y `providers` qué vistas autenticadas deberán consultar el nuevo endpoint de public access y cómo degradarán cuando solo exista `READ`
      Status: pending

## Phase 3. Technical Design

- [ ] Definir el shape interno objetivo del catálogo de módulos y operaciones en frontend
      Status: pending

- [ ] Definir reglas de render para operaciones no-CRUD o sensibles
      Status: pending

- [ ] Definir impacto en copy, hints y docs frontend vivas
      Status: pending

## Phase 4. Implementation

- [ ] Adaptar el editor de permisos al catálogo final aprobado
      Status: pending

- [ ] Adaptar consumers secundarios afectados por el nuevo catálogo
      Status: pending

- [ ] Adaptar consumers de `customers` y `providers` para separar `READ` de `READ_PUBLIC_ACCESS`
      Status: pending

- [ ] Actualizar docs frontend relevantes
      Status: pending

## Phase 5. Validation

- [ ] Validar funcionamiento del editor con catálogo real por módulo
      Status: pending

- [ ] Validar ausencia de supuestos CRUD uniformes residuales
      Status: pending

- [ ] Registrar cierre en progreso y breakdown
      Status: pending
