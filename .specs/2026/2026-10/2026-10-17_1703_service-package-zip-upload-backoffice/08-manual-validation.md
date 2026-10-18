# Validacion Manual: Carga ZIP Desde Backoffice

- Validation status: `completed`
- Responsable: persona usuaria, con frontend y API accesibles.
- Fecha de confirmacion: 2026-10-17. El usuario confirmo haber cubierto todos
  los escenarios de esta matriz, incluidos error HTTP, corte de red, permisos,
  movil, temas y accesibilidad. No se proporcionaron identificadores de cuenta,
  dispositivo o tema por caso; no se inventan resultados mas especificos.

## Contrato Y Resultado

- [x] Desde `/dashboard/service-packages-records`, una cuenta READ ve
      `Cargar ZIP`; una cuenta sin READ no accede a la ruta.
- [x] Seleccionar un `.zip` de la PWA muestra nombre/tamano y solo permite
      uno; archivo vacio o no ZIP no habilita envio.
- [x] La fila seleccionada conserva la animacion local de preparacion usada
      en registros de servicio a cliente; `Enviar ZIP` se habilita al terminar.
- [x] Confirmar hace un unico POST multipart `package` con
      `origin=backoffice`; no aparece `Content-Type` manual sin boundary.
- [x] Durante la solicitud el dialogo muestra progreso de procesamiento,
      evita segundo envio y no cierra por Escape, overlay o X.
- [x] Con respuesta 201 valida se ven ID de paquete, conteo y folios
      confirmados; el dialogo sigue abierto hasta `Cerrar`.
- [x] Tras exito la tabla refresca conservando pagina, busqueda, filtros y
      preferencias; si un filtro oculta el resultado, el dialogo mantiene su
      detalle para que el usuario no dependa de encontrarlo en la tabla.
- [x] Ante HTTP con error se muestra el mensaje disponible y la advertencia
      de posible carga parcial; no se reintenta automaticamente.
- [x] Ante corte de red o respuesta ilegible se muestra incertidumbre, no
      un fracaso afirmado; se invita a revisar el listado antes de repetir.
- [x] En error o incertidumbre, `Verificar en el listado` cierra el dialogo y
      refresca la tabla sin reenviar el ZIP.
- [x] Cerrar y reabrir el dialogo inicia un intento limpio, sin arrastrar el
      resultado anterior ni volver a enviar por si solo.

## Experiencia Y Regresion

- [x] En escritorio y movil el dialogo no crea scroll competitivo; un ZIP
      con muchos folios deja visible el control de cierre.
- [x] Teclado y lector de pantalla anuncian titulo, progreso y resultado;
      el foco vuelve al trigger despues de cerrar.
- [x] Temas activos conservan contraste de estados, botones y texto sin
      colores hardcodeados.
- [x] Listado, filtro, acciones por fila, detalle y eliminacion conservan su
      comportamiento anterior.

## Riesgos No Simulables

Si no es seguro provocar un fallo parcial real, marcar ese escenario como
`riesgo residual` y validar al menos que el copy no promete atomicidad.
No cerrar la spec suponiendo que un corte de red prueba que la API no proceso
el ZIP.
