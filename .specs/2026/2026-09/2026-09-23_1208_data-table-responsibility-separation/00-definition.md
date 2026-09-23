# Definition: DataTable Responsibility Separation

## Initiative

- Name: `data-table-responsibility-separation`
- Date: `2026-09-23`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

`src/components/data-table/DataTable.tsx` concentra 1,107 lineas de contrato
publico, orquestacion de TanStack Table, toolbar, settings, paginacion,
renderizado semantico de tabla, expansion, fullscreen y utilidades de texto.
La concentracion dificulta revisar responsabilidades y extender el componente
sin aumentar el riesgo de regresion para sus consumidores actuales.

La proxima iniciativa de acciones de fila necesita una base con limites claros,
pero esta spec no implementa ese contrato ni esas acciones.

## Expected Outcome

- Una estructura interna cohesionada para `DataTable`, separada por
  responsabilidad concreta.
- Un componente raiz que conserva la orquestacion de TanStack y el contrato
  publico estable.
- Elementos presentacionales y utilidades puras aislados de la coordinacion de
  tabla.
- Sin cambios funcionales o visuales para Component Lab, Seguimiento de
  servicios y Registros de servicio administrativos.
- Documentacion viva que describa la estructura y sus limites para futuras
  extensiones.

## Included Scope

- Inventariar responsabilidades y dependencias actuales de `DataTable`.
- Definir y aplicar una separacion interna que mantenga el contrato publico
  actual.
- Extraer piezas con responsabilidad propia, como toolbar, settings,
  paginacion, contenido semantico de tabla y utilidades de resaltado o
  paginacion, solo donde el diseno tecnico lo justifique.
- Mantener el export publico del catalogo `data-table` y actualizar sus tipos
  si se requiere para conservar la misma API de consumo.
- Validar los consumidores actuales y actualizar la documentacion viva del
  patron de tabla.

## Excluded Scope

- Menu de acciones de fila, boton de tres puntos, menu contextual o clic
  secundario.
- Cambios a acciones masivas, seleccion, edicion directa de celdas o a sus
  contratos futuros.
- Cambios de rutas, permisos, Zustand, Redux, thunks, endpoints o modelos de
  dominio.
- Redisenar toolbar, columnas, densidad, scroll, responsive, tokens, temas o
  estilos de las tablas actuales.
- Migrar tablas legacy o modificar `@tanstack/react-table-v8`.

## Constraints

- `DataTable` sigue siendo el unico propietario de la instancia TanStack v9;
  los consumidores no reciben ni construyen esa instancia.
- La API publica actual debe conservar props, callbacks, semantica y export
  desde `src/components/data-table/index.ts`.
- La separacion responde a ownership y dependencias, no a repartir lineas de
  forma mecanica ni crear abstracciones sin consumidor real.
- Los estilos existentes permanecen en los archivos de tema y CSS actuales
  salvo que una extraccion requiera una referencia interna sin alterar el
  resultado visual.
- La spec de acciones de fila iniciara despues y consumira esta estructura; no
  la preautoriza ni define sus decisiones.

## Acceptance Criteria

- `DataTable` conserva todas las capacidades implementadas hoy: toolbar,
  filtros aportados por la vista, settings, sorting, paginacion, seleccion,
  expansion, estados remotos, fullscreen, resaltado de busqueda y scroll.
- Component Lab, Seguimiento de servicios y la tabla administrativa conservan
  su comportamiento y apariencia comprobables.
- No cambia ningun contrato remoto, store, thunk, permiso ni ruta.
- La estructura final identifica responsables claros y no deja un segundo
  componente coordinador gigante.
- `typecheck`, lint dirigido, build y validacion manual de los consumidores
  afectados pasan antes del cierre.

## Open Decisions

Ninguna. La frontera aprobada, el registro de artefactos y las validaciones
viven en `04-decisions.md`, `06-technical-design.md` y
`08-manual-validation.md`.
