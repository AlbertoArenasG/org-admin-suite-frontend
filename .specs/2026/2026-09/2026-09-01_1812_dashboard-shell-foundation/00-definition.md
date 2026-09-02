# Definición

## Propósito

Crear la base reutilizable del nuevo dashboard shell y una ruta neutral de
Playground que permita validarla antes de migrar vistas reales.

Las reglas vivas se mantienen en `docs/ui/`; esta spec conserva el alcance,
diseño y trazabilidad de la iniciativa.

## Estado General

- Iniciativa: `dashboard-shell-foundation`
- Fecha: `2026-09-01`
- Definition status: `completed`
- Implementation ready: `yes`

---

## Decisión 01. Alcance de la primera entrega

### Contexto

El dashboard actual mezcla estructura compartida, headers de ruta y contenido
de módulo. Se requiere validar una nueva composición sin una migración big bang.

### Decisión Final

La primera entrega crea primitivas reutilizables del shell y una ruta Playground
neutral. No modifica `DashboardLayout`, no migra módulos reales y no redefine
flujos de cuenta, ajustes, permisos ni navegación existente.

### Status

approved

---

## Decisión 02. Capas y componentes reutilizables

### Contexto

La implementación debe reflejar capas estructurales estables, sin convertir
detalles específicos de una vista en abstracciones prematuras.

### Decisión Final

La iniciativa incorpora componentes para `Global Header`, `Workspace Canvas`,
`Workspace Header`, `Page Composition` y la región de contenido scrolleable.
Los componentes usan slots o `children`; no conocen rutas, permisos, datos de
negocio ni el sidebar concreto.

### Status

approved

---

## Decisión 03. Política de scroll

### Contexto

Algunas vistas requieren preservar contexto mientras otras pueden transformar
sus headers durante el desplazamiento.

### Decisión Final

En escritorio, `Page Content Scroll` es el modo predeterminado; `Page
Composition Scroll` y `Workspace Canvas Scroll` son variantes explícitas. En
móvil se usa `Document Scroll`. Una ruta solo puede tener un dueño principal
del scroll vertical.

### Status

approved

---

## Decisión 04. Global Header y placeholders

### Contexto

Se quiere validar visualmente un header de alcance global sin adelantar cambios
funcionales de cuenta o notificaciones.

### Decisión Final

El Playground muestra trigger de navegación, campana y avatar como placeholders
visuales. No se conecta lógica de notificaciones ni se retira la cuenta del
sidebar actual.

### Status

approved

---

## Decisión 05. Móvil y adopción gradual

### Contexto

El shell de escritorio no debe comprimirse de forma mecánica en móvil, y el
código actual debe mantener compatibilidad mientras se migra.

### Decisión Final

En móvil el `Content Inset` no es una superficie visual separada y el scroll
pertenece al documento. Las guidelines nuevas aplican al Playground y a las
adopciones explícitas; no obligan cambios retroactivos en módulos existentes.

### Status

approved
