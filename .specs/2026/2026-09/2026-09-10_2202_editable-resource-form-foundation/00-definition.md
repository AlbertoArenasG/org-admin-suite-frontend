# Definition: Editable Resource Form Foundation

## Initiative

- Name: `editable-resource-form-foundation`
- Date: `2026-09-10`
- Definition status: `completed`
- Implementation status: `completed`
- Spec status: `closed`

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
- Integrar la familia aprobada Shark UI/Ark UI como source vendor acotado para
  formularios de Next Dashboard y overlays asociados.
- Definir el camino de migración posterior del módulo de usuarios que resuelve
  la deuda de `UserForm`.
- Añadir navegación intraformulario opcional para rutas de recursos largos,
  con scroll spy y regiones sticky configurables.

## Excluded Scope

- Migrar una vista o formulario de negocio. Esta iniciativa implementa y valida
  la fundación neutral, pero no adopta todavía un consumidor de dominio.
- Rediseñar o modificar formularios legacy actuales.
- Migrar un formulario o una ruta de negocio; la integración de Shark/Ark solo
  establece la familia compartida y su preview oficial.
- Cambiar contratos backend, capabilities, endpoints o reglas de jerarquía.
- Decidir el diseño particular de clientes, proveedores, usuarios u otro
  recurso antes de analizar su caso de uso.
- Aplicar navegación intraformulario a una ruta de negocio o a overlays.

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
con scroll, secciones o dependencias complejas. Por política vigente, un
recurso con varias secciones usa ruta dedicada; una excepción futura requiere
una decisión explícita en la spec de ese recurso.

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

Shark UI y Ark UI son la familia aprobada para formularios nuevos de Next
Dashboard y sus overlays de formulario. React Hook Form y Zod permanecen como
stack de valores, validación y submit.

La familia se integra como source vendor bajo
`src/components/vendor/shark/`, sin sobrescribir `src/components/ui/button.tsx`
ni `src/components/ui/spinner.tsx`. El vendor es dueño únicamente de sus
primitives dependientes de formularios y overlays; no es un wrapper de estilos
ni un segundo catálogo general de UI. Las composiciones de producto usarán la
API de formularios aprobada, sin mezclar primitives interactivas de Shark y
Radix de forma arbitraria dentro del mismo flujo.

Shark consume los tokens semánticos globales actuales directamente. El CSS
estructural o de animación exclusivo queda co-localizado con la familia y se
importa globalmente una sola vez si existen portales. Si requiere nuevos roles
visuales reutilizables, cada tema activo los declara explícitamente en su
archivo de familia; no existen fallbacks implícitos entre temas.

La integración documenta fuente, licencia, revisión, dependencias, primitives
internas, consumidores y actualización en
`src/components/vendor/shark/forms/README.md`. El preview oficial ya validó
temas, responsive, foco y teclado; la integración con React Hook Form y una
mutación remota real permanece como gate del primer consumidor de dominio.

## Approved Migration Order

1. Usuarios será el primer consumidor de la base. La primera intención a
   migrar será edición mediante `EditUserForm`; invitación y alta directa se
   organizarán después como formularios propios, sin compartir valores ni
   payloads.
2. Registros de servicio a cliente será la siguiente prioridad. Validará el
   detalle amplio con secciones visuales y transacción global mientras backend
   mantenga una operación única.
3. El orden de los módulos posteriores no se define en esta iniciativa.

## Gate Del Primer Consumidor

La primera ruta de negocio que adopte esta fundación deberá validar React Hook
Form, su mutación remota, permisos reales y los estados derivados de datos de
dominio. Esos casos no corresponden a la fundación neutral ni se simulan como
integración remota en el preview.

## Cierre

La fundación `ResourceForm`, la familia Shark/Ark aprobada, su preview oficial
y la documentación de adopción quedaron implementados y validados dentro del
alcance neutral. La ampliación posterior completó la navegación intraformulario
opcional para rutas largas, incluidos scroll spy, tabs sticky en móvil,
navegación lateral sticky en escritorio y regiones sticky opcionales de ruta.
No quedan decisiones ni tareas abiertas en esta iniciativa. La primera adopción
de negocio deberá cumplir el gate de integración; adjuntos requieren una spec
propia.
