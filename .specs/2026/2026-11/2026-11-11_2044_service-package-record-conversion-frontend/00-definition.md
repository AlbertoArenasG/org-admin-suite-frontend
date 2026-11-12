# Conversión de recolección a servicios a clientes

Definition status: completed
Implementation ready: yes
Implementation status: completed
Validation status: completed
Spec status: completed

## Resultado

Desde una fila de recolección, una persona con `SERVICE_PACKAGES.READ` y `SERVICE_PACKAGES.CONVERT` puede preparar exactamente un registro de servicio a cliente por equipo, asignar cliente, usuarios, tipo, fechas y fotos de condición de entrada, revisar el conjunto y confirmar una sola conversión.

## Alcance

- Ruta dedicada en Next Dashboard, enlazada desde la acción por fila. La lista y el detalle reflejan `converted_to_customer_service_records`.
- Contexto de la recolección permanentemente accesible junto al formulario en escritorio y antes de él en móvil. Pasos por equipo y resumen antes de confirmar.
- Cada paso muestra todas las fotos de la recolección y excluye las firmas. La selección de una foto para un equipo no la retira de los demás. Archivos de otros tipos quedan fuera.
- Catálogos derivados de clientes, usuarios relacionados y tipos de servicio; integración exclusiva con el endpoint de conversión ya implementado.
- Estados de carga, error, conflicto, resultado, salida con borrador, teclado, foco, temas y traducciones ES/EN.

## Fuera de alcance

No cambia el API ni el contrato del wizard compartido. No altera el ZIP de la PWA. No crea registros parciales ni envía fotos nuevas. El usuario ejecuta las validaciones manuales.

## Aceptación

1. Sin READ no se entra; sin CONVERT no se ve la acción ni se puede usar la ruta. Una recolección convertida muestra su estado y no permite repetir la conversión.
2. Se presentan todos los equipos en su orden original. Cada paso conserva sus datos al retroceder y filtra únicamente imágenes, que pueden repetirse entre equipos.
3. La confirmación envía todos los índices, datos obligatorios y fotos elegidas en una solicitud. El éxito muestra los registros creados y refresca el estado de origen.
4. Un error conserva el borrador. Un 409 o una respuesta de red incierta exige volver a consultar el origen antes de repetir, evitando duplicados.
5. La UI usa primitives y composición de Next Dashboard, con un dueño de scroll, sin desbordes ni pérdida de referencia en móvil.

No quedan decisiones críticas abiertas; la disposición exacta usa la composición de página existente según el espacio disponible.
