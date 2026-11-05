# Slices

1. Contrato y estado. Artefactos: tipos, mappers, thunks, slice. Validar typecheck. Conservar listado y detalle actuales.
2. Administración. Artefactos: diálogo, frame, controlador de detalle, traducciones. Validar precarga, permiso y 502; no cambiar `Dialog` genérico.
3. Datos del ciclo. Artefactos: columnas de tabla, frame de facturación, formularios de estado y fechas. Validar opción localizada y errores.
4. Documentos e historial. Artefactos: orden, complementos, archivo y snapshot. Validar IDs, paginación, 409, URLs y permisos.
5. Comentarios y cierre de código. Artefactos: sección de comentarios, locales, documentación viva. Validar typecheck/lint/build; entregar matriz manual al usuario.

Cada slice depende de la anterior y actualiza su tarea y progreso. La validación manual no se marcará hasta confirmación del usuario.
