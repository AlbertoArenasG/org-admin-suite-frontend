# Technical Design

## Contract Boundary

Frontend consume `is_internal_staff` como booleano explícito. No conserva ni reconstruye `type` desde `user_id`, `company_names` o relaciones con Clientes.

- Usuarios: agregarlo a `User`, `ApiUser`, filtros de listado y payload de actualización.
- Invitaciones: agregarlo a sus modelos API, payload de creación, listado y detalle.
- Contactos: reemplazar `ContactType`, `type`, `typeLabel` y el query legacy por `isInternalStaff` en modelos, reducers, thunks, tabla, detalle, formularios y resúmenes de grupos de destinatarios.

Los filtros se serializan exclusivamente como `is_internal_staff=true|false`. En Usuarios no eliminan ni alteran los filtros de Cliente existentes.

## Shared Presentation

Se crearán componentes pequeños en `src/components/ui` y un helper de clasificación para evitar duplicar reglas en tablas y detalles.

- `RadioGroup`: implementación reutilizable con radios nativos, semántica accesible y clases del tema existente; no requiere instalar otra dependencia.
- Helper de insignias: resuelve `Microscope` para `isInternalStaff`, `UserStar` solo para `ADMIN`, tooltip y etiqueta accesible.
- Las tablas consumen la salida del helper en una columna compacta y no ordenable. Los detalles la usan junto al nombre.
- Todo componente compartido e insignia usa tokens y variables de los temas existentes; no incorpora colores fijos ni estilos aislados que impidan su adaptación multi-tema.

## Form Behavior

El campo `Pertenece a Implementos Cientificos` es un `RadioGroup` Sí/No.

- Invitación `USER`: comienza sin valor y bloquea el envío hasta elegirlo.
- Invitación y edición `ADMIN` o `MASTER_ADMIN`: fija Sí y deshabilita el control.
- Invitación: al regresar de rol fijo a `USER`, limpia el valor para requerir una decisión explícita.
- Edición: al regresar de rol fijo a `USER`, conserva Sí como valor editable.
- Contactos manuales: el campo es obligatorio y editable.
- Contactos vinculados a Usuario: no muestran un control editable.

## Filter State And URL

Usuarios incorporará `isInternalStaff: boolean | null` al estado de la tabla, a `buildUserQuery` y al thunk. Contactos reemplazará su filtro `type` con el mismo valor en store, query utility y thunk. El cambio de filtro reinicia la página a la primera, como los filtros existentes.

Los selectores muestran:

- Todo el personal: `null`.
- Personal de Implementos Cientificos: `true`.
- Personal externo: `false`.

## Component Boundaries

- Los formularios conservan su responsabilidad de validación y envío; delegan la UI de clasificación al componente reutilizable.
- Los toolbars reciben el filtro y callbacks desde su contenedor; no hacen fetch ni administran URL.
- Thunks y mapeos se limitan a traducir contratos API y no contienen reglas visuales.
- La migración de Contactos y Grupos de destinatarios se ejecuta en un slice aislado para que no se mezclen cambios con Usuarios o Invitaciones.
