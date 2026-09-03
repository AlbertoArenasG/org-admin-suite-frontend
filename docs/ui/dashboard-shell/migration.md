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

## Estado Objetivo Posterior a la Migracion

Al completar todas las adopciones, el dashboard no debe conservar terminologia
ni infraestructura transitoria de migracion.

- Se retiran `LegacyDashboardShell`, `DashboardShellMigrationBoundary`, la
  variante `legacy | next` y el registro de adopcion temporal.
- `NextDashboardShell` es un nombre transitorio que significa la siguiente
  version del shell, no una dependencia de Next.js. Durante la coexistencia se
  debe renombrar a `MigratedDashboardShell` para expresar ese caracter
  temporal.
- Al retirar la coexistencia, `MigratedDashboardShell` se consolida como
  `DashboardAppShell`, responsable del host comun del dashboard: sidebar,
  content inset, workspace canvas y marco compartido de las rutas.
- `DashboardShellFrame` permanece como primitiva interna y neutral para
  componer canvas y headers; no reemplaza la responsabilidad de
  `DashboardAppShell`.
- La configuracion de breadcrumbs y modo de scroll que siga siendo necesaria
  deja de ser una politica de migracion. Debe renombrarse y simplificarse como
  configuracion estructural permanente, o vivir junto al modulo cuando resulte
  mas claro.

La iniciativa de retiro debe validar que no existan rutas `legacy`, imports de
la carpeta de migracion ni fallbacks de shell antes de eliminar esa
infraestructura.
