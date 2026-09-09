# Decisiones

## 2026-09-01

### Shell reutilizable antes de migración

**Decisión:** crear una base reusable y validarla primero en Playground.

**Razón:** permite acordar interacción, jerarquía y responsive sin arriesgar
módulos productivos ni adoptar una solución big bang.

**Impacto:** el layout productivo permanece intacto en esta iniciativa.

### Separación de headers

**Decisión:** `Global Header` vive fuera de `Workspace Canvas`; `Workspace
Header` vive dentro y contiene breadcrumbs.

**Razón:** evita mezclar utilidades globales con contexto de la ruta.

**Impacto:** títulos, filtros y acciones de una vista siguen perteneciendo a
`Page Composition`.

### Política explícita de scroll

**Decisión:** admitir `page-content`, `page-composition`, `workspace`,
`table-workspace` y `document` como modos, pero solo un dueño principal por
ruta.

**Razón:** mantiene abierta la posibilidad de headers transformables sin crear
scroll anidado accidentalmente.

**Impacto:** `Workspace Canvas Scroll`, `Page Composition Scroll`, `Page
Content Scroll` y `Table Workspace` son excluyentes. El modo de composición
permite mantener fijo `Workspace Header` mientras el `Page Header` opcional
participa en el scroll. En `Table Workspace`, el shell delimita el área y
`DataTable` es el único dueño vertical en escritorio; en móvil vuelve al scroll
del documento. Solo se adopta cuando la tabla es la superficie operativa
principal y debe aprovechar el área disponible; una tabla secundaria junto a
otras superficies relevantes conserva una composición de página normal.

### Placeholders sin cambio funcional

**Decisión:** mostrar campana y avatar en Playground sin funcionalidad.

**Razón:** validar la composición visual sin decidir aún el futuro de cuenta,
notificaciones o ajustes.

**Impacto:** no se modifica el acceso actual de cuenta en el sidebar.
