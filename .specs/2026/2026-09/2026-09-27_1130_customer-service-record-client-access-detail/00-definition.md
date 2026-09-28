# Detalle De Registro De Servicio En Client Access

## Estado

- Definition status: completed
- Implementation ready: yes

## Problema

El portal de acceso a cliente solo ofrece el listado de servicios. Quien tiene
permiso de lectura puede identificar un registro, pero no consultar el detalle
con la misma jerarquia, navegacion, timeline y documentos que ya existen en la
vista administrativa actual.

## Resultado Esperado

Agregar `/dashboard/portal/services/[recordId]` como detalle de solo lectura.
Replica la composicion y experiencia vigente del detalle administrativo solo
para los datos expuestos por el contrato de lectura de Client Access: detalles
generales, cliente y compromiso de entrega, equipo con sus tres colecciones,
documentos raiz y timeline. Excluye proveedor, seguimiento y cualquier dato
que el contrato cliente no publique, incluidos sus hitos.

## Alcance

Incluido:

- Ruta, breadcrumb y boundary `READ` del modulo
  `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS`.
- Entrada explicita desde la tabla: columna `Detalle`, no ocultable y situada
  junto al folio, con accion persistente `Ver detalle`.
- Acceso al detalle mediante el folio enlazado y la accion persistente
  `Ver detalle`; los adjuntos se consultan y descargan dentro de esa vista.
- Carga, skeleton, error con reintento, vacio/no encontrado y limpieza de
  estado del detalle remoto de Client Access.
- Navegacion lateral, navegacion compacta flotante y breakpoints equivalentes
  a la vista administrativa, pero sin proveedor.
- Bloques visuales de lectura: generales, cliente y compromiso, equipo,
  documentos raiz y timeline sin hitos de proveedor.
- Apertura/cierre de colecciones, preview de imagenes y descarga de adjuntos
  para usuarios con permiso `READ`.

Excluido:

- Cualquier mutacion, modo de edicion, carga, eliminacion o reemplazo de
  adjuntos.
- Datos, navegacion, hitos, permisos o solicitudes del bloque de proveedor.
- Cambiar recetas, tokens o contratos de `ResourceForm` y `DocumentCollection`.
- Refinamientos visuales posteriores a la primera evaluacion de producto.

## Restricciones

- El codigo actual de `/dashboard/customer-service-records/[recordId]` es la
  referencia visual y de interaccion, no sus specs historicas.
- El contrato de `GET /v1/customer-service-records-client-access/:recordId` es
  el limite de datos: la referencia administrativa no autoriza solicitar,
  inferir ni representar propiedades que el contrato cliente no exponga.
- La ruta cliente es propietaria de su estado, tipos, thunk y mapeador; no
  reutiliza el slice administrativo ni consume sus endpoints.
- La experiencia reutiliza primitives y recetas vigentes. No se fuerza el uso
  de formularios administrativos que requieren opciones o mutaciones para
  renderizar lectura.
- La visibilidad de detalle permanece resuelta en backend para el actor y sus
  clientes autorizados. El frontend no infiere autorizacion por datos de lista.
- Preview y descarga siguen disponibles en lectura; las acciones de edicion no
  se renderizan.

## Gate De Implementacion

Aprobado el 28 de septiembre de 2026. No hay decisiones de producto,
arquitectura, contrato ni composicion pendientes para iniciar implementacion.

## Criterios De Aceptacion

1. Una persona con `READ` puede abrir un registro visible desde Client Access y
   consultar todos los bloques permitidos sin controles de edicion.
2. El detalle no muestra proveedor, seguimiento ni hitos de entrega o retorno
   a proveedor.
3. La navegacion de escritorio, la flotante de tablet y el ocultamiento de
   timeline respetan los mismos breakpoints y ownership de scroll que el
   detalle administrativo vigente.
4. Cada coleccion documental conserva fila compacta, tooltip, teclado,
   expand/collapse, preview de imagen y descarga; no ofrece editar, remover ni
   cargar archivos.
5. El timeline inicia con la recepcion desde cliente y no infiere un hito de
   solicitud a partir de una fecha que el cliente podria no haber capturado.
6. Carga, error/reintento, recurso inexistente o no visible y traducciones en
   espanol/ingles se muestran sin datos administrativos ni fallbacks en un solo
   idioma.
7. La tabla de Client Access expone una accion persistente `Ver detalle` junto
   al folio; no usa menu de tres puntos, doble clic ni navegacion por toda la
   fila.
