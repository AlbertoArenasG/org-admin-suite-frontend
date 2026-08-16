# Definition

## Purpose

Este documento existe para cerrar decisiones criticas del módulo frontend de `contacts + recipient groups` antes de implementar cambios estructurales.

Regla de trabajo:

- no arrancar implementacion estructural mientras existan decisiones criticas sin aprobacion final
- tu tomas la decision final
- aqui solo se registran contexto, opciones, recomendacion e impacto
- las decisiones se aterrizan una por una

## Overall Status

- Initiative: `contacts-recipient-groups-frontend`
- Definition status: `completed`
- Implementation ready: `yes`

---

## Decision 01. Alcance funcional de esta spec frontend

### Context

Ya existe backend para:

- `contacts`
- `recipient_groups`
- `communication_channels`

Y ya acordamos separar el trabajo frontend pendiente en dos specs:

1. `contacts + recipient groups`
2. `internal asset control`

Antes de definir rutas, estado, formularios o integración visual, hace falta cerrar si esta primera spec frontend entregará solo bases parciales o si cerrará funcionalmente ambos módulos reutilizables.

La decisión importa porque:

- ambos módulos son reutilizables y servirán a iniciativas futuras
- `recipient_groups` depende operativamente de `contacts`
- si frontend deja uno a medias, el siguiente módulo consumidor nacería sobre bases incompletas

### Options

1. Entregar solo `contacts` y dejar `recipient_groups` para otra spec
2. Entregar ambos módulos pero solo con listados y detalle
3. Entregar ambos módulos funcionalmente en una sola spec, con sus flujos administrativos reales de `list + detail + create + edit + delete`, dejando fuera por ahora cualquier integración consumidora en otros módulos

### Recommendation

Opcion 3.

Tiene mejor relación entre esfuerzo y valor.

`contacts` y `recipient_groups` forman una base reutilizable coherente. Separarlos ahora obligaría a reabrir decisiones y retrabajar UX cuando entremos después a módulos consumidores como `internal-asset-control`.

También conviene dejar explícito que esta spec no cubrirá todavía una superficie consumidora embebida dentro de otros módulos. Su responsabilidad será cerrar la administración base de ambos recursos en frontend.

### Implications

- la spec debe cubrir dos módulos administrativos completos
- `contacts` y `recipient_groups` deben seguir el patrón estructural ya existente del proyecto
- la UI debe quedar lista para reutilización posterior desde otros formularios
- no entra todavía la integración embebida dentro de `internal-asset-control` ni otros módulos futuros
- sí puede contemplarse desde definición que algunos componentes resultantes se diseñen para posterior reutilización

### Decision Final

Se aprueba que esta primera spec frontend cubra funcionalmente ambos módulos base:

- `contacts`
- `recipient_groups`

El alcance incluye sus superficies administrativas propias en frontend:

- listado
- detalle
- creación
- edición
- delete

Queda fuera de esta spec:

- la integración consumidora dentro de otros módulos
- cualquier flujo específico de `internal-asset-control`
- automatizaciones o asistentes de uso embebido que dependan de módulos futuros

### Status

approved

---

## Decision 06. Orden de implementación entre `contacts` y `recipient_groups`

### Context

Ya quedó aprobado que esta spec cubrirá ambos módulos y que `recipient_groups` dependerá de:

- lookup de contactos
- selección múltiple
- alta de contacto en contexto

Falta cerrar el orden de implementación para no abrir ambos frentes al mismo tiempo y evitar retrabajo en el flujo dependiente.

### Options

1. Implementar primero `recipient_groups`
2. Implementar ambos módulos en paralelo
3. Implementar primero `contacts` y después `recipient_groups`

### Recommendation

Opcion 3.

Es el orden más limpio y reduce incertidumbre.

Si primero queda bien cerrada la base administrativa de `contacts`, el módulo de `recipient_groups` podrá construirse después sobre contratos, pantallas y estado ya estables, especialmente para el subflujo de búsqueda y alta en contexto.

### Implications

- el breakdown de implementación debe empezar por `contacts`
- `recipient_groups` se implementará como módulo consumidor de esa base ya cerrada
- este orden reduce riesgo de retrabajo visual y de estado

### Decision Final

Se aprueba que esta spec se implemente en este orden:

1. `contacts`
2. `recipient_groups`

### Status

approved

---

## Decision 05. Patrón visual para lookup, selección múltiple y alta en contexto

### Context

Ya quedó aprobado que `recipient_groups` debe permitir:

- buscar contactos existentes
- seleccionar múltiples contactos
- crear un contacto en contexto cuando no exista

Falta cerrar el patrón visual exacto para no llegar a implementación con ambigüedad.

La principal disyuntiva es:

- si el alta en contexto debe sacar al usuario a otra pantalla
- o si debe mantenerse dentro del mismo flujo de edición/creación del grupo

También hace falta dejar explícito que la selección de contactos vive dentro del formulario del grupo y no como una pantalla separada.

### Options

1. Navegar a una pantalla aparte para alta de contacto y volver después
2. Hacer todo en una sola pantalla gigante con bloques expandidos
3. Mantener el lookup y la selección múltiple dentro del formulario de `recipient_groups`, y resolver el alta en contexto con `modal` o `drawer`

### Recommendation

Opcion 3.

Es la opción con mejor continuidad operativa y menor fricción.

Permite:

- no perder el estado del formulario del grupo
- mantener al usuario dentro del flujo principal
- separar claramente el alta de contacto sin colapsar la pantalla completa

### Implications

- el formulario de `recipient_groups` tendrá un selector múltiple embebido
- el alta en contexto no debe romper ni reiniciar el formulario del grupo
- el patrón visual deberá ser `modal` o `drawer`
- más adelante ese patrón podrá extraerse a componente reusable si conviene

### Decision Final

Se aprueba que:

- el lookup y la selección múltiple de contactos vivan dentro del formulario de `recipient_groups`
- el alta de contacto en contexto se resuelva con `modal` o `drawer`
- no se use navegación aparte para ese subflujo

### Status

approved

---

## Decision 04. UX de selección y creación de contactos dentro de `recipient_groups`

### Context

`recipient_groups` necesita construir grupos a partir de contactos existentes, pero también queremos evitar fricción cuando el usuario no encuentre un contacto ya registrado.

Ya se había conversado desde backend que, operativamente, la mejor experiencia sería:

- buscar contactos existentes
- sugerir coincidencias
- seleccionar uno o varios
- y permitir crear un contacto nuevo en contexto cuando no exista

Hace falta cerrar si frontend:

- fuerza a salir del flujo para crear contactos aparte
- restringe el formulario a selección de contactos existentes
- o resuelve ambas necesidades dentro del mismo flujo del grupo

### Options

1. Solo permitir seleccionar contactos ya existentes
2. Obligar al usuario a salir a `contacts` para crear uno nuevo y luego volver
3. Permitir búsqueda y selección de contactos existentes, con creación de contacto en contexto dentro del flujo de `recipient_groups`

### Recommendation

Opcion 3.

Es la mejor experiencia de usuario y además se alinea con la intención funcional ya discutida para estos módulos.

Permite que `recipient_groups` sea útil desde su primera versión sin obligar a navegación extra innecesaria. También deja una base reusable para otros módulos que después necesiten seleccionar o crear contactos durante un flujo mayor.

### Implications

- el formulario de `recipient_groups` necesitará lookup de contactos
- el flujo deberá soportar selección múltiple
- deberá existir una forma de crear contacto en contexto sin romper la pantalla principal
- esa creación en contexto debe integrarse al estado del módulo sin fusionar ambos slices
- más adelante esta UX podrá evolucionar a componente reusable

### Decision Final

Se aprueba que el módulo `recipient_groups` permita:

- buscar contactos existentes
- seleccionar uno o varios contactos
- crear un nuevo contacto en contexto cuando no exista el deseado

No se aprueba obligar al usuario a salir del flujo principal solo para dar de alta un contacto faltante.

### Status

approved

---

## Decision 03. Dónde vive el estado frontend de `contacts` y `recipient_groups`

### Context

Ambos módulos tendrán:

- listados paginados
- detalle
- create
- edit
- delete

Y además `recipient_groups` dependerá de información de `contacts` para construir su formulario.

Hace falta decidir si:

- todo vive en estado local por pantalla
- ambos recursos comparten un solo feature state
- o cada módulo conserva su propio feature state, dejando solo la lógica realmente compartida fuera de los slices

### Options

1. Resolver ambos módulos con estado local por pantalla
2. Un solo feature state compartido para `contacts` y `recipient_groups`
3. Un feature state separado por módulo, con utilidades compartidas solo donde realmente haga falta

### Recommendation

Opcion 3.

Es la opción más consistente con el patrón actual del proyecto.

`recipient_groups` consume datos de `contacts`, pero no deja de ser un recurso distinto. Mezclar ambos desde el estado central volvería más frágiles las paginaciones, mutaciones, flags de carga y manejo de errores.

La reutilización debe ocurrir en:

- componentes compartidos
- utilidades compartidas
- selectores auxiliares

pero no colapsando los dos recursos en un solo slice.

### Implications

- existirá `src/features/contacts/*`
- existirá `src/features/recipient-groups/*`
- cada módulo tendrá su propio:
  - `types.ts`
  - `thunks.ts`
  - `slice.ts`
- si aparece lógica realmente compartida, saldrá a utilidades o componentes compartidos
- el formulario de `recipient_groups` podrá consultar `contacts`, pero sin fusionar ambos estados

### Decision Final

Se aprueba que el estado frontend viva separado por módulo.

La estructura aprobada es:

- `src/features/contacts/*`
- `src/features/recipient-groups/*`

Cada uno con su propio estado, thunks y tipos. La reutilización entre ambos deberá ocurrir fuera de los slices cuando realmente sea compartida.

### Status

approved

---

## Decision 02. Estructura de pantallas y agrupación en navegación

### Context

`contacts` y `recipient_groups` son dos módulos distintos, pero funcionalmente forman una misma base reutilizable de comunicación y destinatarios.

Hace falta cerrar si frontend debe:

- colapsarlos en una sola pantalla grande
- separarlos completamente también a nivel navegación
- o mantenerlos como módulos distintos, pero agrupados visualmente dentro de la misma sección del sidebar

La decisión importa porque:

- ambos módulos tendrán CRUD propio
- `recipient_groups` depende de selección de contactos
- el usuario sí debe percibir que pertenecen a una misma familia funcional
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

- `contacts` tendrá rutas propias de:
  - listado
  - detalle
  - creación
  - edición
- `recipient_groups` tendrá rutas propias de:
  - listado
  - detalle
  - creación
  - edición
- cada módulo tendrá formulario compartido para `create/edit`
- ambos módulos deberán pertenecer al mismo grupo del sidebar
- las páginas de `app/` seguirán enfocadas en composición y routing

### Decision Final

Se aprueba que `contacts` y `recipient_groups` se implementen como módulos separados, cada uno con sus propias rutas y superficies administrativas.

La estructura aprobada es:

- listado
- detalle
- creación
- edición
- formulario compartido para `create/edit`

Y además se aprueba que ambos pertenezcan al mismo grupo en el sidebar para reflejar que forman parte de una misma familia funcional.

### Status

approved
