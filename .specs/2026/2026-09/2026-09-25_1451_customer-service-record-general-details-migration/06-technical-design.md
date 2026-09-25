# Technical Design: Customer Service Record General Details Migration

## Scope

- Ruta individual Next Dashboard de un registro de servicio a cliente.
- Bloque `Detalles generales`: tipo de servicio, fecha de solicitud, estado
  operativo y observaciones generales.

## Contracts

### Read

`GET /v1/customer-service-records/:recordId`

- Permission: `CUSTOMER_SERVICE_RECORDS/READ`.
- Input: `recordId` opaco de URL.
- Output: registro completo. El mapper conserva el modelo canónico completo;
  esta spec renderiza solo los datos de `details`.

### Detail Options

`GET /v1/customer-service-record-service-types/options`

- Permission: la provista por backend para catálogo.
- Output: opciones `{ code, name }` para `FormCombobox`.
- Operational status: catálogo local con los códigos `PENDING`, `IN_PROGRESS`,
  `COMPLETED`, `CANCELLED`; no produce petición HTTP.

### Update

`PUT /v1/customer-service-records/:recordId/details`

- Permission: `CUSTOMER_SERVICE_RECORDS/UPDATE`.
- Request body:

```ts
{
  service_type_code: string;
  requested_at: string; // yyyy-mm-dd
  observations: string | null;
  operational_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
```

- Response: registro canónico completo que reemplaza `detail.record`.

## State Changes

`CustomerServiceRecordsState` añade ramas independientes de `list`:

```ts
detail: {
  record: CustomerServiceRecordDetail | null;
  status: CustomerServiceRecordRequestStatus;
  error: string | null;
  currentRecordId: string | null;
};
detailOptions: {
  serviceTypes: CustomerServiceRecordOption[];
  status: CustomerServiceRecordRequestStatus;
  error: string | null;
};
mutations: {
  // Existing creation and deletion state remains unchanged.
  updateDetailsStatus: CustomerServiceRecordRequestStatus;
  updateDetailsError: string | null;
};
```

- `CustomerServiceRecordDetail` y `UpdateCustomerServiceRecordDetailsPayload`
  se declaran en `types.ts`.
- `customerServiceRecordMappers.ts` traduce API snake_case a modelos internos.
- `customerServiceRecordsThunks.ts` exporta `fetchCustomerServiceRecordDetail`,
  `fetchCustomerServiceRecordDetailOptions` y
  `updateCustomerServiceRecordDetails`.
- Draft y estado de edición se mantienen locales en el formulario; Redux no
  recibe valores transitorios ni errores de campo.

## UI Behavior

- `page.tsx` compone exclusivamente el `DashboardViewAccessBoundary`.
- `CustomerServiceRecordDetailPage` resuelve params, carga, reintento,
  not-found, breadcrumb y composición Next Dashboard.
- `NextDashboardBreadcrumbProvider` conserva los segmentos configurados por
  ruta y expone una actualización temporal al contenido. La página registra
  el folio al cargar y restablece el breadcrumb estático al desmontarse.
- Sin header de página, el breadcrumb muestra `Servicios a clientes / Registros
de servicio / Registro {folio}`.
- Durante carga se usa `ResourceFormSkeleton`; error ofrece reintento; un
  registro ausente se presenta como not-found.
- `CustomerServiceRecordGeneralDetailsForm` es un formulario único e
  independiente para el bloque. En read mode usa `FormReadValue`; en edit mode
  usa `FormCombobox`, `FormDateInput`, selector de estado operativo y
  `Textarea`.
- Los campos usan `FieldGroup` y `FormField orientation="responsive"`:
  horizontal en escritorio, apilado en móvil.
- El botón Editar solo existe con `can('UPDATE')`. Cancelar reinicia RHF desde
  el registro canónico. Guardar bloquea doble submit.
- `ResourceFormActions` sustituye acciones por `MutationFeedback` al guardar y
  al tener éxito. A los 800 ms, actualiza modo a lectura, muestra toast y
  limpia feedback. Error muestra `MutationRecovery` sin perder draft.

## Registro de Artefactos

| Artefacto                                 | Tipo                         | Ubicación                                                                                  | Responsabilidad                                                                                       | Dependencias                                            | Estado         |
| ----------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------- |
| Customer service detail route             | Ruta App Router              | `src/app/dashboard/customer-service-records/[recordId]/page.tsx`                           | Aplicar boundary READ y montar la vista individual                                                    | `DashboardViewAccessBoundary`, página del módulo        | new            |
| NextDashboardBreadcrumbContext            | Contexto compartido de shell | `src/components/dashboard-shell/migration/NextDashboardBreadcrumbContext.tsx`              | Permitir que una ruta Next Dashboard reemplace temporalmente segmentos dinámicos del Workspace Header | `PageBreadcrumbs`, React Context                        | new            |
| Next dashboard shell                      | Composición compartida       | `src/components/dashboard-shell/migration/NextDashboardShell.tsx`                          | Proveer y renderizar breadcrumb dinámico sin alterar la estructura del Workspace Header               | Contexto de breadcrumb, configuración de migración      | modify         |
| Shell migration policy                    | Configuración de rutas       | `src/components/dashboard-shell/migration/dashboardShellMigration.ts`                      | Adoptar patrón `[recordId]` con `page-content` y segmentos estáticos base                             | NextDashboardShell                                      | modify         |
| CustomerServiceRecordDetailPage           | Componente de módulo         | `src/components/customer-service-records/CustomerServiceRecordDetailPage.tsx`              | Coordinar carga, estados de pantalla, breadcrumb y bloque visible                                     | Feature state, `ResourceFormRoute`, dashboard shell     | new            |
| CustomerServiceRecordGeneralDetailsForm   | Componente de módulo         | `src/components/customer-service-records/CustomerServiceRecordGeneralDetailsForm.tsx`      | Encapsular lectura, edición, draft, validación y feedback del bloque                                  | RHF, schema, ResourceForm, inputs, callback de mutación | new            |
| customerServiceRecordGeneralDetailsSchema | Schema de módulo             | `src/components/customer-service-records/customerServiceRecordGeneralDetailsSchema.ts`     | Validar y normalizar los cuatro valores editables                                                     | Zod, tipos del feature                                  | new            |
| FormDateInput                             | Control compartido           | `src/components/forms/FormDateInput.tsx`                                                   | Reflejar error externo de React Hook Form mediante `aria-invalid`                                     | FormField, React Hook Form                              | modify         |
| customerServiceRecordMappers              | Adaptador API                | `src/features/customer-service-records/customerServiceRecordMappers.ts`                    | Mapear respuestas completas backend a modelo canónico                                                 | Tipos API e internos                                    | new            |
| Feature types                             | Tipos de feature             | `src/features/customer-service-records/types.ts`                                           | Declarar detalle canónico, payload de PUT y estado individual                                         | Contratos backend                                       | modify         |
| Feature thunks                            | Integración remota           | `src/features/customer-service-records/customerServiceRecordsThunks.ts`                    | Ejecutar GET, opciones y PUT del recurso individual                                                   | `jsonRequest`, auth token, mapper                       | modify         |
| Feature slice                             | Store Redux                  | `src/features/customer-service-records/customerServiceRecordsSlice.ts`                     | Persistir estado remoto individual y mutación de detalles                                             | Thunks del mismo feature                                | modify         |
| Customer service translations             | Traducciones                 | `src/locales/es/customerServiceRecords.json`, `src/locales/en/customerServiceRecords.json` | Proveer copy de ruta, bloque, campos, errores y feedback                                              | `useTranslationHydrated`                                | modify         |
| Resource form family                      | Componentes compartidos      | `src/components/resource-form/*`                                                           | Aportar composición y acciones sin cambiar su contrato                                                | Reutilización directa                                   | reuse          |
| Dashboard access boundary                 | Boundary compartido          | `src/components/dashboard-shell/*`                                                         | Resolver READ y capabilities institucionales                                                          | Reutilización directa                                   | reuse          |
| Shell migration guideline                 | Guideline                    | `docs/ui/dashboard-shell/migration.md`                                                     | Documentar el breadcrumb dinámico del Workspace Header                                                | Contexto de breadcrumb                                  | modify         |
| Resource form guideline                   | Guideline                    | `docs/ui/patterns/resource-form.md`                                                        | No aplica: se adopta el patrón sin modificarlo                                                        | N/A                                                     | not_applicable |
| Legacy detail/edit                        | Compatibilidad               | N/A                                                                                        | No aplica: ya fue retirado antes de esta spec                                                         | N/A                                                     | not_applicable |

## Validation

- `npm run typecheck`, lint dirigido, `npm run build` y `git diff --check`.
- Validación manual de matriz `08`: permisos, carga, reintento, not-found,
  lectura, edición, cancelación, éxito, error, desktop, móvil, teclado y foco.
- No se crean ni ejecutan pruebas unitarias.

## Open Questions

Ninguna.
