# Technical Design

## Current State

La implementación frontend de `contacts` y `recipient_groups` ya fue completada. Este documento queda como memoria técnica del diseño aprobado y de la estructura efectivamente implementada.

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
- las superficies administrativas implementadas quedaron cubiertas para ambos módulos:
  - listado
  - detalle
  - create
  - edit
  - delete

## Closure Notes

- la administración base de `contacts` quedó integrada en frontend
- la administración base de `recipient_groups` quedó integrada en frontend
- la spec no arrastra pendientes técnicos internos para su cierre
- cualquier integración consumidora en módulos futuros debe tratarse en una spec nueva
