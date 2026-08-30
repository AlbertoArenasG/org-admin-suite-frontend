# Definition

## Overall Status

- Initiative: `customer-service-records-frontend`
- Definition status: `completed`
- Implementation ready: `yes`

## Approved Scope

Construir el MVP visible de `Customer Service Records`:

- listado, detalle, alta, edición y baja lógica;
- un activo visible por formulario, aunque backend soporte varios;
- Cliente, usuarios relacionados, tipo de servicio, compromisos y Proveedor;
- semáforos y materializaciones consumidos desde backend;
- reglas embebidas de seguimiento a Proveedor.

Fuera de alcance: dispatcher de correos, job interno, datos logísticos,
duplicación masiva, múltiples activos en UI y la futura visualización Heijunka.

## Decisions

- Nombre visible: `Registros de servicio`; Heijunka queda reservado para una futura vista de planeación.
- Rutas: `/dashboard/customer-service-records`, `/new`, `/:recordId` y `/:recordId/edit`.
- Formulario en una página por secciones, sin tabs.
- Proveedor es opcional y se controla con un interruptor que limpia el bloque antes de enviar `provider: null`.
- Los semáforos no se calculan en frontend; se presentan con el estado neutral o derivado recibido.
