# Technical Design: Generic Data Table Foundation

## Status

Implementacion base completada, validada en Component Lab y promovida al
catalogo oficial del frontend. La spec esta cerrada.

## Dependency Baseline

- `@tanstack/react-table`: v9, dependencia canonica de DataTable y toda tabla
  nueva.
- `@tanstack/react-table-v8`: alias temporal exclusivo de las tablas legacy.
  El Component Lab usa v9; sus bloques son referencias, no codigo importable.

## Architecture Boundary

```text
API client -> thunk -> feature slice -> module container -> DataTable
                                      ^
                                      |
                              Zustand local table state
```

- API client: serializa requests y normaliza el envelope remoto del modulo.
- Thunk y slice: ejecutan solicitudes y conservan `items`, pagination, status
  y error del recurso remoto.
- Zustand: conserva solo interaccion local controlada, como query editable,
  ordenamiento, pagina, visibilidad, seleccion, expansion o preferencias de
  vista cuando se aprueben.
- Contenedor: sincroniza estado local con URL si aplica, despacha thunks,
  adapta datos del feature y conecta callbacks.
- DataTable: crea internamente la instancia de TanStack Table y presenta filas,
  columnas, estados y controles mediante props. No despacha thunks, no conoce
  rutas API ni interpreta permisos.

## Public Model

El contrato aprobado cubre estas familias sin depender de un modelo de dominio:

- `rows` y una funcion o clave estable de identificacion de fila.
- `columns` con renderer semantico, capacidad de ordenamiento, ancho,
  visibilidad, edicion y metadatos accesibles configurables por columna.
- Estado y callbacks controlados necesarios para que el componente configure
  TanStack sin recibir una instancia creada por el consumidor.
- Resultado remoto normalizado: filas y pagination opcional con `page`,
  `perPage`, `total` y `totalPages`.
- Estado remoto discriminado: `loading`, `success` o `error`, con copy seguro y
  reintento controlado por el consumidor.
- Query controlada: busqueda, filtros tipados por modulo, ordenamiento y
  paginacion; los cambios se emiten al contenedor, no se convierten en HTTP.
- Configuracion opcional de toolbar, sticky header, densidad, seleccion,
  expansion, acciones, indicadores, resaltado, avatar y edicion.

## Approved Column Boundary

Una columna de dominio debe poder declarar conceptualmente:

```text
id: identificador tecnico estable
header: contenido visual localizado
ariaLabel: nombre accesible cuando el encabezado no sea texto suficiente
accessor: lectura de un valor desde la fila, cuando aplique
cell: renderer semantico de la celda, cuando aplique
sorting: enabled y apiField explicito
width: initial, min, max y resizable opcional
visibility: defaultVisible y hideable opcional
align: start, center o end
textBehavior: nowrap, wrap o truncate
edit: configuracion de edicion directa opcional
```

`id` no es un nombre de campo de API. Una columna ordenable declara su
`apiField` porque el contrato remoto puede usar otra denominacion.

Seleccion, expansion y menu de acciones no son columnas de dominio. El
`DataTable` los agrega como columnas utilitarias solo cuando la configuracion
de la vista habilita la capacidad correspondiente. Resaltado de fila,
indicador lateral y variante multilínea se calculan a nivel de tabla o fila.

## Approved Remote State And Query Contract

```text
rows: TData[]
remote:
  status: loading | success | error
  error: copy seguro opcional
  onRetry: callback opcional
query:
  search: texto opcional
  filters: TFilters
  sorting: [{ columnId, direction }]
  pagination: { page, perPage } opcional
  hasActiveCriteria: boolean
  callbacks opcionales para search, filters, sorting, pagination y clear criteria
pagination:
  page, perPage, total, totalPages
```

- Las paginas publicas son base uno. El componente adapta internamente el
  indice requerido por TanStack Table.
- El ordenamiento controlado usa `columnId`; el contenedor lo traduce mediante
  `apiField` al contrato remoto de cada feature.
- `empty` se muestra con respuesta exitosa y cero filas sin criterios activos.
  `emptyFiltered` requiere respuesta exitosa, cero filas y
  `hasActiveCriteria: true`.
- El componente no infiere criterios activos inspeccionando filtros genericos.

## Approved Interaction Contracts

```text
selection:
  selectedRowIds, onSelectedRowIdsChange, isRowSelectable?, bulkActions?

expansion:
  expandedRowIds, onExpandedRowIdsChange, isRowExpandable?, renderDetail,
  trigger?: { kind: chevron | information, ariaLabel }

rowActions:
  getActions(row), onAction(actionId, row)

editing:
  activeCell, onActiveCellChange, renderEditor, onCommit, onCancel
```

- Las listas externas de IDs son serializables y usan el identificador estable
  entregado por la configuracion de tabla.
- `renderDetail` puede ser un componente de modulo que administra carga bajo
  demanda, error y reintento; `DataTable` solo reserva y presenta su region.
- El trigger de expansion siempre es un boton accesible. `chevron` es el
  patron estandar; `information` comunica detalle adicional, no lecturas,
  pendientes ni cantidad de comentarios.
- La vista filtra permisos y entrega un arreglo vacio cuando no hay acciones;
  el menu contextual no se renderiza en ese caso.
- El editor es aportado por la columna o vista. `DataTable` no define inputs,
  schema de validacion, endpoint ni persistencia de una mutacion.

## Approved Lazy Detail Contract

- `renderDetail(row)` presenta datos disponibles en la fila y no genera HTTP.
- Para datos adicionales, la vista entrega un componente contenedor de modulo
  dentro de `renderDetail`, con el ID estable de fila. Ese contenedor usa su
  propio thunk, slice, cache, error y reintento.
- `DataTable` no precarga, solicita, cachea ni reintenta detalle remoto.
- La region expandida mantiene sus propios estados `loading`, `error` y
  `retry`; no reemplaza ni bloquea el listado.
- La vista controla una o varias expansiones mediante `expandedRowIds`. El
  boton de cada fila usa `aria-expanded` y `aria-controls`; la region recibe
  un ID unico y nombre accesible.
- Client Access muestra observaciones desde el contrato de listado y no carga
  detalle al expandirse en la primera adopcion.

## Approved Toolbar And Preferences Contract

```text
toolbar:
  search?: { placeholder, ariaLabel }
  filters?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode

rowLayout: single-line | multiline

density:
  value: compact | comfortable
  onChange?: callback
  showControl?: boolean

columnSizing:
  values?: Record<columnId, width>
  onChange?: callback

settings:
  density?: { value, onChange }
  columnVisibility?: { visibleColumnIds, onChange }
```

- El buscador se renderiza solo cuando `toolbar.search` esta presente y usa los
  valores/callbacks de `query`.
- `filters`, `leading` y `trailing` permiten que cada vista componga controles
  validados, como `DashboardFilterMenu` y comboboxes, sin trasladar sus datos o
  reglas a la tabla.
- Acciones masivas se muestran en una region estandar cuando hay seleccion
  activa y acciones declaradas.
- `rowLayout: multiline` anula la densidad y oculta su control local.
- Un store Zustand dedicado y persistente conserva la densidad global. El
  componente recibe la preferencia por props y no importa el store ni accede a
  `localStorage`.
- `comfortable` es el valor de densidad inicial. Todas las tablas de una linea
  comparten la preferencia; `multiline` la ignora.
- Los anchos se exponen como estado controlado, pero v1 no los persiste. El
  contenedor conserva el estado durante el montaje y restaura los anchos
  declarados al recargar o reingresar a la vista.
- `settings` se presenta como un unico menu en las acciones globales del
  header. Solo se renderiza cuando la vista habilita densidad o columnas
  ocultables. No contiene filtros ni comboboxes.
- La densidad usa la preferencia global existente. La visibilidad de columnas
  es estado controlado por vista y no se persiste en v1. Una columna principal
  puede declararse no ocultable para conservar contexto minimo.

## Approved Text Layout Rules

- `single-line` es el modo estandar: aplica densidad global y las celdas no
  envuelven texto.
- `multiline` es una declaracion explicita para contenido de hasta dos líneas;
  usa siempre la altura `comfortable`. No puede introducir una tercera altura
  ni bloques apilados dentro de una celda.
- Cada columna declara `textBehavior`: `nowrap`, `wrap` o `truncate`.
  `truncate` es opt-in y requiere que la vista ofrezca expansion, detalle o
  accion equivalente para ver el valor completo; `title` solo puede ser ayuda
  adicional de escritorio.
- Valores largos sin separadores se envuelven de forma segura solo con `wrap`.
- Movil mantiene tabla semantica y scroll horizontal; no hay conversion a
  cards ni ocultamiento automatico de columnas.

## Approved Scroll, Responsive And Accessibility Rules

- Sin `stickyHeader`, el shell o pagina conserva el scroll vertical y la tabla
  crea solo scroll horizontal local cuando sus columnas lo requieren.
- Con `stickyHeader`, la vista debe configurar una region de tabla con altura o
  `max-height` que maneje ambos ejes; la vista tambien entrega el offset
  necesario para su composicion. `maxHeight: 'available'` mide el espacio real
  hasta el borde inferior del scroller de pagina y descuenta su padding
  inferior. No se usan offsets globales implicitos ni restas fijas del shell.
- Movil conserva la semantica de tabla y acceso a scroll horizontal. Toolbar y
  slots se reorganizan sin convertir filas automaticamente a cards.
- Ordenamiento, expansion, seleccion, menu, paginacion, edicion y
  redimensionamiento deben ser utilizables sin hover, con teclado, foco visible
  y objetivos tactiles adecuados.
- Encabezados ordenables usan botones y exponen `aria-sort`; regiones con
  scroll horizontal tienen nombre accesible; carga, error y validacion de
  edicion se anuncian de forma no tecnica.
- Redimensionamiento solo se entrega si su handle soporta mouse, touch y
  teclado con limites de ancho y foco visible. Cada columna redimensionable
  declara `min` y `max`; el handle expone valores ARIA y soporta flechas de 16
  px, `Shift` + flechas de 48 px y `Home`/`End` para los extremos.
- El hit target del handle mide al menos 24 px y usa Pointer Events; permanece
  visible al enfocarse o interactuar. Columnas utilitarias no son
  redimensionables.

## Approved Fullscreen Contract

```text
fullscreen?: {
  enabled: true
  enterLabel: string
  exitLabel: string
  onChange?: (active: boolean) => void
}
```

- El componente usa Fullscreen API bajo una accion explicita de usuario y
  escucha `fullscreenchange` para sincronizar la interfaz.
- Si la API no existe o falla, presenta un modo de espacio ampliado dentro de
  la aplicacion, sin afirmar que es fullscreen nativo.
- En ambos modos se ofrece salida visible y se restaura foco al control de
  entrada al cerrar.
- La region de resultados en fullscreen es dueña de scroll vertical y
  horizontal para conservar toolbar y encabezados visibles.

## Remote Response Adaptation

El backend expone un envelope de modulo y su pagination se presenta como:

```text
pagination { page, per_page, total, total_pages }
```

Cada feature adapta ese envelope a la entrada neutral del `DataTable`. El
componente comun no asume que todos los endpoints tienen paginacion ni que
comparten los mismos nombres de filtros o campos ordenables.

## Interaction Rules

- Paginacion, ordenamiento, busqueda, filtros y comboboxes son opcionales por
  vista y emiten cambios hacia el contenedor.
- Al cambiar un criterio que altere el conjunto, el consumidor reinicia la
  pagina conforme al contrato del modulo.
- `emptyFiltered` se usa cuando existen criterios activos y la respuesta es
  exitosa sin filas; limpiar criterios es una accion emitida al consumidor.
- Resaltado de fila e indicador lateral se controlan por condiciones declaradas
  por la vista. No dependen de una unica columna ni presuponen un solo
  semaforo.
- Contenido multilínea usa variante de altura propia y no combina espaciado
  adicional de densidad.

## Deferred Extension Points

- Virtualizacion: estrategia de renderizado futura; no debe condicionarse la
  API a que todas las filas vivan en el DOM.
- Infinite scrolling: estrategia remota alternativa a paginacion por controles;
  requerira contrato de carga incremental y cache propios.
- Detalle bajo demanda: debe definirse por consumidor, incluyendo carga y error.

## Registro de Artefactos

La construccion inicia en Component Lab y se promueve por copia deliberada al
frontend. Component Lab es el repositorio local independiente
`component-staging/component-lab`; nunca se importa desde el frontend ni forma
parte de su runtime.

### Phase A. Component Lab Construction

| Artefacto                       | Tipo                  | Ubicacion                                                                                                               | Responsabilidad                                                                                       | Dependencias                                                            | Estado |
| ------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| `GenericDataTable`              | componente construido | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/GenericDataTable.tsx`             | Compone TanStack v9, props controladas y regiones principales del experimento.                        | Types, primitives compartidas del laboratorio y subcomponentes propios. | new    |
| `generic-data-table.types`      | tipos                 | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/generic-data-table.types.ts`      | Declara el contrato experimental de filas, columnas, query, estados e interacciones.                  | TanStack v9 y tipos React.                                              | new    |
| `GenericDataTableToolbar`       | componente construido | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/GenericDataTableToolbar.tsx`      | Presenta buscador estandar, slots y acciones masivas.                                                 | Contract de toolbar y primitives de controles.                          | new    |
| `GenericDataTableTable`         | componente construido | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/GenericDataTableTable.tsx`        | Renderiza estructura semantica, columnas de dominio/utilitarias, filas y detalle expandible.          | Types, Table primitive y TanStack v9.                                   | new    |
| `GenericDataTableStates`        | componente construido | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/GenericDataTableStates.tsx`       | Presenta loading, error, empty y emptyFiltered sin conocer datos de negocio.                          | Empty, Skeleton, Button y copy entregado por props.                     | new    |
| `GenericDataTablePagination`    | componente construido | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/GenericDataTablePagination.tsx`   | Presenta metadata y controles de pagina controlados.                                                  | Query, pagination y Button/Select primitives.                           | new    |
| `useGenericDataTableFullscreen` | hook                  | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/useGenericDataTableFullscreen.ts` | Encapsula Fullscreen API, fallback, sincronizacion de eventos y restauracion de foco del experimento. | Browser Fullscreen API y contract fullscreen.                           | new    |
| `generic-data-table.css`        | estilos locales       | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/generic-data-table.css`           | Define estructura, scroll, sticky y fullscreen sin valores de tema propios.                           | Tokens y primitives del laboratorio.                                    | new    |
| Preview de componente           | route                 | `component-staging/component-lab/src/app/components/tables/generic-data-table/page.tsx`                                 | Demuestra las capacidades aprobadas con datos de ejemplo, sin dominio de producto.                    | GenericDataTable.                                                       | modify |
| Registro de referencias         | documentacion         | `component-staging/component-lab/src/components/constructed/tables/generic-data-table/requirements.md`                  | Conserva referencias de bloques; debe apuntar a esta spec como fuente de decisiones de producto.      | Esta spec y bloques descargados.                                        | modify |
| Registry del laboratorio        | documentacion         | `component-staging/component-lab/docs/registry.md`                                                                      | Registra avance y promocion futura del componente construido.                                         | GenericDataTable y esta spec.                                           | modify |

### Phase B. Deliberate Frontend Promotion

| Artefacto                | Tipo                     | Ubicacion                                                  | Responsabilidad                                                                                    | Dependencias                                                  | Estado |
| ------------------------ | ------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ |
| `DataTable`              | componente compartido    | `src/components/data-table/DataTable.tsx`                  | Compone la API aprobada y crea internamente TanStack Table v9.                                     | Types, subcomponentes, hook fullscreen, primitives canonicas. | new    |
| `data-table.types`       | tipos                    | `src/components/data-table/data-table.types.ts`            | Declara el contrato publico promovido de filas, columnas, query, estados e interacciones.          | TanStack v9 y tipos React.                                    | new    |
| `DataTableToolbar`       | componente compartido    | `src/components/data-table/DataTableToolbar.tsx`           | Presenta buscador, slots y region de acciones masivas.                                             | Contract toolbar y controls canonicos.                        | new    |
| `DataTableTable`         | componente compartido    | `src/components/data-table/DataTableTable.tsx`             | Renderiza marcado HTML semantico de tabla, columnas utilitarias, filas, sticky y expansion.        | TanStack v9 y types.                                          | new    |
| `DataTableStates`        | componente compartido    | `src/components/data-table/DataTableStates.tsx`            | Presenta estados remotos sin conocer endpoint ni dominio.                                          | Marcado local, Skeleton, Button y copy por props.             | new    |
| `DataTablePagination`    | componente compartido    | `src/components/data-table/DataTablePagination.tsx`        | Presenta paginacion controlada y metadata.                                                         | Types y primitives canonicas.                                 | new    |
| `useDataTableFullscreen` | hook compartido          | `src/components/data-table/useDataTableFullscreen.ts`      | Encapsula fullscreen nativo, fallback, eventos y foco.                                             | Browser Fullscreen API y contract fullscreen.                 | new    |
| `data-table.css`         | estilos locales          | `src/components/data-table/data-table.css`                 | Define layout, responsive, scroll, sticky y fullscreen usando tokens semanticos.                   | Tokens vigentes por tema.                                     | new    |
| Exports publicos         | barrel                   | `src/components/data-table/index.ts`                       | Limita imports consumidores al contrato aprobado.                                                  | DataTable y tipos publicos.                                   | new    |
| Preferencias de tabla    | store Zustand            | `src/stores/useDataTablePreferencesStore.ts`               | Persiste densidad global de tablas compatibles sin almacenar colecciones remotas.                  | Zustand persist y contrato density.                           | new    |
| Catalog playground       | componente de playground | `src/components/playground/DataTableCatalogPlayground.tsx` | Valida composiciones, temas, responsive y accesibilidad con datos no productivos.                  | DataTable, DashboardPlaygroundFrame y escenarios de ejemplo.  | new    |
| Preview de producto      | route                    | `src/app/dashboard-playground/catalog/data-table/page.tsx` | Expone el playground de DataTable solo en catalogo interno.                                        | DataTableCatalogPlayground y guard existente de catalogo.     | new    |
| Indice del catalogo      | componente de playground | `src/components/playground/ComponentCatalogPlayground.tsx` | Enlaza la entrada DataTable cuando la promocion este lista para validacion.                        | Nueva route de catalogo.                                      | modify |
| Guideline viva           | documentacion UI         | `docs/ui/patterns/data-table.md`                           | Conserva el contrato aprobado, limites, variantes y proceso de adopcion tras validar la promocion. | Esta spec, tokens y componente promovido.                     | new    |
| Indice de UI             | documentacion UI         | `docs/ui/README.md`                                        | Registra el patron DataTable en la estructura de documentacion viva al promoverlo.                 | `docs/ui/patterns/data-table.md`.                             | modify |

### Reused Or Not Applicable

| Grupo                 | Artefacto o razon                                                                                                                                                                                                                                                             | Estado         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Primitives            | Se reutilizan sin modificacion `button.tsx`, `input.tsx`, `skeleton.tsx`, `dropdown-menu.tsx` y `dialog.tsx`. El frontend no cuenta con `Table`, `Empty` ni `Select`; esta base usa marcado semantico y estados locales, sin descargarlas ni modificar primitives existentes. | reuse          |
| Dependencia           | `@tanstack/react-table` v9 es canonica; `@tanstack/react-table-v8` conserva temporalmente los 68 imports legacy.                                                                                                                                                              | reuse          |
| Estado remoto         | API clients, thunks, slices y modelos de cada feature permanecen bajo ownership del modulo consumidor.                                                                                                                                                                        | not_applicable |
| Rutas de negocio      | No se crea ni modifica ruta de modulo en esta spec. La primera adopcion pertenece a `customer-service-records-client-access-monitoring`.                                                                                                                                      | not_applicable |
| Autorizacion          | `DataTable` no evalua permisos. Cada ruta y contenedor mantiene sus guards y acciones permitidas.                                                                                                                                                                             | not_applicable |
| Component Lab runtime | El frontend no importa archivos, estilos ni dependencias desde `component-staging/component-lab`.                                                                                                                                                                             | not_applicable |

## Validation Baseline

- Validar estados `loading`, `error` con reintento, `empty` y
  `emptyFiltered`.
- Validar controles habilitados y omitidos por configuracion de vista.
- Validar escritorio, movil, teclado, foco, lector de pantalla, scroll y temas.
- Validar que el componente no genera solicitudes HTTP ni acopla el modelo de
  Client Access u otro dominio.
