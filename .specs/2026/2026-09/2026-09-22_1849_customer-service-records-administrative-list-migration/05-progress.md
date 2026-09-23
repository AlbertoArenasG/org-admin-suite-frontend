# Progress: Customer Service Records Administrative List Migration

## 2026-09-22 - Apertura

- Se separó esta migración del MVP funcional cerrado en agosto y de la
  fundación de filtros cerrada hoy.
- Se confirmó que la ruta administrativa existe, pero su listado interno aún
  usa una superficie local no canónica.
- Se identificó `DataTable` como fundación canónica y se preservaron como
  fronteras el contenedor remoto y el diálogo de filtros existente.
- Se difirió explícitamente la fundación de acciones de fila, command menu y
  clic secundario para una iniciativa posterior.
- No hubo implementación durante la apertura.

## 2026-09-22 - Arquitectura De Información Aprobada

- Se aprobó una tabla administrativa multilínea, sin expansión y sin acciones
  de fila.
- La jerarquía conserva folio, cliente/activo, tipo, estado, compromiso,
  proveedor/retorno y solicitud o actualización.
- Se aprobaron posteriormente navegación, scroll y densidad para cerrar el
  plan.

## 2026-09-22 - Sustitución Sin Compatibilidad

- Se confirmó que esta iniciativa construye una vista nueva y elimina la
  superficie anterior; no adapta archivos, tipos ni estados de UI legacy.
- El contrato nuevo admite un orden y un período. Parámetros históricos no
  representables se descartan, sin compatibilidad o parches de URL.

## 2026-09-22 - Estado Local Por Vista

- Se confirmó a Seguimiento de servicios como referencia: su store propio de
  Zustand controla interacción local y Redux conserva colección remota.
- La tabla administrativa seguirá el mismo patrón ajustando su store existente
  al contrato de `DataTable`, sin cambios previstos en slice o thunks.
