# Implementation Breakdown

## Slice 1. Roles Catalog Editor Alignment

Status:

- completed

Objetivo:

- dejar el módulo de roles completamente alineado al catálogo backend vivo, sin suposiciones CRUD uniformes ni dependencia de `roles/operations`

Incluye:

- verificar que el editor consuma únicamente `GET /v1/roles/modules`
- conservar el render dinámico por `operations[]`
- conservar la ayuda local de UX para `READ` implícito
- evitar cualquier anticipación de operaciones no publicadas, como `ROLES/ACTIVATE`
- revisar detalle de rol para que siga resolviendo labels desde el catálogo real

Criterio de salida:

- editor y detalle de roles funcionando solo con el catálogo backend vigente
- ningún consumer del módulo roles depende de `GET /v1/roles/operations`

## Slice 2. Customers Public Access Separation

Objetivo:

- separar en frontend el acceso público sensible del shape ordinario de `customers`

Incluye:

- dejar de depender de `public_access_url` y `public_access_token` en el fetch normal de customers
- definir o introducir DTO/estado separado para public access de customer
- adaptar el detalle autenticado de customer para pedir el nuevo endpoint solo cuando aplique
- definir degradación de UI cuando exista `READ` pero no `READ_PUBLIC_ACCESS`

Criterio de salida:

- el detalle de customer ya no asume que el payload normal trae acceso público sensible
- la revelación/copia del acceso público depende del flujo explícito alineado a `CUSTOMERS/READ_PUBLIC_ACCESS`

Status:

- completed

## Slice 3. Providers Public Access Separation

Objetivo:

- separar en frontend el acceso público sensible del shape ordinario de `providers`

Incluye:

- dejar de depender de `public_access_url` y `public_access_token` en el fetch normal de providers
- definir o introducir DTO/estado separado para public access de provider
- adaptar el detalle autenticado de provider para pedir el nuevo endpoint solo cuando aplique
- definir degradación de UI cuando exista `READ` pero no `READ_PUBLIC_ACCESS`

Criterio de salida:

- el detalle de provider ya no asume que el payload normal trae acceso público sensible
- la revelación/copia del acceso público depende del flujo explícito alineado a `PROVIDERS/READ_PUBLIC_ACCESS`

Status:

- completed

## Slice 4. Runtime Secondary Consumers Review

Status:

- completed

Objetivo:

- validar y ajustar consumers secundarios del runtime de autorización para que sigan alineados al catálogo backend

Incluye:

- revisar sidebar, dashboard y superficies similares que dependen de `hasModule(...)` y `hasPermission(...)`
- confirmar que no existan supuestos residuales sobre operaciones uniformes
- confirmar que `users` mantenga la frontera funcional basada en invitaciones y no reintroduzca alta directa normal

Criterio de salida:

- navegación, quick actions y guards de UI siguen guiados por `auth/me/permissions`
- no aparece ningún flujo ordinario que dependa de `POST /v1/users`

## Slice 5. Validation And Documentation Closure

Objetivo:

- cerrar la iniciativa con validación funcional y memoria documental suficiente

Incluye:

- validación manual del editor con catálogo real por módulo
- validación manual de customers/providers con separación de public access
- actualización de docs frontend relevantes si cambia algún contrato o flujo visible
- registro de cierre en `05-progress.md` y depuración final de pendientes en task list y breakdown

Criterio de salida:

- task list sin pendientes falsos
- breakdown reflejando solo slices ejecutados o cerrados
- spec lista para cierre formal

## Slice 6. UI Operational Controls Sweep

Status:

- in progress

Objetivo:

- revisar módulo por módulo los controles operativos de UI para asegurar que create, edit y delete ya dependan de los módulos y operaciones efectivas del usuario autenticado

Incluye:

- revisar botones, acciones de fila, accesos rápidos, CTAs y entradas de navegación operativa
- validar que los controles visibles de crear, editar y eliminar no dependan de supuestos legacy ni de accesos demasiado amplios
- recorrerlo de forma interactiva entre tú y yo, vista por vista o módulo por módulo, sin reabrir definición de la spec

Criterio de salida:

- cada control operativo revisado queda alineado al permiso o módulo correcto
- cualquier ajuste descubierto se implementa o se registra dentro de esta misma spec antes del cierre
