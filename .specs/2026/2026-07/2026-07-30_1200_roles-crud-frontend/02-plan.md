# Plan

## Objective

Implementar en frontend el CRUD de roles consumiendo el módulo ya disponible en backend, sin reintroducir dependencias legacy y dejando el módulo listo para futuras sesiones sin depender de contexto implícito.

## Target Design

- feature dedicado en `src/features/roles/*`
- rutas separadas para listado, detalle, creación y edición
- formulario compartido para create/edit
- editor de permisos agrupado por módulo y operaciones válidas
- acciones visuales coherentes con `isSystem`, `isDefault` e `isImmutable`

## Phases

### Phase 1. Definition And Contracts

- cerrar decisiones del módulo
- aterrizar contratos HTTP realmente usados
- definir shape de estado y rutas

### Phase 2. Data And State Foundation

- crear `rolesSlice`, thunks y tipos
- integrar catálogos de módulos y operaciones
- resolver mapping request/response del CRUD

### Phase 3. Core UI

- implementar listado
- implementar detalle
- implementar formulario compartido de create/edit
- integrar acciones de status y delete

### Phase 4. Navigation And Validation

- exponer acceso al módulo desde navegación
- proteger visibilidad por permisos
- validar flujos principales y cleanup final

## Sequencing Notes

- no conviene tocar navegación antes de tener al menos el listado listo
- el editor de permisos debe resolverse antes de create/edit para no duplicar trabajo visual
- el detalle ayuda a desacoplar acciones de tabla y a simplificar el listado

## Exit Criteria

- frontend consume todo el CRUD de roles ya disponible en backend
- no quedan strings legacy ni reglas improvisadas de roles en este módulo
- el módulo queda documentado en la spec con progreso y breakdown actualizados
