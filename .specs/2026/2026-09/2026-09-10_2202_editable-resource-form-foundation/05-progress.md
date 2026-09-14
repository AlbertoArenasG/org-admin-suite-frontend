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
- Se aprobó Shark UI/Ark UI como familia de formularios de Next Dashboard,
  manteniendo React Hook Form y Zod como stack. Su integración se hará como
  source vendor acotado, no como reemplazo del catálogo canónico.
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
- Se completó la Slice 1: `ResourceFormFrame`, `ResourceFormSection` y
  `ResourceFormActions` establecen estructura, secciones y acciones controladas
  sin introducir tipos de dominio, React Hook Form, Zod o integración remota.
- Se completó la Slice 2: `ResourceFormRoute` ordena la composición de un
  detalle en ruta sin asumir shell o scroll; `ResourceFormOverlay` reutiliza el
  frame y exige que el módulo entregue el contenedor elegido (`Dialog` o
  `Drawer`).
- Se completó la Slice 3: el índice público expone la fundación y la auditoría
  confirmó que su carpeta no importa API, features, stores, permisos ni
  navegación. Lint, typecheck y build terminan sin errores atribuibles a esta
  iniciativa; la validación visual sigue pendiente de un consumidor aprobado.
- Se formalizó que Shark/Ark vivirá bajo `src/components/vendor/shark/` para
  formularios y overlays de formulario. El vendor es una frontera de fuente y
  dependencias, no un wrapper de tokens; no sobrescribirá `Button` ni `Spinner`
  canónicos.
- Se completó la integración de la familia mínima bajo
  `src/components/vendor/shark/forms/`: `Editable`, `Drawer`, sus primitives
  dependientes y `tw-animate-css`. La procedencia y actualización quedaron
  registradas; typecheck, lint y build pasaron sin errores atribuibles.
- Se creó el preview oficial en
  `/dashboard-playground/catalog/resource-forms`. Sigue pendiente la
  validación manual de temas, responsive, teclado, foco y portales.
- Se aprobó la topología estable con presentación opcional: `ResourceFormFrame`
  admite superficie y densidad, y frame y sección pueden omitir encabezados
  visibles. El preview conserva el espécimen completo y añade la anatomía de
  ruta y overlay como referencia de las capas disponibles.
- Se formalizó que acciones y atomicidad son conceptos independientes: frame y
  sección exponen `headerActions` y `footerActions`; una mutación global usa
  slots del frame y una sección solo recibe acciones de persistencia si su
  backend expone una operación propia. El catálogo muestra todos los slots
  como opciones de composición.
- El catálogo incorpora controles de validación compartidos para superficie,
  densidad, encabezados y slots de acciones. Los tres hosts reutilizan la misma
  configuración, sin introducir un consumidor de dominio.
- Se aprobó la política de overlays: solo recursos breves de una sección. Los
  recursos multi-sección, con navegación intraformulario o scroll prolongado
  usan ruta dedicada; no se anticipa una infraestructura de overlay extenso.
- La validación manual funcional aprobó el catálogo en ruta, `Dialog` y
  `Drawer`, con superficies, densidades, encabezados y acciones visibles.
- La simulación local de estados remotos aprobó carga, guardado, error,
  prevención de doble submit y reintento. Viewport móvil, teclado, foco e
  integración RHF/remota real continúan pendientes.
- La validación temática aprobó superficies, acciones, foco y feedback de
  carga/error en cada tema activo.
- La validación de teclado aprobó foco visible, navegación entre controles y
  cierre/restauración de foco de `Dialog` y `Drawer`.
- La validación responsive aprobó la composición en móvil y escritorio, sin
  cambiar implícitamente entre `Dialog` y `Drawer`.
- La validación de slots aprobó acciones globales y locales en header, footer u
  ocultas, con dos secciones opcionales y el mismo comportamiento en ruta y
  overlays.
- La auditoría final confirmó que `src/components/resource-form/` no importa
  integración remota, autorización, navegación, RHF, Zod ni tipos de dominio;
  no se creó ni ejecutó una prueba unitaria. Las validaciones con RHF y
  mutación real se transfirieron como gate obligatorio al primer consumidor.
- El contrato de presentación admite superficie y densidad fijas o responsivas
  mediante `{ base, md? }` en frame y sección. El catálogo conserva controles
  individuales; cada spec de recurso decide y valida su combinación real.
- Se precisó que lectura sin edición conserva la misma composición en modo
  `read`, mientras el módulo decide autorización y omite controles o acciones
  de edición. Layout de secciones y campos pertenece al formulario de dominio.
- Adjuntos quedan explícitamente fuera de esta fundación y se resolverán en una
  spec futura con su contrato backend y ciclo de vida propios.
- Se aprobó que reutilizar composición y grupos presentacionales entre
  intenciones sea opcional, nunca un patrón por defecto. Formularios, schemas,
  payloads y mutaciones permanecen propios; intenciones con capacidades o
  efectos distintos mantienen rutas y contratos separados.

## Estado Final De La Iniciativa

- La fundación, vendor Shark/Ark, preview oficial, documentación y validación
  manual de su alcance neutral están completos.
- No quedan decisiones abiertas ni tareas propias de esta iniciativa.
- RHF, mutación remota, permisos y datos de negocio no son pendientes de esta
  fundación: son gates obligatorios de la spec del primer recurso consumidor.
- Se cerró formalmente la spec. La siguiente iniciativa podrá adoptar la
  fundación desde un recurso de negocio, sin reabrir decisiones de composición
  ya aprobadas.

## Reapertura 2026-09-13

- La iniciativa se reabrió para formalizar e implementar navegación
  intraformulario opcional para recursos largos en ruta. No modifica el límite
  de overlays ni convierte el frame neutral en dueño de scroll.
- Se implementaron `ResourceFormNavigation` y la extensión opcional de
  `ResourceFormRoute`: destinos por ancla, scroll spy con APIs de plataforma,
  tabs en móvil y navegación lateral en escritorio. El preview oficial compone
  dos secciones base y tres adicionales para validar recorridos prolongados.
- La validación manual aprobó navegación por clic y scroll en móvil y
  escritorio, tabs y menú lateral sticky, offsets acumulados con header sticky,
  footer sticky y la exclusión de navegación en overlays.
- Se cerró formalmente la ampliación de navegación intraformulario y la spec
  volvió a estado `closed`.
