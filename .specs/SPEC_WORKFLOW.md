# Guia de Trabajo de Specs de Frontend

**Registrado:** 4 de septiembre de 2026  
**Estado:** Referencia operativa vigente para cualquier sesion que trabaje una
spec en este repositorio.

## Proposito

Esta guia define como colaborar en una iniciativa documentada en `.specs`.
Busca conservar decisiones de producto, estructura, integracion y diseno;
evitar implementaciones parciales o parches; y permitir que una nueva sesion
retome una spec sin depender de la conversacion anterior.

La persona usuaria es la autoridad de producto, arquitectura y diseno. El
agente investiga, propone, implementa y verifica, pero no cambia por cuenta
propia una estrategia, alcance, prioridad, arquitectura visual o decision que
ya fue aprobada.

## Fuentes de Verdad

- La carpeta de una spec conserva historial, analisis, decisiones, plan y
  progreso de la iniciativa.
- `docs/ui/` contiene contratos y guidelines visuales/estructurales vigentes.
- Las specs y handoffs del repositorio API describen los contratos remotos que
  consume frontend.
- El codigo, pruebas y configuracion describen el comportamiento implementado
  actual.
- Si estas fuentes entran en conflicto, detenerse, exponer la discrepancia y
  solicitar una decision antes de continuar.

Antes de trabajar una iniciativa, leer en este orden:

1. `.specs/README.md` y este documento.
2. `.specs/index.md` para ubicar estado, dependencias y specs relacionadas.
3. Todos los archivos de la carpeta de la spec activa.
4. Guidelines, tokens, handoffs y contratos relacionados en `docs/`.
5. Codigo, estilos, rutas, pruebas y configuracion afectados.

## Estructura de una Spec

Cada iniciativa relevante usa una carpeta:

```text
.specs/YYYY/YYYY-MM/YYYY-MM-DD_HHMM_slug-del-tema/
```

Los documentos y responsabilidades son:

- `00-definition.md`: problema, alcance, preguntas abiertas y gate para
  implementar.
- `01-analysis.md`: estado actual, hallazgos, dependencias, riesgos y deuda de
  compatibilidad.
- `02-plan.md`: solucion aprobada, fases y orden de ejecucion.
- `03-task-list.md`: vista macro de tareas en orden fijo.
- `04-decisions.md`: decisiones, razon, alternativas descartadas e impacto.
- `05-progress.md`: bitacora breve por sesion e hitos verificables.
- `06-technical-design.md`: contratos, rutas, composicion, estado y diseno
  concreto.
- `07-implementation-breakdown.md`: slices pequenos y verificables.
- `08-manual-validation.md`: matriz manual cuando el alcance visual o
  interactivo la justifique.

No todos los archivos son obligatorios. Se crean cuando aportan claridad; no se
crea documentacion vacia por cumplir una plantilla.

## Ciclo de Vida

### 1. Definicion

Crear o actualizar `00-definition.md` antes de implementar un cambio
estructural. Debe indicar explicitamente:

- Problema y resultado esperado para usuario y negocio.
- Alcance incluido, excluido y compatibilidad requerida.
- Rutas, modulos, consumidores y dependencias afectadas.
- Restricciones de responsive, accesibilidad, permisos, estado o integracion.
- Decisiones abiertas y quien debe resolverlas.
- `Definition status: in_progress | completed`.
- `Implementation ready: no | yes`.

No iniciar implementacion estructural mientras exista una decision critica
abierta. Si el usuario autoriza una exploracion visual o tecnica, aislarla de
la implementacion real y registrarla como experimento.

### Criterios de Aceptacion y Matriz de Comportamiento

Antes de marcar `Implementation ready: yes`, la definicion o el diseno tecnico
debe establecer criterios verificables de aceptacion. No basta con describir
componentes o estilos: debe quedar claro que comportamiento observara cada tipo
de usuario y como se demostrara.

Para cada flujo relevante, documentar segun aplique:

- Camino exitoso, estado inicial, carga, vacio, error y reintento.
- Visibilidad, permisos, capabilities, autenticacion y comportamiento sin
  acceso.
- Acciones, confirmaciones, feedback, navegacion y efectos secundarios.
- Datos remotos, filtros, paginacion, ordenamiento, mutaciones y
  compatibilidad de contrato.
- Comportamiento responsive, teclado, foco, lector de pantalla y objetivos
  tactiles.
- Dueno de scroll, sticky regions, overflow y limites de interaccion cuando
  corresponda.
- Prueba automatica o validacion manual que evidencia cada criterio.

Las variantes que no apliquen se indican expresamente con su razon. El
breakdown y la validacion deben poder rastrearse a estos criterios; no cerrar
una slice solo porque compila si deja un comportamiento relevante sin probar.

### 2. Analisis y Diseno

Investigar el repositorio antes de proponer cambios. Identificar rutas, layouts,
componentes existentes, stores, hooks, contratos API, permisos, estados de
carga/error, responsive, estilos, tokens, pruebas y deuda de compatibilidad.

Registrar en `04-decisions.md` toda decision que cambie la direccion del
proyecto, especialmente sobre:

- Arquitectura de rutas, layouts, limites de modulos o estrategia de
  coexistencia/migracion.
- Contratos API, modelos de vista, estado remoto/local y manejo de errores.
- Autorizacion, visibilidad, navegacion y datos sensibles.
- Patrones compartidos, componentes reutilizables, tokens o temas.
- Responsive, scroll, accesibilidad, animacion y comportamiento interactivo.
- Estrategias de limpieza posteriores a una migracion.
- Cambios de alcance, alternativas descartadas o excepciones deliberadas.

El agente debe presentar alternativas cuando haya tradeoffs reales, pero debe
pedir confirmacion antes de elegir una que modifique una decision aprobada o
una frontera relevante.

### Registro Obligatorio de Artefactos

**Antes de crear o modificar codigo**, `06-technical-design.md` debe contener
un apartado llamado `Registro de Artefactos`. Es obligatorio para cualquier
feature, refactor estructural, integracion, migracion visual o cambio de
contrato.

El registro define que rutas, componentes, archivos, configuraciones y
documentos intervienen. Para cada artefacto nuevo o modificado debe indicar:

| Campo           | Contenido obligatorio                                                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Artefacto       | Nombre exacto del componente, hook, store, archivo, configuracion o documento.                                                                                          |
| Tipo            | Ruta, page, layout, componente compartido, componente de modulo, hook, store, selector, cliente API, tipo, schema, token, theme, prueba, guideline u otro rol concreto. |
| Ubicacion       | Ruta o directorio exacto donde vive.                                                                                                                                    |
| Responsabilidad | Una sola responsabilidad y resultado esperado.                                                                                                                          |
| Dependencias    | Componentes, contratos API, estado, permisos, tokens, providers o rutas que consume.                                                                                    |
| Estado          | `new`, `modify`, `reuse` o `not_applicable`.                                                                                                                            |

No se aceptan entradas ambiguas como "agregar componente" o "crear store".
Debe indicarse nombre y ruta esperados, por ejemplo:

```text
CustomerServiceRecordsPage
Tipo: page de modulo
Ubicacion: src/app/dashboard/customer-service-records/page.tsx
Responsabilidad: compone la lista y acciones del modulo sin decidir el shell.
Dependencias: CustomerServiceRecordsList, permiso READ, query de listado.
Estado: new
```

El registro debe cubrir expresamente estos grupos. Si alguno no aplica, se
registra como `not_applicable` con una razon; no se omite.

- **Rutas y composicion:** rutas App Router, `page.tsx`, layouts, route groups,
  metadata, redirects, breadcrumbs y configuracion de shell/scroll.
- **UI:** componentes de modulo, compartidos, primitives, dialogs, tablas,
  formularios, estados vacios, loading, error y boundaries.
- **Estado y datos:** hooks, stores, slices, selectors, schemas, tipos,
  adaptadores, cache y transformaciones de modelos API a view models.
- **Integracion:** endpoints, parametros, request/response, errores, carga,
  revalidacion, mutaciones y contratos/handoffs consumidos.
- **Autorizacion y navegacion:** permisos, capabilities, guards UI, visibilidad
  de rutas, grupos de navegacion y fallback sin acceso.
- **Estilos y temas:** tokens, archivos de tema, clases, assets, tipografia,
  responsive, motion y requisitos de accesibilidad visual.
- **Documentacion y verificacion:** pruebas, validacion manual, Playgrounds,
  updates a `docs/ui/`, handoffs y comandos requeridos al usuario.

El registro tambien separa explicitamente:

- Artefactos reutilizados sin modificar.
- Artefactos legacy que permanecen por compatibilidad temporal.
- Experimentos que no forman parte de la implementacion productiva.
- Limpieza diferida y la spec futura necesaria para ejecutarla.

La definicion no puede marcar `Implementation ready: yes` mientras el registro
tenga rutas, contratos, responsabilidades, permisos, estados o tokens sin
resolver. Durante la implementacion, toda desviacion actualiza primero el
registro y queda explicada en `04-decisions.md`; no se crean componentes,
stores o rutas sobre la marcha sin documentar su lugar y proposito.

### Limites de Componentes, Hooks y Estado

No crear componentes gigantes que concentren composicion de pagina, consultas,
mutaciones, reglas de permisos, transformaciones de datos y presentacion. Una
page o contenedor de modulo compone el flujo; los componentes hijos deben tener
responsabilidades cohesionadas y props/contratos claros.

Cuando una parte del flujo tenga complejidad propia o se reutilice entre vistas,
extraerla con un proposito concreto y registrarla antes de implementarla:

- Presentacion reutilizable: componente compartido en la ubicacion coherente
  de `src/components/`.
- Coordinacion reutilizable de UI o estado: hook en `src/hooks/` o dentro del
  modulo cuando no sea global.
- Estado global o transversal: store/slice/selector con ownership y ciclo de
  vida documentados en `src/store/`, `src/stores/` o `src/features/`.
- Adaptacion de API, parsing o transformacion reusable: cliente/adaptador del
  feature, no dentro de JSX.

No crear abstractions preventivas, hooks genericos sin consumidores reales ni
componentes comodin. Separar por responsabilidad, dependencias, reutilizacion y
posibilidad de prueba, no solo por numero de lineas. Si una funcionalidad comun
aparece en varios casos de uso, su contrato debe evitar divergencias entre
vistas.

### Librerias y Bloques Externos

No adoptar una libreria, componente o bloque externo solo para acelerar una
slice. Antes de introducirlo, la spec debe registrar en `06-technical-design.md`:

- Fuente, paquete o bloque exacto, version y licencia cuando aplique.
- Problema concreto que resuelve y alternativas internas o existentes que se
  descartaron.
- Ruta donde se integrara y si se consumira mediante un wrapper propio.
- Personalizacion requerida mediante tokens, compatibilidad con temas y
  responsive.
- Accesibilidad, dependencias adicionales, costo de mantenimiento y riesgo de
  acoplamiento.
- Reglas para que la dependencia no se disperse en modulos sin un contrato
  comun.

Si el bloque se reutilizara entre modulos, extraer una integracion o wrapper
propio en una ubicacion compartida. Si solo es un experimento, aislarlo en
Playground y no convertirlo en dependencia productiva hasta contar con
aprobacion explicita. No modificar el comportamiento de negocio para acomodar
un bloque externo.

### 3. Plan y Slices

El plan se ordena por resultados verificables, no por carpetas. Para trabajo
grande, usar slices pequenos con:

- Objetivo funcional o tecnico concreto.
- Rutas, componentes, contratos y documentos que tocara.
- Limites explicitos: artefactos, rutas, comportamiento o datos que la slice no
  cambia.
- Compatibilidad que debe preservar.
- Pruebas y validacion manual requeridas por viewport y rol cuando aplique.
- Criterio claro de cierre.

Para evitar gaps durante implementacion, las iniciativas por fases mantienen
detallados y consistentes estos tres documentos:

- **`03-task-list.md`:** fases y resultados macro en orden estable. Cada tarea
  contiene objetivo, estado, dependencia previa y criterio de cierre. Los
  comandos que debe ejecutar el usuario se registran como tareas explicitas
  con condicion de inicio y resultado esperado.
- **`07-implementation-breakdown.md`:** desglose ejecutable por slice. Cada
  slice referencia su fase de task list e indica alcance, artefactos del
  registro, pasos ordenados, compatibilidad, contrato API, tokens/guidelines,
  validaciones y condicion de cierre. Si requiere un comando del usuario,
  incluye comando exacto, momento, precondiciones, riesgo y evidencia esperada.
  Antes de escribir codigo, contiene todos los slices previstos en orden.
- **`05-progress.md`:** bitacora cronologica de ejecucion real. Al cerrar una
  slice, registrar fecha, fase/slice, resultado, decisiones o desviaciones,
  rutas o contratos relevantes, validaciones ejecutadas, validacion manual
  pendiente/confirmada y siguiente paso exacto.

La relacion debe poder seguirse sin inferencias:

```text
Fase en 03-task-list.md
  -> slices de 07-implementation-breakdown.md
  -> ejecucion y evidencia en 05-progress.md
```

El breakdown inicial es el plan de referencia, no una restriccion inmutable. Si
surge nueva informacion, se pueden refinar, dividir, combinar, reordenar o
agregar slices. Antes de ejecutar la parte afectada, actualizar task list,
breakdown y progreso con razon, impacto, dependencias y validaciones. Si el
ajuste cambia alcance, arquitectura, contrato, estrategia o una decision
critica, actualizar tambien definicion, plan y decisiones, y consultar al
usuario antes de continuar.

### 4. Experimentos y Playgrounds

Los Playgrounds permiten validar estructura, densidad, responsive, scroll,
motion o temas sin comprometer una ruta de negocio. No sustituyen la
implementacion real ni son evidencia de que un patron esta aprobado.

- Los experimentos viven en una ruta o componente de Playground aislado, como
  `src/app/dashboard-playground/`, sin modificar layouts o modulos productivos
  salvo autorizacion explicita.
- Deben declarar que comportamiento prueban, que piezas son representativas y
  que no son contrato final.
- Una vez aprobado, la spec define como extraer o reutilizar primitives reales;
  no se copia el Playground dentro de un modulo.
- Al retirar un experimento, eliminar sus rutas, enlaces y componentes si ya no
  aportan referencia aprobada. Consultar antes si se trata de una ruta
  compartida o una decision de producto.
- Los diagramas o ejemplos estructurales aprobados se preservan en el
  Playground o en `docs/ui/`; las rutas temporales de analisis se retiran al
  dejar de aportar valor.

### 5. Implementacion

Implementar una slice completa antes de abrir otra. La secuencia esperada es:

1. Confirmar que la definicion esta lista o que el usuario autorizo el slice.
2. Inspeccionar archivos afectados y usar `git status` o `git diff` cuando sea
   necesario para revisar cambios en curso.
3. Explicar brevemente que se modificara antes de editar.
4. Implementar sin revertir trabajo ajeno ni introducir parches temporales.
5. Ejecutar validaciones pertinentes o indicar al usuario las que le
   correspondan.
6. Actualizar task list, decisiones, progreso y `docs/` cuando corresponda.
7. Pedir o reportar la validacion manual que solo el usuario pueda realizar.

Mantener compatibilidad temporal de forma explicita. No reemplazar rutas,
layouts, contratos, componentes compartidos o estrategia de migracion porque
parezca una mejora; consultar primero si cambia el rumbo aprobado.

### 6. Cierre

Una spec se cierra cuando su objetivo se implemento, se verifico y sus
documentos reflejan el estado final. Antes de marcarla como completada:

- Actualizar definition, task list, breakdown, progreso y decisiones.
- Mover reglas permanentes a `docs/`; no usar la spec como guideline viva.
- Registrar adopciones de UI, compatibilidad temporal y limpieza diferida.
- Registrar pruebas ejecutadas, validacion manual y riesgos residuales reales.
- Actualizar `.specs/index.md` con un estado util.

## Tokens, Temas y Calidad Visual

Todo componente nuevo o reestructurado debe seguir
[`docs/ui/tokens.md`](../docs/ui/tokens.md): consumir tokens semanticos y no
valores cromaticos, gradients, blur, sombras o materiales hardcodeados.

- Los tokens estructurales compartidos pueden ser globales: spacing, radios,
  tipografia, dimensiones y comportamiento.
- Todo token cromatico o de material que use una implementacion de `Next Dashboard`
  debe declararse por cada tema activo, aunque hoy sus valores
  coincidan.
- Un componente no debe asumir que la superficie de trabajo siempre es clara ni
  que un tema ambient aplica solo al shell. Consume el rol semantico correcto.
- Crear un token solo para un rol reutilizable; una decision local se compone
  con tokens existentes.
- Al aprobar un patron reutilizable, actualizar `docs/ui/tokens.md`,
  `docs/ui/patterns/<patron>.md` o `docs/ui/components/<componente>.md` segun
  corresponda.

Para componentes React, evitar optimizaciones o abstracciones sin necesidad.
Seguir convenciones existentes y usar `useEffectEvent`, `startTransition` o
`useDeferredValue` cuando el caso concreto lo justifique; no agregar
`useMemo`/`useCallback` por defecto.

## Dashboard Shell y Migracion

Toda ruta que adopte el nuevo shell debe cumplir
[`docs/ui/dashboard-shell/guidelines.md`](../docs/ui/dashboard-shell/guidelines.md)
y su proceso de adopcion en
[`docs/ui/dashboard-shell/migration.md`](../docs/ui/dashboard-shell/migration.md).

- Conservar la URL productiva bajo `/dashboard`.
- Una pagina de negocio no selecciona el shell; el boundary central lo resuelve.
- La adopcion a `next` es explicita en la politica central; una ruta no
  registrada permanece `legacy` por compatibilidad.
- Definir breadcrumbs, `Page Composition`, `Page Header` opcional y dueño de
  scroll antes de migrar una ruta.
- Validar escritorio, movil, permisos, sidebar y ausencia de scroll
  competitivo.
- Registrar cada adopcion aprobada en `docs/ui/adoption-log.md`.

No retirar `LegacyDashboardShell`, boundary, politica ni nombres transitorios
como parte de una adopcion individual. El retiro completo requiere la spec
posterior que indica `migration.md`, y solo se inicia por decision explicita del
usuario.

## Contratos e Impacto Entre Repositorios

Todo cambio que dependa de backend o afecte un contrato remoto debe declarar en
`06-technical-design.md` un apartado de `Contrato e Impacto Entre Repositorios`:
consumidor, contrato anterior/nuevo, compatibilidad, accion requerida,
responsable de validar y ruta documental actualizada. El impacto tambien
aparece en la fase y slice que lo implementa.

Usar estas rutas, segun el cambio:

- `../org-admin-suite-api/docs/frontend/<feature>-handoff.md`: fuente de
  integracion funcional del backend. Revisar y referenciar endpoint, request,
  response, permisos, errores y compatibilidad. Si el contrato API cambia, la
  spec debe coordinar su actualizacion en el repositorio API.
- `docs/ui/adoption-log.md`: modulos, vistas o componentes que adopten una
  guideline de UI, con fecha, alcance, spec y compatibilidad temporal.
- `docs/ui/tokens.md`: regla o contrato reutilizable de tokens.
- `docs/ui/dashboard-shell/guidelines.md`: norma estructural vigente del
  dashboard shell.
- `docs/ui/dashboard-shell/migration.md`: proceso de adopcion o retiro del
  shell; no usarlo como historial de una ruta individual.
- `docs/ui/patterns/<patron>.md`: guideline reutilizable de tablas, formularios,
  detalles o Page Composition.
- `docs/ui/components/<componente>.md`: contrato aprobado de un componente
  compartido.
- `docs/ui/initiatives/<tema>.md`: direccion, exploracion o trabajo diferido
  que aun no constituye una guideline normativa.

No actualizar una guideline para registrar el historial de una sola pagina. La
spec conserva razonamiento y ejecucion; `docs/ui/` conserva la regla vigente.

Antes de implementar una integracion, identificar y referenciar el handoff API
que define el contrato. Si no existe, es ambiguo o no cubre un caso necesario,
registrar la dependencia y el bloqueo en `00-definition.md`, `03-task-list.md`
y `07-implementation-breakdown.md`; no inventar request, response, permisos ni
errores desde frontend. La implementacion inicia cuando el contrato este
confirmado o el usuario apruebe explicitamente una excepcion documentada.

## Validacion

Seleccionar validacion segun riesgo. No afirmar que algo esta verificado si una
dependencia, entorno o accion manual lo impide.

En `06-technical-design.md` o `07-implementation-breakdown.md`, documentar por
riesgo: escenario, nivel de prueba, evidencia esperada y responsable de
ejecutarla.

- Reglas de presentacion, hooks, transformaciones y permisos: pruebas unitarias
  cuando exista infraestructura aplicable.
- Integracion con endpoint, request, response, errores y revalidacion:
  pruebas de integracion o validacion manual contra el contrato disponible.
- Rutas, layouts, redirects, auth y navegacion: pruebas de integracion/e2e o
  matriz manual reproducible.
- Formularios, dialogs, menus y sheet: teclado, foco, escape, click fuera,
  lector de pantalla y feedback de error.
- Responsive: desktop, mobile y breakpoints intermedios afectados; validar
  densidad, overflow, objetivos tactiles y contenido largo.
- Scroll/sticky: verificar dueño unico de scroll, limites de trackpad,
  overscroll, headers y regiones fijadas.
- Tokens y temas: validar cada tema activo y confirmar que no hay valores
  visuales directos en componentes nuevos o migrados.

Si se omite una capa de prueba razonable, registrar la limitacion, el riesgo
evaluado y evidencia alternativa. No usar "no aplica" sin razon.

### Evidencia de Validacion Manual

Cuando una slice requiera validacion manual, registrar la evidencia en
`05-progress.md` o en `08-manual-validation.md` cuando la matriz sea amplia.
Cada caso debe indicar:

- Ruta y rol o estado de cuenta utilizado.
- Viewport, dispositivo o breakpoint, y tema cuando aplique.
- Accion o interaccion validada.
- Resultado esperado y resultado observado.
- Estado: confirmado, pendiente, bloqueado o con riesgo residual.

Adjuntar screenshot solo cuando aclare una discrepancia, una decision visual o
un detalle que el texto no pueda describir con precision. Una captura no
sustituye la descripcion reproducible de la validacion.

## Comandos Ejecutados por el Usuario

El usuario ejecuta exclusivamente, salvo solicitud explicita en contrario:

- Inicio, detencion o reinicio de `npm run dev`, servidores, workers,
  contenedores y procesos de desarrollo.
- Validaciones manuales en navegador, viewport, dispositivo o cuenta real.
- Comandos de CI, despliegue u operacion que decida ejecutar desde su entorno.
- Operaciones Git que modifiquen staging, historial, ramas o remotos.

La sesion puede ejecutar `git status` y `git diff` para inspeccionar el estado.
No ejecuta `add`, `commit`, `merge`, `rebase`, `reset`, `restore`, `stash`,
`fetch`, `pull` o `push` salvo solicitud explicita del usuario.

Cuando un comando del usuario sea necesario, indicar de forma concreta:

1. Fase o slice donde se requiere.
2. Comando exacto.
3. Proposito, precondiciones y riesgo.
4. Resultado esperado y salida que debe compartir si se necesita continuar.
5. Tarea y slice donde quedo registrado.

Esperar confirmacion o salida antes de asumir que se completo. La sesion puede
ejecutar validaciones locales no operativas cuando el usuario no las haya
reservado para si mismo; no inicia servidores para ello.

## Git y Commits

- Usar `git status` y `git diff` para preservar cambios ajenos en worktrees
  sucios.
- No ejecutar operaciones Git que modifiquen staging, historial, ramas o
  remotos sin solicitud explicita del usuario.
- No sugerir comandos destructivos, resets ni reverts salvo solicitud o
  aprobacion expresa.
- Usar Conventional Commits con mensaje en espanol, porque `commitlint` lo
  exige.
- Al cerrar un bloque validable, proponer automaticamente solo el comando
  `git commit -m "..."`, sin incluir `git add`, si el estado del staging hace
  segura esa propuesta. Si staging contiene cambios ajenos o incompletos,
  explicar el riesgo en lugar de sugerir un commit inseguro.

## Comunicacion Entre Sesiones

Al retomar una spec:

1. Informar que documentos y codigo se revisaran.
2. Resumir estado actual, siguiente tarea y decisiones abiertas.
3. No asumir que una decision no documentada fue aprobada.
4. Si falta contexto que cambia arquitectura, comportamiento o diseno,
   preguntar de forma concreta antes de editar.
5. Actualizar `05-progress.md` y `04-decisions.md` para que la siguiente
   sesion continue sin reconstruir razonamiento.

## Checklist de Cierre de Slice

Este checklist es un criterio operativo de cierre, no un archivo o bloque que
deba copiarse literalmente en cada spec. La evidencia se registra en
`03-task-list.md`, `07-implementation-breakdown.md`, `05-progress.md` y,
cuando corresponda, `08-manual-validation.md`. Solo crear una copia local del
checklist si aporta claridad real para una iniciativa excepcional; no duplicar
documentacion que ya demuestra los mismos puntos.

```text
[ ] Alcance implementado sin cambios no autorizados.
[ ] Limites, compatibilidad y efectos secundarios revisados.
[ ] Criterios de aceptacion cubiertos.
[ ] Contrato API, permisos y estados remotos validados cuando aplican.
[ ] Dependencias externas aprobadas y documentadas cuando aplican.
[ ] Tokens, temas, responsive y accesibilidad revisados cuando aplican.
[ ] Validaciones automaticas ejecutadas o limitacion registrada.
[ ] Validacion manual con evidencia reproducible solicitada o confirmada cuando aplica.
[ ] Task list, breakdown y progreso actualizados.
[ ] Decisiones y docs/ui actualizados cuando aplica.
[ ] Comando de commit convencional en espanol propuesto si staging es seguro.
```
