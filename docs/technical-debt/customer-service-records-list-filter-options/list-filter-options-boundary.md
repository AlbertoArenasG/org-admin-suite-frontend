# Consumo Cruzado de Opciones de Cliente en el Listado de Registros de Servicio

## Estado

| Campo                   | Valor                                                      |
| ----------------------- | ---------------------------------------------------------- |
| Estado                  | Identificada                                               |
| Prioridad               | Alta                                                       |
| Fecha de identificacion | 24 de septiembre de 2026                                   |
| Ultima revision         | 24 de septiembre de 2026                                   |
| Area                    | Listado administrativo de registros de servicio a clientes |
| Alcance actual          | Frontend, opciones de cliente y limite entre features      |

## Resumen

El repositorio ya establece una frontera por feature: cada modulo concentra sus
llamadas HTTP en su archivo de thunks y sus componentes consumen el estado de
ese mismo feature. El listado de registros de servicio rompe ese patron al
importar y ejecutar `fetchCustomerOptions` del feature de clientes, y al leer
directamente su estado para construir las opciones de cliente del filtro.

Tipos de servicio y proveedores ya se cargan correctamente desde
`customerServiceRecordsThunks.ts`. El estado operativo es un enum local sin
endpoint de opciones. Ninguno de esos dos casos constituye esta deuda.

## Alcance Verificado

| Capa                 | Implementacion actual                                       | Inconsistencia                                                         |
| -------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| Controlador de lista | Importa y despacha `fetchCustomerOptions`                   | Un feature ejecuta un thunk perteneciente a otro feature.              |
| Componentes de tabla | Leen `state.customers` y lo transforman en opciones locales | La funcionalidad depende de estado ajeno a `customer-service-records`. |
| Feature de registros | Carga tipos de servicio y proveedores en su propio thunk    | Se mantiene dentro de la frontera correcta.                            |
| Estado operativo     | Catalogo local del enum de dominio                          | No requiere llamada HTTP ni constituye una dependencia cruzada.        |

## Impacto

- El modulo de registros deja de ser autocontenido para una capacidad que
  ofrece en su propia vista.
- Cambios, retiro o evolucion del feature de clientes pueden romper el filtro
  de registros sin que la dependencia sea visible en su frontera publica.
- El controlador y la tabla deben conocer dos modelos de estado para completar
  una sola funcionalidad de filtros.

## Solucion Objetivo

Mover la carga y el estado de opciones de cliente requeridos por el listado a
`customer-service-records`. Su thunk debe llamar directamente el endpoint de
opciones de clientes que necesita esa funcionalidad y guardar el resultado en
el estado del mismo feature.

La tabla, su controlador y el dialogo de filtros solo deben consumir thunks y
estado de `customer-service-records`. Cada feature conserva sus propias
consultas aunque otro feature consulte el mismo endpoint para una necesidad
distinta.

## Criterios de Cierre

- El feature de registros expone y conserva las opciones de cliente que usa su
  listado.
- Ningun componente de `customer-service-records` importa o despacha thunks
  del feature de clientes.
- Ningun componente del listado lee `state.customers`.
- Tipos de servicio, proveedores, clientes y estado operativo siguen
  funcionando en el dialogo de filtros.
- Se valida manualmente la carga, error y recuperacion de los filtros.

## Historial

| Fecha                    | Estado       | Nota                                                                                             |
| ------------------------ | ------------ | ------------------------------------------------------------------------------------------------ |
| 24 de septiembre de 2026 | Identificada | Detectada durante la definicion de detalle y edicion de registros.                               |
| 24 de septiembre de 2026 | Identificada | Se confirma que la frontera por feature ya existe; el cruce hacia clientes es la deuda concreta. |
