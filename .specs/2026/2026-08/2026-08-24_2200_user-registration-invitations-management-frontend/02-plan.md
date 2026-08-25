# Plan

## Objective

Implementar la administracion frontend de invitaciones de registro de alcance ordinario, respetando el contrato backend ya cerrado y los patrones vigentes de la aplicacion.

## Implementation Order

1. Crear la frontera de feature y mover la creacion existente sin alterar su contrato.
2. Agregar estado Redux, thunks y tipos para listado, reenvio y revocacion.
3. Integrar reducer, localizacion, navegacion y la ruta protegida visualmente por permisos.
4. Construir la tabla operativa con URL sincronizada.
5. Integrar dialogs, mutaciones, reconciliacion y feedback por fila.
6. Validar manualmente y cerrar la documentacion de la spec.

## Constraints

- No cambiar contratos ni reglas de negocio de backend.
- No duplicar evaluacion de permisos o de estados de invitacion en frontend.
- No agregar detalle individual ni otra tarjeta de dashboard.
- No duplicar `fetchUserRoles`; el catalogo compartido permanece en `features/users`.
- No modificar la superficie de invitaciones `MASTER_ADMIN`.
- Mantener localizacion completa en espanol e ingles.

## Validation Strategy

- Verificacion estatica: lint dirigido y typecheck del frontend.
- Validacion manual: permisos, listado, consulta URL, acciones, errores, metadata heredada y redireccion posterior a crear.
- No se planean pruebas automatizadas nuevas en esta spec, salvo que aparezca una necesidad concreta durante implementacion.

## Plan Status

`proposed`
