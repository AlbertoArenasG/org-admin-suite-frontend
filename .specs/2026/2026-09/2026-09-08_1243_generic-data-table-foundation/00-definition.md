# Definition: Generic Data Table Foundation

## Initiative

- Name: `generic-data-table-foundation`
- Date: `2026-09-08`
- Definition status: `complete`
- Implementation status: `complete`
- Spec status: `closed`

## Problem

Las vistas de listado actuales repiten estructuras de tabla, estado local,
controles de consulta y presentacion de estados remotos. La aplicacion necesita
un `DataTable` reutilizable para colecciones entregadas por el backend, sin
mezclar transporte HTTP, reglas de dominio o necesidades exclusivas de una
pantalla dentro de un componente comun.

## Expected Outcome

Definir, construir y validar una base de `DataTable` para el Next Dashboard.
Debe ser extensible por configuracion y composicion, mantener una separacion
clara entre estado remoto y estado de interaccion, y permitir que futuras
vistas la adopten sin copiar implementaciones de listados existentes.

## Included Scope

- Contrato reutilizable para datos, columnas, estado remoto e interacciones de
  un `DataTable`.
- Estados `loading`, `error`, `empty` y `emptyFiltered`.
- Configuracion opcional por vista para busqueda, ordenamiento, paginacion,
  encabezados fijos, detalle expandible,
  seleccion, acciones, redimensionamiento, presentacion semantica, densidad,
  comportamiento de texto y variantes visuales aprobadas.
- Integracion con primitives canonicas de shadcn y tokens multitema vigentes.
- Separacion entre API client/thunks/slices, estado local con Zustand,
  contenedor de modulo y componente de presentacion.
- Preparacion de contratos que permitan agregar virtualizacion e infinite
  scrolling en una fase posterior sin rehacer la estructura base.

## Excluded Scope

- Implementar aun la ruta de Seguimiento de servicios; esa adopcion se
  documenta en `customer-service-records-client-access-monitoring`.
- Migrar todas las tablas legacy como parte de esta iniciativa.
- Comunicacion HTTP desde pages o componentes de presentacion.
- Definir endpoints, permisos o reglas de negocio de modulos consumidores.
- Adoptar virtualizacion o infinite scrolling en la primera version.
- Crear abstracciones sin un contrato y una responsabilidad aprobados.

## Component Lab Reference

El **Component Lab** es el repositorio local independiente
`component-staging/component-lab`, ubicado como hermano de los repositorios de
producto. Sirve exclusivamente para previsualizar bloques descargados de
shadcn.io y evaluar componentes construidos antes de una promocion deliberada.
No se importa desde `org-admin-suite-frontend`, no participa en su runtime y no
es la ubicacion de esta spec. Sus bloques son referencias, no una fuente de
verdad ni una receta de implementacion.

## Constraints

- `DataTable` no conoce endpoints, URLs de API, permisos ni modelos de dominio.
- API client, thunks y slices conservan datos remotos, metadata, error y estado
  de solicitud.
- Zustand conserva solo estado local de interaccion de una tabla cuando aporte
  una frontera clara; no duplica la coleccion remota.
- El contenedor de cada modulo adapta el contrato remoto y conecta callbacks;
  la page solo compone su ruta y autorizacion.
- Las filas solo usan dos alturas estandar: `compact` o `comfortable`. El
  contenido de dos líneas usa siempre `comfortable`; ninguna celda ni variante
  de vista introduce una tercera altura.
- Una vista normal delega scroll vertical al shell o pagina y mantiene scroll
  horizontal local. Al habilitar `sticky header`, debe declarar una region de
  tabla con altura o `max-height` que sea dueña deliberada de ambos ejes.
- No se modifican primitives por una necesidad exclusiva de una vista o de este
  componente sin analisis y aprobacion explicita.
- El componente se implementa con `@tanstack/react-table` v9, dependencia
  canonica para tablas nuevas. Las tablas legacy consumen temporalmente
  `@tanstack/react-table-v8`; el Component Lab no se importa ni se copia al
  frontend.

## Approved V1 Capabilities

- Estados remotos: carga, error recuperable, vacio y vacio con criterios.
- Consulta remota: paginacion, ordenamiento por columnas declaradas y buscador
  opcional.
- Estructura: renderers semanticos por columna, densidad global de dos niveles,
  filas multilínea y encabezados fijos opcionales.
- Interaccion: detalle expandible, menu de acciones, seleccion multiple y
  redimensionamiento sujeto a viabilidad tactil y accesible.
- Variantes: resaltado de fila, indicador lateral, avatar o miniatura y
  edicion directa opcional.
- Presentacion opcional a pantalla completa con Fullscreen API y fallback de
  espacio ampliado dentro de la aplicacion.

## Deferred Decision

Los filtros multicampo, comboboxes y el patron visual que los contendra (como
un sheet) quedan fuera de esta spec. Se definiran en una spec propia; la
primera vista de consulta de cliente solo expone buscador de texto.

## Open Decisions

Ninguna. Las capacidades no incluidas en v1 conservan puntos de extension
documentados; no autorizan implementacion anticipada.

## Closure

La base fue construida y validada en Component Lab, promovida de forma
deliberada al frontend y expuesta en el catalogo oficial. Las capacidades
diferidas conservan sus puntos de extension, pero no forman parte de este
cierre: filtros multicampo, virtualizacion, infinite scrolling, edicion inline
sin caso de uso y la adopcion por el modulo de negocio se definiran en sus
propias iniciativas.
