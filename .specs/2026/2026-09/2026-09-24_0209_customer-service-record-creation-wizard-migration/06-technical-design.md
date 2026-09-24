# Technical Design: Customer Service Record Creation Wizard Migration

## Composition

```text
CustomerServiceRecordsContainer
  |- CustomerServiceRecordsTable
  |    `- DataTableToolbar.primaryActions -> Nuevo registro
  `- CustomerServiceRecordCreateDialog
       |- Stepper
       |- CustomerServiceRecordCreateRequestStep
       |- CustomerServiceRecordCreateAssetStep
       |- CustomerServiceRecordCreateSummary
       `- in-place discard confirmation
```

El contenedor de modulo decide `CREATE`, abre el dialogo y entrega opciones
remotas. El dialogo es dueño de React Hook Form, paso activo, cierre y submit.
Los pasos reciben solamente controles y datos necesarios; no hacen dispatch,
navegacion ni conocen permisos.

## Form Contract

```ts
type CustomerServiceRecordCreateValues = {
  serviceTypeCode: string;
  requestedAt: string;
  customerId: string;
  customerUserIds: string[];
  asset: {
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
};

type CreateCustomerServiceRecordPayload = {
  serviceTypeCode: string;
  requestedAt: string;
  observations: null;
  customer: { customerId: string; customerUserIds: string[] };
  assets: [
    {
      name: string;
      identifier: string;
      brand: string;
      model: string;
      serialNumber: string;
      observations: null;
    },
  ];
};
```

El schema Zod valida todos los strings obligatorios tras `trim`. Al avanzar,
el wizard usa `trigger` solo sobre el conjunto de campos del paso activo. El
paso de resumen valida el formulario completo antes de llamar al thunk.

`requestedAt` se inicializa como fecha local vigente en `yyyy-MM-dd`; el campo
la presenta y edita como `dd/mm/aaaa`. Seleccionar un cliente limpia
`customerUserIds`, dispara `fetchCustomerRelatedUserOptions` y habilita el
multiselect solo al resolver ese cliente.

Los pasos de captura se envuelven en `FieldGroup`; no basta declarar
`orientation="responsive"` en cada `FormField`, porque ese contenedor activa
sus queries de composicion horizontal. Los comboboxes usados por el wizard se
validan dentro de `Dialog` con opciones suficientes para overflow: deben abrir
sin alterar el estado del dialogo y desplazar su lista internamente. Si el
contrato compartido falla, se corrige en `FormCombobox` o `FormMultiSelect`, no
con una excepcion local del wizard.

## Date Field

`FormDateInput` es un control compartido de formularios. Su valor controlado
es ISO `yyyy-MM-dd`; internamente renderiza un input de texto y un popover con
`Calendar` en modo `single`. La mascara agrega `/` despues de dia y mes, el
blur marca fecha incompleta o invalida y el calendario sincroniza el mismo
valor ISO. No comparte archivo, prop ni estado con `TableFilterDateInput`.

## Toolbar Contract

`DataTableToolbar` suma:

```ts
primaryActions?: ReactNode;
```

El render actual queda ordenado como:

```text
[leading] [search] [filters] [trailing] [settings] [primaryActions]
```

El slot es opcional. Sus consumidores existentes no cambian visualmente. La
tabla administrativa entrega un boton `Nuevo registro` a ese slot, solo si el
contenedor determina `can('CREATE')`.

## Mutation And Feedback

`createCustomerServiceRecord` cambia su argumento al payload especifico de
creacion y usa `buildCreateCustomerServiceRecordBody`. El slice conserva
`mutations.createStatus`, `message` y `lastCreatedRecordId`; no recibe draft.

Al enviar:

1. Se bloquean cierre, navegacion y boton de confirmacion.
2. Un exito hace `reset`, cierra el dialogo, invoca `showToast` y navega con
   `router.push` a `/dashboard/customer-service-records/[id]`.
3. Un error remoto mantiene dialogo, paso y valores; muestra error localizado
   en el flujo sin limpiar el draft.

## Close And Discard State Machine

```text
open + clean draft --close--> closed
open + dirty draft --close--> discard_confirmation
discard_confirmation --continue--> open + same draft + same step
discard_confirmation --discard--> reset --> closed
submitting --close/navigation--> ignored
submitting --success--> reset --> closed --> toast --> legacy detail route
submitting --error--> open + same draft + same step
```

El dialogo intercepta `onOpenChange`, Escape y clic exterior para aplicar esta
maquina. El boton Cancelar usa el mismo handler.

## Responsive And Accessibility

- Dialogo amplio en escritorio y con ancho casi total en movil.
- Cada paso conserva scroll interno solo si su contenido excede el viewport;
  fondo y pagina no adquieren scroll competidor.
- `FormField orientation="responsive"` mantiene etiqueta izquierda y control
  derecho en escritorio, y apila en movil.
- El Stepper comunica paso activo, completo y error; el usuario no salta hacia
  pasos futuros no validados.
- El dialogo conserva foco mediante Radix. El cierre por teclado obedece el
  mismo flujo de descarte.
- Errores se asocian a campos y mantienen foco visible; botones e items de
  catalogo siguen siendo navegables por teclado.

## Legacy Removal

Se eliminan `src/app/dashboard/customer-service-records/new/page.tsx`, la
entrada `customerServiceRecordsCreate` de definicion, tipos y visibilidad de
navegacion, y las ramas `mode="create"` de
`CustomerServiceRecordFormPageContainer` y `CustomerServiceRecordForm`. El
contenedor y formulario legacy permanecen exclusivamente para la ruta de
edicion, sin thunk de create ni `useSnackbar` para alta.

Ninguna ruta nueva reemplaza ese URL; el boton de toolbar es la unica entrada
de creacion. La implementacion debe ejecutar una busqueda final de esos
identificadores y no puede cerrar la slice mientras exista una referencia de
creacion fuera del wizard Next Dashboard.

## Registro de Artefactos

| Artefacto                 | Tipo                  | Ubicacion                                                                            | Responsabilidad                                     | Dependencias                   | Estado         |
| ------------------------- | --------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------ | -------------- |
| `DataTable.types`         | contrato compartido   | `src/components/data-table/DataTable.types.ts`                                       | Declara `toolbar.primaryActions`.                   | React.                         | modify         |
| `DataTableToolbar`        | componente compartido | `src/components/data-table/DataTableToolbar.tsx`                                     | Renderiza el slot al extremo derecho.               | Tipos, settings.               | modify         |
| `FormDateInput`           | control compartido    | `src/components/forms/FormDateInput.tsx`                                             | Fecha ISO con captura localizada y calendario.      | Calendar, Popover, date-fns.   | new            |
| barrel de forms           | export publico        | `src/components/forms/index.ts`                                                      | Exporta el nuevo campo de formularios.              | FormDateInput.                 | modify         |
| tipos de servicio         | tipo de feature       | `src/features/customer-service-records/types.ts`                                     | Declara payload de creacion separado.               | Contrato POST.                 | modify         |
| thunk de registros        | integracion           | `src/features/customer-service-records/customerServiceRecordsThunks.ts`              | Adapta solo el POST minimo.                         | API, tipo nuevo.               | modify         |
| slice de registros        | estado remoto         | `src/features/customer-service-records/customerServiceRecordsSlice.ts`               | Conserva estado de mutacion; no guarda draft.       | Thunk existente.               | reuse          |
| schema de creacion        | schema de modulo      | `src/components/customer-service-records/customerServiceRecordCreateSchema.ts`       | Valida valores del wizard.                          | Zod.                           | new            |
| paso solicitud            | componente de modulo  | `src/components/customer-service-records/CustomerServiceRecordCreateRequestStep.tsx` | Renderiza tipo, fecha, cliente y usuarios.          | forms, opciones.               | new            |
| paso equipo               | componente de modulo  | `src/components/customer-service-records/CustomerServiceRecordCreateAssetStep.tsx`   | Renderiza un equipo obligatorio.                    | RHF, forms.                    | new            |
| resumen                   | componente de modulo  | `src/components/customer-service-records/CustomerServiceRecordCreateSummary.tsx`     | Presenta valores sin edicion.                       | FormReadValue.                 | new            |
| dialogo wizard            | componente de modulo  | `src/components/customer-service-records/CustomerServiceRecordCreateDialog.tsx`      | Coordina RHF, pasos, descarte y mutacion.           | Dialog, Stepper, thunk, toast. | new            |
| tabla administrativa      | componente de modulo  | `src/components/customer-service-records/CustomerServiceRecordsTable.tsx`            | Recibe y entrega accion primaria a toolbar.         | DataTable.                     | modify         |
| contenedor administrativo | composicion de modulo | `src/components/customer-service-records/CustomerServiceRecordsContainer.tsx`        | Resuelve `CREATE`, opciones y dialogo.              | access, Redux, tabla.          | modify         |
| ruta legacy de alta       | ruta legacy           | `src/app/dashboard/customer-service-records/new/page.tsx`                            | Se elimina; no hay redirect.                        | Form legacy.                   | delete         |
| navegacion lateral        | configuracion         | `src/components/sidebar/navigation/{definitions,types,visibility}.ts`                | Retira entrada de alta legacy.                      | Auth.                          | modify         |
| contenedor legacy         | componente legacy     | `src/components/customer-service-records/CustomerServiceRecordFormPageContainer.tsx` | Retira rama `create`; conserva solo edicion.        | Form legacy.                   | modify         |
| formulario legacy         | componente legacy     | `src/components/customer-service-records/CustomerServiceRecordForm.tsx`              | Retira contrato y UI de `create`; conserva edit.    | RHF legacy.                    | modify         |
| traducciones              | copy de modulo        | `src/locales/{es,en}/customerServiceRecords.json`                                    | Añade copy del wizard y errores.                    | i18n.                          | modify         |
| DataTable guideline       | documento vivo        | `docs/ui/patterns/data-table.md`                                                     | Documenta slot primario sin prescribir superficie.  | Contrato DataTable.            | modify         |
| acciones guideline        | documento vivo        | `docs/ui/components/actions-and-buttons.md`                                          | Declara tres superficies sin reglas de asignacion.  | Taxonomia UI.                  | modify         |
| formularios guideline     | documento vivo        | `docs/ui/patterns/resource-form.md`                                                  | Documenta `FormDateInput` y overlays de selectores. | Controles compartidos.         | modify         |
| pruebas unitarias         | verificacion          | N/A                                                                                  | No aplica por norma vigente del repositorio.        | N/A.                           | not_applicable |
