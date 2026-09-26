# Analysis: Customer Service Record Customer And Delivery Migration

## Current State

- La ruta `[recordId]`, el boundary `READ`, el modelo canónico y el bloque de
  detalles generales ya viven en Next Dashboard.
- El GET individual ya devuelve `customer` y `customer_delivery` mapeados en
  `CustomerServiceRecordDetail`.
- La spec anterior aplazó la navegación scroll spy hasta incorporar un segundo
  bloque visible; esta iniciativa satisface esa condición.
- `customer-service-records` es la frontera del feature. La deuda del listado
  no es alcance de esta iniciativa ni justifica dependencias externas.

## Backend Contracts

- `PUT /v1/customer-service-records/:recordId/customer` exige
  `CUSTOMER_SERVICE_RECORDS/UPDATE` y devuelve el registro canónico completo.
- `customer` contiene `customer_id` y `customer_user_ids`.
- `customer_delivery` contiene `received_at`,
  `estimated_delivery_interval`, `estimated_delivery_at`,
  `delivered_to_customer_at`, `status_policy_id` y
  `notification_policy_id`; sus llaves siempre son requeridas en body.
- El intervalo tiene `years`, `months`, `weeks` y `days`, todos enteros
  no negativos.
- Backend calcula `estimated_delivery_at` cuando llega `null`, con base en
  `received_at` e intervalo.
- Existen endpoints de opciones para clientes, usuarios relacionados por
  cliente, políticas de estatus y políticas de notificación.

## Findings

- Cliente y compromiso de entrega deben vivir en un formulario independiente
  porque backend los persiste atómicamente en el mismo PUT.
- El reemplazo de la respuesta PUT actualiza el recurso compartido; cada
  formulario conserva solo su draft y modo local.
- La navegación debe ser de anclas y no `role=tablist`: ambas secciones están
  simultáneamente en el documento y el scroll cambia la sección activa.

## Risks

- Reutilizar thunks, estado u opciones de clientes, relaciones o políticas de
  otros features rompería la frontera del módulo.
- Tratar intervalo como opcional puede producir bodies inválidos.
- Hacer la fecha estimada solo de lectura impediría la fecha explícita que
  backend admite.
- Cambiar los contratos compartidos de `ResourceForm` o del boundary amplía el
  alcance sin necesidad.
