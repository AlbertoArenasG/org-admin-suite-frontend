# Diseño Técnico: Detalle Editable De Usuario

## Alcance

Esta iniciativa implementa únicamente el detalle editable de Usuario. No migra
creación directa ni invitación, no cambia backend y no sustituye el formulario
legacy mixto en sus otras intenciones.

## Topología

```text
/dashboard/users/[userId]
  -> UserEditableDetailRoute
    -> ResourceFormRoute
      -> ResourceFormFrame
        -> UserEditForm (RHF + Zod + reglas de dominio)
          -> datos generales / contacto
          -> acceso y alcance
        -> acciones globales
    -> UserPasswordDialog (acción de header; operación independiente)
```

La ruta `/dashboard/users/[userId]/edit` no monta formulario: redirecciona a
la ruta canónica.

## Registro De Artefactos

| Artefacto                 | Ubicación propuesta                                        | Responsabilidad                               | No responsabilidad                          |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| `FormCombobox`            | `src/components/forms/FormCombobox.tsx`                    | Selección única, buscable y controlada        | RHF, payload, permisos, carga remota        |
| `FormMultiSelect`         | `src/components/forms/FormMultiSelect.tsx`                 | Selección múltiple, buscable y controlada     | Reglas de clientes, RHF, mutación           |
| `PhoneInput`              | `src/components/forms/PhoneInput.tsx`                      | Captura y formato de teléfono MX/US/CA        | Endpoint, schema de Usuario, payload remoto |
| `UserEditForm`            | `src/components/users/UserEditForm.tsx`                    | RHF, Zod, campos y condiciones del Usuario    | HTTP, autorización de servidor              |
| `UserEditableDetailRoute` | `src/app/dashboard/users/[userId]/page.tsx` o módulo local | Datos, gates de UI, dispatch, estados de ruta | Primitives de colección o teléfono          |
| `UserPasswordDialog`      | `src/components/users/UserPasswordDialog.tsx`              | RHF/Zod de contraseña y Dialog canónico       | Edición ordinaria                           |
| Redirect legacy           | `src/app/dashboard/users/[userId]/edit/page.tsx`           | Compatibilidad de URL                         | UI de formulario                            |

Las rutas finales pueden ajustar el nombre de la carpeta local, pero no las
responsabilidades ni la frontera entre primitive, formulario y contenedor.

## Contratos De Primitives

### Opción De Colección

```ts
type FormSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};
```

### `FormCombobox`

```ts
type FormComboboxProps = {
  value: string | null;
  onValueChange: (value: string | null) => void;
  options: readonly FormSelectOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  invalid?: boolean;
};
```

Es controlado. Usa trigger, popover, búsqueda `cmdk`, selección con teclado y
marca visual. No realiza fetch ni decide si el valor puede limpiarse; cada
consumidor lo declara.

### `FormMultiSelect`

```ts
type FormMultiSelectProps = {
  value: readonly string[];
  onValueChange: (value: string[]) => void;
  options: readonly FormSelectOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  invalid?: boolean;
};
```

Conserva el mismo patrón visual y de teclado. Su valor es una colección de IDs
sin conocer el significado de esos IDs. No crea chips, límites ni reglas de
negocio implícitas fuera de lo que declare su consumidor.

### `PhoneInput`

```ts
type PhoneValue = {
  countryCode: string;
  number: string;
};

type PhoneInputProps = {
  value: PhoneValue;
  onValueChange: (value: PhoneValue) => void;
  countries?: readonly ('MX' | 'US' | 'CA')[];
  disabled?: boolean;
  invalid?: boolean;
};
```

`react-phone-number-input` procesa internamente un E.164 temporal para formato
y validación de entrada. El componente expone y recibe siempre `PhoneValue`.
El adaptador conserva el código como `+52`, `+1` u otro código permitido y
normaliza el número sin alterar el contrato actual de API.

## Formulario De Dominio

`UserEditForm` crea una única instancia RHF para la operación ordinaria. El
schema incluye nombre, apellido, correo, teléfono, rol, personal interno y
clientes. Contraseña y confirmación no pertenecen a este schema ni payload.

Reglas de interfaz:

- El selector de rol usa `FormCombobox` y las opciones ya autorizadas por el
  endpoint transversal de Roles.
- Clientes usa `FormMultiSelect` solo si el rol objetivo es `USER`.
- Roles administrativos fuerzan el estado interno que exige el contrato
  backend; el formulario no manda una combinación inválida.
- El adaptador convierte el valor telefónico a `cellPhone` y `customerIds` al
  payload existente de `updateUser`.
- Modo `read` conserva la topología y no entrega controles editables ni
  acciones de persistencia.

## Operaciones Y Gates

```text
lectura: USERS/READ
edición ordinaria: USERS/UPDATE + jerarquía de objetivo
contraseña: USERS/UPDATE_PASSWORD + jerarquía de objetivo, incluido self
```

El frontend usa los helpers existentes solo para visibilidad e interacción; el
backend conserva la autorización efectiva. La edición ordinaria usa feedback
local en el host de acciones para loading, éxito y error. El diálogo de
contraseña conserva esos estados mientras existe; su éxito cierra el diálogo y
se confirma mediante toast global.

## Dependencias

- Agregar `cmdk` para los dos controles de colección.
- Agregar `react-phone-number-input` para formato, metadatos y banderas SVG.
- Reutilizar `@radix-ui/react-popover`, `@radix-ui/react-dialog`, `Button`,
  `Input`, RHF, Zod, Lucide y Sileo ya existentes.
- No instalar `@shark/dialog`, `@shark/combobox`, `command`, `scroll-area` ni
  una primitive externa que sobrescriba archivos actuales.

## Accesibilidad, Temas Y Responsive

- Trigger y lista de cada selector son navegables con teclado y exponen estado
  expandido, selección y error.
- `PhoneInput` etiqueta country picker y número; sus banderas son decorativas
  con nombre de país accesible en las opciones.
- El Dialog canónico aporta foco, Escape y retorno de foco para contraseña.
- Los controles usan tokens semánticos existentes y no agregan fallback de
  tema ni variables globales.
- Campos se apilan en móvil y usan grid declarado por el formulario de Usuario
  en pantallas amplias.

## Validación

- Lint, typecheck y build conforme a los scripts disponibles, sin corregir
  errores ajenos a esta iniciativa.
- Prueba manual de selección, búsqueda, teclado, selección múltiple, limpieza,
  teléfono por los tres países, lectura, edición, contraseña, permisos,
  jerarquía, temas y responsive.

## Preguntas Abiertas

No quedan preguntas de producto abiertas. La apariencia concreta de botones y
variantes visuales se valida durante la implementación de Usuario sin cambiar
las fronteras aprobadas.
