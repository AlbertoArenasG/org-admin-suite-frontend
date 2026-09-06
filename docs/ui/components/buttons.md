# Botones

## Estado

`DashboardButton` es un primitive local basado en shadcn, en validación desde
el 5 de septiembre de 2026. Se demuestra en
`/dashboard-playground/catalog/actions-buttons/buttons`. `Button` conserva su
contrato Legacy; la adopción de `DashboardButton` es gradual y ocurre solo al
migrar o reestructurar una vista.

## Roles

- `default`: representa `Primary`, la acción principal de un contexto visible.
- `secondary`: acción complementaria visible. En `Page Header` solo aplica si
  tiene alcance completo de página.
- `outline`: acción visible de jerarquía menor en un bloque operativo.
- `ghost`: control de baja prominencia para toolbars y acciones locales.
- `destructive`: acción sensible dentro de un flujo de confirmación.
- `link`: navegación o acción de apariencia textual.

Los roles determinan jerarquía visual, no alcance funcional. El alcance se
define en el [contrato de acciones y botones](./actions-and-buttons.md).

## Tamaños

`sm`, `default`, `lg`, `icon`, `icon-sm` e `icon-lg` son tokens estructurales
compartidos. No se redefinen por tema salvo que una decisión futura cambie el
contrato de densidad completo.

## Material e Interacción

Cada apariencia declara una receta explícita para:

- `--button-primary-{surface,foreground,hover-surface}`
- `--button-secondary-{surface,foreground,border,hover-surface,hover-border}`
- `--button-outline-{surface,foreground,border,hover-surface,hover-border}`
- `--button-ghost-{surface,foreground,hover-surface,hover-foreground}`
- `--button-destructive-{surface,foreground,hover-surface}`
- `--button-link-foreground`
- `--button-{focus-outline-width,focus-outline-color,transition-duration,transition-easing,disabled-opacity}`

Un botón nuevo o migrado no debe usar utilidades cromáticas directas para
sustituir estos roles. `DashboardButton` solo se monta dentro de `Next
Dashboard`, donde la receta del tema activo es obligatoria.
