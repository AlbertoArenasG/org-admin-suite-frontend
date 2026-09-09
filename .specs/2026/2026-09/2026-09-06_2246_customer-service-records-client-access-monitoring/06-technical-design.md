# Technical Design: Seguimiento de Servicios (Client Access)

## Status

Implementacion completada y pendiente de validacion manual integrada. Esta
iniciativa sigue abierta hasta validar la ruta con usuarios autorizados y el
contrato HTTP real.

## Route And Navigation

- Ruta publica: `/dashboard/portal/services`.
- El resolvedor de migracion registra exclusivamente la coincidencia exacta de
  esa ruta con `NextDashboardShell`, breadcrumbs `Portal` y `Seguimiento de
servicios`, y `scrollMode: 'page-content'`.
- El sidebar incorpora el grupo `portal`, con `portalServices`, visible solo con
  `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS:READ`.
- `Panel` pertenece siempre al grupo Dashboard y la casita del rail siempre se
  muestra. Portal no altera la estructura base de navegacion segun permisos.
- El grupo y la entrada usan copy neutral para todos los actores. La vista no
  interpreta `systemRole` ni intenta reproducir `isInternalStaff`: el backend
  decide el alcance de los resultados en cada solicitud.
- El grupo queda abierto para futuras capacidades autenticadas. Servicios es la
  primera capacidad de dominio; otras capacidades de cliente se agregaran por
  dominio. Un futuro acceso autenticado de proveedores sera un subgrupo separado.

## Data Boundary

```text
page -> ClientAccessServicesContainer -> feature thunk -> API client
                              |                 |
                              v                 v
                       Zustand query UI     Redux remote state
                              |
                              v
                         DataTable v9
```

- La feature dedicada consume solo
  `GET /v1/customer-service-records-client-access`.
- El thunk serializa los parametros permitidos y adapta el envelope HTTP a un
  modelo de lectura propio. No se importan tipos, thunks, slices, selectores ni
  query helpers de `customer-service-records` administrativo.
- Redux conserva filas, paginacion, estado de solicitud y error remoto.
- Un store Zustand local conserva pagina, limite, busqueda, ordenamiento,
  columnas visibles y filas expandidas. No duplica filas ni metadata remota.
- La URL es la fuente sincronizable de pagina, limite, `search` y un solo
  ordenamiento. El input se aplica con debounce y reinicia a pagina uno; atras
  y adelante rehidratan el store. No se emiten filtros ni lookups en el MVP.

## Query Contract

| UI          | Query API                       | Regla                                                                 |
| ----------- | ------------------------------- | --------------------------------------------------------------------- |
| Pagina      | `page`                          | Base uno; default `1`.                                                |
| Tamano      | `limit`                         | Valores iniciales `10`, `25`, `50`; nunca usar `items_per_page`.      |
| Busqueda    | `search`                        | Placeholder: `Buscar por folio, servicio o equipo`.                   |
| Folio       | `sort[0][field]=service_number` | Columna ordenable.                                                    |
| Recoleccion | `sort[0][field]=received_at`    | Columna ordenable.                                                    |
| Entrega     | No ordenable en MVP.            | Muestra la fecha real cuando existe; de otro modo, la fecha estimada. |

El primer release no muestra filtros multicampo, selects ni rangos, aunque el
endpoint los soporte. Esa interfaz se define en una spec posterior. La falta de
criterios no se representa en la URL; una busqueda activa si participa en los
estados `emptyFiltered` y en limpiar criterios.

## Table Composition

La tabla usa `DataTable` con `rowLayout: 'multiline'`; por ello no expone el
selector global de densidad. Su fila usa la altura `comfortable` y se limita a
dos líneas; información adicional se muestra en el detalle expandido.

| Columna                | Contenido                                                                                                            | Prioridad visual                                                | Interaccion                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Folio                  | `service_number`                                                                                                     | Identificador de referencia.                                    | Ordenable.                                                                   |
| Equipo y servicio      | `assets[].name`, `assets[].identifier`, `service_type.name`.                                                         | Equipo como texto primario y servicio como contexto secundario. | Columna principal multilínea; resaltado de texto al buscar.                  |
| Estado operativo       | Estado localizado de `operational_status`.                                                                           | Senal dominante.                                                | No ordenable en MVP.                                                         |
| Compromiso con cliente | Badge semantico de `customer_delivery.status_materialization`, con nombre y color entregados por el contrato.        | Senal dominante.                                                | No ordenable.                                                                |
| Recoleccion            | `customer_delivery.received_at`.                                                                                     | Fecha dominante.                                                | Ordenable.                                                                   |
| Entrega                | `customer_delivery.delivered_to_customer_at` cuando existe; de otro modo, `customer_delivery.estimated_delivery_at`. | Fecha dominante; etiqueta explicita `Entregada` o `Estimada`.   | No ordenable en MVP: backend solo expone ordenamiento por la fecha estimada. |
| Detalles de equipo     | `assets[].brand`, `assets[].model`, `assets[].serial_number`.                                                        | Contexto tecnico secundario, en dos líneas como maximo.         | Resaltado de texto al buscar.                                                |
| Cliente                | `customer.name`.                                                                                                     | Contexto secundario, al final de la tabla.                      | Puede requerir scroll horizontal; no participa en resaltado de busqueda.     |

- Cada estado conserva etiqueta textual; el color nunca es la unica senal.
- La presentacion de la materializacion se encapsula en un renderer local de
  Client Access. Usa el color autorizado por el contrato sin modificar
  primitives ni tokens globales.
- No se muestran columnas ni datos de proveedor, solicitudes, politicas,
  eventos o fechas internas.
- La expansion usa el disparador semantico `feedback`, con indicador sutil
  mientras hay contenido por consultar. Se habilita si existen observaciones
  generales o `assets[].observations`; su region presenta ambas fuentes con el
  equipo identificado. No solicita el endpoint de detalle ni crea una ruta de
  detalle en esta version.
- No hay seleccion multiple, acciones de fila, edicion ni toolbar de filtros.
- Fullscreen no se habilita en esta ruta. La capacidad compartida permanece
  disponible para futuras vistas que justifiquen ampliar la tabla.
- No se habilita `stickyHeader` inicialmente: `page-content` es dueño del
  scroll vertical y la tabla solo conserva scroll horizontal local. Activarlo
  requerira una region de tabla acotada que sea dueña de ambos ejes.

## Remote States And Accessibility

- `loading`: conserva encabezados y presenta skeleton por filas con el spinner
  `RefreshCw` junto al titulo.
- `error`: muestra error recuperable y reintenta el mismo query desde el
  contenedor.
- `empty`: ausencia real de registros, incluidas relaciones externas vacias.
- `emptyFiltered`: una busqueda sin resultados permite limpiar el criterio.
- La tabla conserva nombres accesibles para busqueda, ordenamiento, expansion,
  settings, fullscreen y paginacion. Fechas date-only se formatean con locale
  hidratado sin desplazar dia por zona horaria.

## Artifact Register

| Artefacto            | Ubicacion                                                                                    | Responsabilidad                                                             | Estado |
| -------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| Ruta                 | `src/app/dashboard/portal/services/page.tsx`                                                 | Compone guard y contenedor de la vista.                                     | new    |
| Feature              | `src/features/customer-service-records-client-access/`                                       | Tipos de lectura, slice y thunk dedicado al endpoint Client Access.         | new    |
| Query helper         | `src/utils/customerServiceRecordsClientAccessQuery.ts`                                       | Serializa y rehidrata pagina, limite, busqueda y sort permitido.            | new    |
| Store UI             | `src/components/customer-service-records-client-access/useClientAccessServicesTableStore.ts` | Estado local de query, visibilidad y expansion.                             | new    |
| Contenedor           | `src/components/customer-service-records-client-access/ClientAccessServicesContainer.tsx`    | Coordina URL, store, Redux, permiso y `DataTable`.                          | new    |
| Columnas y renderers | `src/components/customer-service-records-client-access/`                                     | Define columnas, estados semanticos y expansion sin dominio administrativo. | new    |
| Navegacion           | `src/components/sidebar/navigation/`                                                         | Registra grupo, entrada, tipos, visibilidad y copy localizado de Portal.    | modify |
| Shell migration      | `src/components/dashboard-shell/migration/dashboardShellMigration.ts`                        | Adopta solo la ruta exacta en Next Dashboard Shell.                         | modify |
| Locales              | `src/locales/{es,en}/`                                                                       | Copy de Portal, tabla y estados.                                            | modify |

## Validation Gate

- Usuario con permiso y `is_internal_staff` persistido ve registros `ACTIVE` de
  todos los clientes.
- Usuario externo con permiso ve solo registros autorizados; sin relaciones
  obtiene respuesta vacia, no error.
- Usuario sin permiso no dispara request ni ve la tabla.
- Busqueda, ordenamiento y paginacion actualizan URL, solicitan el endpoint
  dedicado y restauran su estado con atras/adelante.
- La vista no expone datos de proveedor en columnas, expansion, requests ni
  estados vacios.
- Se valida manualmente escritorio, movil y cada tema activo, incluidos
  loading, error, vacio, busqueda vacia y fullscreen.
