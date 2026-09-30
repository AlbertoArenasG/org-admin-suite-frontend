# Diseno Tecnico: Migracion Del Listado De Recepcion, Recoleccion Y Entrega

## Ruta, Shell Y Autorizacion

`src/app/dashboard/service-packages-records/page.tsx` se crea con:

```tsx
<DashboardViewAccessBoundary module="SERVICE_PACKAGES" requiredOperation="READ">
  <DashboardTableWorkspace contentClassName="mx-auto max-w-[1600px]">
    <ServicePackagesRecordsContainer />
  </DashboardTableWorkspace>
</DashboardViewAccessBoundary>
```

`dashboardShellMigration.ts` registra la ruta exacta con breadcrumb de
Recepcion, Recoleccion y Entrega y `scrollMode: 'table-workspace'`. La
navegacion lateral recupera una entrada hija visible solo con `READ`; el grupo
`services` conserva activo tanto el listado como el detalle.

## Contrato Y Modelo De Lista

El thunk llama:

```text
GET /v1/service-packages/records?page={page}&limit={limit}&search={search}&service_type={type}
```

Los parametros opcionales vacios no se serializan. La respuesta paginada se
normaliza a:

```ts
type ServicePackageRecordListItem = {
  id: string;
  serviceOrder: string;
  serviceType: string | null;
  company: string | null;
  collectorName: string | null;
  visitDate: string | null;
  createdAt: string | null;
};
```

El mapper privado de API puede recibir la respuesta completa del presenter,
pero solo proyecta estos campos. `details`, archivos, rutas S3, package ID y
metadatos del recurso no cruzan a la tabla.

`GET /records/options` se mapea a `{ value, label }[]`. La baja usa
`DELETE /records/:recordId`; al exito, el estado remoto elimina el item y el
contenedor vuelve a solicitar la pagina activa para obtener conteos y limites
servidor actualizados.

## Estado, URL Y Preferencias

Redux extiende `servicePackagesRecords` con ramas hermanas de `detail`:

```text
list: { items, status, error, page, perPage, total, totalPages }
options: { serviceTypes, status, error }
mutations: { deleteStatus, error, message, currentRecordId }
detail: ... existente sin cambios de ownership
```

Los thunks y reducers de listado no reutilizan identificadores ni respuestas
de `detail`. Los errores de lista y mutacion son independientes para permitir
reintento y confirmar baja sin degradar la ruta individual.

`useServicePackagesRecordsTableStore` conserva estado local no remoto:

```text
page, limit, search, appliedSearch, serviceType, visibleColumnIds,
initialized
```

`useServicePackagesRecordsListController` es el unico adaptador entre Zustand,
URL, Redux y la preferencia global de limite. Lee y serializa `page`, `limit`,
`search` y `service_type`; normaliza enteros positivos (`page >= 1`,
`limit <= 100`). `limit` de URL prevalece; de no existir, usa el page size
global de `useDataTablePreferencesStore` para el `userId` autenticado. El
debounce de busqueda es de 350 ms y pagina/filtro reinician a 1. Si el total
reduce el numero de paginas, el controlador ajusta la pagina al ultimo
resultado.

`ServicePackagesRecordsTable` consume `density` y `setDensity` del mismo
`useDataTablePreferencesStore`. El middleware `persist` ya guarda esa
preferencia global en Local Storage bajo `icsa-data-table-preferences`; no se
crea estado local, parametro URL ni persistencia de densidad adicional.
El store no propaga valores a consumidores por si mismo: las tablas multilínea
de Registros de servicio administrativo y portal no entregan `density` ni
`settings.density`, por lo que mantienen el default `comfortable` y no exponen
selector.

## Tabla Y Comportamiento

`ServicePackagesRecordsTable` usa:

- `rowLayout="single-line"`, densidad global `compact | comfortable`.
- `scrollRegion={{ maxHeight: 'available', desktopOnly: true, overscrollBehavior: 'none' }}`.
- `stickyHeader={{ desktopOnly: true }}` y settings en toolbar.
- Toolbar compacta con busqueda y `ServicePackagesRecordsFilterDialog`.
- Settings en toolbar para visibilidad de columnas y densidad global.
- Paginacion controlada con `[10, 25, 50, 75]`.
- Sin prop `sorting`, `expansion`, seleccion, fullscreen o estilos de dominio.

| Columna           | Presentacion                                            | Visibilidad  |
| ----------------- | ------------------------------------------------------- | ------------ |
| Orden de servicio | Enlace monoespaciado, destacado y truncable al detalle. | Obligatoria. |
| Tipo de servicio  | Texto secundario.                                       | Ocultable.   |
| Empresa           | Texto principal truncable.                              | Ocultable.   |
| Recolector        | Texto truncable.                                        | Ocultable.   |
| Fecha de visita   | Fecha localizada en UTC o valor vacio.                  | Ocultable.   |
| Creado            | Fecha localizada en UTC o valor vacio.                  | Ocultable.   |

El resaltado de busqueda usa el termino aplicado sobre orden, tipo, empresa y
recolector. El estado vacio distingue una coleccion sin resultados de criterios
activos y permite limpiarlos. Carga, error recuperable y skeleton se resuelven
con contratos de `DataTable`.

## Filtro Y Acciones

`ServicePackagesRecordsFilterDialog` adapta `TableFilterDialog` a:

```ts
type ServicePackagesRecordsListFilters = { serviceType: string | null };
```

El selector usa `TableFilterSelect` de seleccion unica y orientacion vertical.
Abrir, cerrar, Escape o cancelar no modifican resultados; aplicar actualiza
Zustand, URL y pagina. Limpiar elimina solo `service_type`; la limpieza global
tambien borra busqueda.

`useServicePackageRecordRowActions` resuelve:

| Capacidad | Accion                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------- |
| `READ`    | Enlace de orden y `Ver detalle` primaria hacia `/dashboard/service-packages-records/:recordId`. |
| `DELETE`  | `Eliminar`, destructiva y confirmada.                                                           |

La columna de orden usa `Link` hacia el detalle como via visible y directa. La
accion primaria habilita ademas el menu visible, menu contextual y doble clic
seguro conforme al contrato de `DataTable`; la fila no se vuelve clickeable y
el doble clic ignora el enlace como cualquier otro elemento interactivo.
El hook posee la fila objetivo y compone `DestructiveConfirmationDialog`.
Al exito muestra toast, cierra el dialogo y solicita nuevamente la pagina; al
fallar conserva el dialogo y muestra el error. El `DataTable` no conoce ninguno
de esos detalles.

## Responsive, Tema Y Accesibilidad

- El shell es duenio del scroll de pagina; el `DataTable` es duenio del viewport
  de resultados en escritorio y deja flujo/scroll nativo en movil.
- Columnas y acciones conservan overflow horizontal, controles tactiles y
  objetivos interactivos de los componentes compartidos.
- El dialogo y menus reutilizan foco, Escape, lector de pantalla y tokens
  semanticos de primitives canonicas.
- El cambio de preferencia de esta tabla no altera las tablas multilínea ya
  migradas, pues no consumen la densidad global.
- No se agregan CSS, colores hardcodeados, assets, vendors ni dependencias.

## Registro De Artefactos

| Artefacto                                             | Tipo                        | Ubicacion                                                                          | Responsabilidad                                                      | Dependencias                                     | Estado         |
| ----------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ | -------------- |
| Ruta de listado                                       | Ruta App Router             | `src/app/dashboard/service-packages-records/page.tsx`                              | Declara boundary READ y compone workspace/listado.                   | Shell, container.                                | new            |
| Shell migration                                       | Configuracion               | `src/components/dashboard-shell/migration/dashboardShellMigration.ts`              | Define breadcrumb y scroll de ruta exacta.                           | Dashboard shell, breadcrumbs.                    | modify         |
| Container                                             | Componente de modulo        | `src/components/servicePackagesRecords/ServicePackagesRecordsContainer.tsx`        | Compone tabla, acciones y dialogo sin renderizar HTTP.               | Controller, access, row actions.                 | new            |
| Tabla                                                 | Componente de modulo        | `src/components/servicePackagesRecords/ServicePackagesRecordsTable.tsx`            | Adapta controller, densidad global y copy al contrato `DataTable`.   | DataTable, filtro, columnas, preferencias, i18n. | new            |
| Columnas                                              | Modulo puro de presentacion | `src/components/servicePackagesRecords/servicePackagesRecordsColumns.tsx`          | Declara seis columnas, incluido enlace de orden, sin estado ni HTTP. | Modelo lista, formatter, Next Link.              | new            |
| Filtro                                                | Componente de modulo        | `src/components/servicePackagesRecords/ServicePackagesRecordsFilterDialog.tsx`     | Adapta filtro unico al dialogo comun.                                | TableFilterDialog, opciones, i18n.               | new            |
| Controller                                            | Hook de modulo              | `src/components/servicePackagesRecords/useServicePackagesRecordsListController.ts` | Coordina URL, preferencia, store y thunks.                           | Router, Redux, Zustand, query util.              | new            |
| Store local                                           | Store Zustand               | `src/components/servicePackagesRecords/useServicePackagesRecordsTableStore.ts`     | Mantiene estado local de tabla; no coleccion remota.                 | Tipos de filtros.                                | new            |
| Acciones                                              | Hook de modulo              | `src/components/servicePackagesRecords/useServicePackageRecordRowActions.tsx`      | Resuelve acciones autorizadas, dialogo, mutacion y feedback.         | DataTable actions, access, Redux, router.        | new            |
| Query util                                            | Adaptador de URL            | `src/utils/servicePackagesRecordsQuery.ts`                                         | Parsea y serializa page, limit, search y tipo.                       | Tipos de feature.                                | new            |
| Tipos feature                                         | Tipos                       | `src/features/servicePackagesRecords/types.ts`                                     | Declara modelos de lista, opciones, filtros y errores.               | Contrato API.                                    | modify         |
| Mapper feature                                        | Adaptador API               | `src/features/servicePackagesRecords/servicePackagesRecordsMappers.ts`             | Proyecta coleccion y detalle en modelos internos separados.          | Tipos feature.                                   | modify         |
| Thunks feature                                        | Integracion                 | `src/features/servicePackagesRecords/servicePackagesRecordsThunks.ts`              | Ejecuta GET lista/opciones y DELETE sin mezclar detalle.             | jsonRequest, auth, mapper.                       | modify         |
| Slice feature                                         | Store Redux                 | `src/features/servicePackagesRecords/servicePackagesRecordsSlice.ts`               | Mantiene ramas remotas independientes.                               | Thunks, tipos.                                   | modify         |
| Barrel feature                                        | Exportacion                 | `src/features/servicePackagesRecords/index.ts`                                     | Expone contratos nuevos al modulo.                                   | Feature artifacts.                               | modify         |
| Sidebar                                               | Navegacion/autorizacion     | `src/components/sidebar/navigation/{definitions,types,visibility}.ts`              | Restaura entrada y visibilidad con READ.                             | Icono, authorization.                            | modify         |
| Locales de navegacion                                 | i18n                        | `src/locales/{es,en}/nav.json`                                                     | Restaura etiqueta lateral.                                           | Sidebar.                                         | modify         |
| Locales de modulo                                     | i18n                        | `src/locales/{es,en}/servicePackagesRecords.json`                                  | Aporta tabla, filtro, acciones, baja y estados.                      | i18next.                                         | modify         |
| DataTable                                             | Componente compartido       | `src/components/data-table/*`                                                      | Aporta tabla, menu, contexto, responsive y estados.                  | Reuso directo.                                   | reuse          |
| Table Filter                                          | Componentes compartidos     | `src/components/table-filter/*`                                                    | Aporta dialogo y selector de filtro.                                 | Reuso directo.                                   | reuse          |
| Dialogo destructivo                                   | Componente compartido       | `src/components/shared/DestructiveConfirmationDialog.tsx`                          | Aporta confirmacion accesible.                                       | Reuso directo.                                   | reuse          |
| Preferencias                                          | Store compartido            | `src/stores/useDataTablePreferencesStore.ts`                                       | Persiste limite por usuario y densidad global.                       | Reuso directo.                                   | reuse          |
| Endpoints, DTOs, dominio, persistencia y permisos API | Backend                     | `org-admin-suite-api`                                                              | El contrato vigente cubre el alcance.                                | No aplica.                                       | not_applicable |
| CSS, tokens, themes, assets, vendors o dependencias   | Estilos/infraestructura     | N/A                                                                                | Los componentes reutilizados resuelven tema y responsive.            | No aplica.                                       | not_applicable |
| Pruebas unitarias                                     | Pruebas                     | N/A                                                                                | No se crean ni ejecutan por acuerdo del proyecto.                    | No aplica.                                       | not_applicable |
| Validacion manual                                     | Documento                   | `.specs/.../08-manual-validation.md`                                               | Evidencia funcional y visual por rol/viewport.                       | Navegador, API.                                  | new            |
| Adoption log                                          | Documentacion viva          | `docs/ui/adoption-log.md`                                                          | Registra adopcion validada de DataTable.                             | Spec cerrada.                                    | modify         |

## Verificacion Estatica

- `npm run typecheck`
- `git diff --check`

No se crean ni ejecutan pruebas unitarias.
