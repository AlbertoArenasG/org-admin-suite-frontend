# Decisions: Generic Data Table Foundation

## 2026-09-08 - Component Boundary

### Decision

Construir un `DataTable` de producto para colecciones remotas, no un reemplazo
de la primitive `Table` de shadcn ni una copia de bloques descargados.

### Reason

La aplicacion necesita consistencia de interaccion y presentacion entre vistas,
manteniendo primitives compartidas y limites claros de responsabilidad.

### Impact

- La primitive `Table` sigue resolviendo marcado base y accesibilidad.
- Los bloques del Component Lab solo son referencias de capacidad y UX.
- Cada modulo conserva sus modelos de dominio y adapta sus filas al contrato
  comun.

## 2026-09-08 - State And Data Ownership

### Decision

API client, thunks y slices conservan la consulta remota. Zustand conserva
estado local de interaccion cuando corresponda. Pages no ejecutan HTTP y el
`DataTable` no conoce endpoints ni permisos.

### Reason

Respeta la arquitectura vigente y evita duplicar datos remotos o mezclar
transporte, negocio y presentacion.

### Impact

- El contenedor de modulo adapta resultados, query y callbacks.
- URL sync, si una vista lo requiere, se resuelve fuera del componente comun.
- El componente recibe datos, metadata, configuracion y callbacks controlados.

## 2026-09-08 - Scope Of V1

### Decision

V1 incluye las capacidades aprobadas en `00-definition.md`, todas opcionales
por vista excepto los estados remotos que forman parte del ciclo base.

### Reason

Las vistas requieren configuraciones distintas sin sacrificar una experiencia
consistente ni obligar a introducir controles irrelevantes.

### Impact

- Una vista de solo lectura puede omitir acciones, seleccion y edicion.
- Una vista declara sus columnas ordenables, filtros, controles y condiciones
  visuales sin que el componente infiera reglas de dominio.

## 2026-09-08 - Table Settings Menu

### Decision

Las preferencias de presentacion se agrupan en un unico menu de configuracion
en las acciones globales del header. V1 incluye densidad y visibilidad de
columnas cuando la vista las habilite; no incluye reordenamiento de columnas,
filtros ni comboboxes.

### Impact

- La densidad sigue siendo global y persistente.
- Visibilidad es controlada por la vista y no se persiste en v1.
- El menu no se presenta si una tabla no expone preferencias configurables.

## 2026-09-08 - Deferred Scale Strategies

### Decision

Virtualizacion e infinite scrolling quedan fuera de v1. El contrato se disena
para permitir su adicion posterior sin reescribir columnas, renderers, filtros
u ordenamiento.

### Reason

La primera adopcion no los necesita. Introducirlos sin caso de uso elevaria el
riesgo y complejidad de la base.

### Impact

- V1 usa paginacion controlada cuando la vista la habilita.
- Sticky header permanece como capacidad independiente de v1.
- Una fase posterior debe decidir estrategia de renderizado, carga incremental,
  cache, observacion de scroll y validacion de accesibilidad.

## 2026-09-08 - TanStack Table Ownership

### Decision

El `DataTable` crea y configura internamente su instancia de TanStack Table a
partir de filas, columnas, estado controlado y callbacks que recibe por props.

### Reason

Evita que cada modulo repita configuracion de TanStack y permite que el
componente comun mantenga un contrato de interaccion consistente, sin absorber
la responsabilidad de consultas remotas o estado de dominio.

### Impact

- Los contenedores no crean ni entregan una instancia `Table<TData>`.
- El contenedor sigue adaptando datos remotos, conservando URL, Zustand y
  thunks/slices.
- El `DataTable` debe exponer props controladas suficientes para soportar
  paginacion, ordenamiento, seleccion, expansion y visibilidad sin consultar
  endpoints.

## 2026-09-08 - Column Contract And Utility Columns

### Decision

Cada columna de dominio declara un `id` tecnico estable, encabezado localizado,
accesor y/o renderer, configuracion de ordenamiento remoto, ancho,
visibilidad, alineacion y edicion opcional. Seleccion, expansion y acciones se
modelan como columnas utilitarias agregadas por el `DataTable` segun la
configuracion de la vista.

### Reason

Separa el significado del dato de los mecanismos de interaccion comunes. Una
vista puede representar el mismo recurso sin adoptar checkboxes, acciones o
detalle expandible, y el backend puede ordenar por un campo distinto al `id`
tecnico de UI.

### Impact

- El `id` de columna no se usa como contrato implicito de API.
- Las columnas ordenables declaran explicitamente su `apiField`.
- Renderers permiten texto, badges, iconos, avatar y contenido compuesto sin
  crear tipos especiales por dominio.
- Resaltado, indicador lateral y variante multilínea pertenecen a tabla o fila,
  no a una columna individual.

## 2026-09-08 - Controlled Remote State And Query

### Decision

El `DataTable` recibe filas, estado remoto, query y callbacks controlados por
el contenedor. La API publica usa paginas base uno y conserva el ordenamiento
por `columnId`; el componente encapsula la adaptacion interna hacia TanStack.

### Reason

El modelo coincide con los contratos del backend, evita filtrar o paginar datos
localmente por accidente y conserva a cada feature como dueño de su query,
URL, thunks y modelo de dominio.

### Impact

- `loading`, `success` y `error` son estados remotos explicitos.
- `empty` y `emptyFiltered` se derivan solamente tras una respuesta exitosa.
- `emptyFiltered` requiere una señal explicita de criterios activos y una
  accion opcional para limpiarlos; el componente no inspecciona un objeto de
  filtros generico para inferirlo.
- Error recibe copy seguro para usuario y `onRetry`, no detalles tecnicos.
- Los callbacks emiten cambios de busqueda, filtros, ordenamiento y paginacion
  al contenedor; no ejecutan solicitudes HTTP.

## 2026-09-08 - Controlled Interaction Contracts

### Decision

Seleccion, expansion, acciones por fila y edicion directa son capacidades
controladas por el contenedor mediante IDs estables de fila y callbacks. El
`DataTable` coordina estructura e interaccion visual; cada modulo aporta
permisos, contenido de detalle, validacion y mutaciones.

### Reason

Las capacidades son opcionales y su semantica depende del dominio. Mantenerlas
fuera del componente evita que una tabla comun interprete permisos, cargue
detalle remoto o implemente reglas de guardado propias de formularios.

### Impact

- Seleccion recibe y emite una lista serializable de IDs, puede excluir filas y
  permite acciones masivas entregadas por la vista.
- Expansion recibe y emite IDs expandidos, puede excluir filas y recibe un
  renderer de detalle. Ese renderer puede ser un componente de modulo con su
  propio ciclo remoto.
- Acciones por fila se calculan por fila en la vista; el componente nunca
  muestra el menu sin acciones permitidas.
- Edicion recibe una celda activa controlada, editor, commit y cancelacion. No
  incorpora inputs, validacion ni persistencia universales.
- El disparador de expansion es un boton en una columna utilitaria. La vista
  puede elegir el chevron estandar o un icono informativo, siempre con un
  `aria-label` localizado que explique que abre detalle adicional. El icono
  informativo no comunica lecturas, pendientes ni un contador.

## 2026-09-08 - Text Layout And Detail Disclosure

### Decision

La vista declara el layout de fila y el comportamiento de texto por columna.
Las filas solo tienen dos alturas estandar: `compact` y `comfortable`.
`single-line` usa la preferencia global; `multiline` se limita a dos líneas y
usa siempre la altura `comfortable`. No se permite una tercera altura ni usar
celdas como tarjetas verticales. El truncado es explicito por columna y exige
una via no dependiente de hover para acceder al contenido completo.

### Reason

La longitud depende del dominio y no debe decidirse por heuristicas del
componente. Conservar una sola variante por fila mantiene dimensiones
predecibles y evita que texto importante se pierda tras una elipsis.

### Impact

- Cada columna elige `nowrap`, `wrap` o `truncate`; el componente no lo
  infiere desde el valor.
- `truncate` requiere que la vista provea expansion, detalle o accion que
  muestre el contenido completo. Un `title` puede complementar en escritorio,
  pero nunca es el unico mecanismo.
- Correos, IDs, URLs y otros valores sin espacios usan envoltura segura solo
  cuando la columna declara `wrap`.
- Movil conserva tabla semantica y scroll horizontal. No transforma filas a
  cards ni oculta columnas automaticamente.
- Para Client Access, los datos técnicos del activo se distribuyen en columnas
  horizontales; observaciones viven en expansion o detalle, no en una columna
  de fila base.

## 2026-09-08 - Table Preferences And Column Widths

### Decision

La densidad se conserva como una preferencia global persistente de DataTable,
con `comfortable` como valor inicial. Los anchos de columna son controlables
por la vista, pero no se persisten en v1.

### Reason

La densidad expresa una preferencia transversal y debe mantenerse al navegar
entre tablas compatibles. Persistir anchos correctamente requiere una clave
estable por tabla, versionado de columnas, limpieza de configuraciones obsoletas
y reglas por viewport; no es necesario para la primera adopcion.

### Impact

- Un store Zustand dedicado persiste solo `compact` o `comfortable` bajo una
  clave propia de preferencias de DataTable. `comfortable` se usa si no existe
  una preferencia valida.
- Todas las tablas de una linea consumen esa preferencia. Las vistas
  `multiline` la ignoran y no muestran su control.
- El tamaño declarado y redimensionado se recibe y emite mediante props
  controladas; al desmontar la vista o recargar, vuelve al ancho configurado.
- Una persistencia posterior podra conectarse desde el contenedor mediante una
  clave explicita de tabla, sin acoplar `DataTable` a `localStorage` ni cambiar
  su contrato de columnas.

## 2026-09-08 - Accessible Column Resizing

### Decision

El redimensionamiento es una capacidad opcional por columna. Requiere limites
`min` y `max` declarados por la vista y se presenta mediante un separador
vertical enfocable, operable con mouse, touch, pluma y teclado.

### Reason

Una franja visual exclusiva para mouse no es utilizable en touch ni accesible
para teclado. Los limites explicitos impiden columnas ilegibles y evitan que el
componente infiera medidas segun datos de un dominio.

### Impact

- El handle expone nombre localizado, `aria-valuemin`, `aria-valuemax`,
  `aria-valuenow` y texto de valor accesible con etiqueta de columna y pixeles.
- `ArrowLeft` y `ArrowRight` ajustan 16 px; con `Shift` ajustan 48 px; `Home`
  y `End` aplican minimo y maximo.
- La zona interactiva mide al menos 24 px, aunque el divisor visual sea menor;
  usa Pointer Events y captura de puntero para mouse, touch y pluma.
- El handle es visible en foco e interaccion, no depende exclusivamente de
  hover. Fuera de su zona, el desplazamiento horizontal de la tabla se
  conserva en touch.
- No aplica a columnas utilitarias de seleccion, expansion o acciones. La
  vista habilita solo columnas de dominio cuyo ancho sea relevante.

## 2026-09-08 - Lazy Expanded Detail Ownership

### Decision

`renderDetail(row)` presenta datos ya disponibles en la fila. Cuando una vista
necesita datos adicionales, entrega como detalle un componente contenedor de
modulo que recibe el ID estable, usa su propio thunk y slice, y presenta su
ciclo remoto dentro de la region expandida.

### Reason

No todos los detalles requieren una solicitud adicional. Mantener carga, cache,
errores e invalidacion fuera de `DataTable` evita acoplarla a endpoints y
permite que cada feature aplique su contrato remoto real.

### Impact

- `DataTable` no solicita, precarga, cachea ni reintenta detalles.
- La region expandida puede mostrar sus propios estados `loading`, `error` y
  `retry` sin bloquear el listado.
- `expandedRowIds` sigue controlado por la vista y permite una o varias filas;
  filtros, pagina o remocion de fila dejan de renderizar el detalle.
- El boton expone `aria-expanded` y `aria-controls`; el detalle recibe un ID
  unico y una region accesible.
- Client Access presenta observaciones desde el listado; no solicita detalle
  al expandirse en su primera adopcion.

## 2026-09-08 - Toolbar And Density Preferences

### Decision

El `DataTable` proporciona el layout de toolbar y el buscador estandar cuando
se habilita. La vista inyecta filtro multicampo, comboboxes y controles propios
mediante slots. La densidad es una preferencia global persistida por un store
Zustand dedicado y llega al componente como prop controlada.

### Reason

Los controles de filtro y sus opciones son propios de cada dominio, mientras
que el buscador y el layout necesitan consistencia. La densidad debe mantenerse
entre vistas compatibles sin crear almacenamiento aislado por tabla.

### Impact

- `toolbar` ofrece slots `filters`, `leading` y `trailing`; no interpreta
  metadata de filtros ni consulta lookups.
- Acciones masivas usan una region estandar derivada de seleccion, no un slot
  arbitrario.
- `rowLayout: multiline` usa una altura propia, anula la densidad y oculta su
  control en esa tabla.
- `DataTable` no importa el store ni escribe `localStorage`; contenedores o
  composicion superior le entregan valor y callback controlados.

## 2026-09-08 - Scroll, Sticky Header And Responsive Behavior

### Decision

Una tabla normal no crea scroll vertical propio: el shell o pagina es dueño de
ese eje y la tabla conserva scroll horizontal local. Al habilitar `sticky
header`, la vista declara una region de tabla con altura o `max-height` que
maneja vertical y horizontal deliberadamente. Movil conserva tabla semantica y
scroll horizontal; no se transforma automaticamente en cards.

### Reason

Un ancestro con `overflow-x: auto` se vuelve la referencia de `position:
sticky`. Sin una region vertical explicita, el encabezado puede no fijarse al
recorrer la pagina. Separar ambos modos evita scroll anidado accidental y
mantiene sticky header predecible cuando se solicita.

### Impact

- `stickyHeader` no se habilita con valores magicos globales: la vista entrega
  region desplazable y offset compatibles con su composicion. Puede usar un
  `maxHeight` numerico o `available`; este ultimo mide el espacio real hasta el
  borde inferior del scroller de pagina y descuenta su padding inferior, sin
  una resta fija ligada al shell.
- Toolbar y slots se apilan o envuelven en pantallas reducidas.
- Hover no es el unico mecanismo para descubrir acciones.
- Controles, handles de redimensionamiento y regiones desplazables deben ser
  operables con teclado, touch y foco visible; la tabla anuncia estados
  relevantes a tecnologia asistiva.

## 2026-09-08 - Fullscreen Presentation

### Decision

Agregar fullscreen como capacidad opcional de presentacion por vista. Cuando se
habilita, `DataTable` usa la Fullscreen API del navegador y ofrece fallback de
espacio ampliado dentro de la aplicacion cuando la API no este disponible.

### Reason

Algunas estaciones de trabajo usan pantallas grandes y requieren concentrar la
consulta en una tabla sin cambiar su dominio, query ni ruta.

### Impact

- El boton se muestra solo para vistas que habiliten la capacidad.
- En fullscreen, toolbar y encabezado permanecen disponibles y la region de
  resultados maneja ambos ejes de scroll.
- El componente sincroniza `fullscreenchange`, ofrece salida visible y restaura
  foco al salir con `Esc` o con el control correspondiente.
- Fullscreen no incorpora datos, permisos ni estado remoto adicionales.

## 2026-09-08 - TanStack Table Product Baseline

### Decision

El `DataTable` de producto y toda tabla nueva se implementan con
`@tanstack/react-table` v9. Las tablas legacy consumen temporalmente el alias
`@tanstack/react-table-v8`.

### Reason

V9 se convierte en el estandar limpio de producto sin reescribir de inmediato
las APIs de 68 consumidores legacy. El alias hace explicita y acotada esa deuda
hasta migrar cada vista.

### Impact

- Los patrones del laboratorio se adaptan conceptualmente a v9; su codigo no
  se copia al frontend.
- El paquete canonico queda en v9 y los imports legacy se aislan bajo el alias
  v8 hasta que cada vista se migre deliberadamente.
