# Análisis

- La ruta ya tiene `DashboardViewAccessBoundary` y tabla con Redux para datos y Zustand para UI.
- El API del portal ofrece listado filtrable, opciones contextuales y `/timeline` paginado; este último no expone proveedor y limita cada rango a 42 días.
- La vista administrativa tiene primitives vendor de calendario, Gantt, lista y Kanban, y precarga de chunks para Gantt. Los enlaces administrativos codificados necesitan un destino configurable.
- El portal no debe usar los thunks administrativos porque difieren permiso, endpoint, alcance y proyección.
