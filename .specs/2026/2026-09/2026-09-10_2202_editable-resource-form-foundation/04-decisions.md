# Decisions: Editable Resource Form Foundation

## 2026-09-10 - Separación por intención de negocio

**Status:** approved

Los formularios futuros definen valores, schema, payload y submit por
intención de negocio. La reutilización se limita a presentación o secciones de
campos con una responsabilidad realmente común.

**Reason:** evita propagar campos y reglas de alta directa a invitación o
edición, como ocurre actualmente con `UserFormValues`.

**Impact:** esta iniciativa no crea formularios de dominio ni define valores,
schemas o payloads de una intención de negocio.

## 2026-09-10 - Base antes de migraciones de formularios

**Status:** approved

Antes de migrar formularios de módulos legacy a Next Dashboard se definirá y
construirá una base reutilizable de composición de formularios.

**Reason:** evita que cada migración decida de forma independiente estados,
acciones, permisos, feedback y estructura visual.

**Impact:** la iniciativa define y valida el contrato neutral de la base dentro
de su propio alcance, sin seleccionar ni preautorizar adopciones posteriores.

## 2026-09-10 - Frontera de la base de formularios

**Status:** approved

La base compartida resuelve únicamente:

- composición visual de formulario, encabezado, contenido, acciones y feedback;
- modo de lectura o edición controlado por el módulo;
- coordinación visual con una instancia de React Hook Form ya creada;
- acciones controladas de submit, cancelación, eliminación y reintento.

Para recursos amplios se usarán dos capas: un layout de detalle de recurso y
secciones editables. Los recursos acotados podrán usar un diálogo breve que
reutilice el ciclo de edición sin acoplarse al layout de una ruta.

Quedan fuera schemas, valores, payloads, campos de dominio, HTTP, thunks,
slices, permisos, navegación, decisiones de secciones, autosave, wizard,
auditoría y edición inline de tablas.

**Reason:** reutiliza estructura y experiencia sin crear un nuevo formulario
monolítico que mezcle procesos de negocio distintos.

**Impact:** cada formulario de dominio es dueño de su tipo, schema, adaptación
de datos y mutación; el componente compartido recibe una instancia y callbacks
controlados.

## 2026-09-10 - Estrategias de persistencia en detalles amplios

**Status:** approved

Cada detalle declara explícitamente una de estas estrategias:

- `section`: la sección tiene formulario, validación y mutación
  independientes.
- `global`: el detalle conserva una sola instancia de formulario y mutación,
  aunque sus campos se organicen en varias secciones visuales.

No se mezclan ambas para los mismos campos. Las secciones de un detalle largo
no implican operaciones separadas por sí mismas: si backend persiste el
recurso mediante una única operación, la interfaz mantiene cambios pendientes,
validación y guardar/descartar globales. Una sección futura, como archivos o
logística, solo adopta `section` al disponer de operación remota independiente.

**Reason:** la estructura visual debe hacer legible un recurso amplio sin
falsear la frontera transaccional del backend.

**Impact:** registros extensos, como control de activos o servicio a cliente,
pueden crecer mediante secciones con una transacción global. Clientes y
proveedores pueden combinar secciones de lectura con secciones independientes
cuando su contrato remoto realmente lo permita.

## 2026-09-10 - Taxonomía de detalle y edición

**Status:** approved

Se adopta una taxonomía de tres patrones:

1. Overlay editable (`Dialog` o `Drawer`) para recursos acotados,
   autosuficientes, de una sección y un submit, sin navegación secundaria,
   relaciones complejas o acciones críticas simultáneas. La spec de cada
   recurso escoge la variante; no existe una preferencia global obligatoria
   entre ambas.
2. Detalle editable en ruta como patrón preferido para recursos relevantes,
   amplios, seccionados o con crecimiento esperado.
3. Ruta de edición separada como excepción para flujos distintos al detalle:
   wizard, pasos, revisión, alto riesgo, permisos distintos o efectos
   irreversibles.

Ante duda entre overlay y ruta se usa ruta. Ningún overlay se extiende hasta
convertirse en una página comprimida con scroll y secciones.

**Reason:** reduce duplicación de vistas sin forzar recursos complejos en un
contenedor que no puede sostener su interacción, foco, validación y contexto.

**Impact:** cada migración futura clasifica explícitamente el recurso con estos
criterios. La regla no determina por sí sola el diseño de una vista ni su
estrategia de guardado.

## 2026-09-11 - Familia Shark UI para formularios de Next Dashboard

**Status:** approved

Shark UI y Ark UI son la familia oficial para formularios nuevos de Next
Dashboard y overlays asociados. Sus fuentes vivirán bajo
`src/components/vendor/shark/`; no sobrescribirán el `Button` ni el `Spinner`
canónicos de `src/components/ui`. React Hook Form y Zod continúan como stack.

**Reason:** el registro de Shark requiere primitives dependientes y su
instalación directa reemplazaría contratos globales activos. El vendor conserva
una frontera explícita de fuente y dependencias sin introducir un wrapper de
traducción de estilos.

**Impact:** la familia debe consumir tokens semánticos globales directamente,
mantener CSS estructural co-localizado y declarar cualquier rol visual nuevo en
todos los temas activos. Antes de integrar sus fuentes se documentarán
procedencia, licencia, revisión, dependencias, consumidores y actualización;
no se instala todavía ningún bloque en esta iniciativa. Esta es la decisión
vigente para esta etapa, no una restricción absoluta: la persona responsable
puede aprobar en el futuro otra familia vendor, una integración directa o un
cambio de adopción mediante una evaluación explícita.

## 2026-09-13 - Topología estable con presentación opcional

**Status:** approved

La composición conserva la topología `host o ruta -> ResourceFormFrame ->
ResourceFormSection -> campos`, con acciones opcionales en los scopes global y
local, en todos los recursos. Su presentación no es obligatoria: frame y
sección exponen `surface` (`card | bare`) y `density`
(`comfortable | compact | none`), y permiten omitir título y descripción
visibles. Ambas variantes pueden declararse como un valor fijo o por breakpoint
mediante `{ base, md? }`.

**Reason:** un recurso pequeño no debe heredar protagonismo visual de
superficies, padding y encabezados que solo son útiles para un detalle amplio.
Mantener los nodos estructurales evita bifurcar composiciones por apariencia.

**Impact:** el host o la ruta puede ser dueño del único título visible. Las
specs de recurso deciden qué capas se muestran y, cuando haga falta, su
combinación responsive, sin alterar la estrategia de persistencia ni crear una
variante estructural alternativa.
El catálogo conserva el espécimen completo y documenta su anatomía para
referencia futura.

## 2026-09-13 - Acciones por alcance y posición opcional

**Status:** approved

`ResourceFormFrame` y `ResourceFormSection` exponen slots opcionales
`headerActions` y `footerActions`. `ResourceFormActions` puede ocupar cualquiera
de ellos, sin que su ubicación visual determine la operación de backend.

**Reason:** varias secciones visuales pueden pertenecer a una sola mutación
atómica, mientras que un recurso distinto puede requerir mutaciones autónomas
por sección. Un único footer global o acciones implícitamente ancladas a cada
sección no representa ambos modelos.

**Impact:** una mutación global usa acciones del frame, en header o footer. Una
sección solo recibe acciones de persistencia cuando su operación es independiente.
Las specs de recurso declaran atomicidad, instancia de formulario y mutación;
los slots solo resuelven presentación y alcance explícito.

## 2026-09-13 - Política de overlays para formularios

**Status:** approved

Los overlays de formularios se reservan para recursos breves de una sola
sección. Un recurso con varias secciones, navegación intraformulario o scroll
prolongado usa una ruta dedicada. No se implementa en esta fundación una
variante de overlay extenso, viewport interno ni regiones sticky.

**Reason:** las necesidades actuales no requieren un overlay largo; adelantar
esa infraestructura agregaría complejidad de scroll, foco y responsive sin un
consumidor de negocio que la justifique.

**Impact:** `Dialog` y `Drawer` siguen siendo hosts intercambiables solo para
recursos acotados. Una futura excepción debe declararse y diseñarse en la spec
del recurso, incluyendo dueño de scroll, comportamiento responsive y regiones
fijas si fueran necesarias.

## 2026-09-13 - Lectura sin edición y layout de dominio

**Status:** approved

Un recurso accesible con permiso de lectura y sin permiso de edición conserva
la misma ruta y composición en `mode="read"`: no renderiza controles editables
ni acciones de editar, guardar o descartar. El módulo consumidor resuelve esa
autorización y entrega el modo; la fundación no consulta permisos.

El frame y cada sección declaran de forma independiente sus variantes de
presentación, títulos, descripciones y slots. El formulario de dominio es dueño
del layout entre secciones y de sus campos: puede apilar secciones, usar grids
responsivos y combinar superficies o densidades sin trasladar esa decisión a la
fundación.

**Reason:** una estructura compartida no debe duplicar rutas de lectura y
edición ni imponer una cuadrícula que desconozca el contenido del recurso.

**Impact:** las specs de recurso definen autorización, layout y combinaciones
visuales concretas. El preview conserva variantes independientes como
referencia, pero no intenta simular todas las combinaciones posibles.

## 2026-09-13 - Adjuntos fuera de la fundación

**Status:** approved

La carga de binarios y la persistencia de sus identificadores, URLs o
referencias en un recurso no se abstraen en esta fundación. Se abordarán en una
spec futura.

**Reason:** requieren contrato de backend, permisos, progreso, reintento,
eliminación, tratamiento de huérfanos y una decisión específica para creación
de recursos aún inexistentes.

**Impact:** una futura sección de archivos podrá tener operaciones propias si
backend las expone, mientras que la actualización global del recurso conserva
su transacción atómica. No se adelanta una API ni componente genérico de
adjuntos.

## 2026-09-13 - Reutilización entre intenciones de formulario

**Status:** approved

Creación, detalle y edición pueden compartir opcionalmente la composición
neutral, agrupaciones visuales y piezas de campos cuya semántica sea realmente
común. No es un patrón obligatorio ni predeterminado: cada recurso decide si la
coincidencia justifica esa reutilización. No comparten un formulario de negocio
completo: cada intención conserva sus valores iniciales, schema, payload,
submit y mutación.

**Reason:** permite una experiencia visual consistente sin volver a acoplar
reglas de alta, invitación y edición en un tipo compartido como
`UserFormValues`.

**Impact:** `Create*Form`, `Edit*Form` e `Invite*Form` pueden, cuando exista
una coincidencia semántica comprobable, componer grupos presentacionales
comunes. En caso contrario permanecen totalmente independientes; siempre son
dueños de su integración RHF y su contrato remoto.

## 2026-09-13 - Intenciones similares mantienen rutas y contratos separados

**Status:** approved

Operaciones similares, como crear directamente e invitar a un usuario, se
mantienen como rutas e intenciones separadas mientras tengan capacidades,
payloads o efectos remotos distintos. No se decide implícitamente la operación
según los permisos presentes.

**Reason:** evita ambigüedad de propósito, autorización y estado local en una
misma pantalla.

**Impact:** una lista puede exponer ambas acciones a quien tenga ambas
capacidades. Una futura spec podrá justificar una experiencia de alta unificada
con selector explícito, pero deberá conservar formularios y submits distintos.

## 2026-09-13 - Navegación intraformulario exclusiva de ruta

**Status:** approved

Los formularios largos pueden activar navegación intraformulario opcional solo
en `ResourceFormRoute`. Todas sus secciones permanecen montadas en el mismo
documento; tabs o navegación lateral son controles de recorrido hacia anclas,
no cambian contenido ni rutas. El estado activo se sincroniza mediante scroll
spy propio.

La navegación no pertenece a `ResourceFormFrame`: aunque el frame contiene
visualmente las secciones, debe permanecer neutral y reutilizable en ruta,
`Dialog` y `Drawer`. `ResourceFormRoute` coordina la navegación, el contexto
de scroll entregado por la composición de página y las regiones sticky
opcionales de la ruta.

**Reason:** separa la topología visual reutilizable de la política de scroll y
recorrido propia de recursos amplios, sin convertir overlays breves en páginas
comprimidas.

**Impact:** se implementa una pieza propia sin adoptar primitives de ReUI ni
sobrescribir las de Shark/Ark. Cada spec de recurso decide si habilita la
navegación, sus etiquetas, variante responsive y regiones sticky. Los overlays
multi-sección continúan fuera de política.

## 2026-09-10 - Responsabilidades de integración

**Status:** approved

La base de formularios no conoce endpoints, capacidades auxiliares ni reglas
de dominio. El módulo coordina API client, thunk, slice, permiso funcional,
adaptación de datos y callbacks; la composición de formulario recibe estado y
acciones controladas.

**Reason:** conserva la separación vigente entre transporte, negocio, estado y
presentación.
