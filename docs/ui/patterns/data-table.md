# DataTable

El componente compartido `src/components/data-table/DataTable.tsx` usa
`@tanstack/react-table` v9 y es la base para nuevas colecciones remotas. No
reemplaza una primitive de shadcn ni recibe una instancia de TanStack creada
por el consumidor.

La vista conserva API client, thunks, slice y permisos. Su contenedor adapta
la respuesta, mantiene query y preferencias locales, y entrega filas,
columnas y callbacks controlados al componente. `DataTable` no ejecuta HTTP,
no interpreta permisos ni guarda colecciones remotas.

Las tablas legacy continúan importando exclusivamente
`@tanstack/react-table-v8`. No se migran ni se cambian sus contratos al añadir
una tabla nueva. La densidad global vive en
`useDataTablePreferencesStore`; los anchos de columna no se persisten en v1.

Antes de adoptar el patrón, consultar la spec
`generic-data-table-foundation`: define estados remotos, toolbar, expansión,
selección, sticky header, fullscreen y los puntos de extensión diferidos para
virtualización e infinite scrolling.
