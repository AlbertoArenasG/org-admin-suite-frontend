# Definition: Canonical Shadcn Primitives and Theme Migration

## Initiative

- Name: `canonical-shadcn-primitives-theme-migration`
- Date: `2026-09-07`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

El frontend conserva una estrategia temporal para componentes instalados que
duplica primitivas de shadcn dentro de cada bundle de `vendor` y remapea los
tokens globales mediante scopes locales. Esto separa los componentes instalados
de la base canónica de `src/components/ui`, dificulta actualizar shadcn y deja
los valores de tema repartidos entre `globals.css`, archivos de tema y wrappers.

## Expected Outcome

El frontend tendrá una única base de primitivas shadcn compartidas en
`src/components/ui`. Cada tema resolverá el contrato completo de tokens. Los
componentes compuestos conservarán estilos locales para estructura y variantes,
pero no reescribirán tokens fundacionales mediante wrappers de tema ni incluirán
copias privadas de primitivas.

## Included Scope

- Consolidar las primitivas compartidas de shadcn bajo `src/components/ui` y
  actualizarlas de manera controlada desde el registro oficial.
- Migrar el date range picker para que consuma las primitivas canónicas y retirar
  sus copias privadas de `button`, `calendar` y `popover`.
- Reemplazar el mapeo por scope de temas del date picker y las recetas duplicadas
  del menú de filtros por el contrato semántico común.
- Mover todos los valores de tokens de tema a
  `src/styles/themes/dashboard-{classic,ambient,ambient-deep}.css`.
- Dejar `globals.css` como punto de importación, mapeo de Tailwind, resets y
  reglas globales no temáticas, sin valores de tema duplicados.
- Definir el rol de `vendor`, `ui` y componentes compuestos, y actualizar la
  documentación operativa de instalación y tokens.
- Validar las rutas del catálogo de controles y los temas `classic`, `ambient`
  y `ambient-deep`, además de lint, typecheck y build.

## Excluded Scope

- Rediseñar componentes, cambiar su comportamiento funcional o ampliar el
  catálogo de controles.
- Migrar tablas, formularios legacy, MUI o rutas no afectadas por las primitivas
  que se actualicen en esta iniciativa.
- Cambiar el runtime de React, Next.js o las dependencias de dominio.
- Adoptar automáticamente la base Base UI usada por el laboratorio si no se
  aprueba como decisión específica para el frontend de producto.

## Constraints

- No se modifica comportamiento de negocio, contratos API ni permisos.
- No se introducen overrides de un componente particular en los archivos de
  tema. Los temas declaran valores semánticos; la estructura queda junto al
  componente que la consume.
- No se duplican primitivas de shadcn dentro de componentes compuestos o
  bundles instalados.
- Las actualizaciones del CLI se revisan como diff explícito y se validan antes
  de promoverlas; no se sobrescribe una primitiva sin revisar sus consumidores.
- Las rutas legacy no incluidas deben conservar su comportamiento visual actual.

## Initial Acceptance Criteria

- Cada una de las tres clases de tema resuelve los tokens base de shadcn, radios,
  superficies, estados y contrato de controles sin depender de valores en
  `:root` de `globals.css`.
- Date range picker, lookup y menú de filtros muestran el mismo contrato de
  superficie, borde, hover, foco y selección para el tema activo.
- El date range picker importa `Button`, `Calendar` y `Popover` desde
  `@/components/ui`; no quedan copias privadas de esas primitivas en su carpeta.
- Ningún CSS module usa selectores por `html.classic`, `html.ambient` o
  `html.ambient-deep` para reconfigurar un componente.
- Las primitivas canónicas mantienen compatibilidad con sus consumidores
  existentes o los consumidores afectados se migran dentro de esta iniciativa.
- `docs/ui/components/installed-components.md` y `docs/ui/tokens.md` describen
  la estrategia resultante y el procedimiento de actualización.

## Decision 01. Base Oficial De Shadcn Para El Frontend

### Context

El producto usa `style: new-york` y primitivas Radix en `components.json`. El
laboratorio usa `style: base-nova`, que instala primitivas Base UI. La estrategia
canónica compartida no exige que ambos repositorios usen el mismo runtime.

### Options

1. Conservar `new-york` y Radix como base del producto, y actualizar sus
   primitivas con el CLI actual. Recomendado.
2. Cambiar el producto a `base-nova` y Base UI durante esta migración.

### Recommendation

Conservar la base `new-york`/Radix del producto en esta iniciativa. Resuelve la
duplicación, habilita actualizaciones oficiales y limita la migración a temas y
primitivas sin introducir un segundo cambio de runtime. La adopción de Base UI
puede evaluarse por separado con una spec propia y un inventario de APIs
compatibles.

### Implications

- El laboratorio sigue siendo un entorno de evaluación independiente y puede
  conservar Base UI.
- El CLI se ejecutará desde la raíz del frontend usando el `components.json` del
  producto y el registro oficial correspondiente a `new-york`.
- Las dependencias Radix existentes no se sustituyen en esta migración.

### Decision Final

Conservar `new-york`/Radix como base oficial del frontend de producto.

### Status

approved
