# Implementation Breakdown

## Slice 1. Feature Foundation

### Objective

Crear la base del feature `roles` siguiendo el mismo patrón ya usado por `users`, `customers` y `providers`.

### Files

- `src/features/roles/types.ts`
- `src/features/roles/rolesThunks.ts`
- `src/features/roles/rolesSlice.ts`
- `src/store/store.ts`

### Microphases

#### Slice 1.1. Tipos del módulo

- definir tipos de:
  - listado
  - detalle
  - permisos
  - catálogos de módulos
  - catálogos de operaciones
  - filtros, paginación y sorts

#### Slice 1.2. Estado del slice

- modelar bloques para:
  - list
  - detail
  - catalogs
  - mutations

#### Slice 1.3. Wiring global

- registrar el reducer del módulo en `src/store/store.ts`

Done when:

- existe `src/features/roles/*`
- el store reconoce el slice del módulo
- el shape del estado ya soporta listado, detalle, catálogos y mutaciones

Status actual:

- implementado

## Slice 2. Data Flows

### Objective

Conectar el feature con los endpoints de backend y dejar listos los mappings request/response del CRUD.

### Files

- `src/features/roles/rolesThunks.ts`
- `src/features/roles/rolesSlice.ts`
- utilidades auxiliares del módulo si hacen falta

### Microphases

#### Slice 2.1. Listado y detalle

- implementar thunks de listado y detalle

#### Slice 2.2. Catálogos auxiliares

- implementar carga de módulos y operaciones

#### Slice 2.3. Mutaciones

- implementar thunks de create, update, status y delete

#### Slice 2.4. Normalización

- mapear `snake_case` backend -> `camelCase` frontend
- respetar `role_id == code` como identidad técnica
- no reintroducir campos legacy inexistentes en este módulo

Done when:

- el feature consume `GET /v1/roles*`
- el feature consume `GET /v1/roles/modules`
- el feature consume `GET /v1/roles/operations`
- las mutaciones ya escriben con el shape correcto sin duplicar reglas del backend

Status actual:

- implementado

## Slice 3. Roles List

### Objective

Construir la pantalla de listado del módulo con el mismo patrón de tabla, toolbar, estado remoto y acciones ya usado por módulos administrativos existentes.

### Files

- `src/app/dashboard/roles/page.tsx`
- `src/components/roles/*`
- posibles utilidades de query del módulo

### Microphases

#### Slice 3.1. Ruta y contenedor

- crear la ruta `src/app/dashboard/roles/page.tsx`
- crear contenedor principal del listado

#### Slice 3.2. Tabla y toolbar

- integrar tabla paginada
- integrar búsqueda
- integrar sorts soportados por backend
- decidir filtros visibles del primer release

#### Slice 3.3. Acciones visibles

- navegar a create/detail/edit
- exponer status/delete solo cuando apliquen por permiso y metadata
- mostrar roles protegidos como visibles pero bloqueados

Done when:

- existe el listado navegable del módulo
- el usuario con `ROLES/READ` puede ver roles
- las acciones visibles respetan permiso y metadata del rol

## Slice 4. Role Form

### Objective

Construir el formulario compartido de creación/edición con el editor de permisos agrupado por módulo.

### Files

- `src/app/dashboard/roles/new/page.tsx`
- `src/app/dashboard/roles/[roleId]/edit/page.tsx`
- `src/components/roles/*`

### Microphases

#### Slice 4.1. Base del formulario

- construir formulario compartido
- integrar `name`

#### Slice 4.2. Editor de permisos

- renderizar una fila o bloque por módulo
- renderizar operaciones como chips togglables
- distinguir operación activa, inactiva o no aplicable

#### Slice 4.3. Regla automática de `READ`

- activar `READ` automáticamente si se activa otra operación
- impedir apagar `READ` mientras exista otra operación activa
- mostrar hint visual de esa dependencia

#### Slice 4.4. Serialización

- serializar permisos activos al payload backend
- soportar create y edit con el mismo componente

Done when:

- existe formulario compartido para create/edit
- los permisos se editan por módulo con chips
- la dependencia automática de `READ` ya funciona

## Slice 5. Detail And Mutations

### Objective

Construir la vista de detalle y cerrar las mutaciones ordinarias del módulo respetando roles protegidos.

### Files

- `src/app/dashboard/roles/[roleId]/page.tsx`
- `src/components/roles/*`

### Microphases

#### Slice 5.1. Detail view

- construir vista de detalle
- mostrar metadata estructural y permisos agrupados

#### Slice 5.2. Status mutation

- integrar cambio de status
- bloquear la acción si el rol no es mutable

#### Slice 5.3. Delete mutation

- integrar delete con confirmación
- reflejar errores backend si el rol sigue vinculado a usuarios

#### Slice 5.4. Protected roles UX

- reflejar restricciones por metadata real del rol
- permitir ver detalle aunque no pueda mutarse

Done when:

- el detalle funciona
- status y delete funcionan para roles mutables
- roles protegidos se muestran como bloqueados/solo lectura

## Slice 6. Navigation And Final Validation

### Objective

Integrar el módulo a la navegación real del dashboard y validar sus flujos principales.

### Files

- `src/components/sidebar/AppSidebar.tsx`
- rutas de roles del `app/`
- docs de la iniciativa

### Microphases

#### Slice 6.1. Navegación

- integrar entrada del módulo en navegación
- mostrarla solo con `ROLES/READ`

#### Slice 6.2. Protección funcional

- proteger visibilidad por permisos
- confirmar acciones por `ROLES/CREATE`, `ROLES/UPDATE`, `ROLES/DELETE`

#### Slice 6.3. Cierre

- validar rutas y flujos principales
- actualizar progreso y docs

Done when:

- el módulo aparece en navegación solo para quien tenga `ROLES/READ`
- create/update/delete respetan permisos funcionales
- la spec queda actualizada al estado real de implementación
