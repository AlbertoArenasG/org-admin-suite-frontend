# Decisions

## Decision Log

- Decision 01:
  - tema: alcance funcional de la spec
  - estado: approved
  - resultado:
    - esta spec cubrirá `expiration_status_policies`
    - esta spec cubrirá `expiration_notification_policies`
    - incluirá `list + detail + create + edit + delete`
    - no cubrirá todavía integración consumidora dentro de `internal-asset-control`

- Decision 02:
  - tema: estructura de pantallas y agrupación en navegación
  - estado: approved
  - resultado:
    - `expiration_status_policies` y `expiration_notification_policies` vivirán como módulos separados
    - cada uno tendrá `list + detail + create + edit`
    - cada uno reutilizará formulario compartido para `create/edit`
    - ambos pertenecerán al mismo grupo del sidebar

- Decision 03:
  - tema: ubicación del estado frontend
  - estado: approved
  - resultado:
    - existirá `src/features/expiration-status-policies/*`
    - existirá `src/features/expiration-notification-policies/*`
    - cada módulo tendrá estado propio
    - la lógica compartida no deberá forzar un slice único

- Decision 04:
  - tema: orden de implementación
  - estado: approved
  - resultado:
    - primero se implementará `expiration_status_policies`
    - después se implementará `expiration_notification_policies`

- Decision 05:
  - tema: nivel de reutilización entre ambos módulos frontend
  - estado: approved
  - resultado:
    - cada módulo conservará formularios y pantallas propias
    - solo se extraerán componentes y utilidades pequeñas cuando la coincidencia sea real
    - no se construirá una abstracción grande compartida desde definición
