# Desglose De Implementacion

## Slice 1. Contrato, Estado Y URL

### Objetivo

Restaurar solo la infraestructura de listado dentro del feature actual, sin
ruta ni JSX de tabla.

### Cambios

- Agregar tipos de lista, opciones, filtros, paginacion y mutacion.
- Extender mapper, thunks y slice con ramas aisladas de `detail`.
- Crear parser/serializer de query, store Zustand y controller con preferencia
  global, debounce y normalizacion de paginas.

### Limites

- No crea page, sidebar, tabla, columnas, filtro visual ni acciones.
- No altera detalle, backend, permisos ni contratos API.

### Cierre

El listado puede solicitar datos paginados y opciones con URL estable, sin
estado legacy ni cruce con `detail`.

## Slice 2. DataTable, Filtro Y Entrada De Modulo

### Objetivo

Crear la superficie navegable de lectura con el patron visual y estructural
canonico.

### Cambios

- Crear columnas, tabla, filtro y container.
- Crear la ruta base con boundary/workspace, registrar shell y restaurar sidebar
  y locales.
- Conectar busqueda, filtro aplicado, settings de columnas/densidad, estados
  remotos, scroll, responsive, paginacion y enlace de orden hacia el detalle.

### Limites

- No incorpora acciones de baja ni cambia la ruta de detalle.
- No agrega sorting, expansion, seleccion o estilos locales.

### Cierre

Una persona con READ puede encontrar, consultar, buscar, filtrar, paginar y
ajustar la densidad persistida; el enlace de orden y la ruta de detalle quedan
integrados.

## Slice 3. Acciones Destructivas Y Revalidacion

### Objetivo

Incorporar acciones por fila con autorizacion y baja confirmada.

### Cambios

- Crear hook de acciones con `Ver detalle` primaria y `Eliminar` condicionada.
- Integrar dialogo compartido, dispatch, estados pendientes, toast y refetch.
- Verificar que menu, contexto y doble clic usan la misma lista autorizada.

### Limites

- No modifica el contrato compartido de `DataTable` ni `DestructiveConfirmationDialog`.
- No agrega edicion, creacion o mutaciones adicionales.

### Cierre

La baja solo es visible/accionable para DELETE y refleja exito o error sin
dejar datos de paginacion obsoletos.

## Slice 4. Validacion Y Cierre

### Objetivo

Comprobar el alcance completo, registrar evidencia y cerrar la iniciativa.

### Cambios

- Ejecutar verificaciones estaticas acordadas.
- Completar matriz manual de permisos, datos, URL, responsive, temas,
  accesibilidad y mutacion.
- Actualizar adoption log, progreso, checks y estados terminales.

### Cierre

No existen tareas pendientes, checks inconsistentes, artefactos legacy ni
documentacion viva desactualizada dentro del alcance.
