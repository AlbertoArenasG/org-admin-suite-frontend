# Guidelines del Dashboard Shell

## Estado

Referencia viva y normativa para toda implementación nueva que adopte el nuevo
dashboard shell. No es una spec de ejecución ni obliga a reescribir de forma
inmediata los módulos existentes.

Establecido el 1 de septiembre de 2026. Debe evolucionar conforme se aprueben
nuevos patrones o se adopte el shell en módulos reales.

## Referencia

Los nombres y responsabilidades abstractas de las capas se definen en
[`structure-model.md`](./structure-model.md). Este documento establece cómo
deben comportarse esas capas al avanzar de afuera hacia adentro.

## Alcance de Adopción

Estas guidelines aplican a Playground, a las nuevas implementaciones que usen
este modelo y a módulos migrados de forma explícita. La interfaz existente
mantiene compatibilidad temporal hasta que una spec o una iniciativa de
migración indique su adopción.

## App Shell

### Responsabilidad

`App Shell` define el marco global de la experiencia interna: viewport, fondo
global, límites visuales, overflow y transición entre escritorio y móvil.

No define la navegación interna, el canvas de trabajo, cards, tablas,
formularios ni contenido de módulos.

Su material visual se resuelve mediante los tokens del tema de aplicación. El
shell no debe introducir colores, gradients, blur o sombras directos por ruta;
las variantes `Clásico`, `Ambient clásico` y `Ambient profundo` viven en el
contrato documentado en [`tokens.md`](../tokens.md).

### Escritorio

- Ocupa todo el viewport mediante una altura mínima basada en `dvh`.
- Resuelve su fondo, mesh y marco exterior mediante los tokens del tema activo.
- Entrega un espacio exterior compacto a las capas de navegación y contenido.
- No permite desbordamiento horizontal accidental.
- El desplazamiento vertical se define dentro del área principal de trabajo;
  no pertenece a los módulos individualmente salvo que un componente lo
  requiera de forma deliberada.

### Móvil

- Ocupa todo el viewport sin reservar margen decorativo alrededor de la ruta
  activa.
- Usa el fondo base definido por el tema en lugar de exponer el marco exterior
  de escritorio.
- Considera las safe areas superior e inferior del dispositivo.
- La navegación móvil se presenta como overlay y no reduce el ancho disponible
  del shell.

### Fondo Global y Overscroll

El fondo global del documento puede quedar visible durante la carga inicial o
en áreas externas al dashboard. Por ello, debe ser coherente con la superficie
que el shell expone en cada viewport y tema:

- En escritorio no debe producir un salto visual frente al marco del dashboard.
- En móvil debe alinearse con el `Mobile Canvas` para no revelar una capa ajena
  alrededor del contenido de ancho completo.

### Breakpoint Inicial

Se toma `md` como punto inicial de transición entre escritorio y móvil, ya que
coincide con el comportamiento actual del sidebar y su trigger. El valor puede
ajustarse si la validación visual y funcional del shell demuestra que otro
breakpoint ofrece una transición más adecuada.

## Navigation Shell

### Responsabilidad

`Navigation Shell` coordina la navegación global y contextual. Resuelve el
grupo seleccionado y las entradas asociadas a ese grupo, pero no conoce el
contenido de las páginas, breadcrumbs ni acciones de una ruta.

### Escritorio

- Se compone de `Navigation Rail` y `Navigation Pane` como superficies
  persistentes.
- El rail permanece disponible para cambiar de área principal.
- El pane presenta la navegación contextual del área seleccionada.
- Al colapsar el sidebar se oculta el pane, pero el rail permanece disponible.
  Es una reducción de densidad, no una navegación distinta.
- La marca se presenta exclusivamente en el rail.
- El pane muestra la identidad de la organización en su cabecera.
- Mientras exista `LegacyDashboardShell`, la cuenta permanece de forma
  temporal en el pie del pane: legacy no dispone del toolbar del canvas. La
  ubicación definitiva se revisará en la spec de cierre de migración, no en
  una adopción individual.

### Móvil

- `Mobile Navigation Sheet` es la representación móvil de `Navigation Shell`,
  no una capa conceptual adicional.
- Dentro del sheet se conservan los roles de rail y pane: selector de área y
  navegación contextual.
- Cambiar de grupo no cierra el sheet; seleccionar una ruta sí debe cerrarlo.
- El sheet debe gestionar foco, cierre por `Escape`, click fuera y cambio de
  ruta.

### Estado

- El grupo seleccionado se conserva al colapsar el pane y al cambiar entre
  escritorio y móvil.
- La ruta activa prevalece sobre una selección anterior: navegar a una ruta de
  otro grupo actualiza el grupo seleccionado.
- La expansión de secciones del pane puede permanecer como estado local y debe
  restaurarse según la ruta activa.

### Contexto de Inicio

`Inicio` es el nombre del contexto de navegación representado por la casita en
el rail. `Panel` conserva el nombre de la ruta y el título de la vista. El
identificador interno `dashboard` no cambia.

`Inicio` conserva el mismo comportamiento de selección contextual que los
demás elementos del rail. Aunque hoy su pane solo contenga la entrada al
dashboard, mantenerlo abierto preserva una interacción uniforme y reserva un
espacio para contenido de navegación o contexto dinámico asociado al usuario
en el futuro.

Ese contenido potencial no se define en este documento y no debe motivar una
implementación anticipada.

### Límites

- `App Shell` define viewport, fondo y overflow.
- `Navigation Shell` define navegación y su variante responsive.
- En `Next Dashboard`, `Workspace Toolbar` solicita la apertura del sheet móvil
  mediante el trigger compartido. Legacy conserva esa responsabilidad en su
  `Global Header` exterior.

## Navigation Rail

### Propósito

`Navigation Rail` es el selector de contextos principales del dashboard.
Contiene `Inicio` y los grupos de navegación autorizados; no presenta rutas
secundarias, submenús, marca, cuenta ni acciones utilitarias.

### Interacción

- `Inicio` y los demás grupos son selectores contextuales con el mismo
  comportamiento.
- Seleccionar un contexto actualiza el contenido de `Navigation Pane`; no
  navega automáticamente a una ruta.
- El estado activo representa el contexto seleccionado, no necesariamente una
  ruta específica.
- Los contextos visibles se resuelven exclusivamente a partir de navegación y
  permisos; no se muestran grupos sin rutas accesibles.

### Escritorio

- Se presenta verticalmente, con ancho fijo y disponible aun cuando el pane se
  encuentre colapsado.
- Cada control muestra tooltip con el nombre del contexto.
- Los objetivos de interacción tienen un tamaño mínimo de 44 px.
- Los estados activo y de foco visible no dependen solo del color.

### Móvil

- Conserva el mismo rol dentro de `Mobile Navigation Sheet`.
- Se reorganiza horizontalmente y permite scroll intencional cuando los
  contextos no caben en el ancho disponible.
- Mantiene objetivos de interacción de al menos 44 px y nombres accesibles.

## Navigation Pane

### Propósito

`Navigation Pane` presenta las rutas y subsecciones del contexto seleccionado
en `Navigation Rail`. No contiene marca ni preferencias globales. Durante la
coexistencia, incluye temporalmente la cuenta en su pie para mantener legacy
operativo; no se deben agregar otros controles globales al pane.

Su contenido se resuelve por permisos antes de renderizarse.

### Estructura

- Muestra el nombre del contexto activo, como `Inicio`, `Operación` o
  `Directorio`.
- Las entradas raíz pueden ser enlaces simples o secciones expandibles.
- Las rutas hijas se muestran debajo de su entrada raíz con jerarquía visual
  clara.
- La ruta activa y su rama permanecen visibles; su identificación no depende
  solo del color.

### Expansión

- Solo una entrada raíz expandible permanece abierta a la vez, como acordeón.
- La rama de la ruta activa se abre automáticamente.
- La expansión manual es estado local del pane; navegar a otra rama activa
  actualiza esa expansión.
- `Inicio` conserva el mismo pane aunque actualmente tenga una sola ruta.

### Escritorio

- Ocupa el espacio contextual junto al rail y puede desplazarse verticalmente
  de manera independiente.
- No debe desbordar horizontalmente ni ocultar etiquetas largas.
- Al colapsar el sidebar, deja de recibir foco e interacción.

### Móvil

- Se muestra debajo del selector horizontal de contextos dentro de
  `Mobile Navigation Sheet`.
- Mantiene la misma jerarquía y objetivos de interacción de al menos 44 px.
- Elegir una ruta cierra el sheet; expandir una sección no lo cierra.

### Accesibilidad

- Se renderiza como navegación con nombre accesible del contexto.
- Los enlaces activos exponen `aria-current="page"`.
- Las secciones expandibles comunican su estado y son operables por teclado.

## Content Inset y Workspace Canvas

### Responsabilidad

`Content Inset` entrega el área disponible entre `Navigation Shell` y el
contenido de una ruta. `Workspace Canvas` delimita la superficie de trabajo de
esa ruta. Las dos capas se resuelven juntas para evitar que el shell, el canvas
y los módulos compitan por el scroll.

### Escritorio

- `Content Inset` permanece fijo dentro del espacio disponible del `App Shell`
  y no es una región scrolleable.
- `Workspace Canvas` ocupa el espacio restante de `Content Inset` y también
  permanece fijo.
- En rutas de `Next Dashboard`, `Workspace Toolbar` es el primer hijo fijo del
  canvas; sus utilidades globales viven dentro de la misma superficie de
  trabajo. `Workspace Header` ocupa la fila inmediatamente posterior para
  breadcrumbs y contexto de ruta.
- `Global Header` exterior queda reservado para `LegacyDashboardShell` durante
  la coexistencia. No se agrega a nuevas rutas ni a rutas migradas.
- En escritorio, su superficie se resuelve exclusivamente mediante la receta
  `--workspace-canvas-*`, declarada por cada tema. Las variantes iniciales
  conservan un fondo claro y elevación tenue. El radio compartido se resuelve
  mediante el token global `--workspace-canvas-radius`; un tema futuro puede
  ampliarlo sin replicar el mesh ni el vidrio del shell.
- `Workspace Header` contiene los breadcrumbs y el contexto de la ruta activa.
- `Page Content Scroller` contiene la parte desplazable de `Page Composition`
  y sus `Module Surfaces` en el modo predeterminado.
- Las superficies de módulo no crean regiones de scroll anidadas por defecto.
  Solo pueden hacerlo cuando el caso de uso lo justifique explícitamente.

### Política de Scroll

Cada ruta tiene un único dueño principal del desplazamiento vertical. La
selección de ese dueño es una variante explícita de `Page Composition`, no un
efecto incidental de CSS.

- `Page Content Scroll` es el modo predeterminado de escritorio. En `Next
Dashboard`, `Workspace Toolbar` y `Workspace Header` permanecen fijos; `Page
Content Scroller` recibe el scroll vertical. Legacy conserva su `Global Header`
  exterior mientras no se adopte.
- `Page Composition Scroll` es una variante de escritorio en la que `Global
Header` de legacy, o `Workspace Toolbar` y `Workspace Header` de Next,
  permanecen fijos, mientras `Page Composition`, incluido su `Page Header`
  opcional, recibe el scroll vertical. Permite que el encabezado de una vista
  se desplace, se vuelva sticky o se transforme sin entregar el scroll al
  canvas completo.
- `Workspace Canvas Scroll` es una variante de escritorio para rutas cuyo
  contexto amplio debe desplazarse, volverse sticky o transformarse al hacer
  scroll. El canvas conserva su posición y tamaño dentro de `Content Inset`,
  pero recibe el overflow vertical. En este modo, `Workspace Header` puede
  mantenerse sticky, reducirse o desplazarse según la composición.
- `Table Workspace` es una variante de escritorio para resultados tabulares
  extensos cuando la tabla es la superficie operativa principal y debe ocupar
  el área disponible. `Workspace Canvas`, `Page Composition` y `Page Content
Scroller` solo establecen la geometría disponible; el viewport de resultados
  de `DataTable` recibe el único overflow vertical y horizontal. Su
  `stickyHeader` es opcional e independiente del contrato `scrollRegion`, que
  controla altura, overflow y overscroll. No se usa por el solo hecho de
  incluir una tabla: una vista donde la tabla comparte protagonismo con
  resumen, métricas, formularios u otras superficies debe adoptar una
  composición de página normal.
- `Document Scroll` es el modo predeterminado en móvil. La ruta participa en el
  scroll natural del documento.

`Workspace Canvas`, `Page Composition` y `Page Content Scroller` no pueden ser
dueños del scroll vertical al mismo tiempo. `Table Workspace` es una excepción
formal: ninguno de esos contenedores recibe overflow vertical en escritorio y
el viewport de resultados de `DataTable` es el único dueño. En móvil, la
composición vuelve al flujo del documento, sin región interna ni header sticky.

En escritorio, el dueño activo debe usar `overscroll-behavior: none` para no
propagar el rebote vertical u horizontal del trackpad al documento ni revelar
el fondo global en los límites de la región de trabajo. Los elementos con
overflow horizontal intencional conservan su desplazamiento propio, pero no lo
encadenan al viewport.

En móvil, el documento continúa como dueño natural del scroll, pero el
`Dashboard Shell` debe usar esa misma política en ambos ejes. Así se conserva
el flujo normal de la página sin rebote ni propagación horizontal o vertical
fuera del dashboard.

### Workspace Toolbar

`Workspace Toolbar` es una capa de utilidades de alcance transversal de
`Next Dashboard`. Vive dentro de `Workspace Canvas`, antes de
`Workspace Header`; no expresa la ruta activa ni contiene breadcrumbs, título,
filtros o acciones propias de un módulo.

- Su zona inicial contiene el trigger de `Navigation Shell`: en escritorio
  colapsa o expande el pane; en móvil solicita la apertura del sheet.
- Su zona central permanece disponible para una utilidad global futura, como
  búsqueda, sin llenarse artificialmente mientras no exista esa necesidad.
- Su zona final puede alojar notificaciones, ayuda y cuenta.

Una campana y un avatar pueden ser placeholders de controles globales mientras
se define su funcionalidad. No adelantan el traslado de la cuenta desde el
`Navigation Pane`: esa cuenta se mantiene durante la coexistencia para legacy.

`Global Header` exterior solo representa el contrato previo de legacy. No debe
recibir nuevos controles ni cambios estructurales salvo los necesarios para
compatibilidad durante la migración.

### Workspace Header

`Workspace Header` es un hijo fijo de `Workspace Canvas`. Expresa el contexto
de navegación de la ruta activa y contiene sus breadcrumbs.

- No contiene el trigger de navegación, notificaciones, ayuda ni cuenta; esas
  responsabilidades pertenecen a `Workspace Toolbar` en Next Dashboard y al
  `Global Header` exterior en legacy.
- No contiene título, descripción, filtros ni acciones de una vista; esas
  piezas pertenecen a `Page Composition`.
- En rutas largas, el breadcrumb puede resolver segmentos intermedios mediante
  elipsis, pero debe conservar visible el segmento actual y su estado visual.
- En móvil conserva su responsabilidad conceptual. Su representación visual se
  definirá junto con `Mobile Canvas`.

### Page Header Opcional

`Page Composition` define la jerarquía y el orden de las piezas operativas de
una ruta, como título, descripción, filtros, tabs, tablas, formularios,
acciones y superficies de módulo.

`Page Header` pertenece a `Page Composition`, no a `Content Inset`. Es una
capa opcional para agrupar título, descripción y acciones propias de una
vista. Una ruta puede no requerirlo si su composición resuelve esa jerarquía de
otra forma.

Cuando tiene acciones, admite cero o una `primary` y hasta dos `secondary`,
solo si afectan el propósito completo de la página. Controles dependientes de
una tabla, filtro, card o entidad seleccionada pertenecen a su `Page Content` o
flujo local; no al encabezado de página.

La implementación estática de catálogo es `PageHeader`. Su `title` es
obligatorio; `eyebrow`, descripción, metadata y acciones son opcionales. Las
acciones se limitan al alcance de la página. Filtros, tabs, búsqueda,
ordenamiento y comandos operativos pertenecen a `Page Content`. El contrato y
sus tokens se documentan en [components/page-header.md](../components/page-header.md).

`DashboardPageComposition` y `DashboardPageContentScroller` son primitivas
estructurales sin material visual propio: heredan la superficie de `Workspace
Canvas`. El modo de scroll se identifica mediante `data-dashboard-scroll-owner`
y nunca puede asignar propietarios simultáneos. `DashboardTableWorkspace`
establece el límite estructural de la excepción tabular mediante
`data-dashboard-scroll-viewport`; no es dueño de scroll. `Page Content
Scroller` usa `padding="none"` por defecto; una ruta debe elegir
`padding="default"` solo cuando adopte los gutters estructurales compartidos.

La variante opcional `Sticky Collapsible Header` se rige por su
[contrato específico](../components/sticky-collapsible-page-header.md). No se
activa por defecto ni reemplaza al `Page Header` expandido.

### Móvil

Este contrato de canvas fijo y scroll interno se acuerda inicialmente solo para
escritorio. La resolución móvil se definirá por separado, considerando viewport
dinámico, teclado, safe areas y formularios; no se debe trasladar este scroll
interno a móvil por inercia.

### Mobile Canvas

En móvil, `Content Inset` conserva su responsabilidad estructural, pero no se
presenta como una superficie visual independiente ni controla el scroll. La
ruta utiliza el desplazamiento natural del documento.

- El marco morado y los gutters decorativos de escritorio no se exponen.
- `Content Inset` y `Workspace Canvas` ocupan el ancho disponible sin
  comportarse como una card flotante de escritorio.
- `Workspace Canvas` no aplica borde, radio ni sombra en móvil. Los temas
  podrán redefinir su receta de escritorio sin crear excepciones visuales por
  vista o por componente.
- En Next Dashboard, `Workspace Toolbar` conserva el acceso a `Mobile
Navigation Sheet` y el espacio para utilidades globales. Legacy conserva su
  `Global Header` exterior hasta su adopción.
- `Workspace Header` conserva los breadcrumbs en una resolución compacta, con
  elipsis cuando sea necesario sin ocultar el segmento actual.
- `Page Composition` y sus superficies participan en el scroll natural de la
  página. No se crean contenedores de scroll internos por defecto.

## Evolución

- La estructura interna de `Page Composition`, incluyendo cuándo un `Page Header`
  debe permanecer fijo, se definirá mediante un patrón o guideline posterior.
- Las implementaciones en módulos reales se registran en
  [`../adoption-log.md`](../adoption-log.md).
