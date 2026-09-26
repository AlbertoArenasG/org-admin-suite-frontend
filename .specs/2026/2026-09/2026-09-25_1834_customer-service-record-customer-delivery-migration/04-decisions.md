# Decisions: Customer Service Record Customer And Delivery Migration

## 2026-09-25: Independent Customer And Delivery Form

`Cliente y compromiso de entrega` será un `ResourceForm` independiente. Usa
el registro canónico común, pero mantiene modo, draft, validación y mutación
locales. No se crea ni anida un formulario global.

## 2026-09-25: Feature-Owned Dependencies

Los thunks que resuelven clientes, usuarios relacionados y políticas se
declaran en `customerServiceRecordsThunks.ts`; su estado vive en el slice del
mismo feature. Un endpoint puede existir para otro módulo, pero este bloque no
consume sus thunks ni estado.

## 2026-09-25: Scroll Spy As Semantic Anchor Navigation

La vista incorpora navegación de anclas para sus dos secciones. El enlace
activo se deriva de la sección visible mediante `IntersectionObserver`; al
activarlo desplaza a la sección respetando el encabezado fijo. No son tabs
ARIA porque no alternan paneles ni ocultan contenido.

## 2026-09-25: Estimated Delivery Date

La fecha estimada es un `FormDateInput` editable. El cliente la calcula como
ayuda al cambiar recepción o intervalo hasta que el usuario introduzca una
fecha explícita. Al limpiarla se envía `null`; backend mantiene la fuente de
verdad y la recalcula si cuenta con datos base.

## 2026-09-25: Form UX And Permissions

La sección adopta los mismos patrones de la vista de usuario y del primer
bloque: `READ` muestra lectura, `UPDATE` habilita edición, cancelar restablece
el valor canónico, éxito tiene feedback de 800 ms y error conserva el draft.
