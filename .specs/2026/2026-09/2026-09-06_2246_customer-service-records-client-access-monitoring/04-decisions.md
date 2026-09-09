# Decisions: Customer Service Records Client Access Monitoring

## 2026-09-06 - Primera vista de adopcion

- Decision: iniciar la iniciativa con una ruta nueva de Seguimiento de
  servicios (Client Access) como primera vista para el Next Dashboard Shell.
- Source: indicacion de producto.
- Impact: no se reutiliza ni se modifica la ruta administrativa
  `/dashboard/customer-service-records`; el pathname nuevo permanece pendiente.

## 2026-09-06 - Coexistencia con Legacy

- Decision: mantener Legacy como fallback y adoptar solo mediante una entrada
  exacta en el resolvedor central.
- Source: `docs/ui/dashboard-shell/migration.md`.
- Impact: el rollback consiste en retirar esa entrada sin alterar URL ni logica
  del dominio.

## 2026-09-06 - Contrato de consulta separado

- Decision: consumir solo el modulo y permiso
  `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS:READ` de Client Access.
- Source: spec de API
  `2026-09-03_1307_customer-service-records-client-access`.
- Impact: el MVP es de solo lectura, no presenta proveedor y no reutiliza el
  contrato ni los filtros de gestion interna.

## 2026-09-06 - Compromiso completo con Cliente

- Decision: consumir `operational_status` y las materializaciones del bloque
  `customer_delivery` del contrato Client Access ampliado.
- Source: ampliacion aprobada para la API el 2026-09-06.
- Impact: la vista puede priorizar esas senales sin usar datos de proveedor.

## 2026-09-08 - Portal autenticado extensible

- Decision: ubicar la primera vista en `/dashboard/portal/services`, bajo el
  subgrupo `Servicios` del espacio `Portal`.
- Source: decision de producto.
- Impact: `Portal` no queda acoplado a seguimiento. Habilita incorporar futuras
  capacidades autenticadas de cliente por dominio, sin reorganizar esta ruta.
  El acceso autenticado de proveedores se modelara como subgrupo independiente
  cuando exista.

## 2026-09-08 - Copy neutral de navegacion

- Decision: usar `Portal` y `Seguimiento de servicios` como copy comun para
  todos los actores autorizados.
- Source: decision de producto.
- Impact: no se mezcla `systemRole` con la clasificacion de staff, que no forma
  parte de `AuthUser`. La visibilidad del dato sigue resuelta exclusivamente
  por backend y no se duplican rutas ni permisos.
