# Page Header

## Estado

Base estática en validación desde el 5 de septiembre de 2026. Se demuestra en
`/dashboard-playground/catalog/page-headers`; las variantes estáticas se
alternan dentro de la misma página. Su adopción en módulos reales requiere una
spec o migración que la justifique.

## Propósito

`PageHeader` agrupa la jerarquía mínima de una vista dentro de `Page
Composition`. No pertenece a `Workspace Header`, que conserva breadcrumbs y
contexto global de navegación.

## Contrato Base

- `title` es obligatorio y normalmente debe ser el `h1` de la ruta.
- `eyebrow`, `description` y `metadata` son opcionales.
- `titleAs` solo ajusta el nivel semántico en catálogos, previews o
  composiciones que ya proveen un `h1`.
- `actions` es opcional y recibe contenido explícito de la ruta.
- `actionsPlacement` usa `end` por defecto; `title` solo aplica a la variante
  minimalista que muestra acciones inmediatas junto al título.
- La implementación base es estática y compacta; no infiere contexto ni
  transforma su contenido al hacer scroll.

## Acciones y Límites

- El componente admite cero o una acción `primary` y hasta dos `secondary`.
  Todas deben ser de alcance completo de página: no pueden depender de una
  tabla, filtro, card o entidad seleccionada.
- `Overflow` y `Destructive` no se incluyen en el `Page Header` inicial; los
  primeros solo se evaluarán ante un caso real de página y los segundos
  pertenecen a flujos de entidad y confirmación.
- Filtros, búsqueda, tabs, ordenamiento, acciones masivas, comandos y
  encabezados de tabla pertenecen a `Page Content`. `Administrar columnas`,
  por ejemplo, vive en la barra de su tabla.
- Una ruta puede omitir el componente cuando otra composición provea una
  jerarquía suficiente.

Los roles `primary`, `secondary`, `overflow` y `destructive` se rigen por el
[contrato transversal de acciones y botones](./actions-and-buttons.md).

## Material y Tokens

El componente consume estos roles declarados por cada tema activo:

- `--page-header-{surface,image,border}`
- `--page-header-{foreground,description-foreground,metadata-foreground,eyebrow-foreground}`

Sus paddings y gaps son estructurales compartidos y viven en
`styles/dashboard/page-header.css`. La base actual es transparente, pero cada
tema puede definir otro material sin modificar el componente ni las vistas.

## Variantes Futuras

`Sticky Collapsible Header` sigue siendo un experimento separado y no sustituye
el header base. Una variante resizable requiere un caso de uso real y una
decisión explícita antes de entrar al catálogo.
