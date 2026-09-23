# Analysis: Customer Service Records Administrative List Migration

## Current Surface

- Ruta: `src/app/dashboard/customer-service-records/page.tsx`.
- La ruta conserva endpoint, permisos, enlaces y datos de dominio necesarios
  para la nueva composición.
- La superficie actual se considera reemplazable: no aporta contratos de UI a
  la vista nueva.
- Sus componentes y columnas de presentación no tienen otros consumidores y
  pueden eliminarse tras conectar la composición nueva.

## Reusable Foundation

`src/components/data-table/DataTable.tsx` ya cubre colecciones remotas con:

- toolbar y header controlados;
- carga, error, vacío y vacío con criterios;
- paginación, ordenamiento, visibilidad de columnas y acciones de fila;
- densidad, región de scroll y sticky header configurables;
- primitives y tokens del Next Dashboard.

El diálogo de filtros queda separado en `src/components/table-filter/` y su
adaptador de Registros de servicio. No debe incorporarse dentro de `DataTable`.
El contrato genérico del diálogo no cambia; su adaptador se ajusta al contrato
de consulta nuevo de un solo período.

## Contracts To Preserve

- Endpoint, modelos y permisos `READ` y `CREATE`.
- Debounce de búsqueda global, reset de página y fetch remoto.
- Ruta base y navegación explícita al detalle.
- Semáforos/materializaciones provenientes del backend.

## Contracts To Replace

- Columnas, toolbar y superficie de presentación de la vista anterior.
- Ordenamientos múltiples: la composición nueva expone uno.
- Períodos de fecha acumulados: la composición nueva expone uno.
- Estado de URL previo que no pueda representarse por la vista nueva.

## New Query Contract

La utilidad de query existente se ajusta al orden único y período único. El
store de Zustand existente se ajusta al contrato local del `DataTable`, como
en Seguimiento de servicios: página, límite, búsqueda, búsqueda aplicada,
sorting, columnas visibles e inicialización. Los parámetros fuera del contrato
nuevo se descartan durante la sincronización de URL.

## Deferred Foundation

El contrato de acciones de fila queda fuera de esta migración: botón overflow,
command menu y clic secundario se evaluarán y fundarán en una spec posterior.
Esta tabla no debe crear una variante local de esos patrones.

## Analysis Conclusion

La sustitución es viable sin cambios de backend. El trabajo construye una nueva
superficie que consume fundaciones canónicas y elimina la anterior al concluir;
no hay una estrategia de adaptación o compatibilidad incremental.
