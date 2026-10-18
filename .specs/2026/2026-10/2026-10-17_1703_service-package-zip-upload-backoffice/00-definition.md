# Carga De ZIP Desde Backoffice

## Estado

- Initiative: `service-package-zip-upload-backoffice`
- Definition status: `completed`
- Implementation ready: `yes`
- Implementation status: `completed`
- Validation status: `completed`
- Spec status: `completed`

## Problema Y Resultado

La PWA permite exportar ZIP de visitas, pero el personal administrativo no
tiene una via en Next Dashboard para cargar ese respaldo cuando falla la
sincronizacion desde el dispositivo. La lista de Recepcion, Recoleccion y
Entrega debe ofrecer una accion primaria `Cargar ZIP` que confirme de forma
visible lo que respondio la API, sin confundir una respuesta ausente con un
fallo definitivo.

## Alcance

- En `/dashboard/service-packages-records`, accion primaria en la toolbar y
  dialogo responsivo para elegir un ZIP de la PWA, revisar el archivo y enviar
  una vez por intento.
- Envio al endpoint vigente con `origin=backoffice`: seleccion local del
  archivo y ciclo remoto de la mutacion en el feature Redux existente, con
  resultado visible en el dialogo.
- En exito, mostrar `package_id`, numero de registros y folios confirmados,
  mantener el resultado visible hasta cierre explicito y refrescar la lista.
- Conservar filtros, busqueda, pagina y preferencias de tabla al refrescar.
- Copia en espanol e ingles, accesibilidad, temas activos y validacion manual.

## Fuera De Alcance

- Cambios de API, autorizacion, permisos de creacion, PWA o formato del ZIP.
- Idempotencia, reconciliacion de cargas parciales, progreso de bytes o
  consulta del estado de un intento.
- Stepper, toast como unico feedback, carga multiple, reintento automatico,
  cambios a DataTable o a sus primitives compartidas.

## Acceso Y Compatibilidad

La ruta ya exige `SERVICE_PACKAGES.READ`; quien puede verla ve la accion. El
upload sigue publico en backend; la visibilidad UI no lo protege. La PWA
actual sigue sin `origin` y no requiere actualizacion. No se alteran acciones
por fila, detalle, filtros ni borrado.

## Criterios De Aceptacion

1. La accion primaria es visible en la tabla para usuarios con READ y abre un
   dialogo que acepta exactamente un archivo `.zip` no vacio.
2. Confirmar envia `multipart/form-data` con campo `package` y query
   `origin=backoffice`; no se fuerza `Content-Type` para conservar el boundary.
3. Durante el envio hay estado anunciado y no se permite duplicar la peticion
   ni cerrar accidentalmente el dialogo.
4. HTTP 201 con envelope valido muestra `package_id`, conteo y folios de
   `services[]`; la tabla se reconsulta y el dialogo permanece hasta `Cerrar`.
5. Error HTTP muestra el mensaje disponible, advierte que puede haber carga
   parcial y recomienda verificar el listado antes de repetir.
6. Fallo de red, abort inesperado o respuesta 2xx no interpretable se muestra
   como resultado incierto; nunca afirma que el backend no proceso el ZIP ni
   reintenta automaticamente.
7. La vista y el dialogo funcionan con teclado, lector de pantalla, movil y
   temas activos, sin alterar DataTable ni requerir una ruta nueva.

## Decisiones Abiertas

Ninguna critica. El limite efectivo de tamano de la infraestructura no esta
publicado; no se inventa uno de producto. El selector reutilizado tiene un
default de 500 MB que este flujo debe desactivar mediante su prop configurable,
sin modificar el componente compartido. La validacion manual incluira un ZIP
realista de la PWA.
