# Implementation Breakdown

## Slice 1. Boundary sin adopciones

Objetivo: extraer el shell legado y crear el boundary de runtime con una
politica vacia que siempre resuelva `legacy`.

Incluye:

- `LegacyDashboardShell` extraido sin cambios visuales;
- `DashboardLayout` delegado;
- resolvedor tipado con politica vacia;
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

## Limite de la Iniciativa

La adopcion de una ruta, las adopciones posteriores y el retiro del shell
legado no son slices de esta iniciativa. Cada uno requerira una spec con
alcance, riesgos y validacion propios.
