# Progress

## Current Phase

Technical Design.

## Completed

- Se creo la spec y se registro el contrato backend disponible.
- Se aprobo el alcance completo de invitaciones, usuarios y clientes.
- Se aprobo el listado contextual de usuarios relacionados en el detalle de Cliente.
- Se aprobo el selector multiple reutilizable para relaciones de usuarios `USER`.
- Se aprobaron las superficies de detalle para clientes relacionados de invitaciones y usuarios.
- Se aprobo el filtro simplificado de Usuarios por cliente relacionado.
- Se alineo la spec con la frontera contextual de Clientes terminada en backend: endpoints dedicados, permisos `CUSTOMERS/*`, lookup de candidatos, asociacion y desasociacion.
- Se retiro toda referencia al parametro eliminado `has_customer_relationship`; el filtro general usa solo `customer_id`.
- Se registro que Clientes inactivos permiten consultar relaciones, pero no mutarlas.
- Se aprobo el copy de negocio `Agregar usuario` para la mutacion contextual de Clientes.
- Se aprobo `Remover usuario` para desvincularlo contextualmente sin eliminar su cuenta.
- Se aprobo el patron visual del selector de Clientes: combobox, chips removibles y relaciones inactivas de solo lectura.
- Se aprobo el componente reutilizable `Clientes relacionados` para detalles de Invitacion y Usuario.
- Se aprobo el filtro de Cliente en Usuarios, incluido su copy, persistencia en URL y estado vacio.
- Se cerro formalmente la fase de Definition.

## Next

- Definir la estructura tecnica, tipos, componentes y slices de implementacion.
