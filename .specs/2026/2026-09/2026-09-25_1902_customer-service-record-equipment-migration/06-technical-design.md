# Technical Design: Customer Service Record Equipment Migration

## Ownership

Todos los tipos, mappers, thunks, estados y selectores de actualización viven
en `src/features/customer-service-records`. Ningún componente de esta vista
consume thunks, estado o endpoints de otro feature.

## Endpoint

```text
PUT /v1/customer-service-records/:recordId/assets/:assetId
```

```ts
type UpdateCustomerServiceRecordAssetRequest = {
  name: string;
  identifier: string;
  brand: string;
  model: string;
  serial_number: string;
  observations: string | null;
  intake_condition_file_ids: string[];
  delivery_condition_file_ids: string[];
  report_file_ids: string[];
};
```

El thunk recibe `recordId`, `assetId` y los valores editables. Deriva cada
arreglo de IDs de adjuntos desde el equipo canónico mostrado antes de serializar
la petición. Devuelve el detalle canónico y el reducer fulfilled lo reemplaza
atómicamente.

## State

El feature agrega estado de mutación dedicado, equivalente a los bloques
existentes:

```ts
updateAssetStatus: AsyncStatus;
updateAssetError: string | null;
```

El formulario mantiene draft y modo transitorios. La mutación limpia el error
al iniciar, conserva un error accionable al fallar y reemplaza el detalle al
cumplirse.

## UI Composition

`CustomerServiceRecordEquipmentForm` recibe el primer equipo canónico y usa
`ResourceForm` con `id="equipment"`.

| Campo                    | Input    | Obligatorio | Serialización           |
| ------------------------ | -------- | ----------- | ----------------------- |
| Equipo                   | text     | sí          | `name`                  |
| Identificación           | text     | sí          | `identifier`            |
| Marca                    | text     | sí          | `brand`                 |
| Modelo                   | text     | sí          | `model`                 |
| Serie                    | text     | sí          | `serial_number`         |
| Observaciones del equipo | textarea | no          | `observations` o `null` |

La receta existente muestra campos horizontales en escritorio y apilados en
móvil. La página pasa solo `record.assets[0]`. Si falta, presenta una sección
informativa sin controles de mutación.

## Permissions And Navigation

El boundary institucional de la página permanece sin cambios. El bloque
comprueba localmente `UPDATE` para mostrar edición; `READ` permanece en lectura.
La navegación semántica queda formada por:

```text
#general-details
#customer-delivery
#equipment
```
