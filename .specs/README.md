# Frontend Specs

`.specs` guarda el historial de analisis, definicion, plan, tareas, decisiones y progreso de iniciativas de frontend, incluyendo desarrollos nuevos, features, refactors y cambios estructurales.

## Objetivo

- evitar depender del contexto vivo de una sola sesion
- dejar trazabilidad tecnica de cambios importantes
- registrar decisiones antes de implementar
- separar claramente definicion, diseño, tareas y progreso
- permitir avanzar por slices pequenos sin perder consistencia
- distinguir entre documentos historicos en `.specs` y documentos vivos en `docs/`

## Cuando Usarlo

Usar `.specs` para:

- desarrollos nuevos medianos o grandes
- features funcionales nuevas
- refactors de arquitectura frontend
- cambios de estado global, auth, permisos o navegacion
- migraciones de contratos backend en varias pantallas
- cambios que vayan a durar varias sesiones

No hace falta usar el esquema completo para:

- fixes pequenos
- cambios visuales aislados
- ajustes triviales de copy o estilos

## Estructura

Cada iniciativa vive en una carpeta con este formato:

```text
YYYY/MM/YYYY-MM-DD_HHMM_slug-del-tema/
```

Ejemplo:

```text
.specs/2026/2026-07/2026-07-28_1830_roles-permissions-frontend-refactor/
```

## Archivos Recomendados

- `00-definition.md`: documento activo para cerrar decisiones antes de implementar
- `01-analysis.md`: estado actual, hallazgos, dependencias, riesgos y contexto tecnico
- `02-plan.md`: propuesta de solucion, fases y orden de implementacion
- `03-task-list.md`: tareas en orden fijo por fase, con checkbox y status inline
- `04-decisions.md`: decisiones tomadas, razon e impacto
- `05-progress.md`: bitacora breve por sesion
- `06-technical-design.md`: diseño tecnico concreto del cambio
- `07-implementation-breakdown.md`: breakdown por slices o subtareas

## Minimo Recomendado En Frontend

Para la mayoria de iniciativas de frontend, usar al menos:

- `00-definition.md`
- `02-plan.md`
- `03-task-list.md`
- `05-progress.md`
- `06-technical-design.md`

Agregar `01-analysis.md`, `04-decisions.md` y `07-implementation-breakdown.md` cuando el cambio lo necesite.

## Estado De Definition

`00-definition.md` debe reflejar si la iniciativa ya esta lista para implementacion.

Campos esperados:

- `Definition status`
- `Implementation ready`

Valores tipicos:

- `Definition status: in_progress`
- `Definition status: completed`
- `Implementation ready: no`
- `Implementation ready: yes`

Regla:

- no empezar implementación estructural mientras existan decisiones criticas abiertas

## Convencion De Task List

Las tareas no se reordenan por status.

Formato sugerido:

```md
- [ ] Nombre de la tarea
      Status: pending
```

Estados sugeridos:

- `pending`
- `in_progress`
- `done`
- `blocked`
- `cancelled`

## Diferencia Entre Task List E Implementation Breakdown

- `03-task-list.md` conserva la vista macro por fases
- `07-implementation-breakdown.md` baja el trabajo a slices o subtareas concretas
- la task list no debe volverse una lista ruidosa de detalles
- el breakdown si puede refinarse conforme avance la implementacion

## Convencion De Progreso

`05-progress.md` debe registrar:

- cierres de definicion
- cambios importantes de diseño tecnico
- avances de implementacion
- hitos de integracion con backend
- actualizaciones en `docs/`
- riesgos nuevos o decisiones de alcance

## Enfoque Especifico Para Frontend

Cuando aplique, la spec debe dejar explicitamente:

- pantallas afectadas
- rutas afectadas
- slices o stores afectados
- contratos backend consumidos
- permisos o visibilidad involucrados
- estrategia de migracion UI y runtime
- riesgos de regresion

## Documentos Vivos Fuera De `.specs`

Cuando una iniciativa produzca informacion que deba seguir viva mas alla de la spec, crear o actualizar documentos en `docs/`.

Ejemplos:

- handoffs de integracion
- guias de arquitectura frontend
- reglas de permisos UI
- catalogos de navegacion
- contratos consumidos por frontend

Regla:

- `.specs` conserva historial y razonamiento
- `docs/` conserva referencia operativa vigente

## Index

`.specs/index.md` debe servir como vista rapida de iniciativas activas o relevantes.

Estados utiles:

- `definition in progress`
- `definition completed`
- `implementation in progress`
- `blocked`
- `completed`
