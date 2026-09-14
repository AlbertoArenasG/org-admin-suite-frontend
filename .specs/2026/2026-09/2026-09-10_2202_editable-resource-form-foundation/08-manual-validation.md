# Validación Manual

## Validación Estática

- [x] `npm run lint` termina sin errores atribuibles a la fundación. Conserva
      cuatro warnings preexistentes fuera de alcance.
- [x] `npm run typecheck` termina sin errores.
- [x] `npm run build` compila correctamente.

## Superficie Compartida

- [x] Los controles del catálogo aplican la misma superficie, densidad,
      encabezados y slots de acciones en ruta, diálogo y Drawer.
- [x] `surface="card"` y `surface="bare"` conservan estructura y acciones
      sin introducir una superficie o padding no solicitado.
- [x] Las densidades `comfortable`, `compact` y `none` se comportan sin
      colapsar contenido o acciones.
- [x] Frame y sección pueden omitir encabezado visible cuando el host o la ruta
      ya proveen contexto suficiente.
- [x] El frame muestra lectura y edición sin cambios estructurales inesperados.
- [x] El frame muestra carga, guardado y error sin copy
      técnico ni cambios estructurales inesperados.
- [x] Guardar queda inhabilitado durante una mutación activa y no admite doble
      envío.
- [x] Cancelar funciona mediante callbacks entregados por el consumidor.
- [x] Reintentar funciona mediante callbacks entregados por el consumidor.
- [x] Las acciones globales pueden renderizarse en header o footer del frame
      sin alterar la única operación atómica del recurso.
- [x] Las acciones locales de una sección se usan solo cuando su operación es
      independiente y pueden renderizarse en header o footer de esa sección.

## Ruta Y Persistencia

- [x] Una ruta amplia puede presentar varias secciones visuales con una sola
      acción global de guardar.

## Validación Transferida Al Primer Consumidor

La fundación no crea instancias de React Hook Form ni mutaciones remotas. Estas
pruebas no se omiten: pasan como gate obligatorio a la spec del primer recurso
migrado.

- [x] Transferir la validación de varias secciones con una instancia RHF y una
      mutación global única.
- [x] Transferir la validación de una sección con formulario y mutación propios
      que no afecten otra transacción.
- [x] Transferir la validación de que el seccionamiento visual no altera la
      estrategia de persistencia declarada.

## Overlay

- [x] La misma composición se abre correctamente en `Dialog` y en `Drawer`.
- [x] El overlay conserva foco, cierre accesible y restauración de foco de la
      primitive canónica.
- [x] Cada overlay del preview corresponde a un recurso breve de una sola
      sección, sin scroll prolongado, secciones complejas ni navegación
      secundaria.

## Temas, Viewport Y Teclado

- [x] Las superficies, acciones, foco y errores se leen correctamente en cada
      tema activo.
- [x] Los controles son navegables por teclado y tienen foco visible.
- [x] La composición permanece utilizable en viewport móvil y escritorio sin
      cambiar implícitamente entre `Dialog` y `Drawer`.

## Navegación Intraformulario En Ruta

- [x] Los destinos navegan hacia secciones existentes sin ocultar ni desmontar
      contenido.
- [x] El scroll spy actualiza el destino activo al recorrer la ruta con rueda,
      trackpad, teclado o touch.
- [x] Tabs en móvil y navegación lateral en escritorio conservan foco visible,
      lectura accesible y orden de teclado correcto.
- [x] Header y footer sticky de `ResourceFormRoute`, cuando el recurso los
      configure, respetan el dueño de scroll y no cubren contenido o acciones.
- [x] La navegación no se renderiza en `Dialog` ni `Drawer`.

## Límites

- [x] La base no define `ResourceFormValues`, schema, payload, endpoint, thunk,
      store, permiso ni navegación.
- [x] No se creó ni ejecutó una prueba unitaria.
