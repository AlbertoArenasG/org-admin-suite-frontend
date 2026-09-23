# Technical Design: DataTable Row Actions

## Public Contract

`DataTable.types.ts` elimina `getRowActions` y declara el contrato interno y
publico siguiente:

```ts
type DataTableRowAction<T> = {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
  isPrimary?: boolean;
  onSelect: (row: T) => void;
};

type DataTableRowActions<T> = {
  getActions: (row: T) => DataTableRowAction<T>[];
};
```

`rowActions?: DataTableRowActions<T>` es opcional. Si no se entrega, la tabla
preserva su estructura actual. La accion con `isPrimary: true` es la unica que
se puede ejecutar mediante doble clic; si la vista no marca una, el doble clic
no se instala. Cada consumidor debe declarar como maximo una accion primaria.

`DataTableLabels` incorpora el aria-label del trigger de acciones. Las
etiquetas de negocio de cada item siguen siendo responsabilidad de la vista.

## Generic Composition

```text
DataTable
  `- DataTableContent
       |- DataTableColumnHeaders
       `- DataTableBody
            `- DataTableRow
                 |- DataTableRowActions (dropdown de tres puntos)
                 `- DataTableRowContextMenu (clic derecho)
```

`DataTableRow` resuelve la lista una sola vez para su registro. Si la lista
esta vacia, no monta celda de trigger, menu contextual ni doble clic. Si
`rowActions` existe pero una fila particular no tiene acciones, la columna se
conserva por semantica de tabla, pero esa celda queda vacia.

`DataTableRowActions` y `DataTableRowContextMenu` reciben la misma lista ya
resuelta. Sus items ejecutan `action.onSelect(row)` y respetan `variant` para
la accion destructiva. El trigger usa un boton icon-only de tres puntos,
`aria-label` y tooltip; no se muestra texto ni iconos adicionales en los datos
de la fila.

El wrapper de contexto usa `ContextMenuTrigger asChild` sobre el `<tr>` sin
insertar nodos invalidos dentro de `<tbody>`. El detalle expandible permanece
como fila hermana fuera del trigger. El menu contextual se cierra al escoger
una accion, con Escape o al hacer clic fuera, conforme a Radix.

## Activation Rules

- El enlace de folio continua navegando a detalle por su ruta actual.
- `onDoubleClick` se instala solo si existe una accion primaria resuelta.
- Antes de ejecutarla, el handler descarta eventos originados en `a`, `button`,
  `input`, `select`, `textarea`, elementos con `role` interactivo y controles
  marcados por el catalogo DataTable.
- No se instala `onClick` ni `cursor-pointer` en el `<tr>`.
- El menu contextual no bloquea scroll horizontal, expansion, seleccion,
  resize ni el menu de tres puntos.

## Destructive Confirmation Ownership

`DestructiveConfirmationDialog` vive en `src/components/shared/`. Compone la
primitive `Dialog`, encabezado, descripcion, identificador o sujeto opcional,
cancelacion y confirmacion destructiva. Recibe estado controlado, labels,
`isPending` y `onConfirm`; no conoce tablas, Redux, rutas, recursos ni thunks.

`CustomerServiceRecordsContainer` es dueno del registro objetivo de
eliminacion, dialogo, dispatch y snackbar. Al elegir `Eliminar`, guarda la fila
objetivo y abre el dialogo. Al confirmar, despacha el thunk existente. El slice
ya quita la fila al completarse; el contenedor cierra el dialogo y muestra
feedback. Un error conserva el dialogo abierto y muestra su feedback.

## Permissions And Navigation

La pagina administrativa conserva `DashboardViewAccessBoundary` con `READ`.
Su contenedor consulta `useDashboardViewAccess().can`:

| Capacidad | Accion                                    |
| --------- | ----------------------------------------- |
| `READ`    | `Ver detalle` y accion primaria.          |
| `UPDATE`  | `Editar`, ruta actual `/[recordId]/edit`. |
| `DELETE`  | `Eliminar`, con dialogo destructivo.      |

El contenedor resuelve esas acciones por fila. `DataTable` nunca invoca
`hasPermission`, no navega y no conoce las rutas. El backend sigue validando
las operaciones.

## Registro De Artefactos

| Artefacto                                                        | Tipo                            | Ubicacion                                                                                  | Responsabilidad                                                        | Dependencias                            | Estado         |
| ---------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------- | -------------- |
| `DataTable.types`                                                | contrato compartido             | `src/components/data-table/DataTable.types.ts`                                             | Declara acciones tipadas y labels de trigger.                          | React, TanStack.                        | modify         |
| `DataTable`                                                      | coordinador compartido          | `src/components/data-table/DataTable.tsx`                                                  | Propaga `rowActions` y calcula estructura condicional.                 | Tipos, contenido.                       | modify         |
| `DataTableContent`                                               | composicion semantica           | `src/components/data-table/DataTableContent.tsx`                                           | Compone columna de acciones.                                           | Headers, body.                          | modify         |
| `DataTableColumnHeaders`                                         | encabezados de columnas         | `src/components/data-table/DataTableColumnHeaders.tsx`                                     | Renderiza encabezado accesible de acciones.                            | Tipos.                                  | modify         |
| `DataTableBody`                                                  | cuerpo semantico                | `src/components/data-table/DataTableBody.tsx`                                              | Propaga contrato a loading y filas.                                    | Row, loading.                           | modify         |
| `DataTableLoadingRows`                                           | loading compartido              | `src/components/data-table/DataTableLoadingRows.tsx`                                       | Conserva celda skeleton de acciones.                                   | Tipos.                                  | modify         |
| `DataTableRow`                                                   | fila compartida                 | `src/components/data-table/DataTableRow.tsx`                                               | Resuelve acciones, contexto y doble clic seguro.                       | TanStack, actions, contexto.            | modify         |
| `DataTableRowActions`                                            | menu de fila compartido         | `src/components/data-table/DataTableRowActions.tsx`                                        | Renderiza trigger, dropdown e items de acciones.                       | DropdownMenu, Tooltip, tipos.           | new            |
| `DataTableRowContextMenu`                                        | contexto de fila compartido     | `src/components/data-table/DataTableRowContextMenu.tsx`                                    | Envuelve fila y presenta las mismas acciones por clic derecho.         | ContextMenu, tipos.                     | new            |
| `ContextMenu`                                                    | primitive local                 | `src/components/ui/context-menu.tsx`                                                       | Expone wrapper Radix con estilos y variantes consistentes.             | `@radix-ui/react-context-menu`, tokens. | new            |
| `DestructiveConfirmationDialog`                                  | componente compartido           | `src/components/shared/DestructiveConfirmationDialog.tsx`                                  | Confirma mutaciones destructivas sin conocer dominio.                  | Dialog, Button.                         | new            |
| `CustomerServiceRecordsContainer`                                | contenedor de modulo            | `src/components/customer-service-records/CustomerServiceRecordsContainer.tsx`              | Resuelve capacidades, acciones, navegacion, dialogo, thunk y feedback. | Boundary, router, Redux, snackbar.      | modify         |
| `customerServiceRecordsColumns`                                  | columnas de modulo              | `src/components/customer-service-records/customerServiceRecordsColumns.tsx`                | Conserva folio enlazable hacia detalle.                                | Next Link.                              | reuse          |
| `CustomerServiceRecordDeleteDialog`                              | componente legacy               | `src/components/customer-service-records/CustomerServiceRecordDeleteDialog.tsx`            | Permanece para flujos legacy; no participa en Next Dashboard.          | Sheet legacy.                           | reuse          |
| `customerServiceRecordsSlice` y thunk                            | estado e integracion existentes | `src/features/customer-service-records/`                                                   | Ejecutan DELETE y remueven fila al exito.                              | API existente.                          | reuse          |
| Paginas de detalle y edicion                                     | rutas existentes                | `src/app/dashboard/customer-service-records/[recordId]/`                                   | Reciben navegacion actual; no se migran ni modifican.                  | App Router.                             | reuse          |
| `DataTableCatalogPlayground`                                     | playground                      | `src/components/playground/DataTableCatalogPlayground.tsx`                                 | Demuestra acciones, variantes y ausencia de acciones.                  | Barrel DataTable.                       | modify         |
| Traducciones de registros                                        | i18n                            | `src/locales/es/customerServiceRecords.json`, `src/locales/en/customerServiceRecords.json` | Aporta aria-label y copy de acciones/confirmacion.                     | i18next.                                | modify         |
| Guia de DataTable                                                | documentacion viva              | `docs/ui/patterns/data-table.md`                                                           | Documenta contrato, ownership e interacciones.                         | Diseno final.                           | modify         |
| Rutas, layouts, metadata y breadcrumbs nuevos                    | App Router                      | No aplica                                                                                  | No se crean ni migran rutas en esta spec.                              | not_applicable                          | not_applicable |
| Stores Zustand, slices Redux, thunks, endpoints o schemas nuevos | estado e integracion            | No aplica                                                                                  | Se reutiliza mutacion existente.                                       | not_applicable                          | not_applicable |
| Permisos backend                                                 | autorizacion servidor           | No aplica                                                                                  | No se alteran politicas ni catalogo de permisos.                       | not_applicable                          | not_applicable |
