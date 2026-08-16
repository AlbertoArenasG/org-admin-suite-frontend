# Definition

## Purpose

Este documento existe para cerrar decisiones criticas del módulo frontend de `contacts + recipient groups` antes de implementar cambios estructurales.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas en estado `pending`
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto
- las decisiones se aterrizan una por una

## Overall Status

- Initiative: `contacts-recipient-groups-frontend`
- Definition status: `in_progress`
- Implementation ready: `no`

---

## Decision 01. Alcance funcional de esta spec frontend

### Context

Ya existe backend para:

- `contacts`
- `recipient_groups`
- `communication_channels`

Y ya acordamos separar el trabajo frontend pendiente en dos specs:

1. `contacts + recipient groups`
2. `internal asset control`

Antes de definir rutas, estado, formularios o integración visual, hace falta cerrar si esta primera spec frontend entregará solo bases parciales o si cerrará funcionalmente ambos módulos reutilizables.

La decisión importa porque:

- ambos módulos son reutilizables y servirán a iniciativas futuras
- `recipient_groups` depende operativamente de `contacts`
- si frontend deja uno a medias, el siguiente módulo consumidor nacería sobre bases incompletas

### Options

1. Entregar solo `contacts` y dejar `recipient_groups` para otra spec
2. Entregar ambos módulos pero solo con listados y detalle
3. Entregar ambos módulos funcionalmente en una sola spec, con sus flujos administrativos reales de `list + detail + create + edit + delete`, dejando fuera por ahora cualquier integración consumidora en otros módulos

### Recommendation

Opcion 3.

Tiene mejor relación entre esfuerzo y valor.

`contacts` y `recipient_groups` forman una base reutilizable coherente. Separarlos ahora obligaría a reabrir decisiones y retrabajar UX cuando entremos después a módulos consumidores como `internal-asset-control`.

También conviene dejar explícito que esta spec no cubrirá todavía una superficie consumidora embebida dentro de otros módulos. Su responsabilidad será cerrar la administración base de ambos recursos en frontend.

### Implications

- la spec debe cubrir dos módulos administrativos completos
- `contacts` y `recipient_groups` deben seguir el patrón estructural ya existente del proyecto
- la UI debe quedar lista para reutilización posterior desde otros formularios
- no entra todavía la integración embebida dentro de `internal-asset-control` ni otros módulos futuros
- sí puede contemplarse desde definición que algunos componentes resultantes se diseñen para posterior reutilización

### Decision Final

Se aprueba que esta primera spec frontend cubra funcionalmente ambos módulos base:

- `contacts`
- `recipient_groups`

El alcance incluye sus superficies administrativas propias en frontend:

- listado
- detalle
- creación
- edición
- delete

Queda fuera de esta spec:

- la integración consumidora dentro de otros módulos
- cualquier flujo específico de `internal-asset-control`
- automatizaciones o asistentes de uso embebido que dependan de módulos futuros

### Status

approved
