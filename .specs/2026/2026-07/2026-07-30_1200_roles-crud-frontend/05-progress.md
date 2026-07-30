# Progress

## 2026-07-30

- Se creó la spec `roles-crud-frontend`.
- Se dejó creada la estructura mínima de documentos para trabajar esta iniciativa por varias sesiones sin depender del contexto del chat.
- Se aterrizó `00-definition.md` con las decisiones críticas iniciales del módulo.
- Se dejó `01-analysis.md`, `02-plan.md`, `03-task-list.md`, `06-technical-design.md` y `07-implementation-breakdown.md` como base operativa inicial.
- Se implementó el primer corte real de código del módulo con `src/features/roles/types.ts`, `rolesThunks.ts`, `rolesSlice.ts` e `index.ts`.
- El store global quedó actualizado para registrar `roles` como slice propio, siguiendo el patrón ya usado por módulos administrativos existentes.
- El feature ya consume los endpoints de listado, detalle, create, update, status, delete, módulos y operaciones del backend, con normalización a `camelCase` y sin reintroducir contratos legacy.
- `npm run typecheck` y `npm run lint` volvieron a pasar después de este corte de `Slice 1` y `Slice 2`.
- Se implementó el `Slice 3` del listado de roles con ruta `src/app/dashboard/roles/page.tsx`, contenedor de tabla, búsqueda, sorts, paginación remota y acciones por fila alineadas al patrón existente del repo.
- El listado ya respeta `ROLES/READ` para visibilidad, `ROLES/CREATE` para el CTA de alta y `ROLES/UPDATE` / `ROLES/DELETE` para acciones de fila.
- Los roles protegidos siguen visibles en la tabla y quedan bloqueados para mutación desde la UI mediante su metadata (`is_immutable`, `is_default`, `is_system`).
- Se agregaron namespaces y textos base de `roles` a i18n, además de breadcrumbs y labels mínimos para soportar la nueva ruta.
- Se dejaron cascarones mínimos para `new`, `detail` y `edit` únicamente para evitar navegación rota mientras se implementan los siguientes slices funcionales.
- `npm run typecheck` y `npm run lint` siguieron pasando después del corte de `Slice 3`.
- Se implementó el `Slice 4` reemplazando los cascarones de `new` y `edit` por flujos reales con `RoleForm` compartido.
- El formulario ya consume catálogos de módulos y operaciones del backend y serializa permisos al shape `Array<{ module, operation }>` requerido por la API.
- El editor de permisos quedó agrupado por módulo con chips togglables por operación y con dependencia automática de `READ` cuando se activan operaciones no-lectura.
- El flujo de edición respeta el contrato actual del backend: `name` se muestra como no editable y solo se actualizan permisos.
- Los roles protegidos en edición quedan visibles, pero en modo solo lectura cuando su metadata indica que no son mutables.
- `npm run typecheck` y `npm run lint` siguieron pasando después del corte de `Slice 4`.
