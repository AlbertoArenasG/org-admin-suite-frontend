# Cinco vistas de seguimiento para acceso a clientes

Definition status: completed
Implementation ready: yes
Implementation status: completed
Validation status: completed — usuario confirmó la validación manual el 2026-11-24
Spec status: completed

## Resultado y alcance

La ruta `/dashboard/portal/services` muestra tabla, calendario, Gantt, lista y Kanban en Next Dashboard. Con `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS/READ` se consultan solo los registros permitidos por el API. Gantt y calendario muestran únicamente el período e hitos del cliente; no proveedor. Se conservan tabla, detalle y permisos existentes. No hay cambios de backend, permisos, migraciones, seeds ni rutas nuevas.

Tabla, lista y Kanban comparten listado paginado, búsqueda y filtros de cliente, tipo de servicio, recepción y entrega estimada; los controles de filtros viven en la tabla. Calendario y Gantt usan `/v1/customer-service-records-client-access/timeline` por rango y paginan todas las páginas. Semana y mes, navegación, día actual, carga, vacío, error y reintento siguen la experiencia administrativa.

## Criterios verificables

- Sin READ se mantiene el boundary; con READ todos los enlaces van al detalle del portal.
- Filtros y búsqueda aplicados en tabla se reflejan en lista y Kanban; limpiarlos restaura la lista y la URL. La paginación se reinicia al cambiar criterios.
- Calendario dibuja cuadrícula incluso sin eventos; Gantt dibuja períodos y registros de un solo día; ninguno muestra proveedor.
- Cada consulta temporal usa rangos válidos de hasta 42 días y completa la paginación. Los errores ofrecen reintento.
- Scroll, responsive, ES/EN, temas, foco y lector de pantalla siguen Next Dashboard.

Decisiones abiertas: ninguna. El usuario confirmó la validación manual el 2026-11-24 sin detallar resultados por escenario.
