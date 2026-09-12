# Analysis: Editable Resource Form Foundation

## Current State

- El frontend ya usa `react-hook-form`, `zod` y `@hookform/resolvers` en
  formularios de varios módulos.
- Los formularios legacy están distribuidos por dominio y rutas; no existe un
  contrato común de composición para detalle editable dentro de Next Dashboard.
- La deuda documentada de `UserForm` confirma que invitación, alta directa y
  edición son operaciones distintas. El lookup transversal de roles ya fue
  migrado y no bloquea definir los formularios futuros.
- El dashboard tiene primitives canónicas shadcn, contrato multitema y
  composiciones de workspace. No existe todavía un patrón vivo de formularios
  aprobado.
- Shark UI/Ark UI fue evaluada en Component Lab y se aprobó como familia
  acotada para formularios nuevos de Next Dashboard. Todavía no se han
  incorporado sus fuentes productivas ni dependencias al frontend.

## Findings

- Reutilizar campos o secciones de presentación puede ser útil, pero reutilizar
  tipos de valores y callbacks entre intenciones distintas produce acoplamiento
  de negocio.
- El tamaño de un recurso no basta por sí solo para escoger un diálogo: también
  importan complejidad de validación, relaciones, navegación, acciones
  colaterales, carga de datos y necesidad de revisar información simultánea.
- Clientes y proveedores probablemente requerirán secciones con ciclos de
  edición propios; esa hipótesis debe validarse por recurso antes de fijar una
  composición común.
- Un diálogo editable necesita reglas explícitas para foco, cierre con cambios
  sin guardar, feedback de mutación, error, reintento y retorno al disparador.
- Una ruta editable necesita definir si lectura y edición coexisten por sección
  o por toda la página, y cómo se preserva el estado ante navegación.

## Dependencies

- `docs/technical-debt/user-form-boundary/user-form-flow-coupling.md` para la
  posterior migración de los tres flujos de usuario.
- `docs/ui/components/installed-components.md` para cualquier evaluación o
  adopción de Shark UI u otra fuente externa.
- `docs/ui/dashboard-shell/structure-model.md` y sus guidelines para las rutas
  que vivan en Next Dashboard.
- Contratos backend ya existentes de cada módulo consumidor. Esta iniciativa no
  los redefine.

## Risks

- Crear un `GenericForm` que concentre schemas, payloads, permisos, transporte
  HTTP y composición de todos los dominios.
- Elegir overlays para formularios que necesitan una experiencia de workspace,
  produciendo scroll, foco y confirmaciones difíciles de mantener.
- Incorporar Shark/Ark sin documentar su procedencia, dependencias, primitives
  internas, temas, responsive y accesibilidad, o sobrescribir por ello una
  primitive canónica con consumidores activos.
- Migrar usuarios antes de que la base defina fronteras y repetir el
  acoplamiento de `UserForm` con una API nueva.

## Constraints Confirmed

- El formulario compartido solo puede compartir estructura o presentación; no
  contratos de valores propios de operaciones distintas.
- La interfaz no es dueña de autorización backend ni de comunicación HTTP.
- Las decisiones de una ruta particular se documentan en su propia spec de
  migración, no se infieren automáticamente desde esta base.

## First Consumer: User Editing

### Current Route And State

- La edición legacy vive en `src/app/dashboard/users/[userId]/edit/page.tsx`.
  Aún se resuelve con `LegacyDashboardShell`, MUI y una ruta separada del
  detalle `src/app/dashboard/users/[userId]/page.tsx`.
- La ruta obtiene el usuario mediante `fetchUserById`, opciones de rol mediante
  `fetchAssignableUserRoles` y opciones de cliente bajo demanda mediante
  `fetchCustomerOptions`.
- `updateUser` conserva una única mutación `PATCH /v1/users/:userId`; actualiza
  `state.users.entities` y el estado de detalle al completarse.
- La edición requiere `USERS / UPDATE`. La posibilidad de modificar el usuario
  concreto usa además `canManageSystemRole` como regla de UI vigente para actor,
  objetivo y edición propia.

### Form Boundary

- `src/components/users2/UserForm.tsx` crea su propio `useForm`, combina tres
  modos y mantiene `password` y `confirmPassword` aun en edición.
- La edición realmente necesita email de solo lectura, rol, clasificación de
  personal interno, nombre, apellido, teléfono y relaciones con clientes. No
  necesita contraseña.
- El rol controla comportamientos locales: roles administrativos fuerzan
  personal interno y un rol `USER` habilita la asociación de clientes.
- La asociación de clientes usa `CustomerMultiSelect`, carga opciones bajo
  demanda y conserva clientes inactivos ya relacionados.

### Design Implications

- `EditUserForm` debe tener valores, schema y adaptación de payload propios;
  no puede importar ni extender `UserFormValues`.
- La primera migración reutiliza los thunks, slice y contrato de opciones
  actuales; no cambia backend ni el lookup de roles.
- Usuarios tiene una transacción `global`, no guardado por sección.
- Aunque el recurso es más acotado que clientes o proveedores, el selector de
  clientes y las reglas de clasificación hacen que no sea automáticamente un
  diálogo breve. La elección entre diálogo y detalle editable en ruta requiere
  decisión explícita de producto y validación responsive.

### Shark UI Candidates

- `Field` es candidato para evaluar composición semántica de etiqueta,
  descripción y error sobre controles de formulario.
- `Editable` controlado es candidato de la familia para alternar lectura y
  edición sin sustituir la instancia RHF, schema o submit global del módulo.
- `Dialog`, `Drawer`, `Select` y `Combobox` se integran únicamente cuando el
  flujo de formularios aprobado los requiera; no sustituyen por defecto las
  primitives canónicas en el resto del producto.
