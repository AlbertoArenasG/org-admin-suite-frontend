# Definition: Next Dashboard View Access Foundation

## Initiative

- Name: `next-dashboard-view-access-foundation`
- Date: `2026-09-22`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

Las vistas de la aplicación resuelven autorización en fronteras distintas:
páginas, contenedores o estados de error de componentes. Las nuevas vistas de
Next Dashboard requieren un patrón único que aplique a cualquier superficie,
no solo a tablas, y que impida montar contenido o ejecutar efectos de una vista
antes de que la autorización de entrada esté resuelta.

## Expected Outcome

- Una frontera compartida de acceso para vistas Next Dashboard.
- Una ubicación normativa para declarar la operación que permite entrar a una
  vista y para esperar la carga de autorización.
- Un mecanismo consistente para que las acciones internas consulten
  capacidades del módulo sin volver a resolver la política de acceso de ruta.
- Las vistas ya migradas de Seguimiento, Registros de servicio y Detalle
  editable de Usuario como primeras adopciones del patrón acordado.

## Included Scope

- Analizar y definir el boundary de autorización de una vista Next Dashboard.
- Definir la responsabilidad entre ruta, boundary, contenido de vista y
  acciones internas.
- Tratar la carga de autorización, acceso denegado y no montaje de contenido
  no autorizado.
- Definir cómo las acciones internas consultan operaciones del mismo módulo.
- Adoptar la fundación en las tres vistas Next Dashboard existentes.
- Documentar la norma para futuras vistas de Next Dashboard.

## Excluded Scope

- Migrar las vistas del dashboard legacy.
- Cambiar la autorización efectiva del backend, endpoints o catálogo de
  permisos.
- Crear un patrón específico para tablas, formularios o detalles.
- Rediseñar fallbacks de acceso de cada módulo más allá de la frontera común.
- Implementar command menus o contratos de acciones de tabla.

## Constraints

- La autorización del backend permanece como control de seguridad definitivo.
- La fundación de frontend controla montaje, experiencia y capacidades de UI;
  no sustituye la validación de API.
- La solución compartida no conoce recursos, textos de negocio, thunks ni
  componentes de tabla.
- El acceso denegado no deja contenido específico de la vista: la fundación
  redirecciona de forma uniforme al dashboard.
- Ninguna vista nueva de Next Dashboard debe inventar una ubicación alternativa
  para autorización de entrada una vez aprobada la fundación.

## Open Decisions

Ninguna. Las decisiones aprobadas están registradas en `04-decisions.md`.
