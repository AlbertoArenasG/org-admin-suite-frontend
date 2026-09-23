# Definition: Customer Service Records Administrative List Migration

## Initiative

- Name: `customer-service-records-administrative-list-migration`
- Date: `2026-09-22`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La ruta administrativa `/dashboard/customer-service-records` conserva un MVP
funcional, pero su superficie de listado ya no representa la arquitectura ni
la experiencia objetivo de la aplicación. Se sustituirá por una vista nueva
con la composición canónica `DataTable` del Next Dashboard.

La sustitución conserva el endpoint, permisos, navegación y los componentes
genéricos aprobados. No conserva implementación, estado visual ni
compatibilidad de interacción de la vista anterior.

## Expected Outcome

- La vista administrativa nueva usa `DataTable` v9 y primitives canónicas.
- El contenedor conserva su propiedad sobre Zustand, URL, thunks, paginación,
  búsqueda, ordenamiento, filtros y permisos.
- La toolbar conserva búsqueda global, diálogo de filtros, conteo, limpieza
  rápida, columnas y acción de crear.
- Las filas exponen navegación explícita al detalle, semáforos y datos
  operativos con la jerarquía aprobada.

## Approved Scope

- Construir una superficie nueva para `/dashboard/customer-service-records` a
  partir de `DataTable` y los componentes compartidos aprobados.
- Crear el contenedor y columnas de la nueva superficie. Ajustar el store de
  Zustand y la utilidad de query existentes al contrato de `DataTable`, sin
  crear una segunda capa de estado local.
- Adaptar toolbar, paginación, estados remotos, scroll y responsive al
  contrato compartido.
- Adoptar `CustomerServiceRecordsFilterDialog` como nodo de toolbar y
  simplificar su adaptador para el modelo nuevo de un período.
- Eliminar los componentes y columnas de presentación de la vista anterior
  cuando la nueva superficie esté conectada.

## Excluded Scope

- Creación, detalle, edición o baja de Registros de servicio.
- Cambios a endpoint, payload, filtros API, permisos, reglas de negocio,
  semáforos o modelos de dominio.
- Rediseño o sustitución del diálogo de filtros recién validado.
- Columna de acciones, menú de overflow, command menu o menú contextual por
  clic secundario. Su contrato compartido se definirá en una spec posterior.
- Migración de otras tablas, virtualización, infinite scrolling, selección
  masiva o edición inline sin una decisión específica.
- Compatibilidad de UI o URL con ordenamientos múltiples, períodos acumulados
  u otros estados de la vista anterior.

## Constraints

- La URL actual bajo `/dashboard/customer-service-records` se conserva.
- El contenedor nuevo mantiene la coordinación remota y no traslada HTTP a
  componentes de presentación.
- Redux conserva slice, thunks y colección remota sin cambios. Zustand
  conserva el estado local de interacción de esta vista y se ajusta a un único
  orden y a visibilidad de columnas por IDs.
- La migración usa `DataTable` y primitives canónicas; no crea una tabla
  paralela ni modifica primitives globales por necesidades del módulo.
- La tabla usa fila multilínea y densidad `comfortable`. El encabezado sticky y
  la región de scroll pertenecen al `DataTable` en escritorio; móvil conserva
  el scroll de página.
- El folio es la navegación explícita al detalle. No se hace navegable toda la
  fila mientras no exista el contrato de acciones diferido.
- La nueva vista admite un único orden activo. El parser acepta como máximo un
  criterio válido y el serializer emite uno; los parámetros adicionales se
  descartan al sincronizar la vista nueva.
- La nueva vista admite un único período activo. Parámetros de fecha acumulados
  de la superficie anterior no se preservan.

## Definition Status

La frontera y decisiones de experiencia están aprobadas. La implementación
puede comenzar con el plan y desglose registrados.
