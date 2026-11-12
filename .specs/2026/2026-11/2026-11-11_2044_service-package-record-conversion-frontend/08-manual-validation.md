# Matriz manual para el usuario

Matriz marcada como completada por indicación del usuario el 12 de noviembre de 2026. No se registraron resultados individuales ni se presenció su ejecución.

| Caso                       | Acción y resultado esperado                                                                                                      | Estado                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Acceso                     | READ sin CONVERT no muestra acción; URL directa no abre formulario. READ + CONVERT sí.                                           | completado por indicación del usuario |
| Origen                     | Lista/detalle muestran convertido y acción deshabilitada tras éxito; origen inexistente/error permite volver o reintentar carga. | completado por indicación del usuario |
| Equipos                    | Todos los equipos aparecen en orden; avanzar/retroceder preserva datos; cliente y usuarios se seleccionan del catálogo.          | completado por indicación del usuario |
| Fotos                      | Solo fotos, sin firmas; cada paso ofrece todas; la misma foto puede elegirse para varios equipos; cero fotos es válido.          | completado por indicación del usuario |
| Confirmación               | Se revisa resumen; un envío produce N registros y muestra IDs/folios; no se envía dos veces.                                     | completado por indicación del usuario |
| Error                      | 400 mantiene borrador; 409 refresca origen; red incierta impide reintento hasta verificar.                                       | completado por indicación del usuario |
| Responsive y accesibilidad | Contexto visible en desktop y accesible en móvil; sin scroll competitivo; foco, etiquetas, teclas y estados comprensibles.       | completado por indicación del usuario |
