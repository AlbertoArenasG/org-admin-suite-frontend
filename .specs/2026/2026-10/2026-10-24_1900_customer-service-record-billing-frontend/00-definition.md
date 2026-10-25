# Facturación de registros de servicio a clientes en Next Dashboard

## Estado

- Initiative: customer-service-record-billing-frontend
- Definition status: completed
- Implementation ready: yes
- Implementation status: completed
- Validation status: pending
- Spec status: in_progress

## Problema y resultado

El personal administrativo necesita enviar registros de servicio a facturación con una acción que explique el aviso por correo. El personal de facturación necesita consultar los registros enviados, editar sus facturas y marcarlos como facturados. La UI debe expresar esas acciones, en vez de exponer directamente todas las transiciones permitidas por el backend.

## Alcance

- Listado administrativo: columna visible de estado de facturación, filtro de tres estados en el diálogo de filtros existente y acción de fila «Enviar a facturación» solo para NOT_SUBMITTED y con UPDATE. Mantener búsqueda, filtros, orden, paginación, selección de columnas y preferencias vigentes.
- Detalle administrativo: mostrar estado y último intento de aviso; ofrecer la misma acción de envío solo para NOT_SUBMITTED y UPDATE; conservar la edición de referencia y archivos de factura. El header compacto añade el nombre del cliente junto al contexto del equipo.
- Nuevo grupo visual «Facturación» y entrada «Registros de servicio a clientes», visibles con BILLING_CUSTOMER_SERVICE_RECORDS/READ. No existe permiso padre del grupo en API.
- Listado de facturación: tabla enfocada en consecutivo, cliente, equipo, tipo de servicio y estado de facturación; búsqueda, paginación, menú/contexto/doble clic/enlace a detalle y diálogo de filtros con SUBMITTED e INVOICED. Ambos estados visibles por defecto.
- Detalle de facturación: contexto del servicio, cliente, equipo, fechas y documentos en lectura. Omitir el bloque de seguimiento al proveedor, sus reglas, grupos destinatarios y políticas de notificación/estatus; aunque lleguen en la respuesta API, no son relevantes para el personal de facturación. Mostrar el estado de facturación y el estado/fecha del último correo que avisó a facturación; este aviso es distinto del seguimiento al proveedor. Editar solo referencia y archivos de factura con UPDATE. El header compacto incluye cliente.
- Factura: permitir «Guardar cambios» en SUBMITTED como avance y «Guardar y marcar como facturado» como acción explícita. Esta última exige al menos un archivo, guarda la factura y después cambia a INVOICED. Si el segundo paso falla, reconocer que la factura ya se guardó y permitir reintentar solo el cambio de estado. En INVOICED, la edición sigue disponible pero no puede dejar la factura sin archivos. La validación del último archivo aplica en ambos módulos.
- Traducciones ES/EN, feedback local, estados de carga/error/vacío, responsive, teclado, lector de pantalla y temas activos. Registrar adopción en docs/ui/adoption-log.md al implementar.

## Exclusiones

- Cambios de API, dominio, persistencia, migraciones, correos, seed, PWA y portal de clientes externos.
- Selector libre de los tres estados en administración, reenvío de correo y transición inversa visible desde facturación. El backend conserva sus transiciones.
- Cambio automático de estado por guardar la factura; acción «Marcar como facturado» desde la fila; ordenamiento de columnas del listado de facturación, no soportado por su endpoint actual.
- Ampliar DataTable, ResourceForm, AttachmentUploadDialog u otras primitives genéricas por este caso.

## Contrato y acceso

Fuente viva: docs/frontend/customer-service-record-billing-handoff.md del repositorio API. Administración usa exclusivamente CUSTOMER_SERVICE_RECORDS/READ y UPDATE; facturación usa exclusivamente BILLING_CUSTOMER_SERVICE_RECORDS/READ y UPDATE. Cada ruta nueva declara DashboardViewAccessBoundary. POST /v1/files requiere JWT y no un permiso funcional adicional. Las opciones de políticas, proveedores y grupos pertenecen a otras capabilities; el detalle de facturación no depende de ellas.

## Criterios de aceptación

1. Un usuario sin READ de facturación no ve su entrada ni monta sus rutas. UPDATE controla acciones de factura y estado sin afectar la lectura. El acceso administrativo y el de facturación son independientes.
2. El listado administrativo muestra el estado localizado, filtra NOT_SUBMITTED, SUBMITTED o INVOICED mediante el diálogo estándar y conserva los criterios en URL y Zustand. Solo una fila NOT_SUBMITTED con UPDATE ofrece «Enviar a facturación».
3. El envío requiere confirmación que explique el correo; bloquea dobles intentos. Ante éxito actualiza el detalle/listado. Ante 502 conserva NOT_SUBMITTED y muestra el error y el último intento fallido; ante conflicto no afirma que el correo no salió.
4. El grupo «Facturación» contiene el listado. Su búsqueda y filtro de dos estados se reflejan en URL; sin filtro se ven ambos. La tabla navega al detalle mediante enlace, menú, clic derecho y doble clic seguro.
5. El detalle de facturación expone información operativa legible y documentos; no presenta seguimiento al proveedor, reglas, grupos destinatarios ni políticas, y no consulta sus endpoints auxiliares. Sus únicos controles de edición son factura y marcado como facturado, sujetos a UPDATE.
6. Guardar factura en SUBMITTED no cambia el estado. Guardar y marcar exige al menos un archivo y ejecuta PUT invoice seguido de PATCH billing-status. Si PUT falla no se hace PATCH; si PATCH falla tras PUT, se conserva la factura guardada y se puede reintentar solo PATCH.
7. En INVOICED, ambas vistas permiten actualizar referencia y archivos pero impiden guardar una factura sin archivos. No hay retorno de estado ni reenvío en la UI.
8. Ambos detalles muestran cliente en el header compacto, sin cambiar el header del portal. Estados de carga, error, 404, foco, móvil y temas conservan los patrones de Next Dashboard.

## Decisiones abiertas

Ninguna de producto. El registro de artefactos, las dependencias de shell, las rutas, los permisos, el estado y la matriz de validación quedaron auditados para iniciar implementación. `Implementation ready: yes` no implica que el código o las validaciones de la nueva interfaz estén completados.
