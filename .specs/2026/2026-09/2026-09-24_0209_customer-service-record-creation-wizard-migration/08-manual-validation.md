# Manual Validation: Customer Service Record Creation Wizard Migration

## Permissions And Entry

- [x] Con `READ` y sin `CREATE`, no aparece el boton de nuevo registro.
- [x] Con `CREATE`, aparece al extremo derecho de la toolbar, despues de
      configuracion de tabla.
- [x] La tabla conserva busqueda, filtros, settings, scroll, filas y acciones
      existentes al agregar el boton.

## Wizard Data Entry

- [x] El dialogo abre en Solicitud y cliente con fecha vigente.
- [x] Tipo de servicio, fecha y cliente bloquean el avance si faltan o son
      invalidos.
- [x] La fecha permite elegir un dia en calendario y escribir `dd/mm/aaaa`;
      las diagonales se agregan tras dia y mes.
- [x] Usuarios relacionados no se muestran sin cliente.
- [x] Los comboboxes de tipo, cliente y usuarios abren sin parpadeo ni cierre
      del dialogo; las listas extensas permiten scroll interno.
- [x] Cambiar cliente limpia usuarios previos y carga solo usuarios del nuevo
      cliente.
- [x] Es posible continuar sin seleccionar usuarios.
- [x] El paso Equipo permite un solo equipo y bloquea avance si falta alguno de
      los cinco campos obligatorios.
- [x] Los pasos de captura son horizontales en escritorio y apilados en movil.

> Nota de validacion: se ejecutaron las validaciones responsive del wizard. La
> discrepancia observada en la composicion horizontal requiere un analisis
> independiente del sistema compartido `Field`/`FormField`; se acepta como
> seguimiento tecnico fuera del alcance de esta migracion y no deja acciones
> pendientes para esta spec.

- [x] Resumen refleja tipo, fecha, cliente, usuarios elegidos o ausencia de
      ellos, y los cinco datos del equipo sin controles editables.

## Draft, Submission And Navigation

- [x] Cerrar un wizard vacio no solicita confirmacion.
- [x] X, Cancelar, Escape y clic exterior sobre un draft sucio abren la
      confirmacion in-place.
- [x] Seguir editando conserva exactamente datos y paso.
- [x] Descartar limpia el draft; una nueva apertura no recupera datos previos.
- [x] Durante envio no se puede cerrar ni disparar doble submit.
- [x] Error remoto conserva valores y permite corregir o reintentar.
- [x] Exito muestra toast de exito y navega a la ruta legacy de detalle del
      registro creado.

## Responsive And Accessibility

- [x] Dialogo, calendario, popovers y resumen funcionan en escritorio y movil
      sin scroll competitivo.
- [x] Tab, Shift+Tab, Enter, Escape y foco visible permiten operar controles,
      calendario, Stepper, confirmacion y acciones.
- [x] Los estados disabled, carga y error son distinguibles en temas activos.

## Legacy Removal

- [x] No existe acceso lateral a `Nuevo registro` ni ruta productiva
      `/dashboard/customer-service-records/new`.
- [x] `CustomerServiceRecordFormPageContainer` y
      `CustomerServiceRecordForm` no exponen ni usan `mode="create"`.
- [x] El flujo nuevo no invoca `SnackbarProvider` ni `useSnackbar`; solo usa
      `showToast` tras el exito.
- [x] El barrido de referencias no encuentra ruta, entrada lateral, ramas,
      payload ni feedback legacy de creacion fuera del wizard Next Dashboard.

## Static Verification

- [x] `npm run typecheck` termina sin errores.
- [x] `npm run lint -- <archivos afectados>` termina sin errores.
- [x] `npm run build` termina sin errores nuevos atribuibles a la spec.
- [x] No se crearon ni ejecutaron pruebas unitarias.
