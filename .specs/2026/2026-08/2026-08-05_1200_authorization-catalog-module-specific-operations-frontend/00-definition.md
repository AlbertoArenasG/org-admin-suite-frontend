# Definition

## Purpose

Esta iniciativa existe para adaptar el frontend al rediseño backend del catálogo de autorización, de forma que la UI deje de asumir un modelo uniforme de operaciones por módulo y consuma de manera explícita las operaciones reales declaradas por backend.

Esta spec es el espejo frontend de:

- `org-admin-suite-api/.specs/2026/2026-08/2026-08-04_1600_authorization-catalog-module-specific-operations`

Regla de trabajo:

- no arrancar implementación estructural mientras existan decisiones críticas en estado `pending`
- tu tomas la decisión final
- aquí solo se registran contexto, opciones, recomendación e impacto

## Overall Status

- Initiative: `authorization-catalog-module-specific-operations-frontend`
- Definition status: `in_progress`
- Implementation ready: `no`

---

## Decision 01. Alcance exacto del cambio en frontend

### Context

Backend ya cerró el rediseño del catálogo de autorización por operaciones específicas por módulo.

En frontend eso impacta al menos:

- editor de permisos de roles
- copy o hints que todavía asuman CRUD uniforme
- navegación o visibilidad derivada de permisos específicos
- contratos de endpoints que salieron del scope normal, como `POST /v1/users`

Todavía falta decidir si esta iniciativa frontend debe limitarse al editor de permisos o si también debe absorber la alineación completa de consumers secundarios del nuevo catálogo.

### Options

1. Limitar el alcance al editor de permisos de roles
2. Incluir editor de permisos y cualquier consumidor directo del catálogo de autorización
3. Incluir además alineación de rutas, acciones y docs frontend que dependan del nuevo catálogo semántico

### Recommendation

Opción 3.

Si el backend ya redefinió la semántica del catálogo, frontend debe cerrar no solo el editor, sino también los puntos visibles donde esa semántica se expresa o se contradice.

### Implications

- la iniciativa no se reduce al editor de permisos
- habrá que revisar consumers secundarios de operaciones por módulo
- el handoff de integración y cualquier doc frontend vivo deben alinearse al nuevo contrato

### Decision Final

Pendiente.

### Status

pending

---

## Decision 02. Fuente de verdad para operaciones válidas por módulo

### Context

El backend ya evolucionó hacia un catálogo donde cada módulo declara sus operaciones reales y dejó de sostener una semántica CRUD uniforme como regla universal.

Frontend debe decidir si:

- sigue reconstruyendo lógica por su cuenta
- o consume el catálogo enriquecido del backend como única fuente de verdad

### Options

1. Reconstruir en frontend las operaciones válidas por módulo
2. Consumir backend como única fuente de verdad para operaciones válidas por módulo
3. Mezclar catálogo backend con reglas locales adicionales en frontend

### Recommendation

Opción 2.

Frontend no debería duplicar lógica de dominio del catálogo si backend ya la cerró y la expone de forma explícita.

### Implications

- el editor de permisos queda guiado por contrato real
- baja el riesgo de drift entre frontend y backend
- la UI deja de adivinar operaciones inexistentes

### Decision Final

Pendiente.

### Status

pending

---

## Decision 03. Tratamiento de operaciones auxiliares o sensibles en UI

### Context

El backend ya introdujo operaciones más específicas como:

- `CUSTOMERS/READ_PUBLIC_ACCESS`
- `PROVIDERS/READ_PUBLIC_ACCESS`

Además, dejó fuera del scope normal de negocio capacidades como `POST /v1/users`, que ahora viven solo en `master-admin`.

Frontend necesita decidir cómo representar esas capacidades:

- si se muestran como operaciones normales del editor
- si se etiquetan de forma especial
- si ciertas superficies ni siquiera deben mostrarlas en el backoffice ordinario

### Options

1. Mostrar todas las operaciones sin distinción visual
2. Mostrar operaciones específicas con la misma UI base, pero aceptando copy y agrupación contextual por módulo
3. Introducir una UI completamente especial para operaciones sensibles o auxiliares

### Recommendation

Opción 2.

No conviene fragmentar la UI sin necesidad, pero sí aceptar que algunas operaciones ya no son CRUD y necesitan copy o contexto más claro.

### Implications

- el editor seguirá siendo una sola superficie
- algunos módulos requerirán hints o copy más precisos
- frontend debe abandonar cualquier suposición de cuadrícula CRUD perfecta

### Decision Final

Pendiente.

### Status

pending

---

## Decision 04. Relación con la spec previa `roles-permissions-editor-catalog-driven`

### Context

Ya existe esta spec en frontend:

- `2026-08-04_1200_roles-permissions-editor-catalog-driven`

Ese trabajo toca una parte importante del problema actual, pero no necesariamente cubre toda la alineación que ahora exige el backend rediseñado.

### Options

1. Reutilizar la spec previa y no abrir una nueva
2. Dejar la spec previa como antecedente acotado y abrir esta nueva como iniciativa integradora
3. Fusionar manualmente ambos specs en uno solo

### Recommendation

Opción 2.

La spec previa sirve como antecedente técnico útil, pero este rediseño frontend necesita una iniciativa más amplia y trazable respecto al backend ya cerrado.

### Implications

- se mantiene trazabilidad limpia entre iniciativas
- no se pierde el trabajo ya pensado sobre el editor
- esta nueva spec puede absorber integración, cleanup y docs sin reescribir la historia anterior

### Decision Final

Pendiente.

### Status

pending
