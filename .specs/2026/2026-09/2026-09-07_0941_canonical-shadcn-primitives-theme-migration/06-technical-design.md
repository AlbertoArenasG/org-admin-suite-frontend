# Technical Design: Canonical Shadcn Primitives and Theme Migration

## Scope

- Primitivas canónicas de shadcn afectadas por date picker, lookup y menú de
  filtros.
- Contrato de tokens base, superficies, radios y controles en los tres temas.
- Estrategia de instalación y documentación de componentes externos.

## Runtime

`next-themes` conserva la propiedad de la preferencia y aplica una de las
clases `classic`, `ambient` o `ambient-deep` a `html`. Cada clase declara el
contrato visual completo. `globals.css` no decide valores de apariencia por
tema, excepto reglas legacy que sigan registradas explícitamente durante su
auditoría.

La base de primitivas aprobada es `new-york`/Radix. Se conserva para no mezclar
una migración de runtime con esta iniciativa.

## Token Contract

Cada tema declara estos grupos de valores:

- shadcn base: `--background`, `--foreground`, `--card`, `--popover`,
  `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`,
  `--ring`, `--destructive` y sus foregrounds;
- escala y forma: `--radius`, `--radius-button`, `--radius-input`,
  `--radius-card`, `--control-height-compact`, `--control-padding-inline` y
  `--control-gap`;
- controles compartidos: `--control-surface`, `--control-foreground`,
  `--control-border`, `--control-hover-surface`, `--control-focus-ring`,
  `--control-shadow`, `--control-selection-surface`,
  `--control-selection-foreground` y `--control-selection-indicator`;
- composición existente: `--workspace-canvas-*`, `--module-surface-*`,
  `--dashboard-shell-*`, `--dashboard-navigation-*` y `--sidebar-*`.

`@theme inline` conserva los mappings de Tailwind hacia estas variables, pero
no declara valores. Una variable interna de estructura, por ejemplo el tamaño
de celda de calendario, puede permanecer en CSS local si no representa una
decisión temática.

## Component Boundaries

- `src/components/ui`: primitivas instaladas desde shadcn y compartidas por todo
  el frontend. No contiene decisiones de un módulo ni estilos de tema por ruta.
- `src/components/vendor`: fuente externa que aún requiere conservación propia.
  Puede consumir `@/components/ui`, pero no duplicar primitivas ni redefinir el
  contrato de tema.
- Componentes compuestos: encapsulan comportamiento, copy y estructura del
  control. Sus estilos locales usan roles semánticos; una receta exclusiva
  puede definir variantes por `html.<theme>` sólo dentro de su clase local, sin
  promover esos tokens al contrato global.
- Adaptadores de producto: pueden conservar un contrato público estable, pero
  no existen sólo para inyectar una clase de tema o traducir tokens globales.

## Migration Sequence

1. Confirmar el runtime base y actualizar `components.json` sólo si la decisión
   lo exige.
2. Construir la matriz de tokens y trasladar los valores a cada archivo de tema.
3. Actualizar desde el CLI las primitivas canónicas requeridas y revisar cada
   cambio de API o clase.
4. Migrar imports del date picker, eliminar sus primitivas privadas y reemplazar
   scope/overrides por el contrato común.
5. Simplificar filtros y lookup, manteniendo únicamente CSS de estructura local.
6. Eliminar imports globales de CSS de un componente cuando se vuelvan locales.
7. Validar rutas consumidoras y documentar el procedimiento futuro.

## Registro de Artefactos

| Artefacto                          | Tipo                        | Ubicación                                                                                                                | Responsabilidad                                                                         | Dependencias                                     | Estado         |
| ---------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------- |
| Configuración shadcn               | configuración               | `components.json`                                                                                                        | Mantener la base oficial, aliases y origen del CLI del producto.                        | Decisión de runtime, CLI shadcn.                 | modify         |
| Configuración JS heredada          | cleanup                     | `tailwind.config.ts`                                                                                                     | Retirar configuración no usada por el runtime CSS-first de Tailwind 4.                  | `components.json`, `globals.css`.                | delete         |
| Bootstrap global                   | estilos globales            | `src/app/globals.css`                                                                                                    | Importar temas y Tailwind, declarar mappings y resets sin valores temáticos duplicados. | Archivos de tema, Tailwind.                      | modify         |
| Tema clásico                       | theme                       | `src/styles/themes/dashboard-classic.css`                                                                                | Resolver el contrato total de tokens para `html.classic`.                               | Contrato de tokens.                              | modify         |
| Tema ambient                       | theme                       | `src/styles/themes/dashboard-ambient.css`                                                                                | Resolver el contrato total de tokens para `html.ambient`.                               | Contrato de tokens.                              | modify         |
| Tema ambient deep                  | theme                       | `src/styles/themes/dashboard-ambient-deep.css`                                                                           | Resolver el contrato total de tokens para `html.ambient-deep`.                          | Contrato de tokens.                              | modify         |
| Primitivas canónicas               | primitives compartidas      | `src/components/ui/{button,calendar,popover,input}.tsx`                                                                  | Proveer comportamiento y estilos oficiales compartidos requeridos por los controles.    | Base shadcn confirmada, consumidores existentes. | modify         |
| Date range picker                  | componente compuesto        | `src/components/vendor/shadcn/date-picker/ShadcnDatePickerWithRange.tsx`                                                 | Mantener selección y limpieza de rango usando primitivas canónicas.                     | `ui/calendar`, `ui/popover`, token contract.     | modify         |
| Estilos date range picker          | estilos de componente       | `src/components/vendor/shadcn/date-picker/ShadcnDatePickerWithRange.module.css`                                          | Definir composición local sin mapeos por tema ni reasignación de tokens base.           | Token contract, calendario canónico.             | modify         |
| Primitivas privadas de date picker | cleanup                     | `src/components/vendor/shadcn/date-picker/{button,calendar,popover}.tsx`                                                 | Eliminar copias sustituídas por `src/components/ui`.                                    | Migración de imports completada.                 | modify         |
| Lookup SmoothUI                    | componente externo adaptado | `src/components/vendor/smoothui/searchable-dropdown/{SearchableDropdown,DashboardLookupDropdown}.tsx`                    | Conservar búsqueda y selección sin wrapper de tema.                                     | Token contract, CSS local.                       | modify         |
| Estilos lookup                     | estilos de componente       | `src/components/vendor/smoothui/searchable-dropdown/DashboardLookupDropdown.css`                                         | Definir sólo estructura local y consumir roles semánticos.                              | Token contract.                                  | modify         |
| Menú de filtros                    | componente compartido       | `src/components/filters/{FilterMenuTheme.module.css,FilterMenuTrigger.tsx,FilterOptionList.tsx,DashboardFilterMenu.tsx}` | Usar el contrato de controles sin mapas duplicados por tema.                            | Token contract, primitives existentes.           | modify         |
| Catálogo de controles              | rutas de validación         | `src/app/dashboard-playground/catalog/controls/{date-range-picker,searchable-dropdown}/page.tsx`                         | Verificar manualmente controles compuestos por tema.                                    | Componentes migrados, dashboard playground.      | reuse          |
| Provider de tema                   | provider                    | `src/components/providers/AppProviders.tsx`                                                                              | Mantener las clases activas de `next-themes`.                                           | `classic`, `ambient`, `ambient-deep`.            | reuse          |
| Guía de componentes instalados     | guideline                   | `docs/ui/components/installed-components.md`                                                                             | Documentar fuente canónica, flujo CLI, vendor y componentes compuestos.                 | Decisiones de esta spec.                         | modify         |
| Guía de tokens                     | guideline                   | `docs/ui/tokens.md`                                                                                                      | Documentar dueño y grupos del contrato de tokens.                                       | Archivos de tema.                                | modify         |
| Pruebas unitarias                  | verificación                | no aplica                                                                                                                | No se crean por acuerdo de proyecto.                                                    | Validación manual, lint, typecheck, build.       | not_applicable |

## Validation

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Revisión manual en `classic`, `ambient` y `ambient-deep` de date range picker,
  lookup, menú de filtros y rutas consumidoras de primitivas actualizadas.
- Revisar foco, hover, selección, estados deshabilitados, portales y limpieza de
  rango sin regresiones de teclado.

## Open Questions

- Determinar, durante la implementación, si `vendor` conserva el lookup de
  SmoothUI como fuente externa o si su adaptación ya justifica moverlo a un
  componente compuesto propio. La decisión no bloquea la consolidación de
  primitivas.
