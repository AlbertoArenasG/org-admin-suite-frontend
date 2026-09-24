# Plan: Customer Service Record Creation Wizard Migration

## Approved Solution

La creacion se incorpora a la tabla administrativa de Next Dashboard como una
accion primaria de toolbar. El boton abre un dialogo controlado que compone el
Stepper existente y un formulario local. No se reutiliza la interfaz, el
payload ni el feedback legacy de creacion.

## Execution Order

1. Extender el slot generico de acciones primarias de `DataTableToolbar` y
   documentar las superficies permitidas sin prescribir cual usar por caso.
2. Crear el campo de fecha de formularios, separado de filtros.
3. Separar tipo, schema y builder de creacion del contrato de actualizacion.
4. Implementar dialogo, pasos, resumen, descarte y submit.
5. Conectar permisos, opciones remotas, toolbar, toast y navegacion.
6. Retirar acceso legacy de creacion y ejecutar validacion manual completa.

## Deferred Work

- La ruta de detalle es el destino temporal y se reemplazara en la siguiente
  spec de detalle/edicion.
- Las acciones masivas y seleccion de filas permanecen fuera de este alcance.
- Una futura vista puede decidir otra superficie de accion primaria sin cambiar
  este contrato ni esta migracion.
