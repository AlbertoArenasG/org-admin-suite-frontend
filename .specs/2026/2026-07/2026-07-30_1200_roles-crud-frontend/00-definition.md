# Definition

## Purpose

Este documento existe para cerrar decisiones criticas del CRUD de roles en frontend antes de implementar cambios estructurales.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas en estado `pending`
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto

## Overall Status

- Initiative: `roles-crud-frontend`
- Definition status: `in_progress`
- Implementation ready: `no`

---

## Decision 01. Alcance funcional del primer release

### Context

El backend ya expone el CRUD de roles y los catálogos auxiliares necesarios, pero el frontend todavía no tiene ninguna superficie para administrar roles. Hay que decidir si esta iniciativa cubre solo una primera parte del flujo o si entrega el CRUD funcional de punta a punta.

### Options

1. Entregar solo listado y detalle de roles
2. Entregar listado, creación y edición, dejando status y delete para después
3. Entregar CRUD funcional completo con listado, detalle, creación, edición, cambio de status y delete

### Recommendation

Opcion 3.

El backend ya está suficientemente aterrizado y el dominio no gana mucho valor si frontend deja el módulo a medias. Conviene cerrar el módulo completo en una sola iniciativa, siempre que mantengamos slices pequeños de implementación.

### Implications

- la spec debe cubrir tabla, detalle y formulario
- hay que resolver desde el inicio acciones bloqueadas sobre roles del sistema
- la validación y permisos del módulo deben quedar claras antes de tocar código

### Decision Final

Pendiente.

### Status

pending

---

## Decision 02. Estructura de pantallas del módulo

### Context

El CRUD puede resolverse con muchas combinaciones de rutas y componentes. Necesitamos decidir si usar una sola pantalla multipropósito o separar listado, detalle y formulario.

### Options

1. Una sola pantalla grande que cambie de modo internamente
2. Listado y formulario compartido para create/edit, sin vista de detalle
3. Listado, detalle y formulario compartido para create/edit en rutas separadas

### Recommendation

Opcion 3.

Es la estructura más mantenible para un módulo administrativo. Permite reutilizar el formulario entre creación y edición sin colapsar todo en una sola pantalla, y deja una vista de detalle útil para inspección y futuras acciones.

### Implications

- se requieren rutas separadas para index, create, detail y edit
- el formulario debe diseñarse como componente compartido
- la tabla puede navegar a detalle y desde ahí exponer acciones secundarias

### Decision Final

Pendiente.

### Status

pending

---

## Decision 03. Dónde vive el estado del módulo de roles

### Context

El frontend ya usa Redux Toolkit en módulos administrativos. Falta decidir si el CRUD de roles vive en un feature dedicado con slice propio o si se reparte entre estado local de pantallas y utilidades sueltas.

### Options

1. Resolver todo con estado local por pantalla
2. Crear `src/features/roles/*` con slice, thunks y tipos del módulo
3. Mezclar parte en Redux y parte en stores ad hoc

### Recommendation

Opcion 2.

El CRUD de roles tiene listados paginados, detalle, mutaciones y catálogos auxiliares. Eso justifica un feature dedicado y mantiene consistente la arquitectura con users, customers y providers.

### Implications

- habrá un `rolesSlice`
- los contratos HTTP y transformaciones vivirán en `rolesThunks`
- los componentes de UI no deberán hablar directo con `fetch`

### Decision Final

Pendiente.

### Status

pending

---

## Decision 04. Modelo de edición de permisos del rol

### Context

Un rol contiene permisos por `module + operation`. La parte más delicada del frontend es cómo representar y editar esa matriz sin introducir una UI confusa o acoplada a strings mágicos.

### Options

1. Lista plana de permisos con checkboxes sueltos
2. Agrupar por módulo y renderizar operaciones por módulo
3. Editor completamente libre basado en arrays manuales

### Recommendation

Opcion 2.

El backend ya expone catálogos de módulos y operaciones. Lo natural en frontend es renderizar una matriz por módulo con operaciones válidas por módulo, porque eso hace visible la estructura real del dominio y evita combinaciones inválidas.

### Implications

- hay que consumir `GET /v1/roles/modules` y `GET /v1/roles/operations`
- el formulario necesita un modelo intermedio entre catálogo y payload final
- la UI debe distinguir claramente permisos activos, inactivos y no aplicables

### Decision Final

Pendiente.

### Status

pending

---

## Decision 05. Tratamiento de roles `isSystem`, `isDefault` e `isImmutable`

### Context

El backend ya impide mutaciones ordinarias sobre roles protegidos. El frontend debe decidir si oculta acciones, las deshabilita o ambas cosas, y cómo comunica esas restricciones sin inventar lógica que contradiga al backend.

### Options

1. Mostrar todas las acciones y dejar que backend rechace
2. Ocultar por completo acciones no válidas
3. Deshabilitar u ocultar según el caso, reflejando metadata real del rol

### Recommendation

Opcion 3.

Conviene usar la metadata real del rol para que la UI no ofrezca acciones inválidas. En listados, normalmente es mejor ocultar acciones destructivas o de edición cuando no aplican; en detalle, puede mostrarse el estado protegido del rol con copy explícito.

### Implications

- la tabla y el detalle necesitan reglas visuales basadas en metadata real del rol
- frontend no debe reimplementar reglas de negocio más allá de lo visible
- backend sigue siendo la frontera final de seguridad

### Decision Final

Pendiente.

### Status

pending
