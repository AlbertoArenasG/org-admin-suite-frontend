# Progress: Editable Resource Form Foundation

## 2026-09-10

- Se abrió la iniciativa de frontend para definir la base de formularios y el
  patrón de detalle editable antes de migrar vistas legacy.
- Se registraron como acuerdos la separación por intención de negocio, la
  arquitectura de integración vigente y la necesidad de una base común previa
  a nuevas migraciones.
- Se mantuvieron abiertas la clasificación modal/ruta, el alcance de la base,
  la estrategia de guardado por secciones, la adopción de Shark UI y el primer
  consumidor de validación.
- No se creó ni modificó código de producto, dependencias, rutas o componentes.
- Se aprobó la taxonomía para diálogo editable, detalle editable en ruta y
  ruta de edición separada. La ruta es el desempate ante duda entre diálogo y
  ruta.
- Se aprobó la frontera de la base de formularios: composición y ciclo visual
  reutilizables, con valores, schemas, payloads e integración remota bajo
  propiedad del formulario de cada módulo.
- Se aprobó un modelo de persistencia híbrido: guardado por sección solo ante
  operaciones remotas independientes; detalles largos con una única operación
  backend usan secciones visuales sobre una transacción global.
- Se aprobó la adopción selectiva y encapsulada de Shark UI, manteniendo React
  Hook Form, Zod y las primitives canónicas como base de producto.
- Se aprobó el orden inicial de consumidores: edición de usuarios primero y
  registros de servicio a cliente después. No se definió el orden de módulos
  posteriores.
- La definición queda cerrada. Falta elaborar diseño técnico, registro de
  artefactos y criterios verificables antes de habilitar implementación.

## 2026-09-11

- Se formalizó que el patrón overlay puede usar `Dialog` o `Drawer`. La
  selección queda bajo análisis de la spec de cada recurso; ambas variantes
  conservan el límite de recursos acotados y no sustituyen una ruta de
  workspace.
- Se registró el diseño técnico de la fundación: `ResourceFormFrame`,
  `ResourceFormRoute`, `ResourceFormOverlay`, `ResourceFormSection` y
  `ResourceFormActions` vivirán como composición neutral de producto bajo
  `src/components/resource-form/`.
- Se definieron sus fronteras, slices de implementación y validación manual.
  La base no implementa ni migra todavía formularios de negocio; usuarios
  requerirá una iniciativa posterior propia para creación, invitación y
  adopción.
