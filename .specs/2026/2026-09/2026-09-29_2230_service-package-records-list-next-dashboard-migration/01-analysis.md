# Analisis: Migracion Del Listado De Recepcion, Recoleccion Y Entrega

## Estado Actual

- La ruta base, tabla, filtros, acciones, dialogo de baja, tipos, thunk,
  mapper y estado legacy fueron eliminados en el commit
  `10251ea refactor(service-packages): elimina listado legacy de recepción y entrega`.
- La ruta individual `/dashboard/service-packages-records/[recordId]` permanece
  en Next Dashboard con `DashboardViewAccessBoundary` y es el unico consumidor
  actual del feature `servicePackagesRecords`.
- `servicePackagesRecordsSlice` conserva exclusivamente la rama `detail`.
- `DataTable`, `DashboardTableWorkspace`, `TableFilterDialog`,
  `DestructiveConfirmationDialog` y las preferencias globales persistidas de
  page size/densidad estan disponibles. La densidad solo esta consumida por el
  catalogo y esta tabla sera su primera adopcion de negocio.

## Contrato Backend Vigente

| Endpoint                                                          | Permiso                   | Uso de la tabla                        |
| ----------------------------------------------------------------- | ------------------------- | -------------------------------------- |
| `GET /v1/service-packages/records?page&limit&search&service_type` | `service_packages:READ`   | Coleccion paginada, busqueda y filtro. |
| `GET /v1/service-packages/records/options`                        | `service_packages:READ`   | Catalogo de tipos de servicio.         |
| `DELETE /v1/service-packages/records/:recordId`                   | `service_packages:DELETE` | Baja confirmada.                       |

El presenter devuelve objetos completos en la coleccion. El mapper de listado
proyectara un modelo minimo de seis campos para que la UI no consuma detalles,
S3 ni archivos que no necesita.

## Hallazgos

- El repositorio ordena la coleccion por `createdAt` descendente y no acepta
  parametros de ordenamiento. No existe un gap de backend: el orden es fijo y
  la capacidad de sorting del `DataTable` es opcional.
- El backend excluye registros eliminados, limita el filtro a `service_type` y
  busca por orden, empresa, recolector, contacto y correo. El frontend solo
  expone las capacidades que ya tenia el listado: busqueda y tipo de servicio.
- La preferencia global ya fue adoptada para tablas Next Dashboard. Una URL
  con `limit` es determinista y debe prevalecer sobre Local Storage.
- `DataTableSettingsMenu` presenta selector de densidad unicamente con
  `rowLayout="single-line"`. Los seis campos de este listado caben en esa
  geometria, por lo que no se requiere una extension del contrato.
- La sidebar mantiene al grupo `services` activo para la ruta de detalle, pero
  no tiene una entrada hacia el listado hasta que la nueva ruta exista.

## Riesgos Y Contencion

| Riesgo                               | Contencion                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| Mezclar estado de detalle y listado  | Ramas Redux independientes y store Zustand exclusivo del listado.                         |
| Reintroducir UI legacy               | No se reutiliza ningun componente, hook, stylesheet ni tabla anterior.                    |
| URL invalida o pagina fuera de rango | Parser normaliza pagina/limite, sincroniza URL y ajusta al ultimo resultado.              |
| Eliminar sin capacidad               | Boundary READ para entrar; row action solo se resuelve con `can('DELETE')`; API revalida. |
| Filtro modifica resultados al abrir  | `TableFilterDialog` conserva borrador y aplica solo por confirmacion.                     |

## Restricciones De Validacion

- No se crean ni ejecutan pruebas unitarias.
- La verificacion estatica acordada es `npm run typecheck` y `git diff --check`.
- La persona usuaria validara manualmente comportamiento, permisos, responsive,
  temas, teclado, foco, scroll, URLs y baja contra registros reales.
