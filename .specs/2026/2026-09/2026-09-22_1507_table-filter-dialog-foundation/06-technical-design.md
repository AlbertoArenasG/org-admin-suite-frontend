# Technical Design: Table Filter Dialog Foundation

## Status

Diseño técnico aprobado para implementación. La fundación se ubica en
`src/components/table-filter/`; los criterios heredados con varios rangos se
preservan hasta una acción explícita.

## Architecture Boundary

```text
Zustand applied filters -> module container -> TableFilterDialog
                                      ^             |
                                      |             v
                              URL + thunk      local draft only
```

- El contenedor crea, normaliza y aplica filtros de dominio.
- El diálogo recibe el valor aplicado y emite un valor confirmado; mantiene el
  borrador durante su apertura.
- Los selectores y el período son presentacionales/controlados. No conocen
  URLs, endpoints, Redux, permisos ni el modelo de Registros de servicio.
- La tabla conserva búsqueda global, sorting, columnas y resultados remotos.

## Proposed Public Contract

```text
TableFilterDialog<TFilters>
  open, onOpenChange
  value: TFilters
  onApply(next: TFilters)
  sections: FilterSection<TFilters>[]
  labels
  layout: one-column | two-columns

SelectableFilter
  id, label, placeholder, options
  selection: single | multiple
  searchable, loading, disabled

DateRangeFilter
  fields: one or more date targets
  value: { fieldId?, from, to }
  picker: separate
  presets
```

El contrato final evita transformaciones de negocio: el consumidor adapta entre
sus filtros y el modelo visible antes de invocar `onApply`.

## Customer Service Records Composition

- `Tipo de servicio`, `Cliente` y `Proveedor`: selección única, buscable.
- `Estado operativo` y `Proveedor asignado`: selección única, sin búsqueda.
- `Periodo`: selector de uno de cuatro campos y dos inputs/pickers separados.
- La toolbar conserva input de búsqueda y administración de columnas; añade
  solo el trigger de filtros.

## Behavior

- `X`, Escape y clic fuera cierran y restauran el borrador desde `value` en el
  siguiente open, sin aplicar ni disparar fetch.
- Limpiar período elimina campo, inicio y fin. Limpiar filtros elimina todos
  los criterios del borrador.
- El primario compara borrador contra aplicado. Sin diferencia queda
  deshabilitado; con diferencias cambia de manera sutil y aplica el copy según
  haya o no criterios tras el cambio.
- Los atajos escriben inicio y fin completos y muestran estado activo cuando
  equivalen exactamente al rango actual.
- La captura manual inserta `/` tras día y mes; acepta edición y se normaliza a
  ISO solo si la fecha es válida.
- Una URL con varios rangos heredados no se proyecta como un período ficticio:
  el adaptador CSR entrega ese estado como información de compatibilidad. El
  diálogo abre sin diferencias y solo habilita la acción al seleccionar un
  nuevo límite de un período único o limpiar deliberadamente. Elegir solamente
  el campo de fecha no altera ni habilita sustitución de criterios heredados.

## Registro De Artefactos

| Artefacto                          | Tipo                    | Ubicación                                                                          | Responsabilidad                                                               | Dependencias                                | Estado         |
| ---------------------------------- | ----------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- | -------------- |
| TableFilterDialog                  | componente compartido   | `src/components/table-filter/TableFilterDialog.tsx`                                | Dialog, secciones, borrador y confirmación controlada                         | Dialog y tokens canónicos                   | new            |
| TableFilterSection                 | componente compartido   | `src/components/table-filter/TableFilterSection.tsx`                               | Encabezado y distribución de una o dos columnas para controles aportados      | tokens y utilidades canónicas               | new            |
| TableFilterSelect                  | componente compartido   | `src/components/table-filter/TableFilterSelect.tsx`                                | Selección única/múltiple, búsqueda opcional y resumen                         | Popover, Input, primitives canónicas        | new            |
| TableFilterDateRange               | componente compartido   | `src/components/table-filter/TableFilterDateRange.tsx`                             | Uno o varios campos de fecha, atajos y dos pickers                            | TableFilterDateInput y primitives canónicas | new            |
| TableFilterDateInput               | componente compartido   | `src/components/table-filter/TableFilterDateInput.tsx`                             | Máscara `dd/MM/aaaa`, picker individual y normalización ISO                   | Input, Popover y Calendar                   | new            |
| Tipos table-filter                 | contrato compartido     | `src/components/table-filter/types.ts`                                             | Modelos de opciones, períodos y props compartidas sin dominio de negocio      | TypeScript                                  | new            |
| Exportaciones table-filter         | API pública             | `src/components/table-filter/index.ts`                                             | Exponer únicamente el contrato compartido aprobado                            | Componentes table-filter                    | new            |
| CustomerServiceRecordsFilterDialog | componente de módulo    | `src/components/customer-service-records/CustomerServiceRecordsFilterDialog.tsx`   | Adaptar filtros y opciones CSR al contrato compartido                         | table-filter, tipos CSR, copy localizado    | new            |
| Toolbar CSR                        | componente de módulo    | `src/components/customer-service-records/CustomerServiceRecordsTableToolbar.tsx`   | Sustituir filtros directos por trigger y diálogo                              | consumidor CSR, búsqueda y tabla legacy     | modify         |
| DataTable CSR                      | componente de módulo    | `src/components/customer-service-records/CustomerServiceRecordsDataTable.tsx`      | Reducir el contrato de labels del toolbar a los controles que permanecen      | toolbar CSR y tabla legacy                  | modify         |
| Contenedor CSR                     | contenedor de módulo    | `src/components/customer-service-records/CustomerServiceRecordsTableContainer.tsx` | Conserva confirmación, reset de página, URL y fetch existentes                | Zustand, thunk, URL                         | reuse          |
| Store CSR                          | store Zustand de módulo | `src/components/customer-service-records/useCustomerServiceRecordsTableStore.ts`   | Conservar solo filtros aplicados                                              | Tipos del feature                           | reuse          |
| Adaptador de filtros CSR           | adaptador de módulo     | `src/components/customer-service-records/customerServiceRecordsFilterAdapter.ts`   | Traducir filtros CSR, período único y estado histórico al contrato compartido | tipos CSR y table-filter                    | new            |
| Query CSR                          | serializador/parsing    | `src/utils/customerServiceRecordsQuery.ts`                                         | Conservar claves URL/API y serializar el resultado confirmado                 | tipos del feature                           | reuse          |
| Tipos CSR                          | tipos de feature        | `src/features/customer-service-records/types.ts`                                   | Mantener contrato actual o extraer adaptador local si basta                   | contrato API                                | reuse          |
| Ruta CSR                           | page App Router         | `src/app/dashboard/customer-service-records/page.tsx`                              | Composición y guard READ actuales                                             | autorización                                | reuse          |
| Autorización                       | guard de vista          | Ruta CSR y `useAuthorization`                                                      | Sin cambio de permisos                                                        | `CUSTOMER_SERVICE_RECORDS.READ`             | reuse          |
| API                                | endpoint/cliente        | feature CSR existente                                                              | Sin endpoint ni payload nuevo                                                 | contrato vigente                            | not_applicable |
| Temas globales                     | tokens/tema             | `src/styles/themes/*`                                                              | Sin token global nuevo salvo necesidad demostrada                             | tokens existentes                           | not_applicable |
| Locales CSR                        | i18n                    | `src/locales/{es,en}/customerServiceRecords.json`                                  | Copy de trigger, diálogo, acciones, presets y accesibilidad                   | i18next                                     | modify         |
| Validación manual                  | verificación            | `08-manual-validation.md`                                                          | Matriz de interacción, teclado, responsive y temas                            | rutas y controles finales                   | new            |
| Date range integrado               | experimento             | Component Lab solamente                                                            | No se promueve en esta iniciativa                                             | N/A                                         | not_applicable |

## Open Questions

Ninguna.
