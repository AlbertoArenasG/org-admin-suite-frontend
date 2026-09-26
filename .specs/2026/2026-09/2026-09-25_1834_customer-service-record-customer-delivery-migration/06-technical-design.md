# Technical Design: Customer Service Record Customer And Delivery Migration

## Contracts

### Options

El feature consulta sus opciones necesarias desde sus propios thunks:

- `GET /v1/customers/options` para cliente.
- `GET /v1/customers/:customerId/users/options` cuando cambia cliente.
- `GET /v1/expiration-status-policies/options` para política de estatus.
- `GET /v1/expiration-notification-policies/options` para política de
  notificación.

### Update

`PUT /v1/customer-service-records/:recordId/customer`

```ts
{
  customer: {
    customer_id: string;
    customer_user_ids: string[];
  };
  customer_delivery: {
    received_at: string | null;
    estimated_delivery_interval: {
      years: number;
      months: number;
      weeks: number;
      days: number;
    };
    estimated_delivery_at: string | null;
    delivered_to_customer_at: string | null;
    status_policy_id: string | null;
    notification_policy_id: string | null;
  };
}
```

La respuesta canónica reemplaza `detail.record`; no se hace GET adicional.

## State Changes

`CustomerServiceRecordsState` añade ramas independientes de `list` y de las
opciones del bloque de detalles:

```ts
detailCustomerOptions: {
  customers: CustomerServiceRecordOption[];
  status: CustomerServiceRecordRequestStatus;
  error: string | null;
};
detailCustomerUsers: {
  customerId: string | null;
  users: CustomerServiceRecordOption[];
  status: CustomerServiceRecordRequestStatus;
  error: string | null;
};
detailCustomerDeliveryOptions: {
  statusPolicies: CustomerServiceRecordOption[];
  notificationPolicies: CustomerServiceRecordOption[];
  status: CustomerServiceRecordRequestStatus;
  error: string | null;
};
mutations: {
  updateCustomerDeliveryStatus: CustomerServiceRecordRequestStatus;
  updateCustomerDeliveryError: string | null;
};
```

Los nombres concretos pueden ajustarse si mantienen estas responsabilidades.
Los drafts no entran a Redux.

## UI Behavior

- `CustomerServiceRecordDetailPage` mantiene carga, error, no encontrado y
  permisos existentes; monta dos secciones y la navegación.
- La navegación usa enlaces a `#general-details` y `#customer-delivery` con
  estado activo derivado de intersección. El foco llega a la sección al usar
  un enlace y el encabezado fijo no oculta su título.
- `CustomerServiceRecordCustomerDeliveryForm` contiene dos grupos visuales:
  `Cliente` y `Compromiso de entrega`.
- Cliente usa `FormCombobox`; usuarios usan multiselección opcional y solo se
  habilita después de elegir cliente. Al cambiar cliente, limpia selección y
  opciones previas antes de cargar las nuevas.
- Recepción, fecha estimada y entrega real usan `FormDateInput`. Intervalo
  usa cuatro controles numéricos no negativos. Las políticas son comboboxes
  opcionales.
- La fecha estimada se calcula localmente solo mientras no sea explícita; la
  respuesta backend es el valor definitivo tras guardar.
- Todos los campos usan `FormField orientation="responsive"`: horizontal en
  escritorio y apilado en móvil.

## Validation

- `npm run typecheck`, lint dirigido, `npm run build` y `git diff --check`.
- Matriz manual en `08-manual-validation.md`.
- No se crean pruebas unitarias.

## Registro de Artefactos

| Artefacto                       | Tipo                 | Ubicación                                                                                | Responsabilidad                        | Estado         |
| ------------------------------- | -------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- | -------------- |
| Detail customer/delivery schema | Schema de módulo     | `src/components/customer-service-records/customerServiceRecordCustomerDeliverySchema.ts` | Validar y normalizar payload           | new            |
| Customer delivery form          | Componente de módulo | `src/components/customer-service-records/CustomerServiceRecordCustomerDeliveryForm.tsx`  | Lectura, edición y feedback del bloque | new            |
| Section navigation              | Componente de módulo | `src/components/customer-service-records/CustomerServiceRecordSectionNavigation.tsx`     | Anclas semánticas y scroll spy         | new            |
| Detail page                     | Componente de módulo | `src/components/customer-service-records/CustomerServiceRecordDetailPage.tsx`            | Montar navegación y segundo bloque     | modify         |
| Feature types                   | Tipos                | `src/features/customer-service-records/types.ts`                                         | Payloads y opciones propias            | modify         |
| Feature thunks                  | Integración remota   | `src/features/customer-service-records/customerServiceRecordsThunks.ts`                  | Opciones y PUT del bloque              | modify         |
| Feature slice                   | Redux                | `src/features/customer-service-records/customerServiceRecordsSlice.ts`                   | Estado remoto exclusivo del feature    | modify         |
| Feature mapper                  | Adaptador API        | `src/features/customer-service-records/customerServiceRecordMappers.ts`                  | Mapear respuesta de PUT                | modify         |
| Translations                    | Localización         | `src/locales/{es,en}/customerServiceRecords.json`                                        | Copias de sección y feedback           | modify         |
| Resource form family            | Patrón compartido    | `src/components/resource-form/*`                                                         | Se reutiliza sin cambiar contrato      | reuse          |
| Dashboard boundary              | Patrón compartido    | `src/components/dashboard-shell/*`                                                       | Se reutiliza sin cambiar contrato      | reuse          |
| Legacy detail/edit              | Compatibilidad       | N/A                                                                                      | No aplica; no se restaura              | not_applicable |
