# Technical Design: DataTable Responsibility Separation

## Design Boundary

`DataTable.tsx` conserva los efectos y estado que requieren ownership unico:

- construccion de `useTable` y de sus `ColumnDef`;
- normalizacion de columnas visibles y highlight;
- estado de fullscreen, anchos de columna y altura disponible;
- refs y `ResizeObserver` de la region disponible;
- callbacks controlados de sorting, seleccion, expansion, resize y paginacion;
- calculo de clases, colspans y props derivados;
- composicion de los subcomponentes.

Los hijos reciben datos derivados y callbacks. No importan stores, no conocen
API, permisos o dominio, ni crean otra instancia de TanStack.

## Internal Composition

```text
DataTable
  |- DataTableChrome
  |    |- DataTableHeader
  |    |- DataTableToolbar
  |    `- DataTableSettingsMenu
  |- DataTableResultsRegion
  |    `- DataTableContent
  |         |- DataTableColumnHeaders
  |         `- DataTableBody
  `- DataTablePagination
```

`DataTableResultsRegion` solo representa el contenedor scrollable y recibe su
ref, clases y estilos desde el coordinador. `DataTableContent` contiene
`<table>` y `colgroup`; sus hijos son responsables de `<thead>` y `<tbody>`.

## Public Contract

Los tipos se trasladan a `DataTable.types.ts` para que todos los artefactos
internos compartan una unica definicion. `src/components/data-table/index.ts`
mantiene exactamente estos exports:

```ts
export { DataTable, type DataTableColumn, type DataTableProps } from './DataTable';
```

No se agrega ni se elimina ninguna prop. `DataTableLabels` puede ser tipo
interno compartido por los subcomponentes, sin convertirse en parte del barrel
publico.

## Registro De Artefactos

| Artefacto                         | Tipo                                     | Ubicacion                                                                                          | Responsabilidad                                                              | Dependencias                               | Estado |
| --------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ | ------ |
| `DataTable`                       | componente compartido coordinador        | `src/components/data-table/DataTable.tsx`                                                          | Conserva TanStack, efectos, estado derivado y composicion.                   | TanStack v9, subcomponentes internos.      | modify |
| `DataTable.types`                 | tipos compartidos                        | `src/components/data-table/DataTable.types.ts`                                                     | Define contrato publico e interno sin JSX.                                   | React, TanStack `RowData`.                 | new    |
| `DataTableChrome`                 | componente compartido                    | `src/components/data-table/DataTableChrome.tsx`                                                    | Compone header superior, toolbar y settings.                                 | Header, toolbar, settings, tipos.          | new    |
| `DataTableHeader`                 | componente compartido                    | `src/components/data-table/DataTableHeader.tsx`                                                    | Renderiza titulo, acciones superiores, loading y controles aportados.        | Tipos, iconos existentes.                  | new    |
| `DataTableToolbar`                | componente compartido                    | `src/components/data-table/DataTableToolbar.tsx`                                                   | Renderiza busqueda, filtros y regiones de toolbar.                           | Tipos, iconos existentes.                  | new    |
| `DataTableSettingsMenu`           | componente compartido                    | `src/components/data-table/DataTableSettingsMenu.tsx`                                              | Renderiza densidad y visibilidad de columnas.                                | Dropdown primitive, tipos.                 | new    |
| `DataTableResultsRegion`          | componente compartido                    | `src/components/data-table/DataTableResultsRegion.tsx`                                             | Presenta contenedor de resultados, scroll y atributos accesibles.            | React.                                     | new    |
| `DataTableContent`                | componente compartido                    | `src/components/data-table/DataTableContent.tsx`                                                   | Compone la tabla semantica y colgroup.                                       | TanStack, column headers, body, tipos.     | new    |
| `DataTableColumnHeaders`          | componente compartido                    | `src/components/data-table/DataTableColumnHeaders.tsx`                                             | Renderiza encabezados, sorting, resize y seleccion total.                    | TanStack, tipos, iconos.                   | new    |
| `DataTableBody`                   | componente compartido                    | `src/components/data-table/DataTableBody.tsx`                                                      | Renderiza loading, vacio, filas, indicadores, seleccion y expansion.         | TanStack, Motion, Tooltip, tipos.          | new    |
| `DataTablePagination`             | componente compartido                    | `src/components/data-table/DataTablePagination.tsx`                                                | Renderiza paginacion controlada.                                             | Tipos, iconos, utilidad de paginas.        | new    |
| `dataTableHighlight`              | utilidad de presentacion                 | `src/components/data-table/dataTableHighlight.tsx`                                                 | Resalta coincidencias sin distinguir acentos.                                | React.                                     | new    |
| `dataTablePagination`             | utilidad pura                            | `src/components/data-table/dataTablePagination.ts`                                                 | Calcula numeros y elipsis de pagina.                                         | Ninguna.                                   | new    |
| Catalogo publico                  | barrel                                   | `src/components/data-table/index.ts`                                                               | Preserva export de consumo.                                                  | `DataTable`.                               | reuse  |
| `useDataTablePreferencesStore`    | store compartido                         | `src/stores/useDataTablePreferencesStore.ts`                                                       | Conserva la preferencia de densidad que los consumidores entregan por props. | Zustand, consumidores de `DataTable`.      | reuse  |
| Estilos y temas                   | estilos compartidos                      | `src/components/data-table/DataTable.css`, `DataTable.theme.css` y `themes/`                       | Conservan apariencia y tokens vigentes.                                      | Tokens de UI.                              | reuse  |
| `ClientAccessServicesContainer`   | contenedor de modulo                     | `src/components/customer-service-records-client-access/ClientAccessServicesContainer.tsx`          | Consume `DataTable` para Seguimiento sin cambiar su contrato.                | Barrel `data-table`, store local, Redux.   | reuse  |
| `CustomerServiceRecordsContainer` | contenedor de modulo                     | `src/components/customer-service-records/CustomerServiceRecordsContainer.tsx`                      | Consume `DataTable` para Registros administrativos sin cambiar su contrato.  | Barrel `data-table`, store local, Redux.   | reuse  |
| `DataTableCatalogPlayground`      | Playground                               | `src/components/playground/DataTableCatalogPlayground.tsx`                                         | Ejerce capacidades visuales e interactivas del contrato compartido.          | Barrel `data-table`, preferencias locales. | reuse  |
| Catalogo de DataTable             | ruta Playground                          | `src/app/dashboard-playground/catalog/data-table/page.tsx`                                         | Expone el Playground existente sin cambio de ruta.                           | `DataTableCatalogPlayground`.              | reuse  |
| Rutas y composicion productivas   | App Router                               | No aplica: no hay rutas, layouts, metadata, breadcrumbs ni redirects nuevos.                       | Ninguna.                                                                     | not_applicable                             |
| Estado remoto e integracion       | slices, thunks, clientes API y endpoints | No aplica: la refactorizacion no toca consultas, mutaciones, cache ni contratos remotos.           | Ninguna.                                                                     | not_applicable                             |
| Autorizacion y navegacion         | boundary, permisos y visibilidad         | No aplica: no cambia acceso de vistas ni capacidades de UI.                                        | Ninguna.                                                                     | not_applicable                             |
| Documentacion viva                | guideline de patron                      | `docs/ui/patterns/data-table.md`                                                                   | Registra estructura y limites finales.                                       | Diseno implementado.                       | modify |
| Verificacion                      | comandos y matriz manual                 | `.specs/2026/2026-09/2026-09-23_1208_data-table-responsibility-separation/08-manual-validation.md` | Evidencia tecnica y manual de no regresion.                                  | Consumidores actuales.                     | modify |

## Responsive And Accessibility Preservation

- Se conservan tabla semantica, `thead`, `tbody`, scopes, `aria-sort`, labels,
  foco y controles de teclado existentes.
- Los props derivados de scroll y sticky header se calculan una vez en el
  coordinador y se entregan sin reinterpretacion a la region de resultados.
- Movil conserva scroll horizontal local y ownership vertical existente.
- Las transiciones de expansion conservan `useReducedMotion`.
