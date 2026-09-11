# Validación Manual

## Validación Estática

- [x] `npm run lint` termina sin errores atribuibles a la fundación. Conserva
      cuatro warnings preexistentes fuera de alcance.
- [x] `npm run typecheck` termina sin errores.
- [x] `npm run build` compila correctamente.

## Superficie Compartida

- [ ] El frame muestra lectura, edición, carga, guardado y error sin copy
      técnico ni cambios estructurales inesperados.
- [ ] Guardar queda inhabilitado durante una mutación activa y no admite doble
      envío.
- [ ] Cancelar y reintentar funcionan mediante callbacks entregados por el
      consumidor.

## Ruta Y Persistencia

- [ ] Una ruta amplia puede presentar varias secciones con una sola instancia
      de React Hook Form y una sola acción global de guardar.
- [ ] Una sección independiente puede recibir su propio formulario y mutación
      sin afectar campos de otra transacción.
- [ ] Cambiar la organización visual en secciones no altera la estrategia de
      persistencia declarada.

## Overlay

- [ ] La misma composición se abre correctamente en `Dialog` y en `Drawer`.
- [ ] El overlay conserva foco, cierre accesible y restauración de foco de la
      primitive canónica.
- [ ] Ningún overlay requiere scroll prolongado, secciones complejas o
      navegación secundaria para completar su operación.

## Temas, Viewport Y Teclado

- [ ] Las superficies, acciones, foco y errores se leen correctamente en cada
      tema activo.
- [ ] Los controles son navegables por teclado y tienen foco visible.
- [ ] La composición permanece utilizable en viewport móvil y escritorio sin
      cambiar implícitamente entre `Dialog` y `Drawer`.

## Límites

- [ ] La base no define `ResourceFormValues`, schema, payload, endpoint, thunk,
      store, permiso ni navegación.
- [ ] No se creó ni ejecutó una prueba unitaria.
