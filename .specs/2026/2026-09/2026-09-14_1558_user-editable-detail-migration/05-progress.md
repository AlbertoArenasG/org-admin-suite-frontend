# Progreso

## 2026-09-14

- Se abrió la definición para migrar el detalle editable de Usuario.
- Se confirmó la separación entre edición ordinaria y cambio administrativo de
  contraseña.
- Se confirmó que Shark no es obligatorio: la composición es propia y los
  bloques visuales se evaluarán por artefacto.
- Se aprobó correo editable; backend conserva unicidad sin notificación ni
  verificación adicional.
- Se inspeccionó el Phone Input externo y se aprobó un componente propio sobre
  `react-phone-number-input`, limitado a México, Estados Unidos y Canadá. Su
  frontera conserva el payload telefónico vigente sin cambiar backend.
- Se aprobó modo editable propio y una familia local reutilizable de combobox:
  `FormCombobox` para selección única y `FormMultiSelect` para selección
  múltiple. Ambos son controles controlados, sin conocimiento de RHF ni de
  Usuarios, inspirados en el bloque Pro evaluado en el laboratorio.
- Se inspeccionó `@shark/dialog`: intenta sustituir primitives canónicas y
  agregar variables globales. Se decidió conservar el Dialog canónico para el
  cambio de contraseña; las acciones siguen desacopladas de su familia visual.
- La spec quedó lista para implementación.
- Se implementaron `FormCombobox`, `FormMultiSelect` y `PhoneInput` bajo
  `src/components/forms/`; son controles controlados sin reglas de dominio.
- Se migró `/dashboard/users/[userId]` a detalle editable con una mutación
  ordinaria única y se redireccionó la ruta legacy `/edit`.
- Se agregó `UserPasswordDialog` con su thunk independiente hacia el endpoint
  de cambio de contraseña y gates separados de capability y jerarquía.
- `npm run typecheck`, `npm run lint` y `npm run build` completaron sin errores.
  Lint y build conservan warnings preexistentes fuera de este alcance.
- La matriz manual y el cierre formal se completaron el 2026-09-16.

## 2026-09-16

- Se adoptaron `MutationFeedback` y `MutationRecovery` como piezas neutrales
  reutilizables; `ResourceFormActions` actúa como host del formulario, sin
  acoplar las piezas a Resource Form.
- La edición ordinaria conserva éxito local durante dos segundos antes de
  volver a lectura y muestra recuperación visible ante errores remotos.
- El diálogo de contraseña bloquea sus controles durante guardado, conserva el
  error dentro del diálogo y se cierra con éxito para confirmar mediante un
  toast de título único.
- Se aisló la API nueva de Sileo en `components/toast`; el store de Snackbar
  queda solo como compatibilidad para consumidores legacy fuera de alcance.
- Se actualizaron catálogo, recetas, patrones y registro de adopción.
- La persona usuaria validó nuevamente la matriz manual completa. La spec queda
  cerrada sin tareas ni slices pendientes.
