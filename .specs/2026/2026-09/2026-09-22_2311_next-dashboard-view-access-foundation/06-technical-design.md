# Technical Design: Next Dashboard View Access Foundation

## Artifact Registry

| Artifact                      | Responsibility                                                                    | Boundary                                                        |
| ----------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `DashboardViewAccessBoundary` | Autoriza entrada, evita montaje sin permiso y redirecciona al dashboard.          | No conoce recursos, UI de negocio, HTTP ni tablas.              |
| `DashboardViewAccessContext`  | Provee módulo y consulta de capacidades para descendientes autorizados.           | Existe solo dentro de un boundary de vista.                     |
| `useDashboardViewAccess`      | Consume capacidades de la vista y falla descriptivamente sin provider.            | No navega ni resuelve autorización de entrada.                  |
| `AuthGuard` existente         | Conserva sesión, token e hidratación global de `/dashboard`.                      | No se modifica ni se duplica su responsabilidad.                |
| Ruta consumidora              | Declara módulo y operación de entrada; compone workspace y contenido de la vista. | No ejecuta comprobación imperativa ni construye fallback local. |
| Contenedor consumidor         | Coordina estado de vista, URL, datos remotos y acciones de UI autorizadas.        | Asume entrada autorizada.                                       |

## Public Contract

```tsx
<DashboardViewAccessBoundary module="CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
  <CustomerServiceRecordsContainer />
</DashboardViewAccessBoundary>
```

```ts
const { module, can } = useDashboardViewAccess();

const canCreate = can('CREATE');
```

- `module` usa `AuthPermissionAccess['module']`.
- `requiredOperation` y el argumento de `can` usan
  `AuthPermissionAccess['operation']`.
- Los aliases preservan el contrato dinámico del backend sin crear enums o
  catálogos locales paralelos.
- No hay prop de fallback, notificación, loader local ni ruta de destino
  configurable en v1.

## Authorization Flow

1. `AuthGuard` monta la ruta dashboard solo después de resolver sesión y
   autorización global.
2. La ruta compone su workspace y `DashboardViewAccessBoundary`.
3. El boundary evalúa `hasPermission(module, requiredOperation)`.
4. Con permiso, monta provider y `children`.
5. Sin permiso, no monta provider ni `children`; un efecto protegido por `ref`
   ejecuta `router.replace('/dashboard')` una sola vez.
6. Los componentes internos consultan `can(operation)` sin reimplementar la
   política de entrada de ruta.

## First Adoption

| Route                                 | Module                                   | Entry operation | Change                                                             |
| ------------------------------------- | ---------------------------------------- | --------------- | ------------------------------------------------------------------ |
| `/dashboard/portal/services`          | `CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS` | `READ`          | Mover guardia de entrada del contenedor a la ruta.                 |
| `/dashboard/customer-service-records` | `CUSTOMER_SERVICE_RECORDS`               | `READ`          | Sustituir comprobación manual de página por el boundary.           |
| `/dashboard/users/[userId]`           | `USERS`                                  | `READ`          | Añadir guardia de entrada y consumir `UPDATE` y `UPDATE_PASSWORD`. |

Las tres rutas conservan su composición, estado, thunks y comportamiento de
negocio. La fundación no crea dependencias entre vistas ni entre tipos de
superficie.

## Failure Behavior

- El acceso denegado solo redirecciona al dashboard; no deja UI restringida ni
  emite feedback.
- `useDashboardViewAccess` fuera de provider lanza un error descriptivo en
  cualquier entorno: es un error de integración y no debe simular permisos ni
  devolver una capacidad inventada.
- `router.replace` evita que Atrás restituya la ruta denegada desde el historial
  inmediato.
