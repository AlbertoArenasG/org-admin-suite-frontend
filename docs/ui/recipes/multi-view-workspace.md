# Receta de espacio de trabajo con varias vistas

## Propósito

Una ruta puede ofrecer varias representaciones de la misma colección, por ejemplo
Tabla, Calendario, Gantt, Lista y Kanban, sin perder el área útil del workspace.
Solo se monta una vista a la vez. Esta receta adopta la geometría de
`DashboardTableWorkspace` para mantener el header de navegación visible y dar
altura disponible a la superficie activa.

## Composición

- El selector de vistas pertenece a la ruta y permanece visible sobre la
  superficie activa. Cada opción tiene nombre accesible y tooltip cuando solo
  muestra un icono.
- El workspace usa `padding="none"` en todos los modos: el selector comienza
  a la misma altura bajo la navegación. Tabla conserva sus gutters laterales,
  el ancho útil máximo de 1600 px, el espacio inferior y el scroll interno de
  `DataTable` mediante la composición local de su contenido. Las otras vistas
  aprovechan el ancho del workspace.
- Calendario, Lista y Kanban desplazan su contenido dentro del panel activo;
  Gantt administra sus ejes dentro de su propia superficie. El scroller del
  shell no compite por el scroll de escritorio. En móvil se conserva el flujo
  natural del documento, salvo el eje horizontal propio de una visualización.
- Las transiciones al cambiar de vista pueden animar la superficie activa;
  respetan `prefers-reduced-motion`. Esto es distinto de repetir la animación
  de entrada de la ruta durante un refetch.

## Límites

Esta receta se usa cuando las vistas son modos de una misma tarea y se muestra
solo una a la vez. No convierte cualquier página con varias secciones y una
tabla en `Table Workspace`. No modifica los contratos globales del shell ni de
`DataTable`: la ruta compone las vistas, los datos, el estado y las acciones.

## Adopción

`/dashboard/customer-service-records` es la primera adopción. Mantiene la
tabla administrativa existente como modo Tabla y las otras cuatro vistas como
modos alternativos del mismo listado.
