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
├─ dashboard-shell/
│  ├─ structure-model.md
│  └─ guidelines.md
├─ initiatives/
│  └─ mobile-responsive-redesign.md
├─ patterns/                 # Futuro: tablas, formularios, detalles y page composition.
└─ components/               # Futuro: contratos de componentes compartidos.
```

## Tipos de Documento

- `dashboard-shell/structure-model.md`: vocabulario y relaciones abstractas.
  Es una referencia conceptual, no una spec de ejecución.
- `dashboard-shell/guidelines.md`: referencia viva y normativa para nuevas
  implementaciones que adopten el dashboard shell.
- `initiatives/`: diagnósticos y direcciones de trabajo diferidas. No son
  guidelines ni obligan cambios inmediatos.
- `patterns/` y `components/`: ubicaciones reservadas para guidelines más
  específicas que se aprueben en specs futuras.
- `adoption-log.md`: registro de módulos, vistas o componentes existentes que
  adopten una guideline de esta carpeta.

## Regla de Evolución

Al crear o reestructurar una vista, un módulo o un componente con una guideline
de esta carpeta, la implementación debe registrarse en `adoption-log.md` con
fecha, alcance, spec o iniciativa relacionada y cualquier compatibilidad
temporal que permanezca. Las guidelines solo se actualizan cuando se aprueba
una regla reutilizable, no para registrar detalles aislados de una página.
