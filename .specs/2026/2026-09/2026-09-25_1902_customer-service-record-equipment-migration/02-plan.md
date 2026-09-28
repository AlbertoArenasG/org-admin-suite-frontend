# Plan: Customer Service Record Equipment Migration

## Slice 1: Feature Contract

- Añadir el payload, thunk, estados de mutación y reducers de actualización de
  equipo dentro de `customer-service-records`.
- Mapear el payload PATCH parcial de cada subsección sin derivar datos ajenos.
- Reemplazar el detalle canónico con la respuesta del PATCH.

## Slice 2: Equipment Section

- Crear el formulario de datos y tres colecciones documentales independientes
  dentro del mismo frame de `Equipo`.
- Montar la tercera sección y extender la navegación por anclas.
- Representar el estado no editable si no existe `assets[0]`.
- Añadir copys localizados ES/EN.

## Slice 3: Verification And Closure

- Ejecutar typecheck, lint focalizado y revisión de diff.
- Validar manualmente permisos, edición, error, colecciones documentales,
  ausencia de equipo y comportamiento responsive.
- Actualizar progreso, adopción y el índice de specs al cerrar.
