# Validación Manual

## Primitives

- [ ] `FormCombobox` filtra, selecciona, limpia cuando el consumidor lo permite y opera con teclado.
- [ ] `FormMultiSelect` agrega y retira varias opciones sin cerrar ni perder foco indebidamente.
- [ ] `PhoneInput` limita países a México, Estados Unidos y Canadá; conserva código y número separados.
- [ ] Los tres controles muestran estado disabled, invalid, foco visible y tema correcto.

## Detalle Editable

- [ ] Un actor con `USERS/READ` observa el detalle con la misma topología.
- [ ] Sin `USERS/UPDATE`, los controles y acciones ordinarias no se habilitan.
- [ ] Con `USERS/UPDATE` y jerarquía válida, editar, cancelar y guardar funcionan sin cambiar de ruta.
- [ ] Rol, personal interno y clientes respetan sus condiciones; clientes solo se presenta para `USER`.
- [ ] Correo y teléfono llegan al backend con el contrato esperado.
- [ ] `/dashboard/users/[userId]/edit` redirecciona a la ruta canónica.

## Contraseña

- [ ] El acceso aparece únicamente con `USERS/UPDATE_PASSWORD` y jerarquía válida, incluido objetivo propio.
- [ ] El Dialog permite cancelar, reporta error y confirma éxito sin alterar el formulario ordinario.
- [ ] La contraseña no aparece en valores, schema ni payload de actualización ordinaria.

## Calidad Visual Y Accesibilidad

- [ ] La ruta funciona en escritorio y móvil; campos y acciones conservan orden y alcance.
- [ ] Los tres temas activos declaran y resuelven correctamente los tokens usados.
- [ ] Popovers y Dialog conservan foco, Escape y retorno de foco predecibles.
