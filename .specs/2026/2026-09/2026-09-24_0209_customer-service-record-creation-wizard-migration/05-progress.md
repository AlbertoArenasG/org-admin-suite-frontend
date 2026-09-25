# Progress: Customer Service Record Creation Wizard Migration

## 2026-09-24

- Definicion completada tras validar contrato POST, ownership de estado,
  rutas, permisos y documentos vivos afectados.
- Aprobados: toolbar como superficie de alta, wizard de tres pasos, equipo
  unico, usuarios opcionales, fecha inicial vigente, formulario horizontal,
  descarte in-place y destino temporal de detalle legacy.
- Confirmado: toda operacion no `READ` seleccionada en el editor de roles
  incorpora `READ`; `CREATE` puede acceder a la tabla que contiene el wizard.
- Definicion reforzada: el mandato de migracion enumera el retiro completo de
  creacion legacy y su sustitucion Next Dashboard. Los componentes compartidos
  que sirven a edicion se conservan solo despues de retirar su rama `create`.
- Añadidas precondiciones verificables para `FieldGroup` y comboboxes dentro
  de Dialog, incluidos scroll interno y ausencia de parpadeo.
- Slices reordenadas: Slice 1 retira por completo la creacion legacy; Slice 2
  crea contratos compartidos; Slice 3 reintroduce solo el boundary minimo de
  create; Slice 4 adopta el wizard Next Dashboard; Slice 5 valida y cierra.
- Slice 1 implementada: se retiraron la ruta `/new`, acceso lateral, ramas de
  alta del formulario legacy, thunk y estado exclusivos de create. Edicion,
  PATCH y delete se preservaron.
- Verificacion de Slice 1: lint dirigido, `npm run typecheck`, busqueda de
  referencias y `git diff --check` completados sin errores.
- Slices 2 y 3 implementadas: `DataTableToolbar.primaryActions`,
  `FormDateInput`, contrato de create, schema, body HTTP exclusivo y estado
  remoto de la mutacion ya estan separados de la edicion legacy.
- Slice 4 implementada: el wizard Next Dashboard abre desde la tabla segun
  `CREATE`, maneja sus tres pasos, draft local, descarte in-place, toast y
  navegacion al detalle legacy despues del POST exitoso.
- Verificacion previa a pruebas manuales: JSON de traducciones, lint dirigido,
  `npm run typecheck`, `npm run build` y `git diff --check` completados sin
  fallas de esta migracion.
- Validacion manual completada por el usuario para toda la matriz de `08`.
  El comportamiento responsive se acepta con seguimiento tecnico separado para
  la composicion compartida de `Field`/`FormField`.
- Slice 5 completada: `npm run build` finaliza correctamente. Conserva dos
  warnings preexistentes y ajenos a esta spec en
  `CustomerUsersSection` y `UserRegistrationInvitationTableRowActions`.
- Spec cerrada: tareas, slices, validacion y documentos vivos consistentes.
