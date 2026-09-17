# Validación Manual

## Primitives

- [x] `FormCombobox` filtra, selecciona, limpia cuando el consumidor lo permite y opera con teclado.
- [x] `FormMultiSelect` agrega y retira varias opciones sin cerrar ni perder foco indebidamente.
- [x] `PhoneInput` limita países a México, Estados Unidos y Canadá; conserva código y número separados.
- [x] Los tres controles muestran estado disabled, invalid, foco visible y tema correcto.

## Detalle Editable

- [x] Un actor con `USERS/READ` observa el detalle con la misma topología.
- [x] Sin `USERS/UPDATE`, los controles y acciones ordinarias no se habilitan.
- [x] Con `USERS/UPDATE` y jerarquía válida, editar, cancelar y guardar funcionan sin cambiar de ruta.
- [x] Rol, personal interno y clientes respetan sus condiciones; clientes solo se presenta para `USER`.
- [x] Correo y teléfono llegan al backend con el contrato esperado.
- [x] `/dashboard/users/[userId]/edit` redirecciona a la ruta canónica.

## Contraseña

- [x] El acceso aparece únicamente con `USERS/UPDATE_PASSWORD` y jerarquía válida, incluido objetivo propio.
- [x] El Dialog permite cancelar, reporta error y confirma éxito sin alterar el formulario ordinario.
- [x] La contraseña no aparece en valores, schema ni payload de actualización ordinaria.

## Calidad Visual Y Accesibilidad

- [x] La ruta funciona en escritorio y móvil; campos y acciones conservan orden y alcance.
- [x] Los tres temas activos declaran y resuelven correctamente los tokens usados.
- [x] Popovers y Dialog conservan foco, Escape y retorno de foco predecibles.

## Cierre

- [x] La persona usuaria validó nuevamente la matriz completa el 2026-09-16.
