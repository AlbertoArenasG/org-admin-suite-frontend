# Validacion Manual: Listado De Recepcion, Recoleccion Y Entrega

## Estado

- Validation status: `completed`
- Responsable: persona usuaria

## Acceso Y Navegacion

- [x] Un usuario con `SERVICE_PACKAGES/READ` ve la entrada lateral y accede a
      `/dashboard/service-packages-records`.
- [x] Un usuario sin READ no accede a la ruta ni ve la entrada.
- [x] Breadcrumb, shell de tabla y scroll corresponden a Next Dashboard.
- [x] El enlace de orden, `Ver detalle`, doble clic seguro y menu contextual
      llegan al registro correcto sin convertir toda la fila en clickeable.

## Datos Y Estados Remotos

- [x] Las seis columnas reflejan el endpoint y fechas localizadas.
- [x] Carga inicial, skeleton, error/reintento, vacio total y vacio por
      criterios son comprensibles y no rompen la altura de tabla.
- [x] El resaltado de busqueda conserva texto original e ignora acentos/caso.
- [x] El cambio de pagina y el ajuste de ultima pagina mantienen conteos y URL.

## Criterios, URL Y Preferencias

- [x] La busqueda aplica tras debounce, reinicia pagina y se comparte por URL.
- [x] El filtro de tipo conserva borrador hasta aplicar; cancelar/Escape no
      modifica resultados ni URL.
- [x] Con tipo de servicio aplicado, el trigger muestra contador y boton
      dividido de limpieza con tooltip; limpiarlo actualiza solo
      `service_type` sin abrir el dialogo.
- [x] Limpiar filtros y limpiar criterios restablecen los resultados esperados.
- [x] `limit` de URL prevalece; sin `limit`, el page size global por usuario se
      restaura y cambiarlo persiste para las otras tablas Next Dashboard.
- [x] La tabla muestra selector de densidad por ser de una sola linea; cambiar
      entre `compact` y `comfortable` se persiste en Local Storage y se
      conserva al recargar.
- [x] Cambiar esa preferencia no habilita selector ni altera la densidad
      `comfortable` de las tablas multilínea administrativa y de portal de
      Registros de servicio.

## Baja Y Permisos

- [x] Sin DELETE no aparece accion destructiva.
- [x] Con DELETE, la confirmacion muestra el registro correcto, bloquea durante
      la solicitud y cancela sin mutar.
- [x] Exito muestra feedback, actualiza filas/conteos y conserva una pagina
      valida; error conserva contexto y permite recuperacion.

## Responsive, Tema Y Accesibilidad

- [x] En escritorio, sticky header, scroll de resultados y controles
      horizontales no compiten con el shell.
- [x] En movil, tabla, toolbar, dialogo, menu y paginacion son utilizables por
      tacto y el scroll de pagina se conserva.
- [x] Tema claro y oscuro conservan contraste, tokens y estados interactivos.
- [x] Teclado, foco visible, Escape, tooltip, menus y dialogo se comportan
      conforme a primitives compartidas.
