# Documentación de UI

## Estado

Área de documentación en evolución, creada el 1 de septiembre de 2026. No
representa todavía un sistema de diseño completo: crecerá conforme las specs
aprueben patrones, componentes y migraciones de módulos o vistas existentes.

## Propósito

Concentrar la referencia de estructura, guidelines, iniciativas y adopciones de
UI. Los documentos de esta carpeta evitan que decisiones aprobadas se pierdan
entre specs puntuales o implementaciones aisladas.

## Estructura

```text
docs/ui/
├─ README.md
├─ adoption-log.md
├─ tokens.md
├─ dashboard-shell/
│  ├─ structure-model.md
│  ├─ guidelines.md
│  └─ migration.md
├─ initiatives/
│  ├─ application-theming.md
│  └─ mobile-responsive-redesign.md
├─ patterns/                 # Futuro: tablas, formularios, detalles y page composition.
└─ components/
   ├─ actions-and-buttons.md
   ├─ page-header.md
   └─ sticky-collapsible-page-header.md
```

## Tipos de Documento

- `dashboard-shell/structure-model.md`: vocabulario y relaciones abstractas.
  Es una referencia conceptual, no una spec de ejecución.
- `dashboard-shell/guidelines.md`: referencia viva y normativa para nuevas
  implementaciones que adopten el dashboard shell.
- `dashboard-shell/migration.md`: proceso operativo para adoptar rutas al
  nuevo shell y retirar la compatibilidad temporal.
- `tokens.md`: estrategia viva para crear y consumir tokens semánticos de UI.
- `initiatives/`: decisiones de dirección y trabajo diferido. No son
  guidelines ni obligan cambios inmediatos, salvo cuando una iniciativa ya
  implementada remite explícitamente a un contrato vivo como `tokens.md`.
- `patterns/`: ubicación reservada para guidelines específicas de tablas,
  formularios, detalles y Page Composition.
- `components/`: contratos aprobados de componentes compartidos. Cada archivo
  indica si su implementación ya está validada o sigue en etapa de Playground.
- `adoption-log.md`: registro de módulos, vistas o componentes existentes que
  adopten una guideline de esta carpeta.

## Catálogo Vivo

`/dashboard-playground/catalog` es la referencia visual navegable del catálogo
en evolución. Su propósito es validar piezas reutilizables con los temas,
viewports y primitivas reales del dashboard; no sustituye sus contratos de
documentación.

- `Components` reúne piezas compartidas que se originan en necesidades reales
  de vistas migradas.
- `Compositions` reúne combinaciones sin datos de negocio que se repiten entre
  rutas.
- `Templates` reúne estructuras completas reutilizables de páginas.
- `Experiments` conserva patrones aislados que todavía no forman parte del
  catálogo estable.

Una entrada de catálogo puede estar en definición o validación. Solo al aprobar
su contrato reutilizable se actualizan `components/`, `patterns/`, las
guidelines o `tokens.md` que correspondan. Una ruta de Playground por sí sola
no convierte un experimento en una dependencia obligatoria.

## Regla de Evolución

Al crear o reestructurar una vista, un módulo o un componente con una guideline
de esta carpeta, la implementación debe registrarse en `adoption-log.md` con
fecha, alcance, spec o iniciativa relacionada y cualquier compatibilidad
temporal que permanezca. Las guidelines solo se actualizan cuando se aprueba
una regla reutilizable, no para registrar detalles aislados de una página.
