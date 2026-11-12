# Decisiones

- Ruta dedicada con `page-content`: permite referencia a la izquierda y formulario a la derecha en escritorio; referencia arriba en móvil. No se modifica el wizard genérico ni se fuerza un diálogo estrecho.
- `SERVICE_PACKAGES.CONVERT` gobierna acción y ruta; `READ` gobierna lista y detalle. El backend conserva la autorización final.
- Datos del formulario por equipo; catálogos reutilizan endpoints derivados, pero viven en estado del feature de recolecciones. No se mezcla el tipo de servicio de la PWA con el catálogo de registros de cliente.
- Se usan solo imágenes (`mime_type` `image/*`) y sus `file_id`. La selección es independiente por equipo.
- La mutación ocurre una vez tras resumen. Si el resultado es incierto, primero se consulta el origen. No se reintenta a ciegas.
