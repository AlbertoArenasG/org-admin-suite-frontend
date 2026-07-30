# Implementation Breakdown

## Slice 1. Feature Foundation

- crear `src/features/roles/*`
- definir tipos de listado, detalle, payloads y catálogos
- registrar slice en store

## Slice 2. Data Flows

- implementar thunks de listado y detalle
- implementar thunks de create, update, status y delete
- implementar carga de módulos y operaciones

## Slice 3. Roles List

- construir contenedor de listado
- integrar tabla, búsqueda y acciones visibles
- navegar a create/detail/edit

## Slice 4. Role Form

- construir formulario compartido
- modelar editor de permisos por módulo
- integrar validación local y serialización al payload backend

## Slice 5. Detail And Mutations

- construir vista de detalle
- integrar cambio de status
- integrar delete
- reflejar restricciones por metadata real del rol

## Slice 6. Navigation And Final Validation

- integrar entrada del módulo en navegación
- proteger visibilidad por permisos
- validar rutas y flujos principales
- actualizar progreso y docs
