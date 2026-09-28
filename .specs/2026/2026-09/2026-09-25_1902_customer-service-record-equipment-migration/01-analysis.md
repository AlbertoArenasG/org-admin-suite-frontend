# Analysis: Customer Service Record Equipment Migration

## Existing Next Dashboard Baseline

- `CustomerServiceRecordDetailPage` obtiene el detalle canónico y monta
  formularios independientes de detalles generales y cliente/entrega.
- `CustomerServiceRecordSectionNavigation` usa anclas semánticas y scroll spy;
  solo requiere recibir el tercer destino `#equipment`.
- `ResourceForm` ya resuelve lectura, edición local, guardar, cancelar, error y
  el feedback de éxito de 800 ms.
- El boundary institucional de acceso protege la ruta. Cada bloque decide su
  edición local con el permiso `UPDATE` de registros de servicio.

## Canonical Equipment Data

El GET canónico expone `assets` con la forma necesaria para el bloque:

```ts
{
  assetId: string;
  name: string;
  identifier: string;
  brand: string;
  model: string;
  serialNumber: string;
  observations: string | null;
  intakeConditionFiles: {
    fileId: string;
  }
  [];
  deliveryConditionFiles: {
    fileId: string;
  }
  [];
  reports: {
    fileId: string;
  }
  [];
}
```

La interfaz toma solo `assets[0]`. Es una decisión de producto estable para
esta migración: el arreglo del backend es una capacidad futura, no un modelo de
interacción actual.

## Update Contract

El backend recibe el identificador del registro y del equipo en la ruta:

```text
PATCH /v1/customer-service-records/:recordId/assets/:assetId
```

Su body acepta solo las propiedades administradas por la subsección que guarda.
Los datos principales y cada colección documental mantienen estados, acciones y
payloads independientes; no se reconstruyen arreglos ajenos. La respuesta es
el registro canónico completo, apropiado para reemplazar el detalle presente en
el feature.

## Form Composition

El bloque adopta la receta de detalle editable de Usuario y de los dos bloques
ya migrados del registro:

- Un formulario independiente, no un formulario global de página.
- Campos horizontales en escritorio y apilados en móvil mediante los inputs
  Next Dashboard existentes.
- `Observaciones del equipo` es un textarea opcional.
- Validación local de los cinco campos obligatorios antes del PUT.
- No se requieren opciones remotas para este bloque.

## Missing Equipment

Un registro sin `assets[0]` no puede construir una ruta válida para actualizar
equipo. La página debe representar un estado informativo y no editable. Crear
un equipo, administrar una lista o convertir esa ausencia en una solicitud de
alta queda explícitamente fuera de alcance.

## Risks Addressed

- El payload de adjuntos se preserva aunque su UI se migre después.
- Cada bloque conserva su estado y mutación local para evitar acoplar formularios.
- No se consume ningún thunk de otro feature o módulo.
- La UI de un solo equipo evita introducir una capacidad no aprobada por
  producto solo porque el backend acepta un arreglo.
