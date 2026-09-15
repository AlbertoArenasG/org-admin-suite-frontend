# Migracion Gradual del Dashboard Shell

## Estado

Proceso operativo establecido el 2 de septiembre de 2026. La infraestructura
de coexistencia está preparada y las rutas adoptadas se registran de forma
explícita en la política central.

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

## Frontera De Migración

Adoptar una ruta en `Next Dashboard` es sustituir su host y su composición de
layout; no es envolver una vista legacy con un shell nuevo. La migración
conserva comportamiento de dominio, no infraestructura visual heredada.

Antes de implementar, cada pieza de la vista existente debe clasificarse:

- **Host o shell legacy:** `Global Header`, breadcrumbs o encabezados de
  contexto legacy, canvas, márgenes, fondos, scroll y navegación. No se
  reutilizan en una ruta adoptada.
- **Composición de página:** título, descripción, acciones y superficies. Se
  reconstruye con las piezas aprobadas de Next Dashboard; puede omitirse si la
  jerarquía de la ruta ya queda resuelta por otra composición nueva.
- **Dominio:** carga, permisos, jerarquía, RHF, Zod, valores, payloads,
  mutaciones, copy y feedback. Puede conservarse o migrarse internamente sin
  heredar su layout legacy.
- **Primitives neutrales:** se evalúan por contrato y apariencia; no se
  reutilizan solo porque ya existen en una pantalla legacy.

Una ruta adoptada debe tener un único dueño para cada capa de host:

- `Workspace Toolbar` es el único toolbar global.
- `Workspace Header` es la única fuente de breadcrumbs y contexto de ruta.
- Un `Page Header` nuevo, cuando aplique, contiene únicamente jerarquía y
  acciones propias del contenido; no replica breadcrumbs del shell.

No se permiten imports de componentes legacy de host o layout en una ruta que
resuelva a `next`. Si existe duda sobre la clasificación de una pieza, se
inspecciona antes de reutilizarla; la reutilización no es el comportamiento por
defecto.

## Adopcion de una Ruta

Cada primera adopcion requiere una spec de alcance fijo. La spec debe definir:

- Ruta o patron de ruta a adoptar.
- Breadcrumbs y modo de scroll.
- Adaptacion minima de `Page Composition` y compatibilidad temporal necesaria.
- Validacion funcional, desktop, movil, permisos y ausencia de scroll
  competitivo.
- Adopcion del host de Next Dashboard: `Workspace Toolbar` dentro de
  `Workspace Canvas` y `Workspace Header` en una fila posterior para el
  contexto de ruta. No se replica el `Global Header` exterior de legacy.
- Sustitución de toda infraestructura legacy de host y layout según la
  frontera anterior; la validación comprueba que no existan toolbar o
  breadcrumbs duplicados.

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

No se debe iniciar esa iniciativa de retiro automaticamente ni como parte de
la ultima adopcion. Solo se crea una spec de cierre cuando el responsable del
proyecto decida hacerlo despues de confirmar que la migracion esta completa.

## Estado Objetivo Posterior a la Migracion

Al completar todas las adopciones, el dashboard no debe conservar terminologia
ni infraestructura transitoria de migracion.

- Se retiran `LegacyDashboardShell`, `DashboardShellMigrationBoundary`, la
  variante `legacy | next` y el registro de adopcion temporal.
- `NextDashboardShell` es un nombre transitorio que significa la siguiente
  version del shell, no una dependencia de Next.js. Al retirar la coexistencia
  se consolida y renombra como `DashboardAppShell`, responsable del host comun
  del dashboard: sidebar,
  content inset, workspace canvas y marco compartido de las rutas.
- `DashboardShellFrame` permanece como primitiva interna y neutral para
  componer canvas y headers; no reemplaza la responsabilidad de
  `DashboardAppShell`.
- La configuracion de breadcrumbs y modo de scroll que siga siendo necesaria
  deja de ser una politica de migracion. Debe renombrarse y simplificarse como
  configuracion estructural permanente, o vivir junto al modulo cuando resulte
  mas claro.

## Spec Obligatoria de Cierre

Cuando se decida iniciar la spec posterior a la migracion completa, su alcance
debe incluir todo el retiro de la infraestructura temporal. No se permite dejar
un fallback, una variante de shell o una politica de adopcion sin consumidores.

La spec debe comprobar y ejecutar:

- No existen rutas que resuelvan a `legacy` ni entradas pendientes de adopcion.
- No existen imports de `LegacyDashboardShell`,
  `DashboardShellMigrationBoundary` ni archivos de la carpeta `migration/`.
- Se elimina el resolvedor de pathname, el registro temporal y la union
  `legacy | next`.
- `NextDashboardShell` se consolida como `DashboardAppShell` y el layout final
  deja de seleccionar variantes de shell.
- La configuracion estructural permanente se separa de la politica temporal de
  migracion.
- Se validan rutas representativas, desktop, movil, sidebar, auth y scroll
  antes de cerrar la spec.
