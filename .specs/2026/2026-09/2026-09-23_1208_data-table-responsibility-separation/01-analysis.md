# Analysis: DataTable Responsibility Separation

## Current State

`src/components/data-table/DataTable.tsx` contiene 1,107 lineas. Declara tipos
publicos, labels, la instancia de TanStack v9, efectos de fullscreen y altura
disponible, configuracion de columnas, toolbar, settings, estados remotos,
tabla semantica, expansion, paginacion y helpers de resaltado.

El catalogo publico solo exporta `DataTable`, `DataTableColumn` y
`DataTableProps` desde `src/components/data-table/index.ts`.

Los consumidores productivos actuales son:

- `ClientAccessServicesContainer`: Seguimiento de servicios.
- `CustomerServiceRecordsContainer`: Registros de servicio administrativos.

El Component Lab consume el mismo componente mediante
`DataTableCatalogPlayground`. La preferencia global de densidad vive fuera del
componente en `src/stores/useDataTablePreferencesStore.ts`.

## Existing Responsibilities

| Area                                     | Estado actual                            | Riesgo de mantenerla concentrada                     |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Contrato publico y labels                | Vive en `DataTable.tsx`                  | Mezcla API de consumo con renderizado.               |
| Settings                                 | Ya tiene `DataTableSettingsMenu` interno | No es reutilizable ni aislable para revision.        |
| Toolbar y estados superiores             | JSX dentro de `DataTable`                | Hace crecer la coordinacion.                         |
| Tabla, filas y expansion                 | JSX dentro de `DataTable`                | Concentra semantica y comportamiento de filas.       |
| Paginacion                               | JSX y helper local                       | Mezcla presentacion con calculo puro.                |
| Highlight                                | Helper local                             | Es capacidad compartida con logica propia.           |
| TanStack, fullscreen y altura disponible | `DataTable`                              | Deben conservarse en el componente raiz coordinador. |

## Relevant Existing Contracts

- `DataTable` recibe estado controlado de busqueda, sorting, paginacion,
  seleccion y expansion. No ejecuta HTTP ni interpreta permisos.
- `rowLayout="multiline"` anula densidad y requiere filas comodas; ambas tablas
  de registros de servicio dependen de ello.
- La region de scroll disponible y encabezado sticky son parte de las dos
  adopciones productivas actuales.
- `getRowActions` existe como slot de `ReactNode`, pero no tiene consumidores
  productivos. Su ampliacion queda fuera de esta spec.
- La fundacion original de DataTable permanece cerrada; sus limites aprobados
  siguen siendo referencia, no una instruccion para anadir capacidades nuevas.

## Risks

- Separar JSX puede alterar colspans, foco, overflow, sticky header o el orden
  de columnas utilitarias si los props internos no son explicitos.
- Mover tipos sin conservar el barrel puede romper imports existentes.
- Extraer un componente que reciba demasiados props solo desplaza la
  concentracion sin mejorar responsabilidades.
- Esta refactorizacion no debe aprovecharse para modificar acciones, permisos
  o experiencia visual.

## Dependencies

- `@tanstack/react-table` v9.
- Primitives existentes de shadcn para menus, tooltip y controles.
- `motion/react` para transiciones actuales.
- `docs/ui/patterns/data-table.md` como documento vivo del patron.
