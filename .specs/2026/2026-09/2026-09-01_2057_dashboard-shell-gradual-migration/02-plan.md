# Plan

## Objetivo

Permitir que una ruta de `/dashboard` adopte el nuevo Dashboard Shell sin
cambiar su URL ni impactar rutas que permanezcan en el shell legado.

## Diseno Objetivo

- `DashboardLayout` conserva la responsabilidad de proteger el arbol y delega
  la composicion visual a un boundary de migracion.
- `LegacyDashboardShell` contiene el markup actual sin cambios funcionales.
- `NextDashboardShell` compone `SidebarProvider`, `AppSidebar` y las
  primitivas de `dashboard-shell` aprobadas.
- `resolveDashboardShell(pathname)` consulta una politica central y retorna
  `legacy` o `next`.
- Las paginas de negocio se conservan como children del layout; no importan
  shells ni conocen el registro de adopcion.

## Fases

### Fase 1. Cerrar definicion de coexistencia

- Aprobar la conservacion de URLs, el boundary central y el registro local.
- Definir el contrato del resolvedor de pathname y los criterios de cobertura.
- Mantener la seleccion de la primera ruta fuera de esta spec.

### Fase 2. Extraer shell legado sin regresion

- Crear `LegacyDashboardShell` con el markup actual.
- Reducir `DashboardLayout` a auth y boundary de seleccion.
- Verificar visual y funcionalmente rutas representativas no migradas.

### Fase 3. Incorporar shell nuevo al boundary

- Crear `NextDashboardShell` basado en las primitivas ya validadas.
- Crear politica tipada de adopcion con conjunto vacio inicialmente.
- Añadir pruebas unitarias al resolvedor, incluidos pathnames dinamicos y
  negativos.

### Fase 4. Primera adopcion real

- Abrir una spec o slice para elegir una ruta y su modo de scroll.
- Registrar un patron de ruta deliberado en la politica.
- Adaptar solo la composicion necesaria y validar desktop, movil y permisos.

### Fase 5. Migracion gradual y retiro

- Registrar cada adopcion en `docs/ui/adoption-log.md`.
- Migrar rutas por iniciativas independientes.
- Cuando no existan rutas `legacy`, retirar boundary, shell legado y politica.

## Criterios de Salida

- Una ruta puede usar el nuevo shell bajo su URL productiva actual.
- Una ruta no registrada conserva el shell legado sin diferencias funcionales.
- La seleccion de shell esta centralizada, es tipada y se prueba de forma
  determinista.
- Las paginas de negocio no contienen condicionales de shell.
- Cada adopcion tiene validacion responsive y se registra en el adoption log.
