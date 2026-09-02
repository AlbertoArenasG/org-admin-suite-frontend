# Implementation Breakdown

## Slice 1. Boundary sin adopciones

Objetivo: extraer el shell legado y crear el boundary de runtime con una
politica vacia que siempre resuelva `legacy`.

Incluye:

- `LegacyDashboardShell` extraido sin cambios visuales;
- `DashboardLayout` delegado;
- resolvedor tipado y pruebas;
- validacion de rutas existentes.

No incluye:

- `NextDashboardShell` activo para una ruta;
- cambios en paginas de negocio;
- cambios de sidebar, cuenta o notificaciones.

## Slice 2. Shell nuevo conectado sin ruta productiva

Objetivo: conectar `NextDashboardShell` al boundary, sin entradas activas en
la politica de adopcion.

Incluye:

- configuracion declarativa de shell nuevo;
- composicion de Global Header y Workspace Header;
- cobertura del fallback legado;
- validacion de que no afecta rutas existentes.

## Slice 3. Adopcion de una ruta seleccionada

Objetivo: migrar una sola ruta aprobada mediante su spec propia.

Incluye:

- entrada explicita en la politica;
- configuracion de breadcrumbs y scroll;
- adaptacion minima de la pagina;
- actualizacion de `docs/ui/adoption-log.md`;
- validacion responsive y funcional.

## Slice 4. Adopciones posteriores y retiro

Objetivo: repetir el slice 3 por ruta hasta agotar consumidores del shell
legado y retirar la infraestructura temporal.
