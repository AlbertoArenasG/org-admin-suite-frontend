# Progress

## Current Phase

Validation.

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
- Se aprobo la separacion tecnica entre lookup de Clientes, feature relacional contextual y extensiones puntuales de Usuarios e Invitaciones.
- Se aprobaron tipos compartidos y estados Redux aislados para opciones, relaciones contextuales y mutaciones.
- Se aprobaron flujos de carga, mutacion y sincronizacion de estado para formularios, detalles y contexto de Clientes.
- Se aprobo la separacion entre filtro global persistido en URL y tabla contextual con estado local.
- Se documento el breakdown de implementacion en seis slices para revision antes de iniciar codigo.
- Se cerro formalmente la fase de Technical Design.
- Se completo el Slice 1: lookup cacheado de Clientes, tipos compartidos y mapeo de detalles de Usuario e Invitacion.
- Se completo el Slice 2: selector multiple reutilizable, carga diferida de opciones y payloads de invitacion y edicion con `customer_ids` para usuarios `USER`.
- Se completo el Slice 3: detalle administrativo de Invitacion, navegacion desde la tabla y seccion reutilizable de Clientes relacionados en detalles de Invitacion y Usuario.
- Se completo el Slice 4: filtro global de Usuarios por Cliente, persistido mediante `customer_id` en URL.
- Se completo el Slice 5: administracion contextual de usuarios desde el detalle de Cliente mediante una feature Redux aislada y permisos `CUSTOMERS/*`.
- Se completo la verificacion estatica final con `npm run typecheck`, `npm run lint -- --quiet` y `git diff --check`.
- Se documentaron los escenarios de validacion manual pendientes para cerrar la spec.

## Next

- Ejecutar y confirmar la validacion manual; despues actualizar el cierre formal e indice de specs.

## Manual Validation Checklist

- Invitar un usuario `USER` sin Clientes y confirmar que el request envia `customer_ids: []`.
- Invitar un usuario `USER` con varios Clientes, revisar el detalle administrativo de la invitacion y consumirla para comprobar sus relaciones efectivas.
- Cambiar el rol seleccionado de `USER` a `ADMIN` y confirmar que el selector se oculta, limpia y el request omite `customer_ids`.
- Editar un usuario `USER`: agregar, remover y conservar Clientes; comprobar que un Cliente inactivo relacionado se muestra solo lectura y no se pierde al guardar.
- Revisar el detalle de Usuario y de Invitacion con y sin Clientes relacionados, incluido el estado localizado de cada Cliente.
- Filtrar `/dashboard/users` por Cliente, verificar `customer_id` en URL, pagina reiniciada, preservacion de busqueda/orden y estado vacio especifico.
- En un Cliente `ACTIVE`, probar agregar y remover usuario; comprobar que la lista y candidatos se actualizan.
- En un Cliente `INACTIVE`, confirmar que el listado se puede consultar y las acciones de mutacion no se muestran.
- Verificar un rol con solo `CUSTOMERS/READ` y otro con `CUSTOMERS/UPDATE`, sin permisos `USERS/*`, para confirmar la frontera contextual.
