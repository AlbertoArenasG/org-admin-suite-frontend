# Análisis

## Estado actual

- Administración ya vive en /dashboard/customer-service-records y /dashboard/customer-service-records/[recordId], con DataTable, ResourceForm, permisos de vista y factura editable. No mapea billing_status ni billing_notification.
- La tabla administra filtros en useCustomerServiceRecordsTableStore y customerServiceRecordsQuery, sincronizados con URL; el feature Redux posee lista, detalle, opciones y mutaciones.
- CustomerServiceRecordDocumentForm reutiliza AttachmentUploadDialog, DocumentCollection y visores. Su flujo actual solo tiene una acción de guardar; el caso de facturación requiere dos intenciones y recuperación tras fallo parcial, dentro del módulo, sin ampliar primitives genéricas.
- CustomerServiceRecordAssetPageHeader ya compone PageHeader compacto y también lo consume el portal. El nombre del cliente será prop opcional para administración y facturación.
- El backend implementa dos módulos de permisos, dos familias de rutas y respuestas equivalentes de lista/detalle. La lista de facturación no incluye invoice; el detalle sí. El filtro de facturación admite solo SUBMITTED e INVOICED; no ofrece ordenamiento por columna.
- POST /v1/files requiere JWT, no FILES/\*; máximo diez archivos por petición y 20 MiB por archivo. La API de facturación no obliga a conservar un archivo al marcar INVOICED; esa regla de esta primera versión pertenece a la UI.

## Hallazgo de permisos del detalle

El detalle administrativo obtiene nombres de políticas y grupos desde endpoints de opciones auxiliares. billing_customer_service_records/READ no concede esas capabilities y el detalle de facturación solo devuelve sus IDs. Además, el personal de facturación no necesita el seguimiento al proveedor ni sus notificaciones. Por decisión de producto, la nueva vista omite por completo ese bloque, sus reglas, grupos y políticas; conserva el contexto del servicio, cliente, equipo, fechas y documentos. No reutilizar el contenedor administrativo, que dispara esas consultas. Reutilizar primitives y mapeos puros sin compartir el fetching ni las slices protegidas de cada módulo.

## Riesgos y tratamiento

- Envío de correo: 502 indica fallo del proveedor y conserva estado; 409 después de un correo aceptado puede dejar incierto si salió. Mostrar el resultado observado y permitir verificar antes de reintentar.
- Guardado en dos pasos: la factura puede quedar persistida si falla PATCH. Mantener snapshot confirmado, bloquear reenvío de archivos y ofrecer reintento exclusivo de estado.
- Filtros activos: tras enviar a facturación una fila puede desaparecer de NOT_SUBMITTED. Refrescar la lista preservando sus criterios y explicar el resultado.
- Documento INVOICED: la validación de mínimo un archivo es UI; el contrato de API sigue admitiendo arreglo vacío. Aplicarla en ambos editores sin crear un guard global ficticio.
- Roles separados: quien solo lee facturación no debe disparar GET administrativos; 401/403/404 se manejan con los límites vigentes de la ruta.

## Fuentes vivas

- API: docs/frontend/customer-service-record-billing-handoff.md y docs/authorization/feature-permission-catalog.md.
- Frontend: docs/ui/dashboard-shell/guidelines.md, docs/ui/patterns/data-table.md, docs/ui/recipes/resource-form.md, docs/ui/tokens.md y docs/ui/adoption-log.md.
