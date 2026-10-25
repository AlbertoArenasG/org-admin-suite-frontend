# Plan

## Resultado previsto

Extender el módulo administrativo existente y añadir un módulo frontend de facturación con rutas, Redux y estado de tabla propios. Compartir únicamente contratos y presentación puros cuando la misma entidad lo justifique. Conservar los componentes genéricos de Next Dashboard y los permisos independientes.

## Fases

1. Contrato y estado: mapear billing_status y billing_notification; integrar filtro y mutación administrativos; crear feature Redux y estado de tabla para facturación. Separar el transporte reutilizable de POST /v1/files sin hacer depender la slice de facturación de la administrativa.
2. Administración: columna/filtro/acción de envío, estado/aviso del detalle, menús normal y compacto, regla del último archivo y cliente en PageHeader.
3. Facturación: política central del shell, navegación autorizada, listado DataTable, detalle ResourceForm de contexto legible y documentos, edición de factura y guardado seguido de marcado explícito.
4. Verificación: typecheck, lint, build, revisión de permisos, casos parciales y matriz manual; actualizar documentación viva y cerrar solo con evidencia.

## Orden y límites

La fase 1 precede a las vistas para fijar tipos, errores y propietarios de estado. La administración se integra antes del módulo nuevo. El portal conserva su comportamiento; el backend no se modifica. Las decisiones de apariencia menores se resuelven con tokens y recetas vigentes, sin ampliar contratos genéricos.
