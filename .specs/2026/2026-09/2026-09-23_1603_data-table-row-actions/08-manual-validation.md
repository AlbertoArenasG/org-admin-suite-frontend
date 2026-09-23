# Manual Validation: DataTable Row Actions

## Technical Checks

- [ ] El typecheck dirigido no reporta errores en el contrato `rowActions`,
      menus, dialogo ni adopcion administrativa.
- [ ] El lint dirigido no reporta errores en archivos modificados.
- [ ] No se crean ni modifican stores, slices, thunks, endpoints, schemas ni
      rutas.
- [ ] `getRowActions` deja de formar parte del contrato publico y no hay
      consumidores residuales.

## Component Lab

- [ ] Una tabla sin `rowActions` conserva exactamente su estructura y
      comportamiento actual.
- [ ] Una tabla con acciones muestra la columna y el trigger persistente de
      tres puntos, con `aria-label` y tooltip correctos.
- [ ] Si una fila recibe una lista vacia, la columna se conserva y su celda no
      muestra trigger ni menu contextual.
- [ ] El dropdown presenta las acciones en el orden recibido, aplica el estilo
      destructivo y se puede operar con teclado.
- [ ] El menu contextual, abierto con clic derecho sobre la fila, presenta la
      misma lista y ejecuta el mismo handler que el dropdown.
- [ ] Dropdown y menu contextual cierran con Escape, clic exterior y despues
      de seleccionar una accion.
- [ ] El doble clic ejecuta solamente la accion primaria de una fila con una
      accion primaria declarada.
- [ ] El doble clic no se ejecuta desde enlace, boton, input, control de
      seleccion, expansion o trigger de acciones.
- [ ] Loading, empty state, error state, scroll horizontal, seleccion y detalle
      expandible mantienen alineacion y funcionamiento cuando hay columna de
      acciones.

## Administrative List

- [ ] Con `READ`, el folio, `Ver detalle`, el doble clic y el menu contextual
      navegan a la ruta de detalle existente.
- [ ] Con solo `READ`, no aparecen `Editar` ni `Eliminar` en ningun menu.
- [ ] Con `UPDATE`, `Editar` aparece en ambos menus y navega a la ruta de
      edicion existente.
- [ ] Con `DELETE`, `Eliminar` aparece como accion destructiva en ambos menus.
- [ ] `Eliminar` abre el dialogo de Next Dashboard con el registro correcto,
      sin usar el Sheet legacy.
- [ ] El dialogo se cierra mediante cancelar, Escape, clic exterior y control
      de cierre sin ejecutar la mutacion.
- [ ] Durante la eliminacion se bloquean las acciones que puedan duplicar la
      solicitud y se comunica el estado pendiente.
- [ ] Una eliminacion exitosa remueve la fila, cierra el dialogo y muestra el
      feedback existente de exito.
- [ ] Un error conserva el dialogo abierto, no remueve la fila y muestra el
      feedback de error.
- [ ] Filtros, busqueda, paginacion, observaciones expandibles, responsive y
      scroll horizontal no presentan regresiones.

## Closure

- [ ] Validacion manual realizada por producto.
- [ ] Progreso de la spec actualizado despues de la validacion.
