# Manual Validation

## Permission Matrix

- [x] Iniciar sesión con acceso completo y confirmar que se muestran todos los grupos y rutas autorizadas.
- [x] Iniciar sesión con acceso parcial y confirmar que cada grupo solo muestra las rutas autorizadas.
- [x] Confirmar que un grupo sin rutas visibles no aparece en el rail ni en el drawer móvil.
- [x] Confirmar que Dashboard sigue visible para todo usuario autenticado.
- [x] Confirmar el fallback de Usuarios: lista, invitaciones y crear invitación conservan su prioridad de ruta cuando faltan permisos anteriores.

## Navigation

- [x] Abrir una ruta directa de cada grupo y confirmar que el rail selecciona su grupo propietario.
- [x] Cambiar de grupo desde el rail y confirmar que el Sidebar de navegación presenta solo sus rutas.
- [x] Confirmar que Dashboard mantiene visible el Sidebar de navegación con su propia ruta.
- [x] Confirmar que el logo dirige a `/dashboard`.
- [x] Confirmar que solo una sección con subrutas puede permanecer expandida a la vez.

## Responsive And Interaction

- [x] En escritorio expandido, confirmar rail, pane de navegación y cuenta al pie.
- [x] En escritorio colapsado, confirmar que el rail y avatar permanecen visibles y que el pane desaparece sin salto brusco.
- [x] En escritorio colapsado, confirmar que el control para expandir aparece al hover o foco sobre la marca.
- [x] Confirmar que `Cmd/Ctrl + B` conserva el comportamiento de contraer o expandir en escritorio.
- [x] En móvil, confirmar que el botón hamburguesa abre el drawer completo.
- [x] En móvil, confirmar que el selector horizontal permite cambiar de grupo y que una navegación cierra el drawer.
- [x] En móvil, confirmar que el botón X y el clic fuera del drawer lo cierran.
- [x] Activar reducción de movimiento del sistema y confirmar que las transiciones no son distractoras.

## Account And Preferences

- [x] Confirmar acceso a Mi perfil desde la cuenta.
- [x] Confirmar cambio de tema, idioma y cierre de sesión desde la cuenta.
- [x] Confirmar copies de los controles en español e inglés.

## Automatic Checks

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `git diff --check`
