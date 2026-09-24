# Implementation Breakdown: Customer Service Record Creation Wizard Migration

## Slice 1: Toolbar And Form Date Field

- Phase: 1.
- Goal: habilitar una accion primaria opcional en toolbar y un campo de fecha
  exclusivo de formularios, sin cambiar filtros existentes.
- Artifacts: `DataTable.types`, `DataTableToolbar`, `FormDateInput`, barrel de
  forms y los dos documentos vivos.
- Steps:
  1. Agregar `primaryActions` al contrato y renderizarlo despues de settings.
  2. Implementar `FormDateInput` con valor ISO, mascara localizada, validacion
     de captura y calendario single.
  3. Exportarlo y documentar las superficies de acciones sin reglas rigidas.
- Compatibility: todas las toolbars sin `primaryActions` conservan su DOM y
  apariencia; `TableFilterDateInput` no cambia.
- Validation: typecheck, lint dirigido y verificacion manual del catalogo o
  consumidor aislado del campo.
- Close: slot y fecha quedan reutilizables, accesibles y documentados.

## Slice 2: Creation Contract

- Phase: 2.
- Goal: separar valores/schema/payload de creacion del contrato de edicion.
- Artifacts: types, thunk y schema de creacion.
- Steps:
  1. Declarar valores del wizard y payload minimo de creacion.
  2. Crear schema Zod con reglas de pasos 1 y 2.
  3. Implementar builder de POST minimo y cambiar solo el thunk `create`.
- Compatibility: PATCH y `CustomerServiceRecordMutationPayload` no cambian.
- Validation: typecheck, lint dirigido e inspeccion de body construido para
  confirmar ausencia de campos legacy.
- Close: el tipo de create no admite provider, delivery ni estado operativo.

## Slice 3: Wizard Dialog And Module Adoption

- Phase: 3.
- Goal: crear flujo completo y sustituir la entrada legacy de alta.
- Artifacts: tres componentes de paso, dialogo, tabla, contenedor,
  traducciones, ruta y navegacion legacy.
- Steps:
  1. Componer RHF, Stepper y pasos con orientacion responsive horizontal.
  2. Cargar opciones, limpiar usuarios ante cambio de cliente y limitar a un
     activo.
  3. Implementar resumen, submit, bloqueo pendiente y recovery de error.
  4. Implementar cierre limpio, descarte in-place y limpieza solo en descarte
     confirmado o exito.
  5. Exponer boton segun `CREATE`, integrar toast/navegacion y retirar ruta y
     enlace legacy.
- Compatibility: tabla, sus filtros, acciones de fila, permisos `READ` y
  rutas legacy de detalle y edicion siguen funcionando.
- Validation: typecheck, lint dirigido, build y matriz manual de `08`.
- Close: todos los criterios funcionales y de permisos se pueden probar desde
  la tabla administrativa.

## Slice 4: Manual Validation And Closure

- Phase: 4.
- Goal: registrar evidencia y cerrar documentos.
- Artifacts: `05-progress`, `08-manual-validation`, definition, task list,
  decisions e indice.
- Steps:
  1. Ejecutar comandos de verificacion acordados.
  2. Solicitar y registrar validacion manual del usuario.
  3. Actualizar estados, checks y documentos vivos antes de cierre.
- Validation: no se escriben ni ejecutan pruebas unitarias.
- Close: spec sin tareas pendientes ni estados contradictorios.
