# Plan: Customer Service Record Creation Wizard Migration

## Approved Solution

La creacion se incorpora a la tabla administrativa de Next Dashboard como una
accion primaria de toolbar. El boton abre un dialogo controlado que compone el
Stepper existente y un formulario local. No se reutiliza la interfaz, el
payload ni el feedback legacy de creacion.

## Execution Order

1. Retirar completamente la creacion legacy: ruta, navegacion, modos de
   formulario, thunk y estado exclusivo de alta. Conservar las piezas
   compartidas solo para edicion.
2. Extender el slot generico de acciones primarias de `DataTableToolbar` y
   documentar las superficies permitidas sin prescribir cual usar por caso.
3. Crear el campo de fecha de formularios, separado de filtros.
4. Declarar tipo, schema, estado y builder de creacion nuevos, sin reutilizar
   el contrato de actualizacion.
5. Implementar dialogo, pasos, resumen, descarte, submit y adopcion en tabla.
6. Ejecutar validacion manual completa y barrido de retiro legacy.

## Deferred Work

- La ruta de detalle es el destino temporal y se reemplazara en la siguiente
  spec de detalle/edicion.
- Las acciones masivas y seleccion de filas permanecen fuera de este alcance.
- Una futura vista puede decidir otra superficie de accion primaria sin cambiar
  este contrato ni esta migracion.
