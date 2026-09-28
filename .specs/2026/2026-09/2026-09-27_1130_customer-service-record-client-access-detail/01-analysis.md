# Analisis

## Base Vigente

La referencia visual e interactiva es
`src/components/customer-service-records/CustomerServiceRecordDetailPage.tsx`.
Compone cinco anclas: generales, cliente/entrega, equipo, documentos y
proveedor. Su `CustomerServiceRecordDetailRoute` resuelve layout, navegacion
normal, navegacion compacta y scroll; `ResourceFormRoute` controla responsive
y scroll.

La referencia administrativa no define los datos permitidos. El contrato de
lectura individual de Client Access define el limite de la replica; cualquier
dato ausente se omite en lugar de reconstruirse o inferirse desde equivalentes
administrativos.

Las primitives ya reutilizables son `ResourceFormFrame`, `ResourceFormSection`,
`DocumentCollection`, `DocumentCollectionList`, `DocumentCollectionItem`,
`AttachmentImageGalleryDialog` y el listado de adjuntos de
`CustomerServiceRecordDocumentForm`. La ultima pieza mezcla lectura y edicion,
por lo que el detalle cliente requiere separar o introducir una presentacion de
lectura que no reciba callbacks de mutacion ficticios.

## Estado De Client Access

- La lista vive en `/dashboard/portal/services` y tiene estado remoto propio en
  `features/customer-service-records-client-access`.
- Ya existe `GET /v1/customer-service-records-client-access/:recordId`, protegido
  con `READ` y filtrado por visibilidad del actor en backend.
- El endpoint individual expone usuarios del cliente, datos de equipo,
  colecciones de adjuntos, documentos raiz y URL de preview/descarga. La lista
  omite deliberadamente esos detalles.
- La fecha administrativa de solicitud no se expone ni se usara en el portal:
  puede coincidir con el registro interno y no ser una referencia confiable
  para el cliente. El timeline cliente inicia con la recepcion desde cliente.

## Riesgos Controlados

- Reusar el detalle administrativo como contenedor acoplaria permisos,
  mutaciones, opciones de formulario y datos de proveedor. Se descarta.
- Duplicar la geometria de navegacion o filas documentales permitiria
  divergencia responsive. Se reutilizan o extraen los primitives existentes.
- Reutilizar un tipo administrativo ocultando `provider` produciria una falsa
  representacion de la respuesta remota. Client Access tendra su propio modelo
  de detalle y mapeador.
- La tabla actual no tiene entrada al detalle. Una fila completamente clicable
  compite con su expansion de observaciones; un menu de una sola accion reduce
  descubribilidad para usuarios no tecnicos.
- La respuesta de listado ya incluye `attachments_count`, pero el modelo y el
  mapeador frontend actuales no lo consumen. Puede señalizar disponibilidad sin
  listar archivos ni requerir una nueva consulta.
