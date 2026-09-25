# Implementation Breakdown: Customer Service Record Creation Wizard Migration

## Slice 1: Legacy Creation Retirement

- Phase: 1.
- Status: implementada y verificada estaticamente.
- Goal: retirar toda entrada y ejecucion legacy de creacion antes de construir
  el reemplazo Next Dashboard.
- Artifacts: ruta `/new`, navegacion lateral, `CustomerServiceRecordFormPageContainer`,
  `CustomerServiceRecordForm`, ruta legacy de edicion, types, thunk y slice.
- Steps:
  1. Eliminar `src/app/dashboard/customer-service-records/new/page.tsx` y
     `customerServiceRecordsCreate` de definicion, tipos y visibilidad.
  2. Reducir `CustomerServiceRecordFormPageContainer` y
     `CustomerServiceRecordForm` a edicion: retirar prop y ramas
     `mode="create"`, submit de alta, copy y estado de envio de alta.
  3. Ajustar la ruta legacy de edicion al contrato solo-edicion.
  4. Retirar `createCustomerServiceRecord`, su manejo en slice y campos de
     estado exclusivos de create. Conservar `message`, tipos y mapeos que
     update o delete aun consumen.
  5. Ejecutar busqueda de referencias para confirmar que no queda una entrada
     ejecutable, payload ni feedback de creacion legacy.
- Compatibility: detalle y edicion legacy mantienen comportamiento. PATCH,
  delete y sus dependencias no se modifican funcionalmente.
- Validation: typecheck, lint dirigido y busqueda de retiros obligatorios.
- Close: el repositorio no ofrece creacion legacy; los componentes compartidos
  solo representan edicion.

## Slice 2: Toolbar And Form Date Field

- Phase: 2.
- Status: implementada y verificada estaticamente.
- Goal: habilitar una accion primaria opcional en toolbar y un campo de fecha
  exclusivo de formularios, sin cambiar filtros existentes.
- Artifacts: `DataTable.types`, `DataTableToolbar`, `FormDateInput`, barrel de
  forms y los tres documentos vivos.
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

## Slice 3: Creation Contract

- Phase: 3.
- Status: implementada y verificada estaticamente.
- Goal: separar valores/schema/payload de creacion del contrato de edicion.
- Artifacts: types, thunk y schema de creacion.
- Steps:
  1. Declarar valores del wizard y payload minimo de creacion.
  2. Crear schema Zod con reglas de pasos 1 y 2.
  3. Reintroducir `createCustomerServiceRecord`, su estado remoto y builder de
     POST minimo, sin restaurar la implementacion retirada en Slice 1.
- Compatibility: PATCH y `CustomerServiceRecordMutationPayload` no cambian;
  create vuelve a existir solo bajo su contrato nuevo.
- Validation: typecheck, lint dirigido e inspeccion de body construido para
  confirmar ausencia de campos legacy.
- Close: el tipo de create no admite provider, delivery ni estado operativo.

## Slice 4: Wizard Dialog And Module Adoption

- Phase: 4.
- Status: implementada y validada manualmente.
- Goal: crear el flujo Next Dashboard sobre los contratos ya reemplazados.
- Artifacts: tres componentes de paso, dialogo, tabla, contenedor y
  traducciones.
- Steps:
  1. Componer RHF, Stepper y pasos con `FieldGroup` y orientacion responsive
     horizontal.
  2. Cargar opciones, limpiar usuarios ante cambio de cliente y limitar a un
     activo.
  3. Validar `FormCombobox` y `FormMultiSelect` con el Dialog y listas largas;
     si falla, corregir el control compartido antes de adoptarlo.
  4. Implementar resumen, submit, bloqueo pendiente y recovery de error.
  5. Implementar cierre limpio, descarte in-place y limpieza solo en descarte
     confirmado o exito.
  6. Exponer boton segun `CREATE` e integrar toast y navegacion.
- Compatibility: tabla, sus filtros, acciones de fila, permisos `READ` y
  rutas legacy de detalle y edicion siguen funcionando. La funcionalidad de
  creacion legacy ya no existe desde Slice 1.
- Validation: typecheck, lint dirigido, build y matriz manual de `08`.
- Close: todos los criterios funcionales y de permisos se pueden probar desde
  la tabla administrativa.

## Slice 5: Manual Validation And Closure

- Phase: 5.
- Status: completada.
- Goal: registrar evidencia y cerrar documentos.
- Artifacts: `05-progress`, `08-manual-validation`, definition, task list,
  decisions e indice.
- Steps:
  1. Ejecutar comandos de verificacion acordados.
  2. Solicitar y registrar validacion manual del usuario.
  3. Actualizar estados, checks y documentos vivos antes de cierre.
- Validation: no se escriben ni ejecutan pruebas unitarias.
- Close: spec sin tareas pendientes ni estados contradictorios.
