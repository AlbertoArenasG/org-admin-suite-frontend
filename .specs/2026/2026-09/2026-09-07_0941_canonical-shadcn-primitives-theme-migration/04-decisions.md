# Decisions: Canonical Shadcn Primitives and Theme Migration

## 2026-09-07 - Una fuente canónica de primitivas

### Decision

Las primitivas de shadcn del frontend vivirán únicamente en
`src/components/ui` y se actualizarán desde el CLI oficial tras revisar el diff.

### Reason

Las copias privadas dentro de componentes instalados no reciben actualizaciones
ni comparten el comportamiento de la base del producto.

### Impact

- Los componentes compuestos importan desde `@/components/ui`.
- No se copian primitivas por componente ni por fuente de bloque.
- Las actualizaciones se convierten en cambios explícitos y verificables.

## 2026-09-07 - Primitivas canónicas sin personalización de producto

### Decision

Los archivos canónicos de `src/components/ui` no se modificarán para añadir
variantes, estilos o comportamiento específicos de producto. Las necesidades
de producto se resuelven mediante componentes compuestos, primitives de
producto con nombre propio o una implementación nueva.

### Reason

Modificar una primitive compartida convierte una necesidad local en una
regresión potencial para todos sus consumidores y vuelve opaca la siguiente
actualización del CLI.

### Impact

- Un componente compuesto puede importar y configurar una primitive canónica.
- Una copia deliberada deja de ser primitive shadcn: tiene nombre, directorio,
  consumidores y documentación propios.
- No se agregan variantes privadas ni parches de compatibilidad a `ui/`.

## 2026-09-07 - Temas como única fuente de valores

### Decision

Cada tema declara el valor de todos los tokens que integran el contrato visual.
Los componentes no introducen selectores por clase de tema para remapear tokens
fundacionales.

## 2026-09-07 - Tokens exclusivos junto a su componente

### Decision

Los archivos de tema global contienen únicamente tokens semánticos compartidos
y compatibilidad transversal inventariada. Una receta exclusiva de un
componente define sus valores y sus variantes de tema en el CSS local del
componente, acotadas a una clase local.

### Reason

Mantener nombres y valores exclusivos de un componente en cada tema global hace
crecer el contrato sin aportar reutilización ni claridad de propiedad.

### Impact

- `DashboardWelcomeHero` conserva sus variaciones visuales en su CSS module.
- `DashboardButton` es un control de producto fuera de `ui/` y conserva su
  receta en CSS local.
- `--data-grid-*` permanece temporalmente como compatibilidad shared de las
  tablas legacy hasta que exista una tabla canónica.
- Los valores locales idénticos entre todos los temas permanecen en el CSS
  principal del componente; los archivos de tema sólo contienen diferencias.

## 2026-09-07 - Directorio dedicado para componentes con CSS local

### Decision

Todo componente que tenga CSS local propio vive en un directorio dedicado que
contiene su implementación, CSS estructural, variantes por tema y assets
exclusivos. Los componentes sin CSS local pueden permanecer como archivo dentro
de la carpeta de su sección o dominio.

### Reason

Las recetas locales y sus archivos por tema pertenecen a un solo componente.
Agruparlos evita que las carpetas de una sección acumulen CSS y variantes de
componentes no relacionados, sin crear subcarpetas vacías para componentes
simples.

### Impact

- El directorio usa `kebab-case` y expresa la frontera de propiedad completa.
- `DashboardWelcomeHero` es el patrón de referencia para una receta local con
  temas explícitos.
- Los temas globales siguen reservados para tokens compartidos y compatibilidad
  transversal.

## 2026-09-07 - Configuración CSS-first de Tailwind 4 para el CLI

### Decision

El frontend conserva Tailwind 4 como configuración CSS-first. En
`components.json`, `tailwind.config` queda vacío y `tailwind.css` apunta a
`src/app/globals.css`. No se conserva `tailwind.config.ts` ni se declara una
entrada de configuración JS para el CLI.

### Reason

El proyecto nació con Tailwind 4 y no carga el archivo JS mediante `@config`.
Además, el experimento de reinstalar `calendar` con el mismo CLI demostró que
dejar la ruta en `components.json` generaba clases inválidas para custom
properties (`h-[--cell-size]`); al dejarla vacía, el CLI generó la sintaxis de
Tailwind 4 (`h-(--cell-size)`). Aunque el archivo no se cargue por Tailwind,
su declaración en `components.json` sí afecta la salida del CLI.

### Impact

- `globals.css` no conserva defaults visuales paralelos.
- CSS local usa el contrato semántico compartido para su estructura.
- Las recetas de controles quedan consistentes entre date picker, lookup y
  menú de filtros.

## 2026-09-07 - Base de runtime del producto

### Decision

El frontend conserva `new-york`/Radix como su base oficial durante esta
migración.

### Reason

El laboratorio usa Base UI para evaluación, pero adoptar ese runtime en el
producto es una migración diferente a consolidar primitivas y tokens.

### Impact

Las primitivas se actualizarán con el CLI configurado por `components.json`,
revisando el diff y los consumidores antes de mantener cada cambio.
