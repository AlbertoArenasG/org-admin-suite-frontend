# Decisiones

## D-01: La vista administrativa actual es referencia visual, no contrato de datos

La nueva vista se compara con el codigo vigente de detalle administrativo, no
con specs cerradas. Esto incorpora los refinamientos posteriores de timeline,
navegacion compacta y colecciones documentales. El contrato de lectura de
Client Access prevalece para alcance de datos: se omite cualquier propiedad que
no exponga, aunque exista en la vista administrativa.

## D-02: Client Access conserva propiedad de datos y estado

La ruta consume exclusivamente el endpoint de Client Access, mantiene su propio
modelo y slice de detalle, y no reutiliza thunks o entidades administrativas.
La coincidencia visual no justifica mezclar fronteras de autorizacion o datos.

## D-03: Solo lectura no simula edicion

No se pasaran opciones vacias, callbacks no-op ni `canUpdate=false` como forma
de forzar formularios administrativos editables. Se comparte presentacion
read-only o se extrae una pieza de lectura cohesionada cuando convenga. Las
acciones de documentos se omiten en origen.

## D-04: El timeline se limita al flujo visible y confiable para cliente

Incluye recepcion desde cliente y compromiso/entrega a cliente. Omite solicitud
porque su fecha es administrativa y puede no reflejar cuando el cliente pidio
realmente el servicio. No crea estados derivados de proveedor.

## D-05: No se extiende el contrato con fecha de solicitud

El endpoint individual ya proporciona todos los datos necesarios para el
detalle cliente. No se expone `requested_at` hasta que exista una necesidad de
producto y una fecha confiable para ese contexto.

## D-06: La tabla ofrece una accion inline persistente junto al folio

Se agrega una columna `Detalle` inmediatamente despues de `Folio`, fuera del
selector de columnas. Cada fila muestra un control compacto con icono de ojo y
texto `Ver detalle`. El texto es el significante principal; hover, tooltip y
foco visible lo refuerzan. Se descartan menu de tres puntos para una sola
accion, doble clic y convertir toda la fila en enlace: reducen descubribilidad
o compiten con la expansion de observaciones.

La primera implementacion no agrega comportamiento extra. Cualquier ajuste
visual posterior se evaluara como refinement despues de validacion de producto.

## D-07: Los adjuntos se consultan desde el detalle

No se muestra una columna de adjuntos en la tabla: sin una accion directa, el
conteo solo agrega densidad. El folio enlazado y la accion persistente `Ver
detalle` explicitan el acceso a la vista donde los archivos se consultan y
descargan. No se usa el desplegable de observaciones, no se listan archivos en
la tabla y no se extiende `DataTable`.
