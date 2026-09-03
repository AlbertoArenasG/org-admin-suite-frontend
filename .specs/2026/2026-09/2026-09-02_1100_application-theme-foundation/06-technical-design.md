# Technical Design

## Runtime

`next-themes` continúa siendo el dueño de la preferencia local y coloca el identificador
del tema en `html`: `classic`, `ambient` o `ambient-deep`. No existe un estado paralelo para apariencia del
dashboard.

## Token Contract

Los roles se dividen en:

- contenido: `--background`, `--foreground`, `--card`, `--border`, `--popover`;
- shell: `--sidebar-*`, `--dashboard-shell-*`, `--dashboard-navigation-*`;
- composición: `--workspace-canvas-*`, `--module-surface-*`, `--control-*`.

Las implementaciones de `Clásico`, `Ambient clásico` y `Ambient profundo` resuelven el
mismo contrato. Las tres variantes iniciales usan el mismo conjunto claro para contenido;
difieren en los materiales del
shell. Esto evita que una apariencia del dashboard altere accidentalmente el canvas.

## Integraciones

- `SidebarAccountMenu` muestra un único selector de tema.
- `ModeToggle` reutiliza ese selector en rutas públicas.
- `SnackbarProvider` y MUI resuelven una presentación clara inicial a partir del tema
  global, sin comprobar el antiguo valor `dark`.
- El proveedor temporal `DashboardAppearanceProvider` se elimina.
