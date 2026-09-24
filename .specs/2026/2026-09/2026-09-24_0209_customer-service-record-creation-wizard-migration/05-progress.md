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
- Siguiente: Slice 1, retiro legacy verificable antes de crear reemplazo.
