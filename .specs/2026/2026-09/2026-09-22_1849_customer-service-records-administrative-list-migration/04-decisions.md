# Decisions: Customer Service Records Administrative List Migration

## Decision 01. Administrative Information Architecture

### Context

La tabla administrativa debe adoptar la misma composición visual y de celdas
de Seguimiento de servicios. Añade al final los datos de proveedor disponibles
en el listado y conserva su despliegue de observaciones cuando existan.

### Options

1. Diseñar una jerarquía administrativa específica.
2. Replicar la composición de Seguimiento de servicios y añadir proveedor al
   final.

### Decision Final

Se aprueba la opción 2. La tabla administrativa usará `DataTable` con la misma
fila multilínea, densidad, anchos y celdas de Seguimiento de servicios, con
expansión de observaciones, con esta jerarquía:

1. Folio.
2. Equipo y servicio.
3. Estado operativo.
4. Seguimiento.
5. Recolección.
6. Entrega.
7. Detalles de equipo.
8. Cliente.
9. Seguimiento con proveedor.
10. Retorno de proveedor.

Las dos últimas columnas se mantienen al final aunque requieran scroll
horizontal. Acciones de fila, overflow y clic secundario no forman parte de
esta decisión.

### Status

`approved`

## Decision 02. Detail Navigation

### Decision Final

El folio conserva el enlace explícito hacia el detalle. La fila completa no es
navegable y no se agrega columna de acciones en esta migración. Esta decisión
preserva una interacción clara sin anticipar el contrato de acciones de tabla
diferido.

### Status

`approved`

## Decision 03. Density And Scroll Ownership

### Decision Final

La tabla usa `rowLayout="multiline"` y densidad `comfortable`. En escritorio,
`DataTable` es dueño de una región de scroll de altura disponible y encabezado
sticky; en móvil el scroll vertical permanece en la página y el contenido
ancho conserva scroll horizontal local.

### Status

`approved`

## Decision 04. Replacement Without Legacy UI Compatibility

### Decision Final

La migración construye una vista nueva y elimina los componentes, columnas y
toolbar de presentación anteriores. El store de Zustand y la utilidad de query
se ajustan explícitamente al nuevo contrato; Redux no cambia. La composición
expone un solo orden y un solo período; parámetros de URL no representables se
descartan al sincronizar.

### Status

`approved`

## Decision 05. Per-View Local Table State

### Context

Seguimiento de servicios ya establece el patrón de Next Dashboard:
`DataTable` recibe estado controlado, un store de Zustand propio de la vista
conserva interacción local y Redux conserva la colección remota.

### Decision Final

La tabla administrativa adopta el mismo patrón. Su store de Zustand existente
se conserva y se ajusta al contrato local de `DataTable`. El slice y el ciclo
remoto Redux no cambian; el mapper del thunk de listado solamente expone los
campos que el endpoint ya entrega para Recolección y Detalles de equipo. No se
crea otra capa de estado ni se modifica Seguimiento de servicios, que ya cumple
esta separación.

### Status

`approved`
