# Matriz manual para el usuario

Todos los casos están pendientes de ejecución por el usuario. Probar en escritorio y móvil, en temas activos, con teclado y lector de pantalla donde aplique.

| Caso                       | Acción y resultado esperado                                                                                                      | Estado    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Acceso                     | READ sin CONVERT no muestra acción; URL directa no abre formulario. READ + CONVERT sí.                                           | pendiente |
| Origen                     | Lista/detalle muestran convertido y acción deshabilitada tras éxito; origen inexistente/error permite volver o reintentar carga. | pendiente |
| Equipos                    | Todos los equipos aparecen en orden; avanzar/retroceder preserva datos; cliente y usuarios se seleccionan del catálogo.          | pendiente |
| Fotos                      | Solo fotos, sin firmas; cada paso ofrece todas; la misma foto puede elegirse para varios equipos; cero fotos es válido.          | pendiente |
| Confirmación               | Se revisa resumen; un envío produce N registros y muestra IDs/folios; no se envía dos veces.                                     | pendiente |
| Error                      | 400 mantiene borrador; 409 refresca origen; red incierta impide reintento hasta verificar.                                       | pendiente |
| Responsive y accesibilidad | Contexto visible en desktop y accesible en móvil; sin scroll competitivo; foco, etiquetas, teclas y estados comprensibles.       | pendiente |
