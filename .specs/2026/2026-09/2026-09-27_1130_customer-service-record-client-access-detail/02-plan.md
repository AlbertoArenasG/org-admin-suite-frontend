# Plan

## Fase 1: Estado De Detalle

1. Crear tipo API, modelo de detalle, mapeador, thunk y estado `detail` en el
   feature de Client Access.

## Fase 2: Ruta Y Composicion

1. Agregar a la tabla la accion `Detalle` junto al folio, con accion inline
   persistente y folio enlazado; crear la page con boundary, breadcrumbs
   dinamicos, carga, error, ausencia y limpieza.
2. Extraer solamente la configuracion reusable necesaria de la ruta de detalle
   administrativo para recibir una lista de items de navegacion, conservando
   sus breakpoints y su navegacion compacta.
3. Implementar los cuatro bloques permitidos y el timeline cliente desde la
   recepcion, sin hito de solicitud.

## Fase 3: Documentos Y Validacion

1. Separar la presentacion documental de lectura de la variante editable, sin
   cambiar la receta documental ni introducir callbacks vacios.
2. Confirmar preview/descarga, navegacion por teclado, responsive y ausencia
   total de proveedor/edicion.
3. Actualizar docs vivos solo si la extraccion cambia un contrato reusable;
   registrar la adopcion de la nueva vista.
