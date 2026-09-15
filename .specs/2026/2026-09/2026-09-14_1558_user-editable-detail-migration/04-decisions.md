# Decisiones

## Ruta Canónica Con Detalle Editable

**Status:** approved

`/dashboard/users/[userId]` concentra lectura y edición. La ruta `/edit` solo
redireccionará por compatibilidad.

**Reason:** elimina navegación y construcción duplicadas sin privar de lectura
a quien no pueda editar.

## Dos Operaciones Separadas

**Status:** approved

La edición ordinaria usa una sola mutación global. Cambiar contraseña vive en
un diálogo breve, con schema, submit, estado y capability propios.

**Reason:** los endpoints y permisos son independientes; la contraseña no debe
viajar ni validarse con los datos ordinarios.

## Composición Propia, Biblioteca Visual Opcional

**Status:** approved

La aplicación conserva ownership sobre estado editable, RHF, Zod, permisos,
payloads y feedback. Una primitive o bloque visual se adopta solo cuando se
inspecciona y aprueba para este recurso.

**Reason:** permite usar bloques Pro de shadcn.io o botones de otras familias
sin acoplar reglas de dominio a Shark ni a un proveedor visual.

## Correo Editable

**Status:** approved

El correo electrónico participa en la mutación global de edición. La ruta
valida formato en cliente y delega unicidad a `PATCH /v1/users/:id`.

**Reason:** backend ya soporta el cambio y no existe un requisito de
notificación ni verificación de correo para restringirlo.

## Teléfono Con Phone Input Acotado

**Status:** approved

Se construirá un Phone Input propio inspirado en el componente publicado en
`https://shadcn-phone-input.vercel.app/`, sobre `react-phone-number-input`.
Solo expondrá México, Estados Unidos y Canadá. Su frontera pública conservará
el contrato del formulario y backend: `{ countryCode, number }`; E.164 será un
detalle interno de formato, no un valor de dominio.

**Reason:** entrega selector buscable, bandera y formato telefónico sin crear
un catálogo manual; limitar opciones evita presentar países no requeridos por
el negocio actual.

**Constraints:** instalar únicamente `react-phone-number-input`. El selector
de país reutilizará la familia local de controles de colección cuando aplique;
no instalará ni sobrescribirá `command`, `popover`, `scroll-area` u otras
primitives existentes.

## Familia Local De Combobox Para Formularios

**Status:** approved

- El modo `read | edit` pertenece al contenedor de Usuario y no usa
  `SharkEditable`.
- Inputs, labels, errores y layout usan las primitives canónicas actuales, RHF
  y Zod.
- `FormCombobox` provee selección única y buscable; se usará para el rol.
- `FormMultiSelect` provee selección múltiple y buscable; se usará para los
  clientes únicamente cuando el objetivo sea `USER`.
- Ambos controles son propios, controlados y agnósticos de RHF, Usuarios y
  cualquier payload de dominio. Los adaptadores RHF viven en el consumidor o
  en una capa de formulario, no dentro de los controles.
- Su lenguaje visual parte del bloque Pro `form-select-searchable` evaluado en
  el laboratorio: trigger, popover, búsqueda `cmdk` y marca de selección.
- Cambio de contraseña usa el `Dialog` canónico como operación breve
  independiente.
- Las acciones usan una frontera intercambiable; no se acoplan a una familia de
  botones y podrán adoptar otra apariencia sin alterar formularios ni payloads.

**Reason:** el bloque Pro es una demostración de selección única con formulario,
opciones y acciones propias. Extraer una familia local reutilizable preserva el
lenguaje visual aprobado sin acoplar recursos futuros a una demo ni a las reglas
de Usuarios.

**Constraints:** se inspeccionarán los archivos y dependencias de la familia
local antes de instalar. Ninguna integración puede sobrescribir primitives
canónicas sin aprobación explícita.

## Dialog Canónico Para Cambio De Contraseña

**Status:** approved

El cambio de contraseña utilizará el `Dialog` canónico existente. No se
instalará ni vendorizará `@shark/dialog` para esta operación.

**Reason:** el flujo es breve e independiente. El Dialog de Shark sustituye
primitives canónicas y agrega variables globales, costo que no se justifica
para un único overlay de seguridad.
