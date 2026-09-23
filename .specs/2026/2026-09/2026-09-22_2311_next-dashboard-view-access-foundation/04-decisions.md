# Decisions: Next Dashboard View Access Foundation

## Decision 01. Access Boundary Scope

### Decision Final

Se crea `DashboardViewAccessBoundary` como fundación de vistas Next Dashboard.
La ruta declara el módulo y operación de entrada; el boundary determina si el
contenido puede montarse. La solución no conoce tablas, formularios, detalles,
thunks ni modelos de negocio.

`AuthGuard` conserva sesión e hidratación global. El nuevo boundary solo
resuelve autorización de una vista ya montada dentro de `/dashboard`.

### Status

`approved`

## Decision 02. Denied Access Behavior

### Decision Final

Si falta la operación de entrada, el boundary no monta `children` y ejecuta
`router.replace('/dashboard')`. No muestra fallback por módulo, pantalla de
acceso denegado, notificación, toast ni contenido transitorio de la vista
denegada.

El destino es fijo en esta primera versión. No se agrega una prop para rutas
alternativas sin un caso de uso aprobado.

### Status

`approved`

## Decision 03. Internal Action Capabilities

### Decision Final

El boundary expone un contexto acotado a la vista con el módulo y una función
para consultar operaciones internas. Los componentes descendientes consumen
`useDashboardViewAccess()` para decidir capacidades como `CREATE`, `UPDATE` y
`DELETE`; no vuelven a crear una frontera de acceso de ruta.

El hook falla descriptivamente si se usa fuera del boundary para detectar una
adopción incompleta y no simular permisos inexistentes.

### Status

`approved`

## Decision 04. First-Version Limits

### Decision Final

La primera versión admite un módulo y una operación de entrada por vista. No
soporta políticas compuestas, destinos alternativos ni migración de dashboard
legacy sin un consumidor y decisión posterior.

### Status

`approved`
