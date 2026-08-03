# Definition

## Purpose

Este documento existe para cerrar decisiones criticas del CRUD de roles en frontend antes de implementar cambios estructurales.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas en estado `pending`
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto

## Overall Status

- Initiative: `roles-crud-frontend`
- Definition status: `completed`
- Implementation ready: `yes`

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

Se aprueba que esta iniciativa entregue el CRUD funcional completo del módulo de roles en frontend.

El alcance incluye:

- listado
- detalle
- creación
- edición
- cambio de status
- delete

La implementación debe hacerse por slices pequeños, pero la iniciativa no se cerrará dejando el módulo a medias.

### Status

approved

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

Se aprueba que el módulo de roles siga el patrón estructural ya existente en el proyecto.

La estructura aprobada es:

- rutas separadas para listado, detalle, create y edit
- formulario compartido para create/edit
- feature dedicado del módulo en `src/features/roles/*`
- páginas del `app/` enfocadas en composición y routing
- componentes de UI separados, evitando archivos gigantes

No se aprueba introducir una arquitectura nueva ni una pantalla única multipropósito si eso rompe el patrón actual del repo.

### Status

approved

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

Se aprueba que el estado del módulo de roles viva en un feature dedicado, siguiendo el patrón existente del proyecto.

La estructura aprobada es:

- `src/features/roles/types.ts`
- `src/features/roles/rolesThunks.ts`
- `src/features/roles/rolesSlice.ts`

Los componentes y páginas del módulo consumirán ese feature, en lugar de repartir la lógica entre estado local improvisado o stores alternos.

### Status

approved

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

Se aprueba que la edición de permisos del rol se construya agrupando permisos por módulo.

La UI aprobada es:

- una fila o bloque por módulo
- nombre del módulo visible
- operaciones representadas como chips o tags togglables dentro de ese módulo

El payload final hacia backend se construirá desde esa matriz visual `módulo -> operaciones`.

La UI debe dejar claro:

- cuándo una operación está activa
- cuándo una operación está inactiva
- cuándo una operación no aplica o está deshabilitada

No se aprueba una lista plana caótica de permisos sin agrupación por módulo.

### Status

approved

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

Se aprueba que esta iniciativa cubra el CRUD de roles custom mutables y no introduzca flows especiales para roles protegidos del sistema.

Reglas aprobadas:

- los roles custom del módulo son mutables
- no son `isSystem`
- no son `isDefault`
- no son `isImmutable`

Si el backend devuelve roles protegidos en el listado o en detalle, frontend deberá:

- mostrarlos en UI para visibilidad y contexto
- permitir inspeccionar su información
- tratarlos como bloqueados o solo lectura
- ocultar o deshabilitar acciones de mutación como edit, change status o delete

Esto aplica a cualquier rol devuelto por backend que tenga metadata de protección, incluyendo casos como `MASTER_ADMIN_DEFAULT` o `ADMIN_DEFAULT`.

La creación o mutación especial de roles del sistema queda fuera del alcance de esta iniciativa.

### Status

approved

---

## Decision 06. Regla base de acceso al módulo y dependencia de `READ`

### Context

El módulo de roles tiene dos decisiones relacionadas:

- qué permiso permite siquiera ver o entrar al módulo
- cómo evitar combinaciones incoherentes al editar permisos por módulo

Si un usuario tuviera solo `ROLES/CREATE` pero no `ROLES/READ`, la experiencia del módulo quedaría inconsistente. Además, en el editor de permisos conviene evitar combinaciones como `CREATE` o `DELETE` sin `READ`.

### Options

1. Permitir acceso al módulo con cualquier permiso `ROLES/*` y dejar operaciones totalmente libres
2. Exigir `ROLES/READ` para entrar al módulo y hacer `READ` dependiente de cualquier operación no-`READ` dentro del editor
3. Exigir `ROLES/READ` para entrar al módulo, pero dejar libre la combinación interna de permisos

### Recommendation

Opcion 2.

`ROLES/READ` debe ser el permiso base de entrada al módulo. `CREATE`, `UPDATE` y `DELETE` deben habilitar acciones dentro del módulo, pero no bastan por sí solos para mostrar navegación o listado.

En el editor de permisos, `READ` debe activarse automáticamente si el usuario habilita cualquier otra operación dentro del mismo módulo, y no debe poder desactivarse mientras exista otra operación activa.

### Implications

- el sidebar y las rutas del módulo dependen de `ROLES/READ`
- la UX del editor de permisos necesita una regla automática y visible
- se evita persistir combinaciones semánticamente débiles como `DELETE` sin `READ`

### Decision Final

Se aprueba exigir `ROLES/READ` como permiso base para ver y entrar al módulo de roles.

Reglas aprobadas:

- `ROLES/CREATE` no basta por sí solo para mostrar el módulo
- `ROLES/UPDATE` no basta por sí solo para mostrar el módulo
- `ROLES/DELETE` no basta por sí solo para mostrar el módulo
- el acceso visible al módulo requiere `ROLES/READ`

En el editor de permisos por módulo:

- si se activa cualquier operación distinta de `READ`, `READ` se activa automáticamente
- `READ` no puede desactivarse mientras exista otra operación activa en ese mismo módulo
- si `READ` es la única operación activa, sí puede desactivarse manualmente

### Status

approved
