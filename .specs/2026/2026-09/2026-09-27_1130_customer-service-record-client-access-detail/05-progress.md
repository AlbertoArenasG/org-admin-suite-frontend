# Progreso

## 2026-09-27

- Se creo la iniciativa a partir del estado actual de la vista administrativa.
- Se verifico el endpoint individual vigente de Client Access y su control de
  visibilidad y permiso.
- Se decidio no exponer `requested_at`: la fecha administrativa de solicitud no
  es una referencia confiable para el portal. El timeline iniciara con la
  recepcion desde cliente.
- Se aclaro que el contrato de lectura de Client Access delimita la replica;
  la vista administrativa solo es referencia visual e interactiva.
- Se aprobo una entrada explicita al detalle desde la tabla: columna `Detalle`
  junto al folio, con accion inline persistente `Ver detalle`.
- Se aprobo senalizar adjuntos con su conteo y ayuda contextual, sin listarlos
  ni crear un segundo desplegable en la tabla.

## 2026-09-28

- La persona usuaria aprobo la definicion. La spec queda lista para iniciar
  implementacion desde la slice de estado remoto y tabla.
- Se completo la slice de estado remoto y tabla: modelo y thunk de detalle,
  estado aislado con cancelacion por request id, accion `Detalle`, folio
  enlazado y traducciones bilingues.
- Se completo la slice de ruta: page protegida, carga y limpieza aisladas,
  breadcrumb dinamico y reutilizacion declarativa de la navegacion responsive
  administrativa con las cuatro secciones de Client Access.
- Se completo la slice de bloques de lectura: generales, cliente y compromiso,
  equipo y timeline desde recepcion hasta entrega. No se muestran datos no
  disponibles en el contrato cliente ni hitos de proveedor.
- Se extrajo `DocumentCollectionReadOnlyItem` para reutilizar la presentacion
  documental de lectura en Client Access y en la rama administrativa de solo
  lectura, sin mezclar uploader, eliminacion ni guardado.
