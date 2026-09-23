# Implementation Breakdown: Next Dashboard View Access Foundation

## Slice 1. Shared View Access Boundary

- Crear boundary, contexto y hook en `dashboard-shell`.
- Derivar tipos de `AuthPermissionAccess` y reutilizar `useAuthorization`.
- Implementar no montaje y redirección única con `router.replace('/dashboard')`.
- Exportar contrato público y cubrir el error de hook fuera de provider.

**Closure:** la fundación es independiente de tablas, recursos y transporte
HTTP; `AuthGuard` no cambia.

## Slice 2. First Adoptions And Validation

- Adaptar Seguimiento, Registros de servicio y Detalle editable de Usuario al
  boundary.
- Eliminar guardias locales de `READ` y fallbacks asociados en páginas o
  contenedores.
- Validar navegación autorizada, redirección denegada, ausencia de fetch no
  autorizado y preservación de las tres experiencias.
- Actualizar documentación viva y cerrar la iniciativa.

**Closure:** las tres vistas iniciales siguen un único patrón de acceso y la
norma queda lista para futuras vistas Next Dashboard.
