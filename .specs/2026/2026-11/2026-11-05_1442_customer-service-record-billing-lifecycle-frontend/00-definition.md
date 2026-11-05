# Ciclo de facturación de registros de servicio: frontend

Definition status: completed  
Implementation ready: yes  
Implementation status: completed  
Validation status: pending  
Spec status: in_progress

## Resultado

Integrar el contrato de ciclo de facturación ya implementado en API en las vistas administrativas y de facturación de Next Dashboard. La persona administrativa puede escribir indicaciones en el diálogo de envío y editarlas después; facturación puede gestionar estado de factura, fechas, plazo, orden de compra, complementos, archivo histórico y comentarios.

## Alcance y límites

- Administración: diálogo de envío con indicaciones opcionales y precargadas, edición posterior de indicaciones en su frame; sin ampliar el resto de funciones administrativas.
- Facturación: lista con estado de factura y fecha estimada; detalle editable con datos del ciclo, orden de compra, complementos, archivado e historial y comentarios internos/externos.
- Solo `BILLING_CUSTOMER_SERVICE_RECORDS` puede leer y escribir comentarios. El portal cliente no los consume todavía. No cambiar el módulo API ni el modelo persistido.
- Mantener rutas, shell, permisos READ/UPDATE, estados de carga/error, responsive, teclado, ES/EN y temas vigentes.

## Criterios de aceptación

1. Enviar desde fila o detalle abre el diálogo especializado, carga instrucciones vigentes, permite editarlas y solo envía después de confirmar. Error de lectura impide sobrescribir instrucciones a ciegas; 502 conserva el diálogo y explica el fallo.
2. Administración muestra y edita instrucciones sin enviar correo; solo `UPDATE` puede hacerlo.
3. Lista de facturación presenta estado de factura y fecha estimada; sin datos se ve un valor vacío inteligible.
4. Detalle de facturación muestra y permite editar fechas, plazo y estado con feedback y errores. El estado se ofrece desde opciones del API; no se infiere de la fecha de pago.
5. Orden de compra y complementos usan la receta de adjuntos actual: referencia y lista de archivos, carga, guardado, error y reintento. Los complementos son recursos independientes con ID estable.
6. Archivar exige confirmación, informa un `409`, actualiza factura vigente e historial. El historial pagina y abre un snapshot de solo lectura con archivos descargables.
7. Comentarios paginan, se crean con visibilidad explícita y aparecen con su auditoría; no se editan ni eliminan. Sin `UPDATE` se leen pero no se crean.
8. Sin `READ` se usa el boundary vigente; sin `UPDATE` no se muestran acciones de mutación. Vacío, loading, error, móvil y temas se verifican manualmente.

## Decisiones abiertas

Ninguna crítica para implementación. La validación manual corresponde al usuario tras recibir el código.
