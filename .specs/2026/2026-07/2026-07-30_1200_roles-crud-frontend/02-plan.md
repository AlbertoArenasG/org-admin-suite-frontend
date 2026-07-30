# Plan

## Objective

Implementar en frontend el CRUD de roles consumiendo el módulo ya disponible en backend, sin reintroducir dependencias legacy y dejando el módulo listo para futuras sesiones sin depender de contexto implícito.

## Target Design

- feature dedicado en `src/features/roles/*`
- registro del slice en `src/store/store.ts`
- rutas separadas para listado, detalle, creación y edición
- formulario compartido para create/edit
- editor de permisos agrupado por módulo y operaciones válidas
- acciones visuales coherentes con `isSystem`, `isDefault` e `isImmutable`
- roles protegidos visibles pero bloqueados en UI si backend los devuelve
- integración del acceso al módulo usando el patrón actual del dashboard y sidebar

## Phases

### Phase 1. Definition And Contracts

- cerrar decisiones del módulo
- aterrizar contratos HTTP realmente usados
- definir shape de estado, rutas y restricciones visuales

### Phase 2. Data And State Foundation

- crear `rolesSlice`, thunks y tipos
- integrar catálogos de módulos y operaciones
- resolver mapping request/response del CRUD
- definir selectors del módulo para listado, detalle, catálogos y mutaciones

### Phase 3. Core UI

- implementar listado paginado con búsqueda, filtros y acciones
- implementar detalle en modo solo lectura cuando el rol sea protegido
- implementar formulario compartido de create/edit
- integrar acciones de status y delete con confirmaciones y estados bloqueados

### Phase 4. Navigation And Validation

- exponer acceso al módulo desde navegación
- proteger visibilidad por permisos
- validar flujos principales y cleanup final
- actualizar spec/progreso para futuras sesiones

## Sequencing Notes

- no conviene tocar navegación antes de tener al menos el listado listo
- el editor de permisos debe resolverse antes de create/edit para no duplicar trabajo visual
- el detalle ayuda a desacoplar acciones de tabla y a simplificar el listado
- conviene reutilizar primero patrones existentes de `users`, `customers` y `providers` antes de crear componentes nuevos de infraestructura
- el módulo debe asumir desde el inicio que el backend es la frontera final de mutación; frontend solo optimiza la experiencia visible

## Exit Criteria

- frontend consume todo el CRUD de roles ya disponible en backend
- no quedan strings legacy ni reglas improvisadas de roles en este módulo
- el módulo respeta el patrón estructural ya existente del proyecto
- los roles protegidos quedan visibles pero no mutables en UI
- el módulo queda documentado en la spec con progreso y breakdown actualizados
