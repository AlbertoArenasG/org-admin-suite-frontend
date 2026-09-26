# Definition: Customer Service Record Equipment Migration

## Initiative

- Name: `customer-service-record-equipment-migration`
- Date: `2026-09-25`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La vista individual Next Dashboard ya cuenta con bloques independientes para
`Detalles generales` y `Cliente y compromiso de entrega`. Falta migrar los
datos del equipo del registro, sin restaurar detalle o edición legacy.

## Expected Outcome

La misma ruta individual incorpora una tercera sección, `Equipo`, que muestra
y actualiza un único equipo mediante
`PUT /v1/customer-service-records/:recordId/assets/:assetId`.

## Migration Mandate

Esta iniciativa extiende exclusivamente la vista individual Next Dashboard.
No restaura, adapta, reutiliza ni imita rutas, componentes, payloads, estado,
formularios, permisos o estilos legacy. Cada llamada remota, mapper, tipo y
estado de este bloque vive en `customer-service-records`; no puede importar,
despachar ni leer thunks o estado de otro feature.

## Included Scope

- Añadir la sección independiente `Equipo` a la vista individual.
- Extender la navegación existente a tres anclas semánticas con scroll spy.
- Mostrar y editar únicamente el primer equipo canónico del registro.
- Editar nombre, identificación, marca, modelo, serie y observaciones del
  equipo conforme al contrato backend.
- Preservar los identificadores de adjuntos existentes al actualizar el equipo,
  sin exponer interfaz de adjuntos.
- Aplicar la receta vigente de `ResourceForm`, permisos locales, recuperación,
  toast y feedback de éxito de 800 ms.

## Excluded Scope

- Más de un equipo en interfaz, alta o eliminación de equipos y reordenamiento.
- Adjuntos, carga, descarga o eliminación de archivos.
- Proveedor, documentos, otros bloques, listado y funcionalidades legacy.
- Cambiar contratos backend, permisos institucionales o el boundary de vista.
- Corregir detalles visuales diferidos de bloques anteriores.

## Constraints

- La interfaz representa y administra exactamente un equipo: el primer elemento
  de `record.assets`. El soporte backend de un arreglo no habilita una UI de
  múltiples equipos.
- `name`, `identifier`, `brand`, `model` y `serial_number` son obligatorios.
- `observations` es opcional y se envía como `null` cuando está vacío.
- Los tres arreglos de IDs de adjuntos son obligatorios para el endpoint y se
  reconstruyen desde el equipo canónico; este bloque no los modifica.
- Si el GET no contiene un primer equipo, la sección informa que no hay equipo
  disponible y no ofrece edición ni intenta un PUT inválido.
- Escritorio usa campos horizontales; móvil, campos apilados.

## Acceptance Criteria

- La navegación muestra tres secciones, desplaza a la sección visible y no usa
  tabs ARIA.
- El bloque muestra el primer equipo canónico en modo lectura. Sin `UPDATE` no
  ofrece edición; con `UPDATE`, su draft y modo son locales e independientes de
  los otros bloques.
- El guardado emite una sola petición PUT con el `assetId` del equipo mostrado,
  sus campos editables y los IDs de adjuntos preservados.
- La respuesta del PUT reemplaza el detalle canónico completo sin GET adicional.
- Éxito, cancelación, error, recuperación y prevención de doble envío siguen el
  patrón de formularios de detalle ya validado.
- Si falta equipo, el usuario recibe un estado seguro no editable.
- Las opciones, estado y thunks pertenecen solo a `customer-service-records`.

## Open Decisions

Ninguna.
