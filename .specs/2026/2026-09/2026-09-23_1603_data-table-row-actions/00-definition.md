# Definition: DataTable Row Actions

## Initiative

- Name: `data-table-row-actions`
- Date: `2026-09-23`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

`DataTable` ya permite recibir contenido de acciones por fila, pero no define
un patron uniforme para descubrir, presentar y ejecutar acciones. En Registros
administrativos de servicios a clientes, el enlace temporal del folio permite
entrar a detalle, pero no resuelve las acciones disponibles por permisos ni
ofrece una experiencia consistente mediante menu de tres puntos, menu
contextual o atajos de interaccion.

La aplicacion necesita un contrato reutilizable para que futuras tablas no
inventen menus, reglas de visibilidad ni rutas de activacion distintas.

## Expected Outcome

- Un contrato generico de acciones disponibles por fila, decidido por cada
  vista a partir de sus capacidades y del registro.
- El prop sin consumidores `getRowActions` se sustituye por el contrato
  estructurado y opcional `rowActions`, extensible cuando exista un nuevo caso
  de uso aprobado.
- Un menu dropdown desde la columna de acciones y un menu contextual con clic
  derecho que consumen la misma lista de acciones.
- `Ver detalle` disponible con lectura; `Editar` y `Eliminar` solo cuando la
  vista determine que el usuario tiene la capacidad respectiva.
- Un dialogo de confirmacion destructiva coherente con Next Dashboard para
  ejecutar `Eliminar`, sin reutilizar el `Sheet` legacy.
- Accesos rapidos de detalle mediante clic en folio y doble clic en una zona
  no interactiva de la fila.
- Descubribilidad sin ruido: trigger persistente de tres puntos con tooltip
  acotado al control, folio enlazable y hover actual de fila.
- Primera adopcion en Registros administrativos de servicios a clientes, sin
  alterar las demas tablas actuales.

## Included Scope

- Analizar las primitivas existentes y el patron vigente de permisos para
  acciones internas en Next Dashboard.
- Definir contrato, componentes y ownership de acciones de fila en
  `DataTable`.
- Implementar dropdown de tres puntos y menu contextual con la misma lista de
  acciones disponibles.
- Definir y crear el patron compartido de dialogo de confirmacion destructiva
  para las vistas de Next Dashboard, con primera adopcion en esta tabla.
- Implementar la columna de acciones solo cuando la fila tenga al menos una
  accion disponible.
- Implementar los atajos de detalle: enlace de folio y doble clic excluyendo
  controles interactivos internos.
- Adoptar el patron en la tabla administrativa de registros de servicio a
  clientes usando las rutas y acciones existentes.
- Documentar el patron vivo y validar desktop, mobile, teclado, permisos y
  estados de fila relevantes.

## Excluded Scope

- Migrar o redisenar la vista de detalle y la vista de edicion del registro.
- Unificar las rutas actuales de ver y editar; esa sera una iniciativa
  posterior de detalle/edicion en Next Dashboard.
- Crear el formulario o flujo de nuevo registro.
- Cambiar permisos efectivos de backend, endpoints, thunks, slices, stores o
  contratos remotos.
- Introducir edicion de celdas, acciones masivas nuevas o acciones de fila en
  otras tablas durante esta primera adopcion.
- Alterar el layout, densidad, scroll, columnas de datos o filtros de la tabla
  administrativa fuera de la nueva columna de acciones.

## Constraints

- El componente generico no conoce recursos, permisos, textos de negocio ni
  rutas: la vista entrega acciones ya autorizadas y sus handlers.
- El `Sheet` legacy de eliminacion no se reutiliza ni condiciona la interfaz
  nueva. La confirmacion destructiva se presenta en un dialogo y su contenido
  de negocio permanece a cargo de la vista.
- Dropdown y menu contextual usan una unica fuente de acciones para impedir
  divergencias de permisos, orden o disponibilidad.
- `rowActions` no presupone un catalogo fijo: cada vista puede omitir acciones
  y el contrato solo se extiende cuando un caso real lo requiera.
- El clic simple sobre la fila no navega. El doble clic solo ejecuta la accion
  primaria de detalle y nunca se activa sobre botones, inputs, enlaces,
  controles de expansion ni menu de acciones.
- La fila no usa `cursor-pointer`, pues comunica una accion de clic simple que
  no existe. El cursor pointer queda reservado para el folio enlazable y los
  controles interactivos; no se agregan iconos de mano ni tooltips sobre datos.
- El trigger de tres puntos permanece visible cuando hay acciones y su tooltip
  describe solo ese control; el menu contextual es un atajo complementario.
- El menu explicito `Ver detalle` permanece como alternativa descubrible y
  accesible; el doble clic es solo un atajo de escritorio.
- La columna de acciones no se decide por el permiso de lectura, sino por si
  existe al menos una accion disponible para esa fila.
- La autorizacion de backend sigue siendo el control definitivo; frontend solo
  controla visibilidad y experiencia.

## Acceptance Criteria

- Un usuario con lectura ve y puede ejecutar `Ver detalle` desde el menu de
  tres puntos y el menu contextual.
- Cuando la vista proporcione capacidades de actualizacion o eliminacion,
  `Editar` o `Eliminar` aparecen en ambos menus de la misma fila; si no, no
  aparecen.
- Si la vista no entrega `rowActions`, no se renderiza columna, trigger, menu
  contextual ni activacion primaria. Una fila cuya lista resuelta este vacia
  conserva la columna, pero sin trigger ni menu contextual.
- El clic en folio y doble clic sobre area no interactiva abren detalle sin
  interferir con seleccion, expansion, botones, enlaces, inputs o el menu.
- Menus, foco, Escape, teclado, clic exterior, mobile, scroll horizontal y
  reduced motion conservan accesibilidad y no degradan las tablas existentes.
- La tabla administrativa conserva sus datos, filtros, paginacion, expansion,
  permisos de entrada y comportamiento actual fuera de acciones de fila.
- Lint dirigido, typecheck, build y validacion manual de los flujos afectados
  pasan antes del cierre.

## Open Decisions

Ninguna. El contrato, responsabilidades, artefactos, slices y matriz de
validacion estan definidos. La spec esta lista para aprobacion de
implementacion.
