# Analysis: Table Filter Dialog Foundation

## Current State

- `CustomerServiceRecordsTableToolbar` combina búsqueda, cinco filtros,
  administración de columnas y cuatro rangos nativos acumulables.
- `CustomerServiceRecordsTableContainer` conserva filtros en Zustand, los
  sincroniza a URL y despacha el fetch remoto. Redux conserva colección,
  metadata, carga y error.
- `customerServiceRecordsQuery.ts` serializa los filtros existentes; no hay
  cambio de contrato API requerido.
- El frontend ya dispone de `Dialog`, `Popover`, `Calendar`, `date-fns` y
  `react-day-picker` bajo control del producto.
- `LocalizedDateInput` tiene tres consumidores y un contrato de trigger con
  calendario propio; no permite captura manual ni selectores directos de
  mes/año. Reutilizarlo requeriría cambiar una pieza transversal sin que el
  consumidor de filtros lo justifique.
- `DashboardFilterMenu` es un popover de selección única sin borrador. No es
  base adecuada para esta iniciativa.

## Consumer Contract

Registros de servicio administra hoy:

- `serviceTypeCode`, `customerId`, `operationalStatus`, `providerId` y
  `hasProvider`.
- Cuatro parejas de fechas: solicitud/registro, recepción/recolección,
  compromiso con cliente y retorno de proveedor.

La migración conservará las mismas claves URL/API, pero el diálogo impedirá
que más de una pareja de fecha tenga valor al aplicar. Por tanto, el contrato
actual sigue siendo compatible y el cambio es de interacción y normalización
en frontend.

Una URL histórica puede contener más de una pareja. No se normaliza ni altera
silenciosamente: el diálogo identifica el estado heredado, no queda sucio al
abrirse y permite sustituirlo solo mediante una confirmación explícita.

## Dependencies

- `docs/ui/patterns/data-table.md` y la spec
  `generic-data-table-foundation`: la vista compone filtros mediante toolbar;
  la tabla no conoce su estado ni el API.
- `docs/ui/components/installed-components.md`: primitives canónicas y regla
  de CSS/tokens locales.
- `src/components/ui/dialog.tsx`, `calendar.tsx`, `popover.tsx` y
  `localized-date-input.tsx`.
- Component Lab local como evidencia visual únicamente; no se importará ni se
  copiará de forma literal.

## Risks

- Generalizar props antes de tener un segundo consumidor real.
- Alterar de forma incidental la sincronización URL/fetch al introducir el
  borrador.
- Duplicar o divergir la lógica de fecha localizada ya existente.
- Dejar valores de más de un campo de fecha cuando la UX promete un rango.
- Usar un diálogo alto sin definir scroll, footer y foco en móvil.

## Constraints

- La primera entrega adopta únicamente la variante de dos pickers separados.
- Los textos pertenecen a locales, incluidos labels, acciones y mensajes
  accesibles.
- La persona usuaria confirma la frontera de artefactos antes de cualquier
  cambio estructural.
