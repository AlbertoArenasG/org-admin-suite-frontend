# Analysis: Canonical Shadcn Primitives and Theme Migration

## Initiative

- Name: `canonical-shadcn-primitives-theme-migration`
- Date: `2026-09-07`

## Current State

- `components.json` configura el producto con `style: new-york`, variables CSS
  y alias `@/components/ui`.
- `src/components/ui` ya contiene primitivas compartidas de Radix, entre ellas
  `button`, `input`, `popover`, `sidebar` y `combobox`.
- El date range picker instalado en
  `src/components/vendor/shadcn/date-picker` duplica `button.tsx`,
  `calendar.tsx` y `popover.tsx`.
- El lookup de SmoothUI vive en
  `src/components/vendor/smoothui/searchable-dropdown` y se adapta por una
  clase global importada desde `globals.css`.
- `globals.css` declara una paleta y defaults de tema completos en `:root`,
  además de reglas `.dark`; las tres clases de tema vuelven a declarar una parte
  grande del mismo contrato.
- El date picker remapea `--background`, `--popover`, `--border` y otros
  tokens mediante `.scope` y `.popover`, con tres bloques específicos para
  `html.classic`, `html.ambient` y `html.ambient-deep`.
- `FilterMenuTheme.module.css` repite un mapa local de tokens para cada tema.

## Findings

- Hay dos causas diferentes de inconsistencia visual: valores de tema duplicados
  y componentes que interceptan tokens base dentro de sus propios scopes.
- Actualizar primitivas en el directorio canónico no actualiza el date picker
  porque éste consume copias privadas.
- El contrato de tema aprobado ya define roles de contenido, shell y composición,
  incluidos `--control-*`; falta convertirlo en la única fuente de valores.
- `next-themes` establece sólo `classic`, `ambient` y `ambient-deep` en el
  elemento `html`. La regla `.dark` global no forma parte de los temas activos
  del dashboard y debe auditarse como compatibilidad legacy antes de moverla o
  eliminarla.
- El laboratorio demuestra la estrategia de primitivas compartidas, pero su
  configuración `base-nova`/Base UI no debe trasladarse al producto sin una
  decisión explícita.

## Risks

- Sobrescribir `ui` sin inventario de consumidores puede modificar tamaños,
  `asChild`, portales o estados de componentes ya desplegados.
- Eliminar valores de `:root` sin que cada tema declare el contrato completo
  puede causar un primer paint inconsistente o afectar rutas públicas.
- Cambiar simultáneamente de Radix a Base UI mezcla una migración de runtime con
  la de temas, aumentando regresiones de accesibilidad y comportamiento.
- Conservar aliases de componente innecesarios después de la migración recrearía
  la duplicación bajo otro nombre.

## Constraints

- El usuario no quiere parches de compatibilidad ni modificaciones silenciosas
  de componentes base.
- Los estilos específicos de un componente permanecen junto al componente; los
  archivos de tema no reciben selectores o clases particulares de controles.
- No se agregan pruebas unitarias por iniciativa propia. La verificación incluye
  lint, typecheck, build y revisión manual dirigida.
