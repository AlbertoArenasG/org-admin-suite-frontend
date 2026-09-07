# Definition: Seguimiento de Servicios (Client Access)

## Initiative

- Name: `customer-service-records-client-access-monitoring`
- Date: `2026-09-06`
- Definition status: `in_progress`
- Implementation ready: `no`

## Problem

Los clientes necesitan consultar el seguimiento de sus servicios sin acceder a
la gestion interna. El staff tambien puede usar la misma superficie de solo
lectura para consultar servicios activos. Esta es la primera vista que se
adoptara al Next Dashboard Shell.

## Expected Outcome

Una ruta nueva de Seguimiento de servicios se muestra dentro del nuevo host del
dashboard. Consulta exclusivamente el contrato de Client Access y ofrece un
listado legible de servicios activos para cada actor autorizado, sin exponer
informacion de proveedor ni capacidades de gestion interna.

## Included Scope

- Definir y adoptar la ruta nueva de Seguimiento de servicios al Next Dashboard
  Shell. No se reutiliza la ruta administrativa.
- Composicion de la pagina, breadcrumb, superficie de trabajo y dueno de
  scroll para la vista de listado.
- Integracion del listado, lookups contextuales, filtros, paginacion y
  ordenamientos del contrato Client Access.
- Permiso unico `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS:READ`.
- Señales predominantes: estatus operativo, fecha de recoleccion y fecha
  estimada de entrega al cliente, junto con el estatus materializado del
  compromiso con Cliente.
- Criterios de responsive, accesibilidad, carga, vacio, error y temas.

## Excluded Scope

- Alta, edicion, eliminacion y cambio de estatus.
- El detalle, aunque el API lo soporte, queda fuera de la primera version.
- Cambios al contrato API ya cerrado, salvo la decision explicita sobre el
  estatus materializado.
- Retiro del shell legado o adopcion de otras rutas.
- Exposicion de proveedor, sus fechas, filtros, lookups, politicas o eventos.

## Constraints

- La ruta administrativa `/dashboard/customer-service-records` conserva su
  shell y comportamiento actuales; no es parte de esta iniciativa.
- La politica central de migracion debe resolver esta ruta de forma exacta; no
  adopta por prefijo rutas administrativas ni futuras rutas hijas.
- El frontend usa exclusivamente
  `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS:READ` y los endpoints dedicados
  `/v1/customer-service-records-client-access`.
- Un usuario externo requiere permiso, relacion vigente con el cliente,
  inclusion en el snapshot `customer.users` del registro y servicio `ACTIVE`.
  Si no tiene clientes asignados, entra a la vista pero recibe un listado vacio.
- El staff interno con el permiso consulta todos los registros `ACTIVE`; el
  backend resuelve esta condicion desde persistencia, no desde el frontend.
- Los controles y superficies deben consumir tokens compartidos y recetas
  locales por componente; no se agregan overrides globales exclusivos de esta
  vista a los archivos de tema.
- Solo un contenedor puede ser dueño del scroll vertical. La tabla conserva
  scroll horizontal local cuando sea necesario.

## Initial Acceptance Criteria

- El listado usa la proyeccion exclusiva de Client Access y no muestra datos de
  proveedor, politicas, eventos, fechas internas ni acciones de gestion.
- El listado conserva su estado al abrir una URL con pagina, limite, busqueda,
  filtros u ordenamiento admitidos por Client Access.
- La navegacion atras y adelante resincroniza la vista desde la URL.
- La ausencia de permiso de lectura no consulta ni expone la tabla.
- Un externo sin relaciones vigentes o sin registros asociados ve una tabla
  vacia normal, no un error de autorizacion.
- El staff interno autorizado ve todos los registros activos sin requerir
  relaciones cliente-usuario.
- Carga, vacio, error y reintento permanecen operables.
- En escritorio, movil y los temas disponibles no hay scroll vertical
  competitivo ni overflow horizontal del canvas.
- La integracion frontend se valida contra una respuesta HTTP real del contrato
  ampliado antes de promover la ruta a produccion.

## Open Questions

- Definir el pathname publico de la nueva vista. No puede reutilizar la ruta
  administrativa `/dashboard/customer-service-records`.
- Confirmar la composicion visual final del listado despues de evaluar bloques
  en el laboratorio de componentes.

## Gate

No iniciar la implementacion de la ruta hasta definir el pathname y cerrar la
composicion visual. La exploracion en el laboratorio de componentes puede
continuar en paralelo.
