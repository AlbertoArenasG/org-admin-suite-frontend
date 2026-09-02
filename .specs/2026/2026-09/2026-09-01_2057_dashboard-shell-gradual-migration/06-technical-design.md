# Diseno Tecnico

## Boundary de Runtime

`DashboardLayout` se reduce a tres responsabilidades:

1. Aplicar `AuthGuard` al arbol de `/dashboard`.
2. Obtener el pathname actual en un componente cliente de boundary.
3. Renderizar `LegacyDashboardShell` o `NextDashboardShell` alrededor de
   `children` segun `resolveDashboardShell(pathname)`.

El layout no contiene markup especifico de ninguno de los shells. Esta regla
evita que la coexistencia se convierta en una cadena creciente de condicionales
de estilos.

## Shell Legado

`LegacyDashboardShell` recibe `children` y conserva exactamente la estructura
actual: `SidebarProvider`, `AppSidebar`, `SidebarInset`, superficie redondeada,
paddings y wrappers de contenido. La extraccion no cambia props ni clases salvo
para moverlas de archivo.

## Shell Nuevo

`NextDashboardShell` recibe `children` y una configuracion de ruta declarativa.
Compone los providers de sidebar existentes y las primitivas de
`src/components/dashboard-shell/`. La configuracion de ruta aportara:

- segmentos de breadcrumbs;
- modo de scroll de escritorio;
- contenido opcional de Global Header y Workspace Header;
- clases estructurales necesarias para la composicion de la pagina.

No define datos de negocio, consultas, permisos de modulo ni componentes de
pagina. Esos permanecen en la ruta migrada.

## Politica de Adopcion

La politica vive en un modulo dedicado, por ejemplo
`src/components/dashboard-shell/migration/dashboardShellMigration.ts`.

Su API inicial debe ser deliberadamente pequena:

```ts
type DashboardShellVariant = 'legacy' | 'next';

function resolveDashboardShell(pathname: string): DashboardShellVariant;
```

Internamente usa patrones normalizados y exactos o dinamicos explicitamente
declarados. El valor predeterminado siempre es `legacy`. El registro inicia
vacio; una ruta solo usa `next` despues de que su spec lo apruebe.

## Reversion

Para revertir una adopcion se retira o desactiva su patron del registro. La
pagina, URL y shell legado permanecen disponibles. No se requiere revertir
migraciones ajenas ni modificar componentes de dominio.

## Validacion

- Pruebas unitarias del resolvedor para rutas migradas, no migradas, dinamicas
  y prefijos cercanos.
- Verificacion visual antes y despues de extraer el shell legado.
- Verificacion manual de sidebar, navegacion, auth, desktop, movil y dueños de
  scroll en cada ruta migrada.
- `npm run typecheck`, `npm run lint` y `git diff --check`.
