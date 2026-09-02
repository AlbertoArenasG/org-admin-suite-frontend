# Definicion

## Proposito

Definir una estrategia de coexistencia para migrar rutas reales al nuevo
Dashboard Shell de manera gradual, conservando las URLs actuales y sin alterar
el comportamiento del shell legado para las rutas que aun no adopten el nuevo
modelo.

Esta spec no elige ni migra un modulo de negocio. Cada primera adopcion tendra
su propia spec o slice, donde se decidira la ruta adecuada y su composicion.

## Estado General

- Iniciativa: `dashboard-shell-gradual-migration`
- Fecha: `2026-09-01`
- Definition status: `in_progress`
- Implementation ready: `no`

---

## Decision 01. Conservar URLs durante la migracion

### Contexto

Las rutas productivas viven bajo `/dashboard`. Introducir un prefijo paralelo
para el nuevo shell duplicaria rutas, enlaces y navegacion, y no representa la
adopcion real del modelo.

### Opciones

1. Migrar rutas conservando sus URLs actuales bajo `/dashboard`.
2. Crear rutas temporales bajo un prefijo nuevo y sustituirlas despues.

### Recomendacion

Adoptar la opcion 1. El cambio de shell debe ser una preocupacion interna del
runtime y no una diferencia visible en la URL.

### Implicaciones

- El layout padre de `/dashboard` debe poder delegar a ambos shells.
- No se duplican paginas ni contratos de navegacion.
- Cada ruta migra de forma explicita y reversible.

### Decision Final

Pendiente de aprobacion.

### Status

pending

---

## Decision 02. Boundary unico y politica central de adopcion

### Contexto

Todo descendiente de `/dashboard` hereda `src/app/dashboard/layout.tsx`. Los
route groups no permiten evitar ese layout padre para una ruta hija. Condicionar
shells desde paginas individuales dispersaria infraestructura y haria dificil
auditar la coexistencia.

### Opciones

1. Agregar condicionales de shell dentro de cada pagina migrada.
2. Reemplazar el shell para todas las rutas en un cambio big bang.
3. Convertir `DashboardLayout` en un delegador delgado y resolver el shell por
   una politica central de rutas.

### Recomendacion

Adoptar la opcion 3. `DashboardLayout` conservara auth y proveera un boundary
de runtime. Un registro central determinara si el pathname usa `legacy` o
`next`; el markup actual se movera sin cambios funcionales a
`LegacyDashboardShell`.

### Implicaciones

- No hay condicionales de infraestructura distribuidos en modulos.
- La ruta no migrada sigue usando el mismo markup y sidebar actuales.
- Una ruta se puede retirar de la politica para revertir su shell sin revertir
  su codigo de negocio.

### Decision Final

Pendiente de aprobacion.

### Status

pending

---

## Decision 03. Registro explicito sin feature flag remoto

### Contexto

El proyecto es operado por un solo equipo y no requiere rollout remoto ni
experimentos A/B para esta migracion. Aun asi, la adopcion debe ser visible y
reversible.

### Opciones

1. Deducir el shell mediante convenciones de carpetas o heuristicas de ruta.
2. Usar un registro local explicito de patrones de pathname.
3. Incorporar feature flags remotos desde esta iniciativa.

### Recomendacion

Adoptar la opcion 2. Un registro local, tipado y cubierto por pruebas define
las rutas migradas. No se agrega infraestructura de feature flags.

### Implicaciones

- El conjunto de adopciones se puede revisar en un archivo unico.
- La reversibilidad consiste en retirar una entrada del registro.
- Los patrones dinamicos se expresan deliberadamente, no por coincidencias
  accidentales.

### Decision Final

Pendiente de aprobacion.

### Status

pending

---

## Decision 04. Criterios para la primera ruta migrada

### Contexto

El nuevo shell debe probarse con una ruta real, pero no se debe asumir hoy que
un modulo concreto sera el primero.

### Decision Final

La primera ruta se elegira en una iniciativa posterior. Debe tener datos
estables, permisos conocidos, interaccion acotada, contenido suficientemente
largo para validar scroll y una regresion facil de detectar. La seleccion no
forma parte de esta spec.

### Status

approved

---

## Decision 05. Separacion entre shell y composicion de pagina

### Contexto

La adopcion del shell no debe obligar a redisenar de una vez tablas,
formularios, acciones, estados ni componentes de dominio.

### Decision Final

La primera migracion solo debe envolver el contenido existente en el nuevo
shell y adaptar la composicion minima necesaria para respetar el dueño de
scroll. Cambios de Page Header, Module Surfaces, tablas o formularios se
planifican como slices explicitos de la ruta seleccionada.

### Status

approved
