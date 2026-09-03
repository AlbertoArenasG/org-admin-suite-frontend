# Plan

## Phase 1. Contrato global

1. Configurar `next-themes` con los identificadores internos `classic`, `ambient`
   y `ambient-deep`.
2. Definir tokens semánticos de composición, shell, canvas, superficie y controles.
3. Mantener valores de compatibilidad para que las rutas legacy conserven su apariencia.

## Phase 2. Consumidores centralizados

1. Retirar `DashboardAppearanceProvider` y su selector duplicado.
2. Conectar selector de cuenta, `ModeToggle`, notificaciones y MUI al tema global.
3. Usar nombres de apariencia; no exponer los identificadores internos.

## Phase 3. Adopción gradual

1. Cada componente nuevo o migrado consume roles semánticos, no colores directos.
2. Cada spec de módulo define qué piezas adopta y actualiza los guidelines vivos cuando
   establezca un patrón reutilizable.

## Out Of Scope

- Rediseñar módulos legacy.
- Ofrecer tema oscuro, sistema o persistencia backend.
- Definir paletas futuras adicionales.
