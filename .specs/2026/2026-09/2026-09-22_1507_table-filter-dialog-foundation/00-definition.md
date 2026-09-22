# Definition: Table Filter Dialog Foundation

## Initiative

- Name: `table-filter-dialog-foundation`
- Date: `2026-09-22`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La tabla administrativa de Registros de servicio concentra cinco filtros en la
barra y cuatro rangos de fechas nativos acumulables. Esto ocupa espacio,
fragmenta la experiencia y no ofrece un flujo claro para revisar, descartar o
confirmar cambios antes de alterar el listado.

La aplicación necesita una composición reutilizable para filtros complejos de
tabla: un diálogo con estado borrador, secciones configurables y un único
período de fechas activo cuando aplique. La primera adopción será la tabla de
Registros de servicio.

## Expected Outcome

- Un diálogo de filtros compartido, sin transporte HTTP, permisos ni modelos
  de dominio.
- Un consumidor administrativo de Registros de servicio que conserva su
  búsqueda global, URL, ordenamiento, paginación y contrato API actuales.
- Una experiencia explícita: los cambios en borrador solo afectan resultados y
  URL al confirmar.

## Included Scope

- Diálogo de filtros para tablas complejas, con una o más secciones
  configurables y distribución de una o dos columnas.
- Selectores reutilizables de selección única o múltiple; la búsqueda por
  selector es configurable. La selección única usa radio visual y la múltiple
  usa checks.
- Variante de período con dos campos separados, `Desde` y `Hasta`, y sus
  date pickers individuales. El valor interno es ISO `yyyy-mm-dd`; la captura
  visible en `es-MX` usa `dd/MM/aaaa` con separadores automáticos.
- Período para un campo de fecha o para varios campos, con selector de campo
  solo en el segundo caso y un único rango activo.
- Atajos de período: semana pasada, semana en curso, próxima semana, mes
  pasado, mes en curso y próximo mes.
- Estado aplicado y estado borrador; aplicar, limpiar, cancelar y descarte por
  `X`, Escape o clic fuera.
- Migración de la tabla administrativa de Registros de servicio a la nueva
  composición: tipo de servicio, cliente, estado operativo, proveedor,
  proveedor asignado y un único período sobre uno de sus cuatro campos de
  fecha.
- Responsive, foco, teclado, lector de pantalla y validación manual en todos
  los temas activos.

## Excluded Scope

- El selector integrado de rango de dos meses evaluado en Component Lab. Es un
  experimento aprobado visualmente, pero no se adopta ni se implementa en esta
  iniciativa.
- Migrar otras tablas o retirar el `DashboardFilterMenu`; este popover simple
  conserva sus consumidores y puede servir a casos compactos futuros.
- Nuevos filtros API, cambios de endpoint, permisos, reglas de negocio o
  ordenamiento.
- Filtros multiselección en Registros de servicio: la base los soportará, pero
  este primer consumidor solo usa selección única.
- Chips externos de filtros aplicados; el contexto se conserva dentro del
  diálogo y en cada selector.
- Adopción de bloques del Component Lab o dependencias nuevas.

## Constraints

- El contenedor de módulo continúa coordinando Zustand, URL y thunks; la base
  compartida solo recibe estado y callbacks controlados.
- La búsqueda global se conserva externa al diálogo y con su debounce actual.
- La tabla sigue siendo dueña de ordenamiento y de administración de columnas.
- El diálogo usa primitives canónicas existentes y tokens semánticos vigentes;
  no modifica una primitive global por una necesidad del consumidor.
- El rango integrado permanece explícitamente como experimento aislado y no
  como variante implícita de la API productiva.

## Decision 01. Frontera De Artefactos Compartidos

### Context

La aplicación tiene `src/components/filters/DashboardFilterMenu.tsx`, pero es
un popover de filtros simples. La nueva composición requiere varios artefactos
cohesionados y no debe convertir ese componente en un contenedor genérico de
flujos incompatibles.

### Options

1. Crear `src/components/table-filter/` como fundación exclusiva de tablas.
2. Crear una subcarpeta nueva dentro de `src/components/filters/` y preservar
   `DashboardFilterMenu` como artefacto separado.

### Recommendation

Opción 1. `table-filter` comunica la frontera de dominio de presentación y
evita que la carpeta existente agrupe popovers y diálogos con contratos
distintos solo por llamarse filtros.

### Decision Final

Aprobada la opción 1: crear `src/components/table-filter/`.

### Status

`approved`

## Decision 02. Control Localizado De Fecha

### Context

`LocalizedDateInput` tiene consumidores de control de activos y su contrato
actual es un trigger con calendario propio. No admite captura manual con
máscara ni selectores directos de mes/año, requeridos por el nuevo diálogo.

### Options

1. Extender `LocalizedDateInput` y migrar o validar sus tres consumidores.
2. Crear un control compuesto dentro de `src/components/table-filter/` que
   use `Input`, `Popover` y `Calendar` canónicos.

### Recommendation

Opción 2. Mantiene la API y comportamiento de los consumidores actuales y
encapsula la máscara `dd/MM/aaaa`, el picker y los atajos en la fundación que
los necesita. No crea ni altera una primitive global.

### Decision Final

Aprobada la opción 2: `TableFilterDateInput` será una composición local de
`src/components/table-filter/` con primitives canónicas. `LocalizedDateInput`
conserva su contrato y consumidores actuales.

### Status

`approved`

## Decision 03. URLs Históricas Con Rangos Acumulados

### Context

El contrato URL/API vigente admite los cuatro pares de fechas de forma
acumulable. El nuevo diálogo permite un solo período. Un enlace guardado puede
contener dos o más pares y no puede representarse fielmente en la nueva UI.

### Options

1. Conservar los rangos históricos mientras no se aplique el diálogo; al
   confirmarlo, reemplazarlos por el único período elegido.
2. Normalizar al cargar la URL, conservando solo el primer período por orden
   documentado y eliminando los demás de URL y fetch.
3. Rechazar la combinación histórica con feedback y exigir que el usuario
   seleccione un único período.

### Recommendation

Opción 1. Preserva resultados y enlaces existentes sin cambios silenciosos.
La primera confirmación explícita del diálogo es el momento claro en que la
persona usuaria adopta la regla nueva de un período.

### Decision Final

Se aprueba la opción 1. Los parámetros históricos y resultados permanecen
intactos hasta una confirmación explícita desde el diálogo. Al confirmar, el
único período elegido sustituye los rangos históricos acumulados.

### Status

`approved`

## Legacy Range Presentation

Si URL contiene más de un período histórico, el diálogo los identifica como
criterios heredados no representables por su modelo de un solo período. Abre
sin cambios pendientes y no altera la consulta al cerrarse. La sección de
período comunica el estado y permite elegir un período nuevo para sustituirlos
o usar `Limpiar filtros` para quitarlos deliberadamente.

## Definition Closure

No quedan decisiones críticas abiertas. La implementación puede comenzar con
el registro de artefactos aprobado y debe actualizarlo antes de cualquier
desviación.
