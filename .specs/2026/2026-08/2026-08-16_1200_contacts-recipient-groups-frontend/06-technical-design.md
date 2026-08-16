# Technical Design

## Current State

La implementación frontend todavía no inicia. Este documento existe para endurecer el diseño técnico conforme se aprueben decisiones, sin depender de memoria de la sesión.

## Confirmed Base

- el backend para `contacts` ya existe
- el backend para `recipient_groups` ya existe
- `communication_channels` existe como catálogo auxiliar
- esta spec no cubre aún consumo embebido desde otros módulos
- `contacts` y `recipient_groups` vivirán como módulos separados
- ambos pertenecerán al mismo grupo del sidebar
- ambos seguirán el patrón de:
  - listado
  - detalle
  - create
  - edit
- el estado frontend vivirá separado por módulo:
  - `src/features/contacts/*`
  - `src/features/recipient-groups/*`
- el formulario de `recipient_groups` deberá soportar:
  - lookup de contactos
  - selección múltiple
  - creación de contacto en contexto
- el alta en contexto aprobada debe resolverse con:
  - `modal`
  - o `drawer`
- no se usará navegación aparte para ese subflujo

## Pending Technical Decisions

- shape exacto de rutas por módulo
- shape exacto del estado de cada slice
