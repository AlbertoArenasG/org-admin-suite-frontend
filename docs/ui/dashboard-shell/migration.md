# Migracion Gradual del Dashboard Shell

## Estado

Proceso operativo establecido el 2 de septiembre de 2026. La infraestructura
de coexistencia esta preparada; no hay rutas productivas adoptadas en el nuevo
shell todavia.

Este documento define como migrar rutas entre shells. No sustituye las
guidelines visuales y estructurales de `guidelines.md`.

## Principios

- Cada adopcion conserva su URL productiva bajo `/dashboard`.
- Una pagina de negocio no importa ni selecciona shells. El boundary central
  resuelve el shell antes de renderizar sus `children`.
- Una ruta no registrada conserva `legacy`. Esta es la compatibilidad temporal
  predeterminada.
- La entrada a `next` es explicita en la politica central de migracion; no se
  infiere por convenciones de carpetas ni por heuristicas de pathname.

## Adopcion de una Ruta

Cada primera adopcion requiere una spec de alcance fijo. La spec debe definir:

- Ruta o patron de ruta a adoptar.
- Breadcrumbs y modo de scroll.
- Adaptacion minima de `Page Composition` y compatibilidad temporal necesaria.
- Validacion funcional, desktop, movil, permisos y ausencia de scroll
  competitivo.

Al completarse una adopcion, debe registrarse fecha, alcance y spec en
[`../adoption-log.md`](../adoption-log.md).

## Reversion

Retirar una entrada de la politica central restaura el shell `legacy` para esa
ruta sin cambiar su URL ni revertir migraciones ajenas. La spec de la adopcion
debe describir cualquier ajuste de pagina que requiera una reversion adicional.

## Retiro del Shell Legado

El retiro de `LegacyDashboardShell`, el boundary y la politica de migracion no
forma parte de una adopcion individual. Requiere una iniciativa exclusiva una
vez que no existan rutas que resuelvan a `legacy`.
