# Plan: Canonical Shadcn Primitives and Theme Migration

## Objective

Reemplazar la estrategia de primitivas aisladas y wrappers temáticos por una
base única de shadcn y un contrato de tokens resuelto íntegramente por tema.

## Target Design

- `src/components/ui` es el único origen de primitivas shadcn del producto.
- `src/styles/themes/dashboard-*.css` contiene todos los valores de tokens del
  contrato activo; `globals.css` conserva imports, Tailwind, resets y mappings
  sin valores de apariencia por tema.
- Los controles compuestos consumen tokens semánticos comunes. Sus CSS locales
  define únicamente estructura, tamaño propio y composición.
- `src/components/vendor` no contiene copias de primitivas shadcn. Un componente
  de fuente externa puede conservarse allí sólo mientras importe primitivas
  canónicas y tenga una frontera explícita.

## Phases

### Phase 1. Close The Baseline And Token Contract

- Confirmar la base oficial del producto y documentar los comandos de
  actualización reproducibles.
- Inventariar tokens de `globals.css`, temas y scopes locales.
- Definir el contrato final que cada tema debe implementar, incluyendo radios,
  controles, superficies y estados.

### Phase 2. Consolidate Primitives

- Actualizar las primitivas compartidas afectadas desde shadcn, revisar el diff
  y corregir únicamente consumidores impactados.
- Instalar o actualizar `calendar` en `src/components/ui` con la base aprobada.
- Migrar el date range picker para consumir las primitivas canónicas y retirar
  sus archivos duplicados.

### Phase 3. Remove Theme Wrappers

- Mover valores de tokens de `globals.css` a los tres archivos de tema.
- Sustituir remapeos por scope del date picker y del menú de filtros por el
  contrato semántico compartido.
- Simplificar la adaptación del lookup para que sus reglas locales no dependan
  de clases globales ni tokens duplicados.

### Phase 4. Validate And Document

- Revisar catálogo de controles y rutas existentes afectadas en los tres temas.
- Ejecutar lint, typecheck y build; registrar cualquier excepción legacy.
- Actualizar documentación viva y cerrar el inventario de componentes.

## Sequencing Notes

- No se ejecuta `shadcn add` hasta cerrar la decisión de la base oficial.
- El contrato de tokens se completa antes de migrar componentes para evitar
  ajustes visuales dispersos.
- La eliminación de archivos privados ocurre después de que imports y catálogos
  consuman la primitiva canónica.

## Exit Criteria

- Una sola implementación activa por primitiva shadcn afectada.
- Ningún wrapper de control reasigna tokens base por clase de tema.
- Los tres temas satisfacen el mismo contrato semántico.
- Documentación, verificación automatizada y revisión manual completadas.
