# Technical Design

## Current State

La definición funcional ya quedó cerrada. Este documento resume el diseño técnico base aprobado antes de implementación.

## Known Base

- backend resource principal:
  - `internal-asset-maintenance-record`
- frontend ya dispone de módulos reutilizables para seleccionar:
  - grupos de destinatarios
  - políticas de status por vencimiento
  - políticas de notificación por vencimiento

## Module Boundary

- el módulo vivirá bajo una sola frontera de feature state:
  - `src/features/internal-asset-control/*`
- esta frontera concentrará estado y wiring de:
  - listado
  - detalle
  - create/edit
  - follow-up manual al provider
  - catálogos auxiliares consumidos por este flujo
- no debe duplicar el estado administrativo de:
  - `recipient_groups`
  - `expiration_status_policies`
  - `expiration_notification_policies`

## Screen Model

- pantallas explícitas:
  - `list`
  - `create`
  - `detail`
  - `edit`
- no se usarán modales como superficie principal
- el detalle será la superficie rica de lectura operativa
- el follow-up manual al provider vivirá en detalle, no en tabla ni en create/edit

## List Design

- el listado tendrá naturaleza operativa
- columnas base:
  - activo
  - identificador
  - tipo de mantenimiento
  - status persistido
  - estado derivado por vencimiento
  - fecha de vencimiento
  - provider
  - actualizado
- filtros base:
  - búsqueda por activo o identificador
  - status persistido
  - tipo de mantenimiento
  - estado derivado por vencimiento
  - `sentToProvider` si backend lo soporta bien
- sorting base:
  - activo
  - tipo
  - status
  - fecha de vencimiento
  - actualizado
- acciones por fila:
  - ver detalle
  - editar
  - eliminar

## Detail Design

- bloques funcionales:
  - resumen principal
  - datos del registro
  - policies asociadas
  - provider
  - follow-up manual
- el detalle debe permitir comprender el estado completo del registro sin entrar a edit

## Form Design

- bloques de `create/edit`:
  - principal
  - policies
  - provider
- las policies se seleccionarán como recursos ya existentes
- al existir selección, frontend mostrará un resumen mínimo de:
  - nombre
  - estado
  - número de reglas
- no se administrarán policies dentro del formulario

## Status Representation

- frontend mostrará dos señales distintas:
  - `status` persistido
  - estado derivado por vencimiento
- `status` persistido:
  - es operativo
  - es editable
- estado derivado:
  - es calculado
  - no es editable
  - representa urgencia
- el derivado solo se mostrará cuando el registro esté en:
  - `PENDING`
  - `IN_PROGRESS`

## Provider Block

- el bloque provider usará disclosure progresivo
- con `sentToProvider = false`:
  - quedará colapsado o visualmente secundario
  - no será obligatorio
  - conservará valores previos si existían
- con `sentToProvider = true`:
  - se expandirá
  - validará lo que backend exija
- frontend no limpiará automáticamente los datos del bloque al apagarlo

## Expiration Date UX

- `expiration_date` se autocalculará en frontend a partir de:
  - `last_maintenance_at`
  - `interval`
- mientras no exista override manual, frontend seguirá recalculándola
- si el usuario la edita manualmente:
  - se detiene el recálculo automático
  - se mostrará una señal breve de override manual
- existirá una acción explícita para volver a la fecha sugerida
