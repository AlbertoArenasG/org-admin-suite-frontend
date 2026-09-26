# Implementation Breakdown: Customer Service Record Equipment Migration

## Feature Layer

- Extender `customerServiceRecords.types.ts` con el input de actualización de
  equipo.
- Añadir serialización del payload en el mapper del feature, incluidos los IDs
  de adjuntos.
- Añadir `updateCustomerServiceRecordAsset` a
  `customerServiceRecordsThunks.ts`.
- Añadir estado y manejo de error independientes al slice.

## Component Layer

- Crear `customerServiceRecordEquipmentSchema.ts`.
- Crear `CustomerServiceRecordEquipmentForm.tsx` con la receta de
  `ResourceForm`.
- Extender `CustomerServiceRecordDetailPage.tsx` con la sección de equipo y el
  tercer destino de navegación.
- Añadir un camino de renderizado no editable cuando falte el primer equipo.

## Locale Layer

- Añadir copys ES/EN para la sección, labels, estado no disponible, validación
  y feedback de mutación cuando sean necesarios.

## Explicit Non-Changes

- No crear componente de múltiples equipos, editor de arreglos ni alta de
  equipo.
- No crear controles de adjuntos ni modificar archivos.
- No importar desde features de clientes, proveedores, control de activos o
  legacy.
