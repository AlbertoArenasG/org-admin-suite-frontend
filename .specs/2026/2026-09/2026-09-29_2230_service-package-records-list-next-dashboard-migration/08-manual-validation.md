# Validacion Manual: Listado De Recepcion, Recoleccion Y Entrega

## Estado

- Validation status: `pending`
- Responsable: persona usuaria

## Acceso Y Navegacion

- [ ] Un usuario con `SERVICE_PACKAGES/READ` ve la entrada lateral y accede a
      `/dashboard/service-packages-records`.
- [ ] Un usuario sin READ no accede a la ruta ni ve la entrada.
- [ ] Breadcrumb, shell de tabla y scroll corresponden a Next Dashboard.
- [ ] El enlace de orden, `Ver detalle`, doble clic seguro y menu contextual
      llegan al registro correcto sin convertir toda la fila en clickeable.

## Datos Y Estados Remotos

- [ ] Las seis columnas reflejan el endpoint y fechas localizadas.
- [ ] Carga inicial, skeleton, error/reintento, vacio total y vacio por
      criterios son comprensibles y no rompen la altura de tabla.
- [ ] El resaltado de busqueda conserva texto original e ignora acentos/caso.
- [ ] El cambio de pagina y el ajuste de ultima pagina mantienen conteos y URL.

## Criterios, URL Y Preferencias

- [ ] La busqueda aplica tras debounce, reinicia pagina y se comparte por URL.
- [ ] El filtro de tipo conserva borrador hasta aplicar; cancelar/Escape no
      modifica resultados ni URL.
- [ ] Con tipo de servicio aplicado, el trigger muestra contador y boton
      dividido de limpieza con tooltip; limpiarlo actualiza solo
      `service_type` sin abrir el dialogo.
- [ ] Limpiar filtros y limpiar criterios restablecen los resultados esperados.
- [ ] `limit` de URL prevalece; sin `limit`, el page size global por usuario se
      restaura y cambiarlo persiste para las otras tablas Next Dashboard.
- [ ] La tabla muestra selector de densidad por ser de una sola linea; cambiar
      entre `compact` y `comfortable` se persiste en Local Storage y se
      conserva al recargar.
- [ ] Cambiar esa preferencia no habilita selector ni altera la densidad
      `comfortable` de las tablas multilínea administrativa y de portal de
      Registros de servicio.

## Baja Y Permisos

- [ ] Sin DELETE no aparece accion destructiva.
- [ ] Con DELETE, la confirmacion muestra el registro correcto, bloquea durante
      la solicitud y cancela sin mutar.
- [ ] Exito muestra feedback, actualiza filas/conteos y conserva una pagina
      valida; error conserva contexto y permite recuperacion.

## Responsive, Tema Y Accesibilidad

- [ ] En escritorio, sticky header, scroll de resultados y controles
      horizontales no compiten con el shell.
- [ ] En movil, tabla, toolbar, dialogo, menu y paginacion son utilizables por
      tacto y el scroll de pagina se conserva.
- [ ] Tema claro y oscuro conservan contraste, tokens y estados interactivos.
- [ ] Teclado, foco visible, Escape, tooltip, menus y dialogo se comportan
      conforme a primitives compartidas.
