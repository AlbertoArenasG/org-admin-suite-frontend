# Progress: Generic Data Table Foundation

## 2026-09-08

- Se creo la spec en `org-admin-suite-frontend/.specs`.
- Se registraron las capacidades de v1 acordadas durante la revision de bloques
  de tablas en el Component Lab.
- Se confirmo la frontera de estado: API client, thunks y slices para remoto;
  Zustand para interaccion local; contenedor para coordinacion; presentacion sin
  transporte HTTP.
- Se identifico el envelope paginado existente de backend y el handoff de
  Client Access como primera referencia de integracion.
- La definicion permanece abierta mientras se aprueba el contrato publico y el
  registro de artefactos previo a implementacion.
- Se aprobo que el `DataTable` sea dueño de su instancia de TanStack Table; los
  contenedores dejan de construirla directamente.
- Se aprobo el contrato conceptual de columnas y la separacion entre columnas
  de dominio y columnas utilitarias de seleccion, expansion y acciones.
- Se aprobo el modelo controlado de estado remoto, query y callbacks, con
  paginas publicas base uno y ordenamiento identificado por columna de UI.
- Se aprobaron los contratos controlados para seleccion, expansion, acciones y
  edicion; el componente no absorbe permisos, detalle remoto ni mutaciones.
- Se aprobo una toolbar por slots y la persistencia global de densidad mediante
  un store Zustand dedicado, sin acoplar el componente a almacenamiento.
- Se aprobaron las reglas de scroll, sticky header, responsive y accesibilidad.
- Se agrego fullscreen como capacidad opcional de presentacion con API nativa y
  fallback de espacio ampliado dentro de la aplicacion.
- Se confirmo `@tanstack/react-table` v9 como baseline de producto; las tablas
  legacy usan temporalmente el alias v8 y el Component Lab no habilita una
  transferencia directa de codigo.
- Se completo el Registro de Artefactos con fases separadas para construccion
  aislada en Component Lab y promocion manual al frontend.
- Se corrigio el Registro de Artefactos de producto: la base no descarga ni
  modifica primitives ausentes (`Table`, `Empty`, `Select`); usa marcado
  semantico y estados locales, reutilizando solo primitives existentes.
- Se aprobaron reglas explicitas para filas de una linea y multilínea,
  envoltura, truncado con divulgacion no dependiente de hover y responsive.
- Se aprobo que expansion use un boton con chevron o icono informativo, sin
  semantica de lectura ni contador.
- Se aprobo persistir globalmente la densidad con `comfortable` como valor
  inicial y no persistir anchos de columna en v1.
- Se aprobo redimensionamiento opcional por columna con limites declarados y
  soporte accesible para mouse, touch, pluma y teclado.
- Se aprobo que detalle expandido presente datos de fila o un contenedor de
  modulo con ciclo remoto propio; `DataTable` no administra HTTP ni cache.
- Se cerraron las decisiones y el Registro de Artefactos. La spec queda lista
  para iniciar construccion aislada en Component Lab.
- Se construyo y validó en Component Lab el primer contrato v9: estados,
  toolbar por slots, sticky header, expansion controlada, seleccion, acciones,
  ordenamiento remoto emitido por callback, paginacion, redimensionamiento,
  indicador/resaltado de fila y fullscreen con fallback local.
- Se promovio el componente como `src/components/data-table/DataTable.tsx` y
  se agrego `useDataTablePreferencesStore` para la preferencia global de
  densidad. Ninguna tabla legacy fue migrada: sus 68 imports permanecen en el
  alias `@tanstack/react-table-v8`.
- Se completo la validacion visual manual en Component Lab de las rutas
  `remote`, `loading`, `empty` y `composed`, incluyendo paginacion, settings,
  densidad, visibilidad, fullscreen y estados de respuesta. La base queda
  aprobada para la primera adopcion de negocio.
- Se definio la estructura estable de cabecera: titulo opcional y spinner
  `RefreshCw` sin texto a la izquierda; acciones globales a la derecha;
  toolbar separada para el buscador. Filtros multicampo y sheet se difieren a
  una spec posterior.
- Edicion inline permanece como punto de extension opcional sin caso de uso
  actual; no bloquea la adopcion de lectura de Client Access.
- Se agrego el preview oficial en
  `/dashboard-playground/catalog/data-table`, enlazado desde el indice de
  catalogo. Importa el `DataTable` promovido y sus primitives canonicas; no
  depende de Component Lab.
- Se cierra formalmente la spec tras la validacion manual del laboratorio y
  del preview oficial. La primera adopcion por negocio corresponde a la
  iniciativa de Client Access y no se incluye en este alcance.
