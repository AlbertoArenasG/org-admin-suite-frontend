# Diseno Tecnico

## Composicion

La tabla `ClientAccessServicesContainer` agrega la columna no ocultable
`Detalle` inmediatamente despues de `Folio`. El folio y `Detalle` renderizan
enlaces hacia `/dashboard/portal/services/[recordId]`; la accion compacta usa
`Eye + Ver detalle`, con cursor, foco visible y tooltip. No transforma la fila
en enlace ni agrega menu de acciones, columna de adjuntos o un nuevo
desplegable.

La page cliente usa `DashboardPageComposition` y
`DashboardPageContentScroller`, como el detalle administrativo. Dentro compone
una ruta de detalle configurable con cuatro anclas:

1. `general-details`
2. `customer-delivery`
3. `equipment`
4. `documents`

La navegacion normal se mantiene de `lg` en adelante; la navegacion de iconos
flotante aparece de `md` a antes de `lg`; el timeline se muestra junto al menu
normal y se omite en la composicion compacta. El scroll permanece propiedad de
`DashboardPageContentScroller` y las anclas conservan `scroll-mt` equivalente.

`Equipment` contiene un frame con cuatro `ResourceFormSection` hermanas:
datos de equipo y las tres colecciones documentales. Todas estan en lectura.
Los documentos raiz mantienen su frame con cuatro secciones documentales. No
se renderiza ni reserva una seccion de proveedor.

## Datos Y Contrato

El cliente llama:

```text
GET /v1/customer-service-records-client-access/:recordId
```

Las propiedades de adjuntos preservan `download_url` y `preview_url`. El
frontend las mapea a un tipo de detalle de Client Access, separado de
`CustomerServiceRecordDetail`; no hay adaptacion artificial del proveedor.

El feature mantiene `detail` con `record`, `status`, `error`, `currentRecordId`
y `activeRequestId`, siguiendo el aislamiento de peticiones de otros detalles
Next Dashboard. Al desmontar o cambiar de ruta, la page despacha su reset.

## Permisos Y Estados

La page declara `DashboardViewAccessBoundary` con modulo
`CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS` y `READ`. No evalua `UPDATE` ni crea
mutaciones. El backend permanece responsable de confirmar visibilidad del
registro; un 403/404 se expresa como error o no encontrado seguro, sin revelar
datos.

## Documentos

`DocumentCollectionReadOnlyItem` sera una primitive compartida que compone
`DocumentCollectionItem`, el contenedor `DocumentCollection(List)` y el visor
de imagenes. La usaran Client Access y la rama de solo lectura administrativa.
Mantiene:

- fila completa accionable excepto acciones independientes futuras;
- tooltip de abrir/cerrar, foco y teclado;
- preview para imagenes y descarga para todos los adjuntos;
- transicion de expand/collapse respetuosa de reduced motion.

No presenta lapiz, uploader, eliminar, formulario, toast de mutacion ni
callbacks de persistencia.

## Registro de Artefactos

| Artefacto                                     | Tipo                         | Ubicacion                                                                               | Responsabilidad                                                                 | Dependencias                                                 | Estado         |
| --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------- |
| `ClientAccessCustomerServiceRecordDetailPage` | componente de modulo         | `src/components/customer-service-records-client-access/`                                | Coordina carga y bloques de detalle cliente.                                    | boundary, slice cliente, ruta compartida                     | new            |
| columna `Detalle`                             | configuracion de tabla       | `src/components/customer-service-records-client-access/clientAccessServicesColumns.tsx` | Expone una entrada persistente y accesible al detalle por fila.                 | Next Link, ruta detalle, i18n                                | modify         |
| page `[recordId]`                             | ruta App Router              | `src/app/dashboard/portal/services/[recordId]/page.tsx`                                 | Declara acceso y workspace de detalle.                                          | page component, permiso READ                                 | new            |
| detalle Client Access                         | tipos, thunk, slice y mapper | `src/features/customer-service-records-client-access/`                                  | Modela y carga respuesta individual sin mezclar estado administrativo.          | endpoint cliente, auth token                                 | modify         |
| ruta de detalle configurable                  | componente de modulo         | `src/components/customer-service-records/CustomerServiceRecordDetailRoute.tsx`          | Conserva layout y navegacion responsive para una lista declarada de secciones.  | `ResourceFormRoute`, compact nav                             | modify         |
| `DocumentCollectionReadOnlyItem`              | componente compartido        | `src/components/documents/DocumentCollectionReadOnlyItem.tsx`                           | Muestra una coleccion sin contratos de mutacion.                                | `DocumentCollectionItem`, adjuntos                           | new            |
| `CustomerServiceRecordDocumentForm`           | componente de modulo         | `src/components/customer-service-records/CustomerServiceRecordDocumentForm.tsx`         | Delega su rama de lectura a la primitive compartida; conserva la rama editable. | `DocumentCollectionReadOnlyItem`, mutaciones administrativas | modify         |
| timeline cliente                              | componente de modulo         | `src/components/customer-service-records-client-access/`                                | Construye hitos desde recepcion hasta entrega al cliente.                       | `ProcessTimeline`, i18n                                      | new            |
| shell migration                               | configuracion de ruta        | `src/components/dashboard-shell/migration/dashboardShellMigration.ts`                   | Breadcrumb y scroll de detalle cliente.                                         | Dashboard shell                                              | modify         |
| locales cliente                               | traducciones                 | `src/locales/en/` y `src/locales/es/`                                                   | Copys de detalle, documentos, errores y timeline.                               | i18next                                                      | modify         |
| detalle API Client Access                     | contrato                     | `org-admin-suite-api/src/internal/.../customer-service-record-client-access/`           | No requiere cambios: ya expone los datos permitidos para esta vista.            | endpoint GET                                                 | reuse          |
| adoption log                                  | documentacion viva           | `docs/ui/adoption-log.md`                                                               | Registrar la adopcion de la vista cliente.                                      | patrones vigentes                                            | modify         |
| receta Resource Form                          | guideline                    | `docs/ui/recipes/resource-form.md`                                                      | No cambia: la receta documental vigente aplica sin extension.                   | receta documental compacta                                   | not_applicable |
| pruebas de feature                            | prueba                       | `src/features/customer-service-records-client-access/*.test.ts`                         | Evidencia el mapeo y ciclo remoto del detalle.                                  | tipos, thunk y slice cliente                                 | new            |
| validacion manual                             | documento de verificacion    | `.specs/.../08-manual-validation.md`                                                    | Evidencia comportamiento visual y de permisos.                                  | navegador, API                                               | new            |

No hay artefactos legacy, experimentos productivos ni limpieza diferida en el
alcance inicial.
