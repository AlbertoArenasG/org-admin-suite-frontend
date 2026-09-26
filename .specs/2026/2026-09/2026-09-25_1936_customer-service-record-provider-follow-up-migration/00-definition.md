# Definition: Customer Service Record Provider And Follow-Up Migration

## Initiative

- Name: `customer-service-record-provider-follow-up-migration`
- Date: `2026-09-25`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La vista individual Next Dashboard ya presenta tres bloques independientes. Falta
migrar el objeto backend completo `provider`, que incluye proveedor, retorno y
seguimiento, sin restaurar funcionalidad legacy ni dejar seguimiento editable
sin interfaz.

## Expected Outcome

La ruta incorpora una cuarta sección, `Proveedor y seguimiento`, que muestra y
actualiza el objeto `provider` completo mediante
`PUT /v1/customer-service-records/:recordId/provider`.

## Migration Mandate

Esta iniciativa extiende exclusivamente la vista individual Next Dashboard. No
restaura, adapta, reutiliza ni imita rutas, componentes, payloads, estado,
formularios, permisos o estilos legacy. Todas las opciones, tipos, mappers,
thunks y estado de este bloque viven en `customer-service-records`; no puede
consumir estado ni thunks de otros features.

## Included Scope

- Añadir la sección independiente `Proveedor y seguimiento` y su ancla.
- Representar `provider: null` y editar la activación o retiro de proveedor.
- Editar proveedor, referencia de orden, fechas de retorno, intervalo y
  políticas.
- Editar `follow_up.enabled` y reglas repetibles con intervalo, destinatarios y
  grupos en copia.
- Cargar proveedores, políticas y grupos destinatarios desde thunks propios del
  feature.
- Aplicar la receta vigente de `ResourceForm`, permisos locales, recuperación,
  toast y feedback de éxito de 800 ms.

## Excluded Scope

- Adjuntos, documentos, cotización, orden de compra, factura y otros archivos.
- Bloques de detalles generales, cliente/entrega, equipo y listado.
- Envío manual de notificaciones, historial o materializaciones de seguimiento.
- Cambiar contratos backend, permisos institucionales o el boundary de ruta.

## Constraints

- El payload siempre incluye `provider`: `null` cuando no se requiere
  proveedor, u objeto completo cuando se habilita.
- Cuando se habilita un proveedor nuevo, `follow_up` inicia como
  `{ enabled: false, rules: [] }`.
- La validación reproduce exactamente el DTO backend: con proveedor, solo
  `provider_id`, intervalo y estructura `follow_up` son requeridos; fechas,
  referencia y políticas admiten `null`.
- Cada regla requiere el intervalo y ambos arreglos de grupos como estructura;
  backend permite que los arreglos estén vacíos, por lo que la interfaz no
  impone un mínimo adicional.
- La fecha estimada de retorno usa la misma ayuda local de fecha calculada ya
  adoptada para cliente, sin reemplazar la fecha explícita.
- Escritorio usa campos horizontales; móvil, campos apilados.

## Acceptance Criteria

- La navegación muestra cuatro secciones y mantiene anclas semánticas con
  scroll spy, no tabs ARIA.
- `READ` presenta valores sin edición; `UPDATE` habilita un draft local e
  independiente de los otros bloques.
- El formulario persiste proveedor nulo o el objeto completo con reglas de
  seguimiento en una sola petición PUT.
- El feature reemplaza el detalle canónico con la respuesta sin GET adicional.
- Las opciones y mutación pertenecen exclusivamente a `customer-service-records`.
- Éxito, cancelación, error y doble envío respetan la receta validada.

## Open Decisions

Ninguna.
