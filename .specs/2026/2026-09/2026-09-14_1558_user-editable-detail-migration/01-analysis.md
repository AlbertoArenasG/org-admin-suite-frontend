# Análisis

## Estado Actual

- `src/app/dashboard/users/[userId]/page.tsx` presenta detalle legacy con MUI y
  navega a una segunda ruta de edición.
- `src/app/dashboard/users/[userId]/edit/page.tsx` usa `UserForm` y concentra
  lectura, permisos, roles, clientes y mutación.
- `UserForm` mezcla valores de invitación, creación directa y edición, incluida
  contraseña vacía en flujos que no la usan. La deuda está registrada en
  `docs/technical-debt/user-form-boundary/user-form-flow-coupling.md`.
- `fetchAssignableUserRoles` consume el lookup no paginado y transversal
  `GET /v1/roles/options`; frontend no replica jerarquía de opciones.
- El endpoint general permite editar email, teléfono, rol, clasificación y
  relaciones de clientes. El endpoint de contraseña recién validado es
  independiente y requiere `USERS/UPDATE_PASSWORD`.

## Dependencias Vigentes

| Área          | Contrato o pieza                                     | Uso en la iniciativa                                 |
| ------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Lectura       | `fetchUserById`                                      | Cargar el detalle canónico.                          |
| Actualización | `updateUser` / `PATCH /v1/users/:id`                 | Mutación global ordinaria.                           |
| Contraseña    | Endpoint y capability `USERS/UPDATE_PASSWORD`        | Mutación independiente en diálogo.                   |
| Roles         | `fetchAssignableUserRoles` / `GET /v1/roles/options` | Opciones autorizadas de rol.                         |
| Clientes      | `fetchCustomerOptions`                               | Opciones remotas solo cuando aplican al rol `USER`.  |
| Formulario    | `ResourceForm*`, RHF y Zod                           | Composición neutral, validación y estado de dominio. |

## Hallazgos De UI

- El `Combobox` actual de `src/components/ui/combobox.tsx` es una implementación
  propia basada en Radix; no es Shark y no debe sobrescribirse.
- El bloque Pro evaluado es una demo de selección única, no un control
  reutilizable: incluye opciones, formulario y acciones propias. Se extraerá
  una familia local de selección única y múltiple sobre `cmdk`.
- `shadcn-phone-input` ofrece un Phone Input basado en
  `react-phone-number-input`. Su valor principal es E.164, mientras backend
  recibe `{ countryCode, number }`; el Phone Input propio adaptará esa frontera
  y limitará la lista de países a México, Estados Unidos y Canadá.
- `@shark/dialog` sustituiría `button`, `dialog` y `spinner`, añadiría
  `scroll-area` y variables globales. Para la operación breve de contraseña se
  conservará el Dialog canónico.

## Riesgos

- Mezclar contraseña con el payload ordinario reintroduciría la deuda del
  formulario legacy y violaría la separación de capabilities.
- Convertir la nueva ruta en un duplicado visual de detalle más edición no
  cumpliría la intención de eliminar la segunda vista.
- Instalar bloques externos sin inspección podría sobrescribir primitives o
  introducir dependencias visuales incompatibles con los temas.
- Las nuevas primitives deben conservar su frontera controlada y no introducir
  reglas de RHF, payload o permisos que pertenecen a Usuarios.
