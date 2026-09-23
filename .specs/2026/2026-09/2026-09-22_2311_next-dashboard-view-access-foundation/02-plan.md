# Plan: Next Dashboard View Access Foundation

## Architecture

`AuthGuard` conserva la autenticación e hidratación global de `/dashboard`.
`DashboardViewAccessBoundary` añade la autorización de entrada a una vista Next
Dashboard: recibe un módulo y operación, no monta contenido sin permiso y
redirecciona al dashboard. El boundary provee capacidades internas del mismo
módulo mediante un contexto acotado a sus descendientes.

Las rutas declaran la política de entrada. Los contenedores conservan sus
responsabilidades funcionales y usan las capacidades solo para acciones de
interfaz; no vuelven a actuar como guardias de ruta.

## Planned Changes

1. Crear el boundary y hook compartidos en `dashboard-shell`, derivados de
   `useAuthorization` y los tipos de autorización existentes.
2. Exportar la fundación desde el catálogo público de `dashboard-shell`.
3. Adoptar el boundary en Seguimiento de servicios y eliminar su guardia local
   de lectura y el contenido de restricción asociado.
4. Adoptar el mismo boundary en Registros de servicio y eliminar su validación
   manual de ruta y el contenido de restricción asociado.
5. Adoptar el boundary en el detalle editable de Usuario, con `USERS/READ` como
   entrada y capacidades internas para `UPDATE` y `UPDATE_PASSWORD`.
6. Validar redirección, no montaje, capacidades internas y ausencia de
   regresiones visuales o de consulta en las tres vistas.

## Verification

- Con permiso de entrada, cada vista conserva contenido, URL, consultas e
  interacciones actuales.
- Sin permiso de entrada, no se monta el contenedor ni se dispara consulta y
  la navegación termina en `/dashboard` sin notificación.
- El hook de capacidades funciona dentro del boundary y falla descriptivamente
  fuera de él.
- La redirección se emite una sola vez por denegación en desarrollo.
- `typecheck`, lint, build y validación manual completan sin regresiones.
