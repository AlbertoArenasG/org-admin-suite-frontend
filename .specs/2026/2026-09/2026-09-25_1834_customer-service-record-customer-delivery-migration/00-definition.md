# Definition: Customer Service Record Customer And Delivery Migration

## Initiative

- Name: `customer-service-record-customer-delivery-migration`
- Date: `2026-09-25`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La vista individual Next Dashboard ya presenta y edita `Detalles generales`.
Falta incorporar el siguiente bloque backend sin crear un formulario global ni
reintroducir detalle o edición legacy.

## Expected Outcome

La misma ruta individual incorpora la sección `Cliente y compromiso de
entrega`, con lectura para `READ`, edición local para `UPDATE`, navegación por
anclas con scroll spy y persistencia mediante
`PUT /v1/customer-service-records/:recordId/customer`.

## Migration Mandate

Esta iniciativa extiende exclusivamente la vista individual Next Dashboard.
No restaura, adapta, reutiliza ni imita rutas, componentes, payloads, estado,
formularios, permisos o estilos legacy. Cada llamada remota, mapper, tipo y
estado de este bloque vive en `customer-service-records`; no puede importar,
despachar ni leer thunks o estado de otro feature.

## Included Scope

- Añadir la sección independiente `Cliente y compromiso de entrega`.
- Añadir navegación de secciones mediante anclas semánticas y scroll spy.
- Cargar desde el feature opciones de clientes, usuarios relacionados y ambas
  políticas de vencimiento.
- Editar cliente, usuarios, fechas, intervalo, políticas y compromiso de
  entrega conforme al contrato backend.
- Aplicar la receta vigente de `ResourceForm`, permisos locales, recuperación,
  toast y feedback de éxito de 800 ms.

## Excluded Scope

- Detalles generales, proveedor, activos, adjuntos, documentos y listado.
- Cambiar contratos backend, permisos institucionales o el boundary de vista.
- Corregir la deuda técnica existente del listado de registros.
- Crear un formulario global, ARIA tabs o compatibilidad legacy.

## Constraints

- Cliente es obligatorio; el arreglo de usuarios relacionados siempre existe
  en payload, pero puede estar vacío.
- Al cambiar cliente se limpian usuarios y se cargan solo los relacionados con
  el nuevo cliente.
- El intervalo siempre incluye años, meses, semanas y días, con enteros no
  negativos y `0` válido.
- Fechas y políticas son opcionales y se envían como `null` cuando están
  vacías. Backend calcula la fecha estimada si recibe `null` y cuenta con
  recepción e intervalo.
- La fecha estimada se muestra editable, se calcula localmente como ayuda y
  puede ser sobrescrita; al borrarla se delega el cálculo a backend.
- Escritorio usa campos horizontales; móvil, campos apilados.

## Acceptance Criteria

- La navegación muestra `Detalles generales` y `Cliente y compromiso de
entrega`, desplaza a la sección y destaca la visible sin usar tabs ARIA.
- El bloque presenta los valores canónicos en lectura. Sin `UPDATE` no ofrece
  edición; con `UPDATE`, su edición no altera el modo ni draft del primer
  bloque.
- Cliente, usuarios relacionados, fechas, intervalo y políticas respetan el
  contrato y validaciones definidos.
- El guardado emite una sola petición PUT contractual, evita doble envío y
  reemplaza el detalle canónico con la respuesta sin GET adicional.
- Éxito, cancelación y error preservan el patrón de formulario ya validado.
- Las opciones, estado y thunks pertenecen solo a `customer-service-records`.

## Open Decisions

Ninguna.
