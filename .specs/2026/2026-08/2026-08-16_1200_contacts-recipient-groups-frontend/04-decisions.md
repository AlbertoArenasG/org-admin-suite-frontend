# Decisions

## Decision Log

- Decision 01:
  - tema: alcance funcional de la spec
  - estado: approved
  - resultado:
    - esta spec cubrirá `contacts` y `recipient_groups`
    - incluirá `list + detail + create + edit + delete`
    - no cubrirá todavía integración consumidora en otros módulos

- Decision 02:
  - tema: estructura de pantallas y agrupación en navegación
  - estado: approved
  - resultado:
    - `contacts` y `recipient_groups` vivirán como módulos separados
    - cada uno tendrá `list + detail + create + edit`
    - cada uno reutilizará formulario compartido para `create/edit`
    - ambos pertenecerán al mismo grupo del sidebar

- Decision 03:
  - tema: ubicación del estado frontend
  - estado: approved
  - resultado:
    - existirá `src/features/contacts/*`
    - existirá `src/features/recipient-groups/*`
    - cada módulo tendrá estado propio
    - la lógica compartida no deberá forzar un slice único

- Decision 04:
  - tema: UX de selección y creación de contactos dentro de `recipient_groups`
  - estado: approved
  - resultado:
    - `recipient_groups` permitirá buscar contactos existentes
    - permitirá seleccionar múltiples contactos
    - permitirá crear contacto en contexto cuando no exista

- Decision 05:
  - tema: patrón visual del flujo de selección y alta en contexto
  - estado: approved
  - resultado:
    - el lookup vivirá dentro del formulario de `recipient_groups`
    - la selección será múltiple
    - el alta en contexto se resolverá con `modal` o `drawer`
    - no habrá navegación aparte para ese subflujo

- Decision 06:
  - tema: orden de implementación
  - estado: approved
  - resultado:
    - primero se implementará `contacts`
    - después se implementará `recipient_groups`
