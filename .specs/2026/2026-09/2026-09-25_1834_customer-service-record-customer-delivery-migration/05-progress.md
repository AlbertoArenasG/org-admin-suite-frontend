# Progress: Customer Service Record Customer And Delivery Migration

## 2026-09-25

- Spec definida para el segundo bloque de la vista individual Next Dashboard.
- Contrato backend, opciones necesarias, propiedad del feature, navegación y
  comportamiento de fecha estimada confirmados antes de implementación.
- Slice 1 implementada y verificada estáticamente: el feature declara el
  intervalo estructurado, carga clientes, usuarios relacionados y políticas
  desde thunks propios, y persiste el PUT de cliente y entrega sin depender de
  otros features. El mapper se corrigió para conservar el intervalo objeto que
  devuelve backend, en vez de tiparlo como texto.
- Slice 2 implementada y verificada estáticamente: la ruta monta navegación de
  anclas con scroll spy y el formulario independiente con permisos, draft,
  cálculo de fecha, cancelación, feedback, toast y recuperación de error.
- `FormDateInput` incorpora `allowEmpty` con comportamiento por defecto
  intacto, para representar explícitamente las fechas opcionales del contrato.
- `npm run typecheck`, lint dirigido, `npm run build` y `git diff --check`
  completados. Build conserva advertencias preexistentes y ajenas en
  `CustomerUsersSection` y `UserRegistrationInvitationTableRowActions`.
- Validación manual completada por la persona usuaria: navegación, lectura,
  permisos, cliente, usuarios relacionados, fechas, intervalo, políticas,
  cálculo de fecha estimada, guardado, cancelación, error y responsive
  funcionan correctamente.
- Se acordó diferir ajustes exclusivamente visuales a una iniciativa posterior
  de refinamiento transversal, para no ampliar el alcance de este bloque.
- Slice 3 completada; spec cerrada.
