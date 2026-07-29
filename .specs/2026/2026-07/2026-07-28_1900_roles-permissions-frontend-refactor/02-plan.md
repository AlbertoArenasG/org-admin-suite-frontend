# Plan

## Objective

Migrar el frontend desde el modelo legacy basado en enums de rol hacia un modelo basado en `system_role`, `role_id`, permisos efectivos y catálogos reales de roles.

## Target Design

### Auth

- reemplazar el modelo compartido de `AuthUser`
- cargar y persistir:
  - `systemRole`
  - `roleId`
  - metadata del rol actual
  - `modules`
  - `permissions`

### Authorization

- crear una capa comun para checks de permisos
- eliminar ranking legacy de roles como fuente principal de visibilidad
- reservar `systemRole` para decisiones estructurales

### User Management

- migrar formularios, tablas y acciones de usuarios
- usar roles asignables reales desde backend
- dejar de normalizar `role_id` contra enums legacy

### Navigation And Feature Visibility

- alinear sidebar y acciones condicionales con permisos o modulos efectivos

## Phases

### Phase 1. Definition And Contracts

- cerrar decisiones del modelo frontend de auth y permisos
- definir el shape interno objetivo
- aterrizar contratos backend realmente consumidos por frontend

### Phase 2. Auth And Permission Foundation

- migrar `auth` al nuevo shape
- cargar permisos efectivos del usuario autenticado
- crear helpers o hooks de autorizacion reutilizables

### Phase 3. Users And Invitations

- migrar CRUD de usuarios
- migrar lista de roles asignables
- migrar invitaciones y registro publico relacionado

### Phase 4. Navigation And Remaining UI

- migrar sidebar
- migrar checks condicionales de service entries u otros modulos que hoy usen ranking legacy
- eliminar helpers y tipos obsoletos

### Phase 5. Validation And Cleanup

- validar rutas y estados principales
- remover residuos legacy
- actualizar docs frontend si hace falta

## Sequencing Notes

- no tocar pantallas masivas antes de cerrar la base de auth y permisos
- no mezclar permisos nuevos con ranking legacy salvo en compatibilidad muy localizada y temporal
- priorizar primero las zonas donde el frontend hoy depende directamente de `role`

## Exit Criteria

- el frontend deja de depender de `parseUserRole()` como base de autorizacion
- `AuthUser` ya no modela `role` legacy como contrato principal
- las acciones de usuarios e invitaciones usan `systemRole` y `roleId`
- existe una capa reusable de permisos en frontend
- los checks de visibilidad principales ya no dependen de enums legacy
