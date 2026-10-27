# Cronograma de registros de servicio a clientes

## Estado

- Initiative: customer-service-record-roadmap
- Definition status: completed
- Implementation ready: yes
- Implementation status: pending
- Validation status: pending
- Spec status: in_progress

## Resultado

Agregar una ruta administrativa de Next Dashboard para consultar los registros de servicio en las cinco vistas del bloque Kibo Roadmap: Gantt, Calendario, Lista, Kanban y Tabla. Conservar la ruta administrativa actual para comparar ambas composiciones. El alcance es de lectura y navegación al detalle.

## Contrato y límites

- `CUSTOMER_SERVICE_RECORDS/READ` gobierna ruta, navegación y solicitudes; no se crean permisos ni endpoints.
- Gantt consulta `GET /v1/customer-service-records/timeline` con `match=periods`; Calendario usa `match=customer_milestones`. El periodo visible usa fechas civiles inclusivas y no supera 42 días. Lista, Kanban y Tabla usan el listado administrativo existente, paginado.
- Gantt muestra tramo de recepción a entrega estimada y, cuando existe, tramo de entrega al proveedor a retorno real o estimado. Una sola fecha forma un hito de un día. Agrupar por cliente, colorear por materialización de estado y mostrar registros con solo tramo de proveedor.
- Calendario muestra recepción y entrega estimada como hitos separados. Gantt y Calendario ofrecen semana y mes.
- Lista y Kanban agrupan por estado operativo; Tabla reutiliza el DataTable administrativo existente dentro del bloque, con sus filtros, paginación, acciones y permisos habituales.
- La vista es de lectura: sin arrastrar, cambiar fechas/estados, crear marcadores ni eliminar desde las primitivas Kibo. Las acciones de Tabla siguen sus permisos actuales.
- Mantener temas, tokens, responsive, ES/EN, teclado, foco y estados de carga, error y vacío. No modificar DataTable, shell ni rutas existentes para acomodar el bloque.

## Aceptación

1. La ruta aparece en la navegación administrativa solo con READ y redirige sin él.
2. Gantt y Calendario cambian entre semana y mes, navegan periodos, consultan el rango correcto, cargan todas sus páginas y muestran reintento o vacío según respuesta.
3. Los periodos y hitos respetan fechas civiles, tramos parciales, retorno real antes que estimado y color de materialización cuando existe.
4. Lista y Kanban leen el listado paginado, navegan al detalle y no permiten edición por arrastre. Tabla mantiene las acciones y configuración de la tabla actual.
5. La ruta existente conserva su composición. Móvil, temas, teclado y lector de pantalla permiten usar las vistas sin acciones ocultas o scroll bloqueado.

## Decisiones abiertas

Ninguna de producto. Las adaptaciones técnicas del vendor y la matriz están en diseño y validación. La validación manual corresponde al usuario después de la codificación.
