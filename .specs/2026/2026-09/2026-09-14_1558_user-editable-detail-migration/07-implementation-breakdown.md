# Desglose De Implementación

## Slice 1. Controles De Colección

1. Agregar `cmdk`.
2. Crear `FormCombobox` y `FormMultiSelect` controlados.
3. Validar interacción, teclado, foco, estados deshabilitado e inválido.

**Cierre:** los controles son reutilizables y no importan módulos de dominio ni
RHF.

## Slice 2. Teléfono

1. Agregar `react-phone-number-input`.
2. Crear `PhoneInput` propio sobre el source inspeccionado.
3. Limitar países a MX, US y CA y preservar `PhoneValue` como API pública.

**Cierre:** el control formatea teléfonos sin cambiar el contrato del backend.

## Slice 3. Detalle Editable

1. Crear `UserEditForm` exclusivo para actualización ordinaria.
2. Integrar cargas, opciones, permissions gates, jerarquía, RHF, Zod,
   `ResourceForm*` y feedback local en la ruta canónica.
3. Crear el redirect de `/edit`.

**Cierre:** lectura y edición autorizada comparten una única ruta y topología.

## Slice 4. Contraseña

1. Crear `UserPasswordDialog` sobre el Dialog canónico.
2. Conectar capability, jerarquía, schema, thunk, feedback local para loading
   y error, y toast posterior al cierre con éxito.
3. Verificar independencia frente a la edición ordinaria.

**Cierre:** ninguna contraseña entra en el formulario ni mutación ordinarios.

## Slice 5. Validación Y Cierre

1. Ejecutar validaciones estáticas disponibles.
2. Ejecutar casos manuales de la matriz de esta spec.
3. Actualizar documentación viva afectada y cerrar formalmente la spec.

**Cierre:** no quedan tareas pendientes ni documentación desactualizada en el
alcance de esta iniciativa.
