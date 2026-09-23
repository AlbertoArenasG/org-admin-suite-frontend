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
  de fila, que replica Seguimiento de servicios.
- La jerarquía conserva folio, equipo/servicio, estado, seguimiento y entrega
  con cliente, cliente, seguimiento de proveedor y retorno de proveedor.
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

## 2026-09-22 - Slices 1 Y 2 Implementadas

- El store de Zustand existente pasó al contrato local de la vista: página,
  límite, búsqueda aplicada, orden único, filtros y visibilidad por IDs.
- La query normaliza URL a un solo orden y un solo período; Redux, thunks y
  colección remota permanecen sin cambios.
- La ruta monta una composición nueva con `DataTable`, columnas multilínea,
  búsqueda, diálogo de filtros, conteo, limpieza rápida, settings, paginación,
  scroll de escritorio y navegación por folio.
- Se eliminaron los componentes y columnas exclusivos de la presentación
  anterior. No se agregaron acciones de fila ni clic secundario.
- `typecheck`, lint focal, `git diff --check` y build completaron sin errores.
  En ese punto, la validación manual y de accesibilidad quedó diferida a la
  slice 3.

## 2026-09-22 - Corrección De Composición

- Se corrigió la composición para replicar Seguimiento de servicios en lugar
  de introducir una jerarquía administrativa propia.
- La tabla no expande filas ni muestra observaciones; conserva sus celdas,
  anchos y densidad, y añade seguimiento y retorno de proveedor al final.
- El botón de filtros se entrega como toolbar trailing para evitar el icono
  redundante que `DataTable` agrega a su slot específico de filtros.

## 2026-09-22 - Observaciones Aprobadas

- Se incorporó el mismo despliegue de observaciones de Seguimiento de
  servicios: solo las filas con observaciones generales o por equipo muestran
  el control de expansión.
- El mapper del thunk de listado ahora proyecta esos campos ya entregados por
  el endpoint; slice, ciclo Redux y contratos de solicitud no cambian.

## 2026-09-22 - Cierre

- Se validaron manualmente permisos, consulta, filtros, orden único, URL,
  navegación, observaciones, estados remotos, columnas, responsive, scroll,
  accesibilidad y temas.
- `typecheck`, build de producción y `git diff --check` finalizaron sin
  errores. El lint conserva cuatro warnings preexistentes fuera de esta
  migración.
- La migración administrativa queda cerrada. La fundación transversal de
  acceso para vistas Next Dashboard se trabajará en una spec independiente.
