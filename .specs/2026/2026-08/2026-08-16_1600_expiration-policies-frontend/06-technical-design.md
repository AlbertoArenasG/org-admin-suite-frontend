# Technical Design

## Current State

El backend de `expiration_status_policies` y `expiration_notification_policies` ya existe, pero la superficie administrativa frontend todavía no inicia.

## Confirmed Base

- el backend para `expiration_status_policies` ya existe
- el backend para `expiration_notification_policies` ya existe
- esta spec no cubre todavía consumo embebido desde `internal-asset-control`
- ambos módulos se trabajarán como superficies administrativas reusables
- ambos pertenecerán al mismo grupo del sidebar
- ambos se implementarán como módulos separados con rutas propias
- el estado frontend vivirá separado por módulo:
  - `src/features/expiration-status-policies/*`
  - `src/features/expiration-notification-policies/*`

## Confirmed Technical Direction

- cada módulo conservará formularios y pantallas propias
- la reutilización entre ambos módulos se limitará a componentes y utilidades pequeñas cuando realmente aplique
- no se construirá una abstracción grande compartida desde definición

## Expiration Status Policies List

El listado base de `expiration_status_policies` se aterriza sobre el contrato real del backend y mostrará:

- `name`
- `status_name`
- `rules_count`
- `created_at`
- `updated_at`
- acciones por fila

Quedan fuera de la tabla base:

- `code`
- `description`

porque no aportan suficiente valor operativo para usuario final en la vista principal.

### List Behavior

- búsqueda por nombre
- filtro por estado
- sorting por:
  - nombre
  - estado
  - creado

### Row Actions

- ver detalle
- editar
- eliminar

## Expiration Status Policies Form

El formulario `create/edit` de `expiration_status_policies` tendrá un editor de `rules[]` basado en bloques repetibles, no en tabla.

La estructura general del formulario será:

- bloque superior de datos generales
- bloque inferior para el editor de reglas

Los datos generales del formulario serán:

- `name`
- `description`
- `status`

`description` será opcional.

`status` estará presente tanto en `create` como en `edit`.

En `create`, `status` iniciará con valor por defecto `ACTIVE`.

No se separará la activación/desactivación en otro flujo distinto: `status` forma parte natural de la edición administrativa del recurso.

Cada regla se capturará como una unidad editable con:

- `label`
- `color`
- `start_offset.years`
- `start_offset.months`
- `start_offset.weeks`
- `start_offset.days`

### Rules Editor UX

- lista vertical de reglas
- cada regla como card o row editable
- preview visual por regla con:
  - badge o chip con `label`
  - color aplicado
  - resumen humano del offset
- botón para agregar regla
- acción para eliminar regla
- no habrá reordenamiento manual en UI
- el orden final se normaliza al guardar según el offset

### Rules Editor Validations

- no permitir guardar sin reglas
- no permitir regla sin `label`
- no permitir regla sin `color`

### Color Input

El color se capturará con `color picker`.

No se usará input hexadecimal como control principal de usuario porque el usuario operador no es técnico.

### Catalog Consumption Rule

Frontend no deberá hardcodear catálogos que backend ya expone mediante endpoints auxiliares.

Para este módulo, `status` deberá poblarse desde el catálogo expuesto por backend y no desde constantes locales manuales.

## Expiration Status Policies Detail

La vista de detalle de `expiration_status_policies` se organizará en dos bloques:

1. `Detalle de la política`
2. `Reglas configuradas`

### Policy Metadata

El bloque superior mostrará:

- `name`
- `description`
- `status_name`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

Queda fuera de la vista de detalle para usuario final:

- `code`

### Rules Presentation

Las reglas configuradas se presentarán como cards, no como tabla.

Cada card mostrará:

- badge o pastilla con el color
- `label`
- resumen humano del offset

No se expondrá el shape técnico del offset como dato crudo.

### Detail Actions

- editar
- eliminar cuando aplique
- volver al listado

## Expiration Notification Policies List

El listado base de `expiration_notification_policies` se aterriza sobre el contrato real del backend y mostrará:

- `name`
- `status_name`
- `rules_count`
- `created_at`
- `updated_at`
- acciones por fila

Quedan fuera de la tabla base:

- `code`
- `description`

porque no aportan suficiente valor operativo para usuario final en la vista principal.

### List Behavior

- búsqueda por nombre
- filtro por estado
- sorting por:
  - nombre
  - estado
  - creado

### Row Actions

- ver detalle
- editar
- eliminar

## Expiration Notification Policies Form

La estructura general del formulario `create/edit` de `expiration_notification_policies` será:

- bloque superior de datos generales
- bloque inferior para el editor de reglas

Los datos generales del formulario serán:

- `name`
- `description`
- `status`

`description` será opcional.

`status` estará presente tanto en `create` como en `edit`.

En `create`, `status` iniciará con valor por defecto `ACTIVE`.

No se separará la activación/desactivación en otro flujo distinto: `status` forma parte natural de la edición administrativa del recurso.

Para este módulo también aplica la misma regla de consumo de catálogos:

- frontend no deberá hardcodear catálogos que backend ya expone mediante endpoints auxiliares
- los selects y opciones administrativas deberán poblarse desde backend

### Notification Rules Editor

Cada regla de `expiration_notification_policies` se capturará como una card editable.

Campos base por regla:

- `anchor`
- `start_offset`
  - years
  - months
  - weeks
  - days
- `trigger_mode`
- `recipient_group_ids`

Campos condicionales de recurrencia:

- `repeat_every`
  - years
  - months
  - weeks
  - days
- `repeat_until`
- `repeat_for`
  - years
  - months
  - weeks
  - days

### Notification Rule Catalog UX

Los campos de catálogo deberán mostrarse en UI con copy funcional, no con naming técnico del modelo.

#### Anchor

- label: `Momento de inicio`
- opciones:
  - `Antes del vencimiento`
  - `Después del vencimiento`

#### Repeat Until

- label: `Repetir hasta`
- opciones:
  - `Hasta la fecha de vencimiento`
  - `Durante un tiempo definido`
  - `Hasta que cambie el estado`

### Conditional Behavior By Trigger Mode

Si `trigger_mode` es de una sola ejecución:

- se muestran:
  - `anchor`
  - `start_offset`
  - `trigger_mode`
  - `recipient_group_ids`
- se ocultan:
  - `repeat_every`
  - `repeat_until`
  - `repeat_for`

Si `trigger_mode` es recurrente:

- se muestran:
  - `anchor`
  - `start_offset`
  - `trigger_mode`
  - `recipient_group_ids`
  - `repeat_every`
  - `repeat_until`
- `repeat_for` solo aparece cuando `repeat_until` corresponda al caso de duración fija

### Data Cleanup Rules

Frontend deberá limpiar datos no aplicables cuando cambie el modo de una regla.

Reglas mínimas:

- si cambia de recurrente a one-time:
  - limpiar `repeat_every`
  - limpiar `repeat_until`
  - limpiar `repeat_for`
- si cambia `repeat_until`:
  - limpiar los campos que ya no apliquen para el nuevo modo seleccionado

No se deben enviar al backend valores invisibles o residuales que ya no correspondan al estado actual de la regla.

### Recipient Groups Selection Inside Notification Rules

La selección de `recipient_groups` dentro de cada regla se resolverá como:

- selección múltiple por regla
- basada en opciones reales de backend
- búsqueda por nombre
- render final de seleccionados como chips o elementos compactos

Reglas aprobadas:

- se mostrará `name`, no `code`, como dato principal de selección
- no se permitirá crear grupos en contexto desde este formulario
- no se duplicará el mismo grupo dentro de una misma regla
- cada regla deberá tener al menos un `recipient_group`

Si un grupo ligado previamente deja de existir o queda inválido, frontend deberá reflejar el problema al cargar o al guardar, pero no intentar corregirlo automáticamente.

## Expiration Notification Policies Detail

La vista de detalle de `expiration_notification_policies` se organizará en dos bloques:

1. `Detalle de la política`
2. `Reglas configuradas`

### Policy Metadata

El bloque superior mostrará:

- `name`
- `description`
- `status_name`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

Queda fuera de la vista de detalle para usuario final:

- `code`

### Rules Presentation

Las reglas configuradas se presentarán como cards, no como tabla.

Cada card mostrará:

- `anchor` en copy de lectura humana
- resumen humano de `start_offset`
- `trigger_mode` en copy de lectura humana
- si aplica:
  - resumen humano de `repeat_every`
  - `repeat_until` en copy de lectura humana
  - resumen humano de `repeat_for`
- grupos de destinatarios ligados por `name`

La presentación debe priorizar lectura humana completa de la regla y no exponer naming técnico del modelo como dato principal de interfaz.

### Detail Actions

- editar
- eliminar cuando aplique
- volver al listado
