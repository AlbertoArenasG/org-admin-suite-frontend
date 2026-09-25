# Frontera Fragmentada de Opciones del Listado de Registros de Servicio

## Estado

| Campo                   | Valor                                                           |
| ----------------------- | --------------------------------------------------------------- |
| Estado                  | Identificada                                                    |
| Prioridad               | Alta                                                            |
| Fecha de identificacion | 24 de septiembre de 2026                                        |
| Ultima revision         | 24 de septiembre de 2026                                        |
| Area                    | Listado administrativo de registros de servicio a clientes      |
| Alcance actual          | Frontend, opciones de filtro, creacion y limites entre features |

## Resumen

El listado administrativo necesita opciones para filtrar por tipo de servicio,
cliente, proveedor y estado operativo. No existe un contrato propio que
represente esas opciones como una capacidad cohesionada de la pantalla.

La implementacion actual reparte sus fuentes entre tres mecanismos:

- `fetchCustomerServiceRecordOptions` carga en paralelo tipos de servicio y
  proveedores, y los guarda en el feature de registros de servicio.
- `fetchCustomerOptions`, del feature de clientes, carga los clientes que la
  tabla consume directamente.
- El estado operativo se declara como catalogo local en el componente del
  dialogo de filtros.

El wizard de creacion reutiliza incidentalmente los tipos de servicio cargados
por el thunk del listado, aunque no necesita proveedores ni pertenece a ese
caso de uso.

## Alcance Verificado

| Opcion           | Fuente actual                                          | Problema                                                      |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------------- |
| Tipo de servicio | `fetchCustomerServiceRecordOptions`                    | Se carga junto con proveedores y se reutiliza desde creacion. |
| Cliente          | `fetchCustomerOptions` del feature de clientes         | La tabla depende de estado ajeno sin un contrato de pantalla. |
| Proveedor        | `fetchCustomerServiceRecordOptions`                    | Comparte estado y fallo con tipos de servicio.                |
| Estado operativo | Catalogo local en `CustomerServiceRecordsFilterDialog` | No forma parte del contrato de opciones del listado.          |

## Impacto

- La tabla y su dialogo de filtros ensamblan opciones desde estados y
  responsabilidades diferentes.
- La carga y el manejo de errores son parciales y no tienen una frontera unica
  para la capacidad de filtros.
- Creacion queda acoplada incidentalmente a una carga iniciada por el listado.
- Un cambio en cualquiera de las fuentes exige conocer detalles internos de
  otros features para mantener la pantalla.

## Solucion Objetivo

Definir en `customer-service-records` un contrato explicito de opciones para
el listado administrativo. Ese contrato debe exponer al consumidor una sola
estructura con tipos de servicio, clientes, proveedores y estados operativos,
asi como sus estados de carga, error y recarga.

La orquestacion puede agrupar solicitudes remotas cuando responden al mismo
caso de uso de filtros, pero la tabla y sus componentes no deben leer estados
de otros features ni construir catalogos propios. Creacion y futuras vistas de
detalle/edicion deben cargar solamente las opciones que requieren para su
propio caso de uso; no deben depender de la inicializacion del listado.

## Criterios de Cierre

- El listado consume un unico contrato de opciones de filtros.
- El dialogo de filtros no recibe ni compone datos desde varios features.
- Tipos de servicio y proveedores no comparten un estado de error cuando sus
  cargas pueden recuperarse de forma independiente.
- Creacion no depende de la carga de opciones del listado.
- Estados operativos forman parte del contrato visible de opciones del listado.
- Se valida manualmente la carga, error y recuperacion de los cuatro filtros.

## Historial

| Fecha                    | Estado       | Nota                                                               |
| ------------------------ | ------------ | ------------------------------------------------------------------ |
| 24 de septiembre de 2026 | Identificada | Detectada durante la definicion de detalle y edicion de registros. |
