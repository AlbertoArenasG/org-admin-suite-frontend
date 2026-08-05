# Progress

## 2026-08-05

- Se abrió la spec espejo de frontend para el rediseño backend `authorization-catalog-module-specific-operations`.
- Se dejó la iniciativa en estado `definition in progress`.
- Se dejó pendiente la primera ronda de decisiones sobre alcance, fuente de verdad del catálogo en frontend y tratamiento UI de operaciones específicas o sensibles.
- Se aprobó como primera decisión de definición que la iniciativa frontend no se limitará al editor de permisos: también cubrirá consumers directos del catálogo y alineaciones secundarias que sean consecuencia directa del rediseño backend.
- Se aprobó como segunda decisión de definición que backend será la única fuente de verdad para las operaciones válidas por módulo, sin reconstrucción paralela en frontend.
- Se aprobó como tercera decisión de definición que frontend no introducirá una categoría visual especial para operaciones sensibles o auxiliares: toda operación válida de un módulo se renderizará igual dentro del editor, usando backend como fuente de verdad de labels y nombres.
- Se limpió la definición para dejar esta spec como iniciativa autosuficiente, sin depender formalmente de specs frontend previas ya cerradas o con propósito distinto.
- Se registró explícitamente en análisis, tareas y diseño técnico que `CUSTOMERS/READ_PUBLIC_ACCESS` y `PROVIDERS/READ_PUBLIC_ACCESS` ya no forman parte del `READ` normal, sino de endpoints y permisos separados que frontend deberá absorber.
- Se aterrizó el snapshot contractual backend que frontend debe asumir en esta iniciativa, incluyendo:
  - `GET /v1/roles/modules` como fuente única del catálogo
  - obsolescencia práctica de `GET /v1/roles/operations` para frontend
  - salida de `POST /v1/users` del scope normal
  - separación de `READ_PUBLIC_ACCESS` para `customers` y `providers`
  - restricción de no anticipar `ROLES/ACTIVATE` mientras backend no la publique en el catálogo vivo
- Con esto quedó cerrada la fase de definición sobre alcance y contratos backend relevantes para frontend.
- Se auditó el editor real de permisos y se confirmó que:
  - el consumo de `GET /v1/roles/modules` ya está alineado con el catálogo backend
  - el render del editor ya es dinámico por módulo y operación
  - persiste una regla local en frontend que autoactiva y bloquea `READ` cuando existe otra operación activa dentro del mismo módulo
  - esa regla fue ratificada como decisión deliberada de UX para evitar errores humanos al capturar permisos y no como un problema de alineación con backend
