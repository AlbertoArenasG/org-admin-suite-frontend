# Análisis

- Handoff: `../org-admin-suite-api/docs/frontend/service-package-record-conversion-handoff.md`. El API exige una entrada por índice de `details.equipment`, fechas ISO de día, IDs de imágenes del origen y una conversión atómica. Las fotos elegidas quedan en `assets[0].intakeConditionFiles`.
- La lista y el detalle frontend aún no modelan `converted_to_customer_service_records`. Su acción por fila vive en `useServicePackageRecordRowActions` y su estado remoto en `servicePackagesRecordsSlice`.
- `CustomerServiceRecordCreateDialog` ya usa `Stepper`, `FormCombobox`, `FormMultiSelect` y `FormDateInput`. El diálogo genérico tiene máximo de ancho 3xl; para la referencia simultánea y varios equipos conviene una ruta de página. Se reutilizan primitives sin ampliar su contrato.
- El shell requiere registrar la nueva ruta como `page-content`. El acceso usa `DashboardViewAccessBoundary`; la acción usa `useDashboardViewAccess`.
- El catálogo de recolecciones es distinto del de servicios a clientes. El endpoint local de opciones de recolección no sirve para este formulario.
- La UX debe distinguir 409, error definitivo y red incierta. El borrador solo se descarta tras confirmación explícita o éxito.
