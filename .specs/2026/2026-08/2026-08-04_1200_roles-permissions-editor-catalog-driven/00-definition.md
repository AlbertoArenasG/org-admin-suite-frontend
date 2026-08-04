# Definition

## Purpose

Esta iniciativa existe para corregir el diseño del editor de permisos de roles en frontend, de forma que deje de asumir una cuadrícula CRUD uniforme para todos los módulos y pase a renderizar solo las operaciones realmente válidas por módulo.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas en estado `pending`
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto

## Overall Status

- Initiative: `roles-permissions-editor-catalog-driven`
- Definition status: `in_progress`
- Implementation ready: `no`

---

## Decision 01. Fuente de verdad de operaciones válidas por módulo

### Context

Hoy frontend consume:

- `GET /v1/roles/modules`
- `GET /v1/roles/operations`

Pero el editor de permisos terminó asumiendo una matriz fija de `READ/CREATE/UPDATE/DELETE` para todos los módulos. Eso contradice el catálogo real del backend, donde algunos módulos tienen operaciones parciales o no-CRUD.

### Options

1. Mantener el contrato backend actual y reconstruir en frontend las operaciones válidas por módulo
2. Enriquecer `GET /v1/roles/modules` para que cada módulo ya devuelva sus operaciones válidas
3. Eliminar `GET /v1/roles/modules` y `GET /v1/roles/operations` y crear un solo endpoint nuevo de catálogo compuesto

### Recommendation

Opcion 2.

Frontend no debería reconstruir una verdad que ya existe en backend. La forma más limpia es que el catálogo de módulos ya llegue enriquecido con sus operaciones válidas, manteniendo `GET /v1/roles/operations` solo si todavía aporta valor para UI o trazabilidad.

### Implications

- el editor de permisos pasa a ser guiado por contrato real
- desaparece la cuadrícula CRUD uniforme
- frontend puede renderizar módulos con 1, 2, 4 o cualquier cantidad válida de operaciones
- se reduce el riesgo de enviar combinaciones inválidas al `PATCH /v1/roles/:roleId`

### Decision Final

Pendiente.

### Status

pending

---

## Decision 02. Regla de dependencia automática de `READ`

### Context

La implementación actual fuerza una dependencia automática de `READ` cuando se activa otra operación. Esa regla solo tiene sentido para módulos que efectivamente incluyen `READ` dentro de sus operaciones válidas.

### Options

1. Mantener la dependencia automática de `READ` para cualquier módulo, aunque no lo declare
2. Aplicar la dependencia solo cuando el módulo incluya `READ` en su catálogo válido
3. Eliminar la dependencia automática y dejar toda selección manual

### Recommendation

Opcion 2.

La regla sigue siendo útil, pero debe existir solo donde el catálogo real permita `READ`.

### Implications

- módulos como `USER_REGISTRATION_INVITATIONS` no deben inventar un `READ` inexistente
- el hint visual de dependencia debe mostrarse solo en módulos aplicables
- el editor pasa a reflejar el dominio real, no una heurística global

### Decision Final

Pendiente.

### Status

pending
