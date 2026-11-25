# Decisiones

- Mantener ruta y READ existentes; ninguna acción nueva ni cambio de permisos.
- Reutilizar primitives visuales y comportamiento de la vista administrativa, con estado remoto propio del portal para conservar independencia.
- Lista/Kanban leen listado filtrado; calendario/Gantt leen timeline por rango sin filtros del listado, como administración.
- Los datos de proveedor no existen en el modelo del portal. Los enlaces llevan al detalle del portal.
- Gantt usa chunks de 42 días, precarga y retención acotada, no una carga total del historial.
