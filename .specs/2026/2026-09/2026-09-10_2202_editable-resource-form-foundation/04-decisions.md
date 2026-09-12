# Decisions: Editable Resource Form Foundation

## 2026-09-10 - Separación por intención de negocio

**Status:** approved

Los formularios futuros definen valores, schema, payload y submit por
intención de negocio. La reutilización se limita a presentación o secciones de
campos con una responsabilidad realmente común.

**Reason:** evita propagar campos y reglas de alta directa a invitación o
edición, como ocurre actualmente con `UserFormValues`.

**Impact:** la migración futura de usuarios crea formularios separados para
invitación, alta directa y edición; esta iniciativa no los implementa todavía.

## 2026-09-10 - Base antes de migraciones de formularios

**Status:** approved

Antes de migrar formularios de módulos legacy a Next Dashboard se definirá y
construirá una base reutilizable de composición de formularios.

**Reason:** evita que cada migración decida de forma independiente estados,
acciones, permisos, feedback y estructura visual.

**Impact:** la siguiente spec de implementación debe cerrar el contrato de la
base y validarlo con un primer consumidor real antes de migrar en serie.

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

## 2026-09-10 - Primeros consumidores y orden de migración

**Status:** approved

Usuarios será el primer consumidor de la base de formularios. La primera
intención a migrar será edición mediante un `EditUserForm` propio; invitación y
alta directa permanecen como operaciones posteriores con formularios, valores,
schemas y payloads separados.

Registros de servicio a cliente será la siguiente prioridad. Ese módulo
validará el detalle amplio con secciones visuales y transacción global mientras
backend persista el recurso en una única operación. El orden posterior de
clientes, proveedores u otros módulos queda sin definir hasta contar con una
prioridad de producto concreta.

**Reason:** usuarios permite validar la base con la deuda conocida y un recurso
acotado. Registros de servicio valida después el caso de mayor prioridad y
complejidad, sin adelantar decisiones de otros dominios.

**Impact:** la siguiente etapa de esta spec debe elaborar el diseño técnico de
la base y de la primera migración de edición de usuarios. No autoriza migrar el
resto de operaciones de usuarios ni el módulo de registros todavía.

## 2026-09-10 - Responsabilidades de integración

**Status:** approved

La base de formularios no conoce endpoints, capacidades auxiliares ni reglas
de dominio. El módulo coordina API client, thunk, slice, permiso funcional,
adaptación de datos y callbacks; la composición de formulario recibe estado y
acciones controladas.

**Reason:** conserva la separación vigente entre transporte, negocio, estado y
presentación.
