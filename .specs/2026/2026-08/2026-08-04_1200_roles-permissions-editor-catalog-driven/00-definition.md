# Definition

## Purpose

Esta iniciativa existe para corregir el diseño del editor de permisos de roles en frontend, de forma que deje de asumir una cuadrícula CRUD uniforme para todos los módulos y pase a renderizar solo las operaciones realmente válidas por módulo.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas en estado `pending`
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto

## Overall Status

- Initiative: `roles-permissions-editor-catalog-driven`
- Definition status: `completed`
- Implementation ready: `yes`

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

Frontend no debería reconstruir una verdad que ya existe en backend. La forma más limpia es que el catálogo de módulos ya llegue enriquecido con sus operaciones válidas.

### Implications

- el editor de permisos pasa a ser guiado por contrato real
- desaparece la cuadrícula CRUD uniforme
- frontend puede renderizar módulos con 1, 2, 4 o cualquier cantidad válida de operaciones
- se reduce el riesgo de enviar combinaciones inválidas al `PATCH /v1/roles/:roleId`

### Decision Final

Se aprueba consumir `GET /v1/roles/modules` como catálogo enriquecido por módulo, con sus operaciones válidas ya resueltas desde backend.

Frontend no reconstruirá esa relación por su cuenta.

El catálogo de autorización seguirá teniendo como fuente de verdad al backend, de forma que cualquier evolución futura de módulos u operaciones no obligue a mantener lógica duplicada o inferencias frágiles en frontend.

### Status

approved

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

Se aprueba aplicar la dependencia automática de `READ` solo en módulos cuyo catálogo válido incluya realmente esa operación.

Si un módulo no declara `READ`, el editor no debe autoactivarla, insinuarla ni modelarla como requisito estructural.

### Status

approved

---

## Decision 03. Futuro de `GET /v1/roles/operations`

### Context

Si `GET /v1/roles/modules` pasa a devolver por módulo sus operaciones válidas, entonces `GET /v1/roles/operations` deja de ser necesario para el editor de permisos.

Además, el catálogo de operaciones no vive en base de datos; hoy ya existe como código backend, así que no aporta una fuente dinámica independiente que justifique mantener un endpoint separado.

### Options

1. Mantener `GET /v1/roles/operations` como endpoint complementario aunque frontend ya no lo necesite
2. Marcarlo como deprecated pero conservarlo temporalmente
3. Eliminar `GET /v1/roles/operations` y usar solo `GET /v1/roles/modules` como contrato del editor

### Recommendation

Opcion 3.

Si el despliegue de backend y frontend ocurrirá junto al cierre de esta iniciativa, no hay valor en sostener un endpoint redundante. Conviene simplificar el contrato y dejar una sola superficie fuente de verdad.

### Implications

- frontend dejará de consumir `GET /v1/roles/operations`
- el editor de permisos dependerá solo de `GET /v1/roles/modules`
- backend reducirá una superficie HTTP redundante
- el shape del catálogo por módulo debe ser suficientemente completo para reemplazarlo

### Decision Final

Se aprueba eliminar `GET /v1/roles/operations`.

El único contrato que frontend usará para construir el editor de permisos será `GET /v1/roles/modules`, ya enriquecido con las operaciones válidas de cada módulo.

### Status

approved

---

## Decision 04. Shape exacto del catálogo enriquecido de módulos

### Context

Una vez aprobado que `GET /v1/roles/modules` sea la única fuente de verdad para el editor de permisos, todavía falta cerrar el shape exacto del payload enriquecido.

### Options

1. Agregar solo una lista de códigos de operación por módulo
2. Agregar `operations[]` por módulo reutilizando el shape descriptivo completo de operación
3. Agregar `operations[]` mínimo y obligar a frontend a resolver nombres localmente

### Recommendation

Opcion 2.

Así frontend recibe por módulo la lista completa de operaciones válidas con el mismo nivel de metadata descriptiva que ya existía en el endpoint separado.

### Implications

- frontend no necesita resolver nombres ni keys por su cuenta
- backend mantiene un contrato autosuficiente por módulo
- la migración desde el endpoint separado de operaciones es directa

### Decision Final

Se aprueba que cada item de `GET /v1/roles/modules` incluya `operations[]` con el mismo shape descriptivo de operación que hoy expone el endpoint separado.

Shape aprobado por módulo:

```json
{
  "module_id": "USERS",
  "module_code": "USERS",
  "module_name": "Usuarios",
  "module_name_key": "AUTHORIZATION.MODULE.USERS",
  "status_id": "ACTIVE",
  "is_system": true,
  "operations": [
    {
      "operation_id": "CREATE",
      "operation_code": "CREATE",
      "operation_name": "Crear",
      "operation_name_key": "AUTHORIZATION.OPERATION.CREATE",
      "status_id": "ACTIVE",
      "is_system": true
    }
  ]
}
```

### Status

approved
