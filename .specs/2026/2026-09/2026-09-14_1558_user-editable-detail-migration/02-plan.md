# Plan

## Objetivo

Migrar el detalle de Usuario a una única ruta editable de Next Dashboard, con
una actualización ordinaria atómica y un cambio de contraseña independiente.

## Diseño Objetivo

- La ruta canónica es `/dashboard/users/[userId]`; `/edit` redirecciona a ella.
- Un formulario propio de Usuario mantiene la instancia RHF, schema Zod,
  condiciones de rol, permisos, mapeo de payload y feedback.
- `FormCombobox`, `FormMultiSelect` y `PhoneInput` son controles controlados y
  reutilizables; no importan Usuarios, RHF, Redux ni clientes HTTP.
- La contraseña se edita en un Dialog canónico breve, con schema y submit
  independientes de la actualización ordinaria.

## Fases

### Fase 1. Primitives De Formulario

- Crear la familia local de selección buscable sobre `cmdk` y primitives
  canónicas existentes.
- Crear el Phone Input propio sobre `react-phone-number-input`, restringido a
  México, Estados Unidos y Canadá.
- Validar controles controlados, teclado, foco, modo deshabilitado y temas.

### Fase 2. Detalle Editable De Usuario

- Crear un formulario de edición exclusivo para Usuario y su contenedor de
  datos, permisos, jerarquía, RHF, Zod y payload.
- Integrar `ResourceFormRoute`, secciones visuales, modo lectura/edición y
  acciones globales.
- Redireccionar la ruta legacy de edición.

### Fase 3. Contraseña Y Validación

- Integrar el Dialog canónico con su formulario de contraseña independiente.
- Validar capacidades, jerarquía, objetivo propio, errores, cancelación y
  éxito de ambas operaciones.
- Verificar responsive, accesibilidad, los tres temas y compatibilidad de ruta.

## Notas De Secuencia

- Las primitives compartidas se implementan antes que el formulario de Usuario
  para validar sus contratos sin introducir reglas de dominio en ellas.
- La familia de selección incorpora `cmdk`; Phone Input incorpora únicamente
  `react-phone-number-input` y reutiliza la interacción de selección ya creada.
- No se reemplazan primitives canónicas ni se modifican tokens globales para
  incorporar componentes externos.

## Criterios De Salida

- La ruta canónica soporta lectura y edición autorizada sin una segunda UI.
- Rol, clientes y teléfono usan los controles aprobados y preservan contratos
  de backend.
- Contraseña y edición ordinaria conservan sus fronteras de permiso, schema,
  estado y mutación.
- La ruta legacy redirecciona correctamente y no queda código productivo
  dependiente del formulario legacy mixto.

## Cierre

Las tres fases se completaron. La edición ordinaria adopta feedback local en
el host de acciones; el diálogo de contraseña mantiene feedback local durante
guardado o error, se cierra al tener éxito y confirma mediante un toast global.
