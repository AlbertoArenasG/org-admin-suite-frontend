# Analysis

El módulo reutilizará los patrones de `internal-asset-control`: rutas App Router,
feature Redux, thunks, contenedores de tabla, formulario, detalle, diálogos y
feedback de errores. Los lookups dependerán de capabilities ya derivadas por
backend; frontend no evaluará capabilities auxiliares.

El contrato backend incluye filtros, rangos date-only y ordenamientos. Las
fechas y semáforos se muestran como datos de negocio provenientes de API.
