# Manual Validation: Customer Service Record Creation Wizard Migration

## Permissions And Entry

- [ ] Con `READ` y sin `CREATE`, no aparece el boton de nuevo registro.
- [ ] Con `CREATE`, aparece al extremo derecho de la toolbar, despues de
      configuracion de tabla.
- [ ] La tabla conserva busqueda, filtros, settings, scroll, filas y acciones
      existentes al agregar el boton.

## Wizard Data Entry

- [ ] El dialogo abre en Solicitud y cliente con fecha vigente.
- [ ] Tipo de servicio, fecha y cliente bloquean el avance si faltan o son
      invalidos.
- [ ] La fecha permite elegir un dia en calendario y escribir `dd/mm/aaaa`;
      las diagonales se agregan tras dia y mes.
- [ ] Usuarios relacionados no se muestran sin cliente.
- [ ] Cambiar cliente limpia usuarios previos y carga solo usuarios del nuevo
      cliente.
- [ ] Es posible continuar sin seleccionar usuarios.
- [ ] El paso Equipo permite un solo equipo y bloquea avance si falta alguno de
      los cinco campos obligatorios.
- [ ] Los pasos de captura son horizontales en escritorio y apilados en movil.
- [ ] Resumen refleja tipo, fecha, cliente, usuarios elegidos o ausencia de
      ellos, y los cinco datos del equipo sin controles editables.

## Draft, Submission And Navigation

- [ ] Cerrar un wizard vacio no solicita confirmacion.
- [ ] X, Cancelar, Escape y clic exterior sobre un draft sucio abren la
      confirmacion in-place.
- [ ] Seguir editando conserva exactamente datos y paso.
- [ ] Descartar limpia el draft; una nueva apertura no recupera datos previos.
- [ ] Durante envio no se puede cerrar ni disparar doble submit.
- [ ] Error remoto conserva valores y permite corregir o reintentar.
- [ ] Exito muestra toast de exito y navega a la ruta legacy de detalle del
      registro creado.

## Responsive And Accessibility

- [ ] Dialogo, calendario, popovers y resumen funcionan en escritorio y movil
      sin scroll competitivo.
- [ ] Tab, Shift+Tab, Enter, Escape y foco visible permiten operar controles,
      calendario, Stepper, confirmacion y acciones.
- [ ] Los estados disabled, carga y error son distinguibles en temas activos.

## Legacy Removal

- [ ] No existe acceso lateral a `Nuevo registro` ni ruta productiva
      `/dashboard/customer-service-records/new`.
- [ ] No se invoca `SnackbarProvider` o `useSnackbar` desde el flujo nuevo.

## Static Verification

- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run lint -- <archivos afectados>` termina sin errores.
- [ ] `npm run build` termina sin errores nuevos atribuibles a la spec.
- [ ] No se crearon ni ejecutaron pruebas unitarias.
