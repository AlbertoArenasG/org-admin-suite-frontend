# Lista De Tareas

## Fase 1. Datos y estado

- [x] Sustituir los thunks duplicados por `fetchAssignableUserRoles` hacia `/v1/roles/options`.
      Status: completed
      Cierre: existe una sola adaptación de respuesta y un solo ciclo Redux de carga/error.

## Fase 2. Consumidores

- [x] Migrar invitación, creación y edición al thunk unificado sin alterar formularios o UI.
      Status: completed
      Cierre: no hay referencias a los thunks legacy y las tres páginas conservan sus permisos de escritura.

## Fase 3. Documentación y verificación

- [x] Actualizar el contrato consumido y la deuda técnica de opciones de roles.
      Status: completed
      Cierre: queda registrada la adopción frontend y el retiro backend pendiente.

- [x] Realizar la validación manual de los tres flujos.
      Status: completed
      Cierre: la persona usuaria confirma invitación, creación directa y edición.

- [x] Cerrar formalmente la spec.
      Status: completed
      Cierre: no quedan tareas de esta migración acotada; formularios quedan fuera de alcance.
