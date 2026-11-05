# Análisis

El frontend ya dispone de detalle y tabla en Next Dashboard, `CustomerServiceRecordDocumentForm`, colección de documentos y diálogo especializado de envío. El mapeo de detalle y las filas no incluyen los nuevos campos de API. Los thunks actuales de facturación solo cubren lista, detalle, opciones de envío, invoice y carga de archivos. El slice ya posee lista y detalle remotos.

La API aporta endpoints separados para datos de factura, estado, orden de compra, complementos, comentarios e historial. Fuente: `../org-admin-suite-api/docs/frontend/customer-service-record-billing-handoff.md`. Ningún cambio de backend es necesario. Riesgo principal: el envío desde la tabla solo tiene datos de fila; debe leerse el detalle antes de confirmar para no limpiar instrucciones existentes. Los errores de red en mutaciones de resultado incierto requieren lectura posterior antes de ofrecer reintento.
