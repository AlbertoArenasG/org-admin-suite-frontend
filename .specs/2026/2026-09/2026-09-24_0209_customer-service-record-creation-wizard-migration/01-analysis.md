# Analysis: Customer Service Record Creation Wizard Migration

## Current State

- La tabla administrativa ya vive en Next Dashboard en
  `src/app/dashboard/customer-service-records/page.tsx` y usa
  `CustomerServiceRecordsContainer`.
- `CustomerServiceRecordsTable` entrega busqueda, filtros y configuracion a
  `DataTable`. `DataTableToolbar` solo tiene `leading`, busqueda, filtros,
  `trailing` y el menu de configuracion; no tiene un slot semantico para una
  accion primaria.
- La creacion actual vive en
  `src/app/dashboard/customer-service-records/new/page.tsx`, usa
  `CustomerServiceRecordFormPageContainer` y conserva patrones legacy,
  incluido `useSnackbar`.
- La navegacion lateral aun enlaza la ruta legacy mediante
  `customerServiceRecordsCreate`.

## Remote Contract

El POST vigente de creacion requiere el contrato minimo:

```ts
{
  service_type_code: string;
  requested_at: string; // yyyy-MM-dd
  observations: null;
  customer: {
    customer_id: string;
    customer_user_ids: string[];
  };
  assets: [{
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serial_number: string;
    observations: null;
  }];
}
```

`CustomerServiceRecordMutationPayload` y `buildMutationBody` son mas amplios:
incluyen entrega al cliente, proveedor, seguimiento y estado operativo. Ese
contrato sigue perteneciendo a edicion legacy y no se debe reutilizar para el
POST nuevo.

## Available Data Sources

| Dato                  | Fuente actual                                     | Uso en wizard              |
| --------------------- | ------------------------------------------------- | -------------------------- |
| Tipos de servicio     | `fetchCustomerServiceRecordOptions`               | Paso 1                     |
| Clientes              | `fetchCustomerOptions`                            | Paso 1                     |
| Usuarios relacionados | `fetchCustomerRelatedUserOptions({ customerId })` | Paso 1, despues de cliente |
| Mutacion              | `createCustomerServiceRecord`                     | Confirmacion               |

Los tres recursos ya tienen slice Redux para datos remotos. El draft de un
dialogo no debe incorporarse a esos slices: su ciclo de vida es local y debe
desaparecer al confirmar descarte o creacion.

## Shared Components

- `Stepper` es controlado y neutral: no posee formulario, dialogo ni
  persistencia. Es apto para los tres pasos.
- `FormField` ya ofrece `orientation="responsive"`, que conserva etiqueta a
  la izquierda en escritorio y apila en movil.
- `FormCombobox` y `FormMultiSelect` cubren catalogos y usuarios relacionados.
- `TableFilterDateInput` tiene el comportamiento de fecha requerido, pero es
  un componente de filtros. No se modifica ni se usa como dependencia de
  formularios. Se creara un campo hermano para formularios.
- `Dialog`, `showToast` y los tokens actuales cubren overlay, foco y feedback.

## Risks And Mitigations

| Riesgo                                    | Mitigacion                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Reintroducir el payload legacy en el POST | Tipo y builder exclusivos de creacion; update conserva su builder actual.                              |
| Draft residual al reabrir                 | `reset` solo tras descarte confirmado o exito; nueva apertura parte de defaults.                       |
| Usuarios de otro cliente en el payload    | Cambio de cliente limpia `customerUserIds` antes de cargar nuevas opciones.                            |
| Cierre accidental                         | Confirmacion in-place solo cuando `isDirty`; dialogo se bloquea durante mutacion.                      |
| Dialogo demasiado alto en movil           | Pasos individuales, campos apilados y contenido con scroll propio solo cuando lo requiera el viewport. |
| Regresion de la tabla                     | Slot toolbar opcional, sin alterar consumidores que no lo usen.                                        |

## Compatibility

- La lista administrativa y su DataTable conservan datos, filtros, filas,
  acciones y scroll.
- En el editor de roles, cualquier operacion no `READ` activa `READ`
  automaticamente y no permite retirarlo mientras exista otra operacion del
  modulo. Por tanto `CREATE` para este recurso siempre concede acceso a la
  tabla que aloja el wizard.
- Las rutas legacy de detalle y edicion permanecen hasta su propia migracion;
  la de detalle es el destino temporal de una creacion exitosa.
- La ruta y enlace legacy exclusivos de creacion se retiran, pues la nueva
  interaccion los sustituye; no se agrega redirect ni compatibilidad historica.
