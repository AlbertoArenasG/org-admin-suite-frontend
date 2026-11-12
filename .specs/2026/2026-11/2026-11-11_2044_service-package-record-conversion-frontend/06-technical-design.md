# Diseño técnico

## Contrato e Impacto Entre Repositorios

Consumidor: `servicePackagesRecords`. Fuente: `../org-admin-suite-api/docs/frontend/service-package-record-conversion-handoff.md`. No se cambia API; se consume `GET /v1/service-packages/records/:id`, `POST /v1/service-packages/records/:id/customer-service-records`, y opciones de `/v1/customers/options`, `/v1/customers/:customerId/users/options`, `/v1/customer-service-record-service-types/options`. Se envían exactamente los equipos del origen y `photo_file_ids` elegidos. El usuario valida manualmente contra backend; frontend verifica estructura y compilación.

## Estado y composición

Redux posee origen remoto, opciones y estado/resultado de la conversión. Los thunks llaman API; el slice administra sus transiciones. React Hook Form administra el borrador por equipo. React local administra paso activo y confirmación de salida. No se crea store persistente para datos que deben morir al salir.

La ruta `/dashboard/service-packages-records/[recordId]/convert` usa `DashboardViewAccessBoundary`, `DashboardPageComposition`, `DashboardPageContentScroller`, `ResourceFormFrame`, `Stepper` y campos genéricos. El scroller de página es el único dueño del scroll vertical; la referencia usa sticky en escritorio dentro del flujo de página, sin scroll interno. En móvil, la referencia aparece antes del formulario. El resumen confirma cantidad de registros y fotos por equipo.

## Registro de Artefactos

| Artefacto                                                                      | Tipo                    | Ubicación                                                                        | Responsabilidad                           | Dependencias       | Estado         |
| ------------------------------------------------------------------------------ | ----------------------- | -------------------------------------------------------------------------------- | ----------------------------------------- | ------------------ | -------------- |
| `page.tsx`                                                                     | ruta                    | `src/app/dashboard/service-packages-records/[recordId]/convert/page.tsx`         | declarar acceso READ y CONVERT            | boundary, wizard   | new            |
| `dashboardShellMigration.ts`                                                   | configuración           | `src/components/dashboard-shell/migration/dashboardShellMigration.ts`            | registrar ruta y breadcrumbs              | shell              | modify         |
| `ServicePackageRecordConversionPage.tsx`                                       | componente de módulo    | `src/components/servicePackagesRecords/ServicePackageRecordConversionPage.tsx`   | orquestar datos, pasos y resultado        | Redux, form, shell | new            |
| `ServicePackageRecordConversionSource.tsx`                                     | componente de módulo    | `src/components/servicePackagesRecords/ServicePackageRecordConversionSource.tsx` | presentar origen siempre accesible        | detalle            | new            |
| `ServicePackageRecordConversionStep.tsx`                                       | componente de módulo    | `src/components/servicePackagesRecords/ServicePackageRecordConversionStep.tsx`   | capturar equipo y fotos                   | forms, stepper     | new            |
| `servicePackageRecordConversionSchema.ts`                                      | schema/mapper           | `src/components/servicePackagesRecords/servicePackageRecordConversionSchema.ts`  | validar y construir payload               | zod, contrato      | new            |
| `useServicePackageRecordRowActions.tsx`                                        | hook                    | `src/components/servicePackagesRecords/useServicePackageRecordRowActions.tsx`    | acción protegida                          | permiso, router    | modify         |
| `DataTable.types.ts`, `DataTableRowActions.tsx`, `DataTableRowContextMenu.tsx` | contrato/hosts          | `src/components/data-table/`                                                     | acción `disabled` opcional en ambos menús | DataTable          | modify         |
| `ServicePackageRecordReadOnlySections.tsx`                                     | componente de módulo    | `src/components/servicePackagesRecords/ServicePackageRecordReadOnlySections.tsx` | mostrar estado de conversión en detalle   | detalle            | modify         |
| `types.ts`, `servicePackagesRecordsMappers.ts`                                 | tipo/mapper             | `src/features/servicePackagesRecords/`                                           | exponer conversión del origen             | API                | modify         |
| `servicePackageConversionThunks.ts`                                            | cliente API             | `src/features/servicePackagesRecords/servicePackageConversionThunks.ts`          | consultar opciones y convertir            | API, auth          | new            |
| `servicePackagesRecordsSlice.ts`, `index.ts`                                   | estado/exports          | `src/features/servicePackagesRecords/`                                           | guardar opciones y mutación               | thunks             | modify         |
| `servicePackagesRecords.json`                                                  | localización            | `src/locales/es/`, `src/locales/en/`                                             | copy ES/EN                                | i18n               | modify         |
| `breadcrumbs.json`                                                             | localización            | `src/locales/es/`, `src/locales/en/`                                             | breadcrumb de conversión ES/EN            | shell              | modify         |
| `docs/ui/adoption-log.md`                                                      | documentación           | `docs/ui/adoption-log.md`                                                        | registrar ruta nueva                      | shell              | modify         |
| `08-manual-validation.md`                                                      | validación              | carpeta de esta spec                                                             | matriz reproducible                       | usuario            | new            |
| `Stepper`, `Form*`, `ResourceForm*`                                            | componentes compartidos | `src/components/`                                                                | composición existente, sin modificaciones | diseño vigente     | reuse          |
| tema/token global                                                              | estilo                  | `docs/ui/tokens.md`                                                              | roles semánticos existentes bastan        | temas activos      | not_applicable |
| limpieza legacy/experimentos                                                   | alcance                 | ninguno                                                                          | no hay ruta previa de conversión          | —                  | not_applicable |

No se añade navegación de sidebar: la conversión es una acción contextual desde la lista. No hay componente legacy que retirar.
