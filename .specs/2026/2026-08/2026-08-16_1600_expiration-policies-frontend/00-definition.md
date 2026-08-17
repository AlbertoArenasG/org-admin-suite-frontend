# Definition

## Purpose

Este documento existe para cerrar decisiones criticas del módulo frontend de `expiration policies` antes de implementar cambios estructurales.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas sin aprobacion final
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto
- las decisiones se aterrizan una por una

## Overall Status

- Initiative: `expiration-policies-frontend`
- Definition status: `in_progress`
- Implementation ready: `no`

---

## Decision 01. Alcance funcional de esta spec frontend

### Context

Ya existe backend para:

- `expiration_status_policies`
- `expiration_notification_policies`

Y ya acordamos separar el trabajo frontend pendiente en dos specs:

1. `expiration policies`
2. `internal asset control`

Antes de definir rutas, estado, formularios o integración visual, hace falta cerrar si esta spec frontend debe:

- cubrir solo una de las dos políticas
- cubrir ambas políticas administrativas
- o mezclar también en esta misma spec el consumo de dichas políticas desde `internal-asset-control`

La decisión importa porque:

- ambas políticas son módulos administrativos reutilizables
- `internal-asset-control` será consumidor de esas políticas, pero no su única posible reutilización futura
- si se mezcla administración de políticas con su primer consumidor, la spec crecerá demasiado y costará más cerrarla limpia

### Options

1. Cubrir solo `expiration_status_policies` y dejar `expiration_notification_policies` para otra spec
2. Cubrir ambas políticas y además su primer consumo dentro de `internal-asset-control`
3. Cubrir ambas políticas administrativas en una sola spec frontend, con sus flujos propios de `list + detail + create + edit + delete`, dejando fuera por ahora el consumo desde `internal-asset-control`

### Recommendation

Opcion 3.

Es la mejor separación de responsabilidades.

Permite cerrar primero la base reusable de administración de políticas y después, en otra spec, enfocarnos únicamente en cómo `internal-asset-control` las consulta, selecciona y presenta dentro de su propio dominio.

También deja mejor memoria institucional: una spec para administrar políticas y otra para consumirlas.

### Implications

- esta spec debe cubrir dos módulos administrativos completos:
  - `expiration_status_policies`
  - `expiration_notification_policies`
- ambos deben seguir el patrón estructural ya existente del proyecto
- la UI debe quedar lista para reutilización posterior desde módulos consumidores
- no entra todavía la integración embebida dentro de `internal-asset-control`
- cualquier decisión específica de consumo quedará explícitamente fuera de esta spec

### Decision Final

Se aprueba que esta spec frontend cubra funcionalmente ambos módulos administrativos:

- `expiration_status_policies`
- `expiration_notification_policies`

El alcance incluye sus superficies administrativas propias en frontend:

- listado
- detalle
- creación
- edición
- delete

Queda fuera de esta spec:

- la integración consumidora dentro de `internal-asset-control`
- cualquier flujo específico de selección o uso embebido de políticas dentro de otros módulos

### Status

approved

---

## Decision 05. Nivel de reutilización entre ambos módulos frontend

### Context

Ya quedó aprobado que:

- `expiration_status_policies` y `expiration_notification_policies` serán módulos separados
- cada uno tendrá sus propias rutas, estado y superficies administrativas
- ambos se implementarán siguiendo el mismo patrón general del proyecto

Falta cerrar qué tanto conviene reutilizar entre ambos módulos a nivel frontend.

La disyuntiva real no es si habrá reutilización o no, sino en qué nivel debe ocurrir:

- si conviene forzar una abstracción grande compartida desde el inicio
- o si conviene mantener cada módulo dueño de su flujo y extraer solo piezas realmente comunes

La decisión importa porque:

- ambos módulos pertenecen a la misma familia funcional
- pero no representan el mismo recurso ni el mismo formulario
- una abstracción prematura puede volver más confusa la implementación y el mantenimiento

### Options

1. Forzar desde el inicio formularios y pantallas grandes compartidas entre ambos módulos
2. No compartir absolutamente nada entre ambos módulos
3. Mantener cada módulo dueño de sus formularios y pantallas, extrayendo solo componentes y utilidades pequeñas cuando la coincidencia sea real

### Recommendation

Opcion 3.

Es la opción más consistente con el patrón actual del proyecto y evita abstraer antes de tiempo.

La reutilización debe ocurrir solo cuando realmente aporte claridad, por ejemplo en:

- componentes visuales pequeños
- bloques administrativos repetibles
- utilidades de transformación o normalización
- badges, chips o piezas visuales comunes

Pero no conviene arrancar intentando colapsar ambos módulos dentro de un único formulario o una misma abstracción grande.

### Implications

- cada módulo conserva su formulario propio
- cada módulo conserva sus pantallas propias
- solo se extraerán componentes/utilidades cuando la coincidencia sea real
- la implementación debe privilegiar claridad por encima de abstracción prematura

### Decision Final

Se aprueba que:

- `expiration_status_policies` y `expiration_notification_policies` conserven formularios y pantallas propias
- la reutilización ocurra solo en componentes o utilidades pequeñas cuando realmente aplique
- no se construya una abstracción grande compartida desde definición

### Status

approved

---

## Decision 04. Orden de implementación entre `expiration_status_policies` y `expiration_notification_policies`

### Context

Ya quedó aprobado que esta spec cubrirá ambos módulos y que cada uno tendrá:

- listado
- detalle
- create
- edit
- delete

Falta cerrar el orden de implementación para no abrir ambos frentes al mismo tiempo y evitar retrabajo en el patrón administrativo base.

### Options

1. Implementar primero `expiration_notification_policies`
2. Implementar ambos módulos en paralelo
3. Implementar primero `expiration_status_policies` y después `expiration_notification_policies`

### Recommendation

Opcion 3.

Es el orden más limpio y reduce incertidumbre.

`expiration_status_policies` se ve más simple estructuralmente y permite cerrar primero:

- contrato base
- patrón visual administrativo
- estructura de listado/detalle/formulario
- wiring de navegación y permisos

Con esa base ya estable, `expiration_notification_policies` puede implementarse después sobre un patrón frontend más firme, aun cuando su formulario y reglas sean más densos.

### Implications

- el breakdown de implementación debe empezar por `expiration_status_policies`
- `expiration_notification_policies` se implementará después reutilizando el patrón ya validado
- este orden reduce riesgo de retrabajo visual y de estado

### Decision Final

Se aprueba que esta spec se implemente en este orden:

1. `expiration_status_policies`
2. `expiration_notification_policies`

### Status

approved

---

## Decision 03. Ubicación del estado frontend

### Context

Ya quedó aprobado que:

- `expiration_status_policies` y `expiration_notification_policies` serán módulos separados
- cada uno tendrá sus propias rutas y superficies administrativas
- ambos pertenecerán a la misma familia funcional en navegación

Hace falta cerrar dónde vivirá su estado frontend para no romper el patrón del proyecto ni generar acoplamientos innecesarios.

La principal disyuntiva es:

- si resolver ambos módulos con estado local por pantalla
- si colapsarlos en un solo feature state compartido
- o si mantener un feature state separado por módulo, dejando solo la lógica realmente compartida fuera de los slices

La decisión importa porque:

- ambos recursos son distintos
- tendrán paginaciones, mutaciones, flags y errores propios
- pero sí podrían compartir componentes, utilidades y partes del patrón administrativo

### Options

1. Resolver ambos módulos con estado local por pantalla
2. Un solo feature state compartido para `expiration_status_policies` y `expiration_notification_policies`
3. Un feature state separado por módulo, con utilidades compartidas solo donde realmente haga falta

### Recommendation

Opcion 3.

Es la opción más consistente con el patrón actual del proyecto.

Aunque ambos módulos pertenezcan a la misma familia funcional, no dejan de ser recursos distintos. Mezclarlos desde el estado central volvería más frágiles las paginaciones, mutaciones, flags de carga y manejo de errores.

La reutilización debe ocurrir en:

- componentes compartidos
- utilidades compartidas
- selectores auxiliares

pero no colapsando los dos recursos en un solo slice.

### Implications

- existirá `src/features/expiration-status-policies/*`
- existirá `src/features/expiration-notification-policies/*`
- cada módulo tendrá su propio:
  - `types.ts`
  - `thunks.ts`
  - `slice.ts`
- si aparece lógica realmente compartida, saldrá a utilidades o componentes compartidos
- las páginas podrán consumir ambos módulos cuando haga falta, pero sin fusionar sus estados

### Decision Final

Se aprueba que el estado frontend viva separado por módulo.

La estructura aprobada es:

- `src/features/expiration-status-policies/*`
- `src/features/expiration-notification-policies/*`

Cada uno con su propio estado, thunks y tipos. La reutilización entre ambos deberá ocurrir fuera de los slices cuando realmente sea compartida.

### Status

approved

---

## Decision 02. Estructura de pantallas y agrupación en navegación

### Context

`expiration_status_policies` y `expiration_notification_policies` son dos módulos distintos, pero funcionalmente forman una misma familia reusable de políticas de vencimiento.

Hace falta cerrar si frontend debe:

- colapsarlos en una sola pantalla grande
- separarlos completamente también a nivel navegación
- o mantenerlos como módulos distintos, pero agrupados visualmente dentro de la misma sección del sidebar

La decisión importa porque:

- ambos módulos tendrán CRUD propio
- ambos pertenecen al mismo dominio funcional
- el usuario sí debe percibir que forman parte de una misma familia
- al mismo tiempo no conviene romper el patrón del proyecto con pantallas gigantes o routing ambiguo

### Options

1. Una sola pantalla multipropósito para ambos módulos
2. Dos módulos separados, cada uno con navegación completamente independiente en sidebar
3. Dos módulos separados con rutas, vistas y formularios propios, pero agrupados dentro del mismo grupo del sidebar

### Recommendation

Opcion 3.

Es la opción más consistente con el proyecto y con el dominio.

Permite:

- mantener CRUD separado por recurso
- reutilizar patrones administrativos ya existentes
- evitar archivos gigantes
- comunicar visualmente que ambos pertenecen a una misma familia funcional en navegación

### Implications

- `expiration_status_policies` tendrá rutas propias de:
  - listado
  - detalle
  - creación
  - edición
- `expiration_notification_policies` tendrá rutas propias de:
  - listado
  - detalle
  - creación
  - edición
- cada módulo tendrá formulario compartido para `create/edit`
- ambos módulos deberán pertenecer al mismo grupo del sidebar
- las páginas de `app/` seguirán enfocadas en composición y routing

### Decision Final

Se aprueba que `expiration_status_policies` y `expiration_notification_policies` se implementen como módulos separados, cada uno con sus propias rutas y superficies administrativas.

La estructura aprobada es:

- listado
- detalle
- creación
- edición
- formulario compartido para `create/edit`

Y además se aprueba que ambos pertenezcan al mismo grupo en el sidebar para reflejar que forman parte de una misma familia funcional.

### Status

approved
