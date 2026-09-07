# Analysis: Customer Service Records Client Access Monitoring

## API Contract

- El modulo es independiente del CRUD administrativo:
  `GET /v1/customer-service-records-client-access`.
- El permiso unico es `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS:READ`.
- El copy de interfaz aprobado por API es `Seguimiento de servicios`.
- Tambien existen lookups contextuales de clientes y tipos de servicio. El
  detalle existe en API, pero no se consume en el MVP frontend.

## Visibility Boundary

- Usuarios externos: READ, relacion vigente usuario-cliente, inclusion del
  usuario en el snapshot del registro y servicio `ACTIVE`.
- Staff interno: READ y servicio `ACTIVE`; no requiere relacion ni inclusion
  en el snapshot.
- La ausencia de relaciones o coincidencias responde coleccion vacia con
  paginacion normal. La frontera se resuelve en backend.

## Public Projection

- El listado expone folio, cliente, tipo de servicio, equipos, observaciones,
  `operational_status` y el bloque completo `customer_delivery`.
- `customer_delivery` incluye fechas, intervalo, politicas y materializaciones
  de estatus y notificaciones propias del compromiso con Cliente.
- No expone proveedor ni sus politicas, materializaciones, eventos o fechas.

## Public Filters and Sorting

- Busqueda por folio, tipo de servicio y campos de equipo; no busca nombre de
  cliente ni proveedor.
- Filtros por cliente, tipo de servicio y rangos de recoleccion y entrega
  estimada al cliente.
- Ordenamientos publicos: folio, recoleccion y entrega estimada.
- No existen filtros, busquedas, rangos u ordenamientos de proveedor.

## Frontend Starting Point

- No existe aun una ruta ni contenedor frontend dedicado para Client Access.
- La tabla administrativa es solo una referencia de patrones tecnicos; no puede
  reutilizarse como contrato porque consulta otro endpoint, permiso y campos.
- No existe una tabla generica del dashboard. El MVP puede usar una
  implementacion dedicada mientras se conserva una frontera clara para una
  futura primitiva compartida.

## Shell Integration

- La politica de migracion en
  `src/components/dashboard-shell/migration/dashboardShellMigration.ts` no
  tiene rutas adoptadas actualmente.
- `NextDashboardShell` recibe breadcrumbs y `scrollMode`, y ya compone sidebar,
  `Workspace Toolbar`, `Workspace Header` y `Workspace Canvas`.
- Para este listado el modo candidato es `page-content`: el contenido de pagina
  conserva el scroll vertical y la tabla el horizontal local.
- La nueva ruta no debe duplicar su breadcrumb dentro del contenido: lo
  entrega `Workspace Header`.

## Risks

- Cambiar la estructura de alto o overflow puede crear scroll competitivo entre
  canvas, pagina y tabla.
- Una entrada de migracion por prefijo podria adoptar accidentalmente alta,
  detalle o edicion.
- Construir la tabla desde varios bloques sin definir una composicion unica
  puede dejar dependencias o primitives cruzadas; el laboratorio debe aislar
  cada bundle antes de promoverlo.
- Las reglas visuales de la vista deben mantenerse locales o basadas en tokens
  compartidos para no contaminar los archivos globales de tema.
