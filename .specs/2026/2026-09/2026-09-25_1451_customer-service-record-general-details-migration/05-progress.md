# Progress: Customer Service Record General Details Migration

## 2026-09-25

- Se creó la spec para el bloque `Detalles generales` de la vista individual
  Next Dashboard.
- Se confirmó el contrato GET, el PUT de detalles, permisos, opciones de tipo
  de servicio y catálogo local de estado operativo contra backend.
- Se fijó la frontera del feature: toda integración de esta vista vive en
  `customer-service-records`; no habrá thunks ni estado de otros features.
- Se aprobó la receta visual y conductual de usuario como referencia, con
  feedback de éxito de 800 ms.
- Slice 1 implementada y verificada estáticamente: `types.ts`, mapper, GET
  individual, opciones de detalles, PUT y ramas Redux viven dentro de
  `customer-service-records`.
- Slice 2 implementada y verificada estáticamente: la ruta Next Dashboard usa
  boundary READ, estados de pantalla, breadcrumb dinámico de folio y formulario
  independiente de detalles generales con UPDATE local, feedback, toast y
  recuperación de error.
- El shell incorpora breadcrumb dinámico sin duplicar contexto de ruta en la
  página; la guideline viva de migración se actualizó con su contrato.
- `FormDateInput` ahora propaga `aria-invalid` externo de React Hook Form sin
  cambiar el comportamiento de sus consumidores existentes.
- Verificación de Slices 1 y 2: lint dirigido, `npm run typecheck`,
  `npm run build` y `git diff --check` completados. Build conserva warnings
  preexistentes y ajenos en `CustomerUsersSection` y
  `UserRegistrationInvitationTableRowActions`.
- Validación manual de Slices 1 y 2 completada por la persona usuaria: ruta,
  breadcrumb dinámico, carga, permisos, lectura, edición, cancelación,
  guardado, feedback, toast y responsive se comportan conforme a definición.
- Barrido documental final completado: se registró la adopción de la ruta,
  se alineó la definición con la guideline viva modificada y no quedaron
  tareas, decisiones ni validaciones pendientes.
- Slice 3 completada; spec cerrada.
