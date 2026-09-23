# Decisions: Customer Service Records Administrative List Migration

## Decision 01. Administrative Information Architecture

### Context

La tabla vigente distribuye datos administrativos en muchas columnas y no
comparte la composición del `DataTable` canónico. La migración necesita una
jerarquía que conserve contexto operativo sin expansión de filas ni un menú de
acciones todavía.

### Options

1. Replicar cada columna vigente como una columna independiente.
2. Adoptar una fila multilínea que agrupe los datos relacionados y priorice las
   fechas operativas.

### Decision Final

Se aprueba la opción 2. La tabla administrativa usará `DataTable` con fila
multilínea, sin expansión, con esta jerarquía inicial:

1. Folio.
2. Cliente y activo.
3. Tipo de servicio.
4. Estado operativo.
5. Compromiso con cliente y su semáforo.
6. Proveedor y retorno estimado con su semáforo.
7. Solicitud o actualización.

La configuración de columnas podrá ocultar columnas secundarias según el
contrato existente de `DataTable`. Acciones de fila, overflow y clic secundario
no forman parte de esta decisión.

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
se conserva y se ajusta al contrato local de `DataTable`; Redux slice y thunks
no cambian. No se crea otra capa de estado ni se modifica Seguimiento de
servicios, que ya cumple esta separación.

### Status

`approved`
