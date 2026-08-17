# Definition

## Purpose

Este documento existe para cerrar decisiones críticas del módulo frontend de `internal-asset-control` antes de implementar cambios estructurales.

Regla de trabajo:

- no arrancar implementación estructural mientras existan decisiones críticas sin aprobación final
- tú tomas la decisión final
- aquí solo se registran contexto, opciones, recomendación e impacto
- las decisiones se aterrizan una por una

## Overall Status

- Initiative: `internal-asset-control-frontend`
- Definition status: `completed`
- Implementation ready: `yes`

---

## Decision 01. Alcance funcional de esta spec frontend

### Context

Ya existe backend para:

- `internal-asset-maintenance-record`
- `expiration-status-policy`
- `expiration-notification-policy`
- `recipient-groups`

Y en frontend ya quedaron integrados los módulos administrativos reutilizables de:

- `recipient_groups`
- `expiration_status_policies`
- `expiration_notification_policies`

Lo siguiente natural es construir la primera UI consumidora de esas piezas dentro de `internal-asset-control`.

Antes de definir pantallas, rutas, formularios o wiring de navegación, hace falta cerrar si esta spec frontend debe:

- cubrir solo la base administrativa del recurso principal
- cubrir también acciones operativas específicas como follow-up al provider
- o intentar incluir desde el inicio automatizaciones o comportamientos no visibles en UI

La decisión importa porque:

- este módulo será el primer consumidor real de varias capabilities reutilizables ya construidas
- si la spec intenta abarcar más de la primera superficie operativa visible, crecerá demasiado
- necesitamos mantener la misma disciplina que ya usamos en specs anteriores: una frontera clara de `v1`

### Options

1. Cubrir solo `list + detail` de `internal-asset-maintenance-record`
2. Cubrir `list + detail + create + edit + delete` del recurso principal, incluyendo el follow-up manual al provider, dejando fuera automatizaciones no visibles en UI

### Recommendation

Opción 2.

Es la frontera correcta para `v1` en frontend.

Permite entregar el módulo operativo que realmente usará negocio:

- listado
- detalle
- creación
- edición
- delete
- acción manual de follow-up al provider

sin mezclar en esta misma spec mecanismos automáticos que ni siquiera pertenecen a la superficie visible de UI.

Además, mantiene alineación con lo ya aprobado en backend:

- las políticas ya son administrables por separado
- `internal-asset-control` solo debe consumirlas
- el procesamiento automatizado diario de notificaciones quedó explícitamente fuera de esta etapa

### Implications

- esta spec debe centrarse en `internal-asset-maintenance-record`
- debe consumir módulos ya existentes sin re-rediseñarlos:
  - `recipient_groups`
  - `expiration_status_policies`
  - `expiration_notification_policies`
- debe incluir la acción manual de `provider follow-up` cuando aplique
- no debe incluir automatización de notificaciones ni scheduler
- no debe intentar modelar todavía un catálogo maestro de activos internos

### Decision Final

Se aprueba que esta spec frontend cubra:

- `list`
- `detail`
- `create`
- `edit`
- `delete`
- follow-up manual al provider

todo dentro del recurso principal:

- `internal-asset-maintenance-record`

También se aprueba que esta spec consuma recursos reutilizables ya existentes:

- `recipient_groups`
- `expiration_status_policies`
- `expiration_notification_policies`

Queda explícitamente fuera de esta spec:

- automatización de notificaciones
- scheduler
- cron
- procesamiento batch
- rediseño de módulos ya cerrados
- catálogo maestro de activos internos
- módulos satélite futuros alrededor de activos internos

### Status

approved

---

## Decision 10. UX de `expiration_date` frente al intervalo autocalculado

### Context

Ya quedó aprobado que en backend:

- `expiration_date` puede autocalcularse por defecto
- pero también es editable

Y ya quedó aprobado para frontend que:

- `expiration_date` debe autocalcularse cuando cambien `last_maintenance_at` e `interval`
- pero debe seguir siendo editable dentro de `create/edit`

Falta cerrar cómo se comportará la UX para evitar que el cálculo automático invada una corrección manual del usuario.

### Options

1. Recalcular siempre `expiration_date` cuando cambien `last_maintenance_at` o `interval`, incluso si el usuario ya la editó manualmente
2. Autocalcular por defecto, pero detener el recálculo automático cuando el usuario haga un override manual explícito, con opción de volver al cálculo sugerido
3. No autocalcular en frontend y obligar al usuario a capturar siempre `expiration_date` manualmente

### Recommendation

Opción 2.

Es la UX más clara y más segura.

Permite aprovechar el cálculo automático como ayuda real para el caso normal, pero evita que el sistema le pise al usuario una fecha que corrigió manualmente por una razón operativa válida.

### Implications

- frontend debe distinguir entre:
  - fecha sugerida/autocalculada
  - fecha ajustada manualmente
- una vez que el usuario edite manualmente `expiration_date`, el recálculo automático debe detenerse
- debe existir una acción explícita para volver al cálculo automático

### Decision Final

Se aprueba esta UX para `expiration_date`:

1. `last_maintenance_at` e `interval` alimentan automáticamente `expiration_date`
2. mientras el usuario no toque manualmente `expiration_date`, frontend la seguirá recalculando cuando cambien esas entradas
3. si el usuario edita manualmente `expiration_date`, frontend considerará que existe override manual y dejará de recalcularla automáticamente
4. frontend ofrecerá una acción explícita para volver a la fecha sugerida o recalculada

También se aprueba que el formulario muestre una señal breve cuando la fecha haya sido ajustada manualmente.

### Status

approved

---

## Decision 09. Comportamiento visual del bloque de provider en create/edit

### Context

Ya quedó aprobado que el formulario `create/edit` tendrá un bloque de provider con:

- `sentToProvider`
- nombre del provider
- fecha de envío
- lead time
- notas

También ya quedó aprobado que:

- el bloque provider es opcional
- si `sentToProvider = false`, no debe comportarse como obligatorio
- no conviene limpiar automáticamente los datos del bloque cuando se apague

Falta cerrar cómo debe comportarse visualmente el bloque en frontend para que no meta ruido innecesario.

### Options

1. Dejar siempre visible todo el bloque completo, aun cuando no aplique
2. Usar una experiencia de disclosure progresivo: colapsado cuando no aplica y expandido cuando sí aplica
3. Ocultar completamente el bloque cuando no aplica

### Recommendation

Opción 2.

Es la mejor relación entre claridad y conservación de datos.

Permite:

- reducir ruido visual cuando el registro no involucra provider
- no perder datos ya capturados
- dejar claro que el bloque existe, pero solo se vuelve operativo cuando aplica

### Implications

- el bloque provider no debe estorbar cuando `sentToProvider = false`
- los datos previos del bloque no deben perderse al apagarlo
- el usuario debe poder reactivar el bloque y recuperar esos datos sin recapturarlos

### Decision Final

Se aprueba que el bloque provider en `create/edit` use disclosure progresivo.

Reglas aprobadas:

- cuando `sentToProvider = false`:
  - el bloque provider quedará colapsado o visualmente secundario
  - no se comportará como obligatorio
  - conservará los datos previamente capturados si existen

- cuando `sentToProvider = true`:
  - el bloque provider se expandirá
  - validará lo que backend exija

También se aprueba que:

- el usuario pueda reactivar el bloque y recuperar sus datos previos
- frontend no limpie automáticamente los valores del bloque al apagarlo

### Status

approved

---

## Decision 08. UX de selección de policies dentro de create/edit

### Context

Ya quedó aprobado que el formulario `create/edit` tendrá un bloque de policies con selección de:

- `expiration_status_policy`
- `expiration_notification_policy`

Falta cerrar qué tan rica debe ser esa experiencia dentro del formulario.

La decisión importa porque:

- el usuario necesita elegir recursos reutilizables ya existentes
- pero no conviene convertir el formulario en una mini vista administrativa de policies
- también conviene dar suficiente contexto para no obligar al usuario a salir del flujo solo para recordar qué eligió

### Options

1. Mostrar solo un selector simple con el nombre de la policy
2. Mostrar un selector simple y, cuando exista selección, un resumen corto útil de la policy elegida
3. Resolver la selección con una experiencia más compleja, como buscador/detalle embebido

### Recommendation

Opción 2.

Es el mejor balance entre claridad y velocidad.

Permite mantener el formulario ligero, pero sin dejar al usuario a ciegas sobre qué policy acaba de asociar al registro.

### Implications

- las policies se seguirán seleccionando como recursos existentes
- el formulario no administrará policies
- debe existir contexto corto visible de la selección actual
- no se justifica una experiencia embebida más compleja en `v1`

### Decision Final

Se aprueba que el bloque de policies en `create/edit` use:

- selector simple para `expiration_status_policy`
- selector simple para `expiration_notification_policy`

Y que, cuando exista una selección, frontend muestre un resumen corto útil sin salir del formulario.

Resumen mínimo aprobado:

- para `expiration_status_policy`:
  - nombre
  - estado
  - número de reglas

- para `expiration_notification_policy`:
  - nombre
  - estado
  - número de reglas

También se aprueba que:

- no se administre ninguna policy dentro del formulario
- no se implemente una experiencia embebida compleja de detalle o búsqueda avanzada en esta `v1`

### Status

approved

---

## Decision 07. Representación frontend de `status` persistido y estado derivado por vencimiento

### Context

Ya quedó aprobado que el módulo tendrá:

- un listado operativo
- un detalle rico por bloques
- un formulario `create/edit` centrado en `status` persistido

Este módulo vive de una doble lectura del registro:

- `status` persistido
- estado derivado por vencimiento

Ambos conceptos ya quedaron separados en backend, pero hace falta cerrar cómo deben convivir en frontend para que no compitan entre sí.

La decisión importa porque:

- negocio necesita entender en qué estado operativo va el trabajo
- pero también necesita ver con rapidez qué tan urgente o vencido está
- si ambos se mezclan visualmente en una sola señal, la lectura se vuelve ambigua

### Options

1. Mezclar ambas lecturas en una sola señal visual
2. Mostrar ambas como lecturas distintas y explícitas
3. Priorizar solo una de las dos y ocultar la otra en la mayor parte de la UI

### Recommendation

Opción 2.

Es la única que mantiene claridad conceptual.

`status` persistido responde a:

- en qué estado operativo está este trabajo

El estado derivado responde a:

- qué tan urgente o vencido está respecto a su fecha

No son la misma cosa y no deben competir ni mezclarse en un solo badge.

### Implications

- frontend debe mostrar ambas lecturas como piezas separadas
- `status` persistido seguirá siendo editable
- el estado derivado será solo lectura
- el estado derivado solo debe mostrarse cuando tenga sentido operativo

### Decision Final

Se aprueba que frontend represente ambas lecturas como señales distintas y explícitas.

Reglas aprobadas:

- `status` persistido será el estado operativo editable del registro
- el estado derivado por vencimiento será una lectura calculada y no editable
- ambos convivirán visibles en:
  - listado
  - detalle
- en `create/edit`, el usuario solo edita `status`; el derivado podrá mostrarse solo como lectura informativa cuando ya exista contexto suficiente para calcularlo
- el estado derivado solo se mostrará cuando el registro esté en:
  - `PENDING`
  - `IN_PROGRESS`
- si el registro está en:
  - `COMPLETED`
  - `CANCELLED`
    no debe mostrarse el estado derivado como semáforo activo

También se aprueba que:

- `status` persistido use la señal principal de estado operativo
- el estado derivado concentre la señal visual de urgencia
- no se mezclen ambas lecturas dentro de un solo badge

### Status

approved

---

## Decision 06. Estructura y alcance del formulario create/edit

### Context

Ya quedó aprobado que:

- la vista de detalle será la superficie rica del módulo
- el follow-up manual al provider vivirá en detalle
- el módulo consumirá resources reutilizables ya existentes:
  - `recipient_groups`
  - `expiration_status_policies`
  - `expiration_notification_policies`

Falta cerrar cómo debe organizarse el formulario `create/edit` para que no se vuelva una pantalla pesada o confusa.

La decisión importa porque este recurso combina:

- captura principal del registro
- configuración de policies asociadas
- bloque opcional de provider
- fechas derivadas pero editables

### Options

1. Un formulario plano, con todos los campos en una sola secuencia larga
2. Un formulario por bloques, donde el usuario capture primero el núcleo del registro y luego configure partes opcionales o asociadas
3. Un formulario partido en pasos tipo wizard

### Recommendation

Opción 2.

Es la mejor relación entre claridad y velocidad operativa.

No conviene usar wizard desde `v1` porque todavía no sabemos si el flujo real de captura justifica esa fricción extra. Tampoco conviene dejarlo plano porque el recurso mezcla varias preocupaciones distintas.

La organización por bloques conserva coherencia con la vista de detalle y mantiene el formulario entendible.

### Implications

- el formulario debe organizarse por bloques claros
- las policies deben seleccionarse como recursos ya existentes
- el follow-up manual no debe formar parte de create/edit
- `expiration_date` debe autocalcularse en frontend pero seguir siendo editable

### Decision Final

Se aprueba que el formulario `create/edit` se estructure por bloques.

Bloques aprobados:

1. Bloque principal
   - nombre del activo
   - identificador
   - tipo de mantenimiento
   - status persistido
   - fecha de última atención
   - intervalo
   - fecha de vencimiento
   - observaciones

2. Bloque de policies
   - selector de `expiration_status_policy`
   - selector de `expiration_notification_policy`

3. Bloque de provider
   - `sentToProvider`
   - nombre del provider
   - fecha de envío
   - lead time
   - notas

También se aprueba que:

- si `sentToProvider = false`, el bloque provider pueda permanecer visible pero no debe comportarse como bloque obligatorio
- `expiration_date` se autocalcule en frontend cuando cambien `last_maintenance_at` e `interval`
- `expiration_date` siga siendo editable
- las policies se seleccionen como recursos ya existentes y no se administren dentro del formulario
- el follow-up manual quede fuera de `create/edit` y viva solo en detalle

### Status

approved

---

## Decision 05. Estructura de la vista de detalle

### Context

Ya quedó aprobado que:

- el detalle será una superficie importante del módulo
- el listado será operativo pero no debe competir con la lectura completa del registro
- el follow-up manual al provider vivirá en la vista de detalle

Falta cerrar cómo debe estructurarse esa vista para que no termine siendo una ficha plana y caótica.

La decisión importa porque cada `internal-asset-maintenance-record` concentra varios tipos de información:

- identificación del activo
- estado operativo
- lectura de vencimiento
- fechas e intervalo
- observaciones
- policies asociadas
- bloque opcional de provider
- acción manual de follow-up

### Options

1. Un detalle plano, casi como una lista larga de campos
2. Un detalle por bloques funcionales, donde cada sección responda a una preocupación distinta del registro
3. Un detalle muy resumido, dejando casi toda la lectura rica para la vista de edición

### Recommendation

Opción 2.

Es la más clara para un recurso con varias dimensiones operativas.

Permite ordenar la lectura por contexto y separar:

- resumen principal
- datos del registro
- configuración asociada
- relación con provider
- follow-up manual

sin obligar al usuario a editar para entender el estado real del registro.

### Implications

- la vista de detalle debe agrupar información por bloques claros
- el detalle no debe limitarse a una lista plana de campos
- el follow-up manual debe vivir como bloque propio dentro del detalle cuando aplique

### Decision Final

Se aprueba que la vista de detalle se estructure por bloques funcionales.

Bloques base aprobados:

1. Resumen principal
   - nombre del activo
   - identificador
   - tipo de mantenimiento
   - status persistido
   - estado derivado por vencimiento
   - fecha de vencimiento

2. Datos del registro
   - fecha de última atención
   - intervalo
   - observaciones
   - creado
   - actualizado
   - creado por
   - actualizado por

3. Policies asociadas
   - policy de status por vencimiento
   - policy de notificación por vencimiento

4. Provider
   - si aplica o no aplica
   - nombre del provider
   - fecha de envío
   - lead time
   - notas del provider

5. Follow-up manual
   - acción para enviar follow-up
   - feedback útil del último envío cuando backend lo exponga

También se aprueba que:

- la lectura rica del registro viva en detalle
- no se obligue al usuario a entrar a edit para entender el estado completo del registro

### Status

approved

---

## Decision 04. Nivel operativo del listado principal

### Context

Ya quedó aprobado que `internal-asset-control` tendrá:

- listado principal
- detalle completo
- create
- edit

Y que el detalle será la superficie rica del módulo.

Falta cerrar qué tanto valor operativo debe dar el listado desde `v1`.

La disyuntiva real es:

- si el listado será solo una puerta de entrada a detalle
- si será una superficie operativa balanceada
- o si intentará cargar demasiada información por fila

La decisión importa porque la naturaleza de este módulo no es solo administrativa: negocio necesita ver rápidamente qué registros requieren más atención.

### Options

1. Un listado mínimo, casi solo de navegación:
   - activo
   - tipo
   - status
   - vencimiento
2. Un listado operativo balanceado, que permita entender rápido qué registro requiere atención:
   - activo
   - identificador
   - tipo
   - status persistido
   - estado derivado por vencimiento
   - fecha de vencimiento
   - provider / seguimiento cuando aplique
   - creado o actualizado
3. Un listado muy cargado que intente mostrar casi toda la ficha del registro desde la tabla

### Recommendation

Opción 2.

Es la mejor para la naturaleza de este módulo.

El listado debe dar lectura operativa inmediata del grado de atención que requiere un registro, pero sin competir con la vista de detalle.

### Implications

- el listado debe ser operativo, no solo navegacional
- debe priorizar señales de atención por encima de metadata secundaria
- el detalle seguirá siendo la superficie completa del registro
- el follow-up manual no debe vivir como acción principal dentro de la tabla

### Decision Final

Se aprueba que el listado principal sea un listado operativo balanceado.

Columnas base aprobadas:

- activo
- identificador
- tipo de mantenimiento
- status persistido
- estado derivado por vencimiento
- fecha de vencimiento
- provider
- actualizado

Filtros base aprobados:

- búsqueda por activo o identificador
- status persistido
- tipo de mantenimiento
- estado derivado por vencimiento
- `sentToProvider` si el backend ya soporta bien ese filtro

Sorting base aprobado:

- activo
- tipo
- status
- fecha de vencimiento
- actualizado

Acciones visibles por fila aprobadas:

- ver detalle
- editar
- eliminar

No se aprueba follow-up manual directo en la tabla. Esa acción seguirá viviendo en detalle.

### Status

approved

---

## Decision 03. Ubicación del estado frontend del módulo

### Context

Ya quedó aprobado que esta spec frontend cubrirá el módulo `internal-asset-control` con foco en:

- `internal-asset-maintenance-record`
- follow-up manual al provider

Y que además consumirá capabilities reutilizables ya existentes:

- `recipient_groups`
- `expiration_status_policies`
- `expiration_notification_policies`

Falta cerrar dónde vivirá el estado frontend del módulo para no romper el patrón del proyecto ni fragmentar demasiado pronto la implementación.

La disyuntiva real es:

- si resolverlo con estado local por página
- si crear un solo feature state del módulo
- o si dividirlo desde el inicio en varios feature states pequeños

La decisión importa porque este módulo sí tiene un recurso principal claro, pero también concentra varias responsabilidades operativas:

- listado paginado
- detalle
- create/edit
- follow-up manual
- catálogos auxiliares consumidos por el formulario

### Options

1. Resolverlo mayormente con estado local por página y hooks sueltos
2. Crear un solo feature state del módulo, por ejemplo `src/features/internal-asset-control/*`, con segmentación interna clara por responsabilidad
3. Dividirlo desde el inicio en varios feature states pequeños separados por subflujo

### Recommendation

Opción 2.

Es la mejor combinación entre cohesión y claridad.

Permite mantener una sola frontera de módulo en frontend, sin dispersar demasiado la implementación, pero a la vez obliga a segmentar internamente el estado por responsabilidades reales.

También evita duplicar estado administrativo de módulos ya existentes. Este módulo debe consumir esas capabilities como contratos/opciones del backend, no volverse dueño de su administración.

### Implications

- existirá una sola frontera de feature state:
  - `src/features/internal-asset-control/*`
- dentro de esa frontera el estado deberá segmentarse claramente para:
  - listado
  - detalle
  - create/edit
  - follow-up manual al provider
  - catálogos auxiliares consumidos
- este feature state no será dueño de la administración de:
  - `recipient_groups`
  - `expiration_status_policies`
  - `expiration_notification_policies`

### Decision Final

Se aprueba crear un solo feature state del módulo:

- `src/features/internal-asset-control/*`

con segmentación interna clara por responsabilidad para:

- listado
- detalle
- create/edit
- follow-up manual al provider
- catálogos auxiliares consumidos por este módulo

También se aprueba que este módulo consuma los recursos reutilizables ya existentes como contratos/backend options, sin duplicar su estado administrativo en frontend.

### Status

approved

---

## Decision 02. Estructura de pantallas y navegación del módulo

### Context

Ya quedó aprobado que esta spec cubrirá el recurso principal:

- `internal-asset-maintenance-record`

con estos flujos:

- `list`
- `detail`
- `create`
- `edit`
- `delete`
- follow-up manual al provider

Falta cerrar cómo se estructurará la navegación y qué superficie será la principal para operar el módulo.

La decisión importa porque este recurso no es un CRUD plano. Cada registro puede concentrar bastante información:

- datos del activo
- tipo de mantenimiento
- fechas
- `status` persistido
- estado derivado por vencimiento
- policies asociadas
- bloque opcional de provider
- acción manual de follow-up

Si se intenta resolver demasiado desde el listado o desde modales, la UX puede quedar saturada.

### Options

1. Un solo listado principal y desde ahí entrar a detalle, create y edit
2. Un listado principal, detalle completo del registro, create, edit, y una acción puntual de follow-up al provider resuelta dentro del detalle
3. Un listado principal, create/edit, y un detalle mínimo, moviendo casi todo a modales o acciones inline

### Recommendation

Opción 2.

Es la más consistente con el patrón ya existente del proyecto y la más limpia para este recurso.

Permite:

- mantener el listado operativo y legible
- reservar la vista de detalle para toda la lectura rica del registro
- dejar `create/edit` enfocados en captura
- ubicar el follow-up manual al provider en el lugar natural donde el usuario ya está revisando el contexto completo del registro

También evita meter demasiada complejidad en modales o acciones inline.

### Implications

- existirán rutas explícitas para:
  - `list`
  - `create`
  - `detail`
  - `edit`
- el detalle será una superficie importante del módulo
- el follow-up manual al provider vivirá en la vista de detalle
- no se usarán modales como superficie principal del módulo

### Decision Final

Se aprueba que el módulo tenga esta estructura de pantallas:

- listado principal
- detalle completo del registro
- create
- edit

También se aprueba que:

- desde el listado se navegue al detalle
- desde el detalle se pueda editar
- la acción manual de follow-up al provider viva en la vista de detalle
- no se usen modales como superficie principal del módulo

### Status

approved
