# Task List

## Phase 1. Definition And Contracts

- [x] Cerrar decisiones del modelo frontend de auth y permisos
      Status: done

- [x] Aterrizar el shape interno objetivo para usuario autenticado y permisos
      Status: done

- [x] Aterrizar los contratos backend que realmente consumira frontend
      Status: done

## Phase 2. Auth And Permission Foundation

- [x] Migrar `src/features/auth/*` al nuevo modelo principal
      Status: done

- [x] Implementar carga y manejo de permisos efectivos del usuario autenticado
      Status: done

- [x] Crear una capa reusable de checks de permisos para UI
      Status: done

- [x] Adaptar consumidores iniciales de auth al nuevo shape sin reintroducir compatibilidad legacy
      Status: done

## Phase 3. Users And Invitations

- [x] Migrar `usersThunks` y `usersSlice` al nuevo contrato
      Status: done

- [x] Migrar pantallas y componentes de usuarios
      Status: done

- [x] Migrar invitaciones y registro publico asociado
      Status: done

- [x] Eliminar la normalizacion de roles asignables hacia enums legacy
      Status: done

## Phase 4. Navigation And Remaining UI

- [x] Migrar sidebar y visibilidad de modulos
      Status: done

- [x] Migrar dashboard a composicion dinamica basada en acceso real
      Status: done

- [x] Migrar checks legacy restantes en tablas, forms y actions
      Status: done

- [x] Eliminar helpers, tipos y parseos legacy obsoletos
      Status: done

## Phase 5. Validation And Cleanup

- [x] Verificar rutas, auth y acciones principales despues de la migracion
      Status: done

- [x] Limpiar residuos legacy del store, persistencia local y helpers compartidos
      Status: done

- [x] Actualizar docs frontend relacionadas si aplica
      Status: done
