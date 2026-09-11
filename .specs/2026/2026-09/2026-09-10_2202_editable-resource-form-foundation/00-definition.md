# Definition: Editable Resource Form Foundation

## Initiative

- Name: `editable-resource-form-foundation`
- Date: `2026-09-10`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

Las vistas legacy suelen separar detalle, edición y creación por recurso. Ese
patrón multiplica rutas, composición y formularios, aunque muchos recursos
tienen pocos campos y una edición contextual sería más clara. A la vez,
`UserForm` mezcla tres intenciones de negocio y confirma que un formulario
genérico no debe unificar valores, validación ni payloads de operaciones
distintas.

Antes de migrar formularios a Next Dashboard se necesita definir una base de
formularios y el patrón de detalle editable, sin convertirlo en una abstracción
que conozca recursos, endpoints, permisos o reglas de dominio.

## Expected Outcome

Un contrato de frontend aprobado para que las migraciones futuras puedan elegir
de forma consistente entre:

- un detalle editable dentro de un overlay (`Dialog` o `Drawer`) para recursos
  acotados;
- un detalle editable en una ruta de workspace para recursos amplios o
  seccionados;
- una ruta de edición separada solo cuando el caso la justifique.

La base reutilizable debe trabajar con React Hook Form y Zod, conservar un
formulario, schema y payload propios por intención de negocio, y permitir que
cada módulo conecte sus thunks, slice y permisos funcionales sin HTTP desde la
presentación.

## Included Scope

- Definir la taxonomía de experiencias: diálogo editable, detalle editable en
  ruta y excepción de edición separada.
- Definir la frontera de un componente o composición genérica de formularios
  para Next Dashboard.
- Establecer cómo los módulos conectan carga, mutación, error, reintento,
  permisos y navegación a esa base.
- Evaluar formalmente Shark UI como posible fuente de componentes para
  formularios, sin adoptarlo todavía en producción.
- Definir el camino de migración posterior del módulo de usuarios que resuelve
  la deuda de `UserForm`.

## Excluded Scope

- Implementar el componente genérico o migrar una vista de negocio en esta
  etapa de definición.
- Rediseñar o modificar formularios legacy actuales.
- Adoptar Shark UI, copiar código del Component Lab o instalar dependencias de
  producción.
- Cambiar contratos backend, capabilities, endpoints o reglas de jerarquía.
- Decidir el diseño particular de clientes, proveedores, usuarios u otro
  recurso antes de analizar su caso de uso.

## Constraints

- React Hook Form, Zod y `@hookform/resolvers` ya son parte del stack del
  frontend; la base no los sustituye.
- Cada operación define sus propios valores, schema, payload y callback de
  submit. Una base compartida no transporta campos ajenos a una intención.
- Pages y componentes de presentación no ejecutan HTTP. La integración remota
  mantiene la cadena API client, thunk, slice y contenedor de módulo.
- La habilitación de edición depende de los permisos funcionales vigentes del
  módulo. La base recibe estado y callbacks; no interpreta capabilities ni
  políticas de autorización.
- Component Lab es un entorno de evaluación independiente y no una fuente de
  código importable para el producto.
- Cualquier componente de producción debe respetar primitives canónicas,
  tokens explícitos por tema, responsive, foco y accesibilidad.

## Open Decisions

Ninguna. La iniciativa requiere diseño técnico y registro de artefactos antes
de pasar a implementación.

## Approved Experience Taxonomy

### Editable Overlay: Dialog Or Drawer

Se usa para recursos acotados y autosuficientes: pocos campos, una sola
sección funcional, un submit, sin navegación secundaria, relaciones complejas
ni acciones críticas simultáneas. Puede materializarse como `Dialog` o como
`Drawer`; la spec del recurso escoge la variante según contexto, foco y
comportamiento responsive. Debe resolver cancelación y cambios sin guardar de
forma accesible.

Ninguna variante overlay se extiende hasta convertirse en una página comprimida
con scroll, secciones o dependencias complejas.

### Editable Detail Route

Es el patrón preferido para recursos relevantes, amplios o que crecerán.
Mantiene lectura y edición en la misma ruta, permite secciones funcionales y
puede habilitar edición por sección si sus operaciones son independientes.

### Separate Edit Route

Es una excepción justificada cuando la edición es un flujo distinto al detalle:
wizard, pasos obligatorios, alto riesgo, revisión previa, permisos distintos,
efectos irreversibles o un espacio de trabajo exclusivo.

### Tie-breaker

Ante duda entre diálogo y ruta se usa ruta. Un diálogo no se convierte en una
página comprimida con scroll, secciones o dependencias complejas.

## Approved Form Foundation Boundary

La base compartida resuelve composición visual, modo controlado de lectura y
edición, integración visual con una instancia ya creada de React Hook Form y
acciones controladas de guardar, cancelar, eliminar o reintentar.

Para una ruta amplia, la composición se separa entre un layout de detalle de
recurso y secciones editables. Un diálogo pequeño usa una composición breve
con el mismo ciclo de edición, sin depender del layout de ruta.

La base no crea schemas, tipos de valores, payloads, campos de dominio,
consultas, thunks, permisos, navegación ni decisiones de qué secciones existen.
Tampoco incluye autosave, wizard, auditoría o edición inline de tabla.

## Approved Persistence Strategies

Cada detalle declara una estrategia explícita según la frontera de la operación
remota:

- `section`: una sección posee campos, validación, formulario y mutación
  independientes.
- `global`: el detalle posee una instancia de formulario y una mutación única,
  incluso si presenta sus campos en varias secciones visuales.

No se mezclan ambas estrategias para los mismos campos. Un detalle largo con
una sola operación backend mantiene secciones para lectura y edición, pero
conserva un único estado de cambios pendientes, validación y acción global de
guardar o descartar. Si archivos, logística u otra sección obtiene después una
operación remota independiente, puede adoptar `section` sin alterar los campos
de la transacción global.

## Approved Shark UI Adoption Boundary

Shark UI es una fuente selectiva de bloques evaluados primero en Component Lab.
Un bloque aprobado se integra como vendor encapsulado y se consume únicamente
mediante una composición propia de producto; los módulos no importan directo
desde `vendor`.

Las primitives canónicas de `src/components/ui` permanecen como base. Shark UI
no puede sobrescribirlas y tampoco sustituye React Hook Form o Zod. Cada bloque
requiere evaluación documentada de fuente, licencia, dependencias, tokens,
temas, responsive, foco, teclado y lector de pantalla antes de adoptarse.

## Approved Migration Order

1. Usuarios será el primer consumidor de la base. La primera intención a
   migrar será edición mediante `EditUserForm`; invitación y alta directa se
   organizarán después como formularios propios, sin compartir valores ni
   payloads.
2. Registros de servicio a cliente será la siguiente prioridad. Validará el
   detalle amplio con secciones visuales y transacción global mientras backend
   mantenga una operación única.
3. El orden de los módulos posteriores no se define en esta iniciativa.

## Gate

No se creará código de formularios ni se migrará una ruta mientras no exista
diseño técnico con registro de artefactos y criterios de aceptación
verificables.
