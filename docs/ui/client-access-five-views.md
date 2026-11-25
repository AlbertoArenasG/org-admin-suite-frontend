# Cinco vistas de seguimiento de servicios

`/dashboard/portal/services` se presenta dentro de Next Dashboard y exige `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS/READ` con `DashboardViewAccessBoundary`. El API determina el alcance efectivo del usuario: staff interno ve registros activos autorizados; un usuario externo debe conservar relación con el cliente y asignación al registro.

La tabla, lista y Kanban comparten el listado `/v1/customer-service-records-client-access`, su paginación y filtros. La tabla contiene los controles de búsqueda, filtrado, orden y columnas. Lista y Kanban reflejan esos criterios cuando el usuario cambia de vista. Los filtros admitidos son cliente, tipo de servicio y un rango de recepción o entrega estimada; las opciones provienen de los endpoints contextuales del mismo módulo. Los criterios se serializan en la URL y la UI local vive en Zustand; los datos remotos, carga y errores viven en Redux.

Calendario y Gantt consultan `/v1/customer-service-records-client-access/timeline` por rangos de hasta 42 días. Calendario completa la paginación del período visible; Gantt precarga chunks vecinos y retiene un conjunto acotado al viewport. Ninguno aplica los filtros del listado, igual que la vista administrativa. El modelo del portal no contiene proveedor; sus eventos son recepción y entrega estimada y sus barras representan el período del cliente. Todos los enlaces abren el detalle del portal.

La composición visual usa `DashboardTableWorkspace`, la `DataTable` existente, el diálogo genérico de filtros y las primitives Kibo aisladas que utiliza administración. Los componentes visuales de calendario y Gantt aceptan la ruta base del detalle para no codificarla dentro del vendor. La preferencia de escala semana/mes del portal usa una clave propia de localStorage y no modifica la administrativa.

Estados de carga, vacío, error y reintento se muestran en cada vista. El calendario mantiene la cuadrícula aun sin registros; Gantt conserva desplazamiento horizontal y vertical dentro de su panel. Las etiquetas y controles tienen traducción ES/EN y operan con teclado.
