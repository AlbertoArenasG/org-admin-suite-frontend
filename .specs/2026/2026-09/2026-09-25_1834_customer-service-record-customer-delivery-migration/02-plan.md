# Plan: Customer Service Record Customer And Delivery Migration

## Delivery Order

1. Extender el contrato, mapper, thunks y slice del feature para opciones del
   bloque y su PUT.
2. Añadir la navegación de anclas con scroll spy y el formulario independiente
   de cliente y compromiso de entrega a la vista existente.
3. Verificar estáticamente, validar manualmente y cerrar documentación.

## Non-Goals

- No se cambia la ruta, el breadcrumb dinámico ni el bloque de detalles.
- No se absorbe deuda del listado ni se consumen dependencias de otros
  features.
- No se crean pruebas unitarias; la validación visual y funcional es manual.
