# Decisiones: Migracion Del Listado De Recepcion, Recoleccion Y Entrega

## 2026-09-29 - Reconstruccion Sin Coexistencia Legacy

### Decision

Eliminar el listado legacy antes de abrir esta spec y construir la nueva
superficie desde cero.

### Razon

Evita mezclar componentes MUI/TanStack v8, estado historico o convenciones
anteriores con las fronteras actuales de Next Dashboard.

### Impacto

- No existe compatibilidad temporal ni adaptador entre las dos tablas.
- El detalle moderno permanece como consumidor independiente del feature.

## 2026-09-29 - Sin Ordenamiento Expuesto

### Decision

No declarar columnas ordenables ni estado/query de sort.

### Razon

El contrato del endpoint no recibe sorting y Mongo conserva orden descendente
por creacion. `DataTable` admite sorting como capacidad optativa, por lo que
omitirlo no es una excepcion ni un parche.

### Impacto

- La tabla reproduce el orden actual del servidor.
- Una futura adopcion de sort requerira contrato backend y una iniciativa
  independiente.

## 2026-09-29 - Propiedad De Estado Por Capa

### Decision

Redux tendra ramas de `list`, `options` y `mutations` independientes de
`detail`; Zustand conservara pagina, limite, busqueda, filtro, columnas y
expansion local de la tabla.

### Razon

Los datos remotos pertenecen al feature Redux; la coordinacion efimera de UI y
URL es propiedad de la vista. El detalle no puede reconstruir ni fusionar
payloads con el listado.

### Impacto

- Ningun JSX interpreta respuestas HTTP ni muta colecciones directamente.
- El desmontaje del listado limpia solo su store local; la rama detail conserva
  su ciclo propio.

## 2026-09-29 - Acciones Por Fila Y Permisos

### Decision

Usar un enlace de orden de servicio hacia detalle y `DataTableRowActions`:
`Ver detalle` como accion primaria y `Eliminar` solo con `can('DELETE')`.

### Razon

El enlace da una via visible y directa en el dato principal. El contrato
institucional complementa esa via: menu de tres puntos, menu contextual y
doble clic seguro comparten la misma lista autorizada. La mutacion destructiva
usa el dialogo comun.

### Impacto

- La columna de orden es duena solo del enlace; la tabla no incorpora menus,
  tooltips, permisos o dialogos locales.
- Backend conserva la autorizacion efectiva de DELETE.

## 2026-09-29 - Filtro De Tipo De Servicio

### Decision

El unico filtro de tabla se presenta mediante un adaptador de modulo sobre
`TableFilterDialog`, con estado borrador y seleccion unica.

### Razon

Mantiene una interaccion consistente para filtros de tabla y evita aplicar una
consulta remota por cada cambio del selector.

### Impacto

- No se crea una nueva primitive ni se modifica `TableFilterDialog`.
- `service_type` solo cambia al confirmar y reinicia pagina a 1.

## 2026-09-29 - Densidad Global Persistida

### Decision

Adoptar el selector de densidad de `DataTable` para esta tabla de una sola
linea, usando `useDataTablePreferencesStore` como fuente global persistida.

### Razon

Los seis datos de cada fila no requieren composicion multilinea. El contrato
actual solo muestra selector de densidad con `rowLayout="single-line"` y el
store compartido ya persiste `compact` o `comfortable` en Local Storage.

### Impacto

- Esta es la primera tabla de negocio que consume la densidad global aprobada.
- La preferencia solo afecta consumidores que entreguen explicitamente
  `density` y `settings.density` a `DataTable`; no modifica automaticamente
  otras tablas Next Dashboard.
- Las tablas administrativas y de portal de Registros de servicio usan
  `rowLayout="multiline"`, omiten ese binding y conservan `comfortable`
  inmutable. No se crea un storage, token ni ajuste de densidad por modulo.
- El limite por pagina sigue siendo preferencia por usuario y la densidad es
  una preferencia global, conforme al contrato vigente.
