# Definition

## Purpose

Este documento existe para cerrar decisiones criticas del refactor de roles y permisos del frontend antes de implementar cambios estructurales.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas en estado `pending`
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto

## Overall Status

- Initiative: `roles-permissions-frontend-refactor`
- Definition status: `completed`
- Implementation ready: `yes`

---

## Decision 01. Fuente principal de autorizacion en frontend

### Context

El frontend actual sigue acoplado a enums legacy y checks por jerarquia fija de `role`. El backend ya expone un modelo principal basado en `system_role`, `role_id` y permisos efectivos.

### Options

1. Seguir autorizando frontend por enums de rol y usar permisos solo como apoyo
2. Migrar el frontend a permisos efectivos como fuente principal y usar `system_role` solo para jerarquia estructural
3. Mantener ambos modelos de forma indefinida

### Recommendation

Opcion 2.

La autorizacion de UI y visibilidad debe depender del contrato nuevo del backend. `system_role` debe quedar reservado para reglas estructurales o decisiones de alto nivel, no para modelar permisos funcionales de pantallas.

### Implications

- cambia el modelo de auth frontend
- cambia la forma de ocultar rutas, acciones y modulos
- obliga a introducir una capa de permisos reusable
- elimina la dependencia estructural a enums legacy

### Decision Final

Se aprueba que la autorizacion funcional del frontend use permisos efectivos y modulos efectivos como fuente principal.

`system_role` no debe usarse como base para permisos funcionales de negocio en UI.

Al `2026-07-28`, no existe en frontend ninguna superficie exclusiva de plataforma; todo lo que hoy existe pertenece al dominio de negocio. Por eso, en esta iniciativa no se considera necesario modelar reglas especiales de plataforma del lado frontend.

### Status

approved

---

## Decision 02. Modelo frontend para el usuario autenticado

### Context

Hoy `AuthUser` y varias pantallas siguen modelando al usuario alrededor de `role`, con parseo legacy y utilidades de ranking.

### Options

1. Reemplazar completamente `role` por `systemRole`, `roleId`, `permissions` y `modules`
2. Mantener `role` como campo derivado temporal dentro del store
3. Dejar `role` en paralelo hasta terminar todas las pantallas

### Recommendation

Opcion 1, con una separacion explicita entre identidad autenticada y estado de autorizacion.

Conviene cambiar el modelo compartido cuanto antes para evitar que nuevas pantallas o fixes sigan reintroduciendo dependencias legacy.

`role` debe salir del contrato principal del usuario autenticado.

La metadata del rol actual, los modulos efectivos y los permisos efectivos no deben vivir como parte del objeto base del usuario, sino como un bloque separado asociado a la sesion autenticada.

### Implications

- cambia `authSlice`, `authThunks` y persistencia local
- cambia el shape consumido por sidebar, tablas y formularios
- obliga a separar identidad y autorizacion en el store
- puede requerir compatibilidad transitoria muy acotada dentro de la migracion

### Decision Final

Se aprueba reemplazar `role` legacy como contrato principal del usuario autenticado.

El frontend separara:

- identidad del usuario autenticado
- estado de autorizacion de la sesion autenticada

`AuthUser` contendra unicamente:

- `id`
- `email`
- `name`
- `lastname`
- `systemRole`
- `roleId`
- `status`
- `cellPhone`

La metadata del rol actual, los modulos efectivos y los permisos efectivos viviran en una estructura separada asociada a la sesion autenticada.

### Status

approved

---

## Decision 03. Estrategia de migracion por fases

### Context

El cambio afecta auth, permisos, navegacion, CRUD de usuarios, invitaciones y posiblemente otras pantallas que hoy usan `parseUserRole`, `canManageRole` o checks de ranking.

### Options

1. Big bang sobre todo el frontend
2. Migracion por capas: auth y permisos base, luego usuarios e invitaciones, luego navegacion y pantallas dependientes
3. Migracion por pantalla sin capa comun previa

### Recommendation

Opcion 2.

Primero se necesita una base comun para auth y permisos; despues conviene migrar los flujos mas acoplados a roles legacy.

### Implications

- permite validar el modelo antes de tocar todas las pantallas
- reduce el riesgo de romper el dashboard completo de una sola vez
- exige definir una capa comun clara antes de mover UI

### Decision Final

Se aprueba una migracion por capas.

Orden aprobado:

1. base de auth y autorizacion
2. usuarios e invitaciones
3. navegacion y pantallas dependientes
4. limpieza final

La navegacion principal del dashboard, incluyendo el sidebar, debe migrarse para usar:

- `modules` efectivos como base de visibilidad macro
- `permissions` para visibilidad o acciones mas finas cuando aplique

No se aprueba una migracion big bang ni una migracion por pantalla sin capa comun previa.

### Status

approved

---

## Decision 04. Dónde vive el estado de autorizacion

### Context

Ya se aprobo separar identidad del usuario autenticado y estado de autorizacion de la sesion. Falta decidir donde vive ese estado de autorizacion dentro del frontend.

### Options

1. Guardarlo dentro de `auth` como un subbloque separado, por ejemplo `auth.authorization`
2. Crear un slice totalmente separado para autorizacion
3. Mezclarlo directamente dentro de `auth.user`

### Recommendation

Opcion 1.

El estado de autorizacion pertenece a la sesion autenticada, asi que debe vivir junto a `auth`, pero separado de `auth.user`.

Eso mantiene:

- una sola frontera clara de sesion autenticada
- separacion conceptual entre identidad y autorizacion
- menor complejidad que abrir un slice extra sin necesidad

### Implications

- `auth` pasara a tener al menos dos bloques conceptuales:
  - `user`
  - `authorization`
- los thunks de auth deberan cargar o hidratar ambos bloques
- los componentes dejaran de leer permisos o metadata de rol desde `auth.user`

### Decision Final

Se aprueba que el estado de autorizacion viva dentro de `auth` como un subbloque separado de la identidad del usuario autenticado.

La forma objetivo es:

- `auth.user`
- `auth.authorization`

No se aprueba mezclar permisos, modulos o metadata del rol dentro de `auth.user`.

### Status

approved

---

## Decision 05. Forma interna de `modules` y `permissions`

### Context

El backend devuelve `modules` y `permissions` como listas planas. Falta decidir si el frontend debe guardar esa misma forma en el store o si debe persistir estructuras derivadas como `Set`, mapas o indices precalculados.

### Options

1. Guardar arrays planos en el store y derivar estructuras optimizadas en selectors o helpers
2. Guardar estructuras indexadas en el store como fuente principal
3. Guardar ambas cosas en el store

### Recommendation

Opcion 1.

El store debe conservar un estado fuente serializable, simple y cercano al contrato del backend.

Las estructuras optimizadas para lookup, como `Set` o mapas, deben derivarse fuera del estado persistido, por ejemplo en selectors o helpers reutilizables.

### Implications

- `auth.authorization.modules` sera un array plano
- `auth.authorization.permissions` sera un array plano
- los checks de consumo deberan encapsularse en helpers o selectors
- no se duplicara estado derivado dentro del store
- se mantiene compatibilidad limpia con persistencia, hidratacion y debugging

### Decision Final

Se aprueba guardar `modules` y `permissions` como arrays planos dentro de `auth.authorization`.

El frontend derivara estructuras optimizadas de consulta en selectors o helpers, por ejemplo:

- `Set` de modulos
- `Set` de permisos
- helpers como `hasModule` y `hasPermission`

No se aprueba persistir `Set`, mapas o indices derivados como estado fuente del store.

### Status

approved

---

## Decision 06. Naturaleza del dashboard en frontend

### Context

La mayor parte de la navegacion del frontend se alineara con `modules` efectivos provenientes del backend. Sin embargo, `dashboard` no existe como modulo de negocio en la API y aun asi sigue siendo una pieza central de navegacion en frontend.

Tambien existe la posibilidad de que, en el futuro, el dashboard muestre experiencias distintas segun el acceso del usuario.

### Options

1. Modelar `dashboard` como si fuera un modulo de backend aunque no exista en la API
2. Tratar `dashboard` como una vista transversal del frontend, separada de los modulos de backend
3. Ocultar o mostrar `dashboard` solo si el usuario tiene ciertos modulos concretos

### Recommendation

Opcion 2.

`dashboard` no debe inventarse como modulo de backend ni depender de un permiso artificial.

Debe tratarse como una vista contenedora o de resumen propia del frontend. Su contenido interno puede variar segun `modules` y `permissions`, pero su existencia no debe depender de modelarlo como si fuera una feature canónica del backend.

### Implications

- el sidebar podra mantener `Dashboard` como entry transversal del frontend
- la visibilidad macro del resto de modulos seguira dependiendo de `modules`
- el contenido interno del dashboard debera componerse dinamicamente segun acceso real
- si un usuario autenticado tiene muy pocas superficies disponibles, el dashboard debera degradar a un estado vacio o limitado, no desaparecer por completo

### Decision Final

Se aprueba tratar `dashboard` como una vista transversal del frontend, separada de los modulos del backend.

Reglas aprobadas:

- `dashboard` no se modela como modulo de backend
- `dashboard` no depende de un permiso artificial `DASHBOARD/*`
- el sidebar puede mostrar `Dashboard` como entry fija para usuarios autenticados
- el contenido interno del dashboard debe construirse dinamicamente en funcion de `modules` y, cuando aplique, `permissions`
- si en el futuro existen dashboards distintos por tipo de acceso, esa variacion se resolvera dentro de la composicion del dashboard, no convirtiendo `dashboard` en modulo del backend

### Status

approved
