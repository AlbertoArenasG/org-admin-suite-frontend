# Decisiones

1. Ruta nueva `/dashboard/customer-service-records/roadmap` bajo el mismo módulo READ; listado actual se conserva para comparar. El enlace se agrega como hijo de Registros de servicio.
2. Las cinco vistas mantienen la composición visual del bloque Kibo. Tabla incrusta el DataTable administrativo existente, sin copiar la tabla vendor de TanStack v8 ni ampliar el contrato global.
3. Gantt y Calendario consultan timeline; Lista, Kanban y Tabla usan el listado paginado. Gantt agrupa por cliente; Lista y Kanban por estado operativo. La navegación siempre va al detalle administrativo existente.
4. Periodos civiles semana/mes; sin inferir fechas faltantes. Una sola fecha ocupa un día. Los tramos invertidos se muestran como hito en el extremo disponible para evitar geometría negativa, sin reescribir datos.
5. La integración vendor queda aislada en `src/components/vendor/kibo-ui/`; las adaptaciones de negocio, permisos y traducción viven en el módulo. El vendor se modifica solo para lectura, semana, visibilidad de eventos y compatibilidad con primitives locales.
6. Redux conserva respuesta remota timeline; Zustand/URL controla vista, rango y paginación de la ruta; estado efímero del switch y foco queda local. No se añaden mutaciones.
