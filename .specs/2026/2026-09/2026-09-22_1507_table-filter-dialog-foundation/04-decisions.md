# Decisions: Table Filter Dialog Foundation

## 2026-09-22 - Superficie Para Filtros Complejos

### Decision

Usar un `Dialog` para filtros complejos de tabla, no un popover ni una barra
externa de chips.

### Reason

El caso de Registros de servicio reúne cinco categorías y varios campos de
fecha. El diálogo conserva contexto, espacio y extensibilidad sin saturar la
toolbar. La búsqueda global permanece visible y externa.

### Impact

- El diálogo tiene estado borrador y confirmación explícita.
- El popover existente conserva usos simples futuros, fuera de esta iniciativa.

## 2026-09-22 - Aplicación Explícita Y Descarte Seguro

### Decision

Al abrir se clona el estado aplicado. `Aplicar filtros` actualiza filtros,
página, URL y fetch. `Cancelar`, `X`, Escape y clic fuera descartan el
borrador sin efectos remotos.

### Reason

Evita que la tabla cambie detrás del diálogo y permite inspeccionar el estado
aplicado sin iniciar una operación.

### Impact

- El botón primario permanece deshabilitado sin diferencias entre borrador y
  aplicado; se activa con transición visual sutil al existir cambios.
- Tras limpiar un estado previamente aplicado, el primario comunica
  `Mostrar todos`.

## 2026-09-22 - Período Único Con Dos Pickers Separados

### Decision

La implementación productiva adopta dos date pickers separados y un único
rango activo. Cuando haya varios campos fecha se elige el campo objetivo;
cuando haya uno, ese selector no se presenta.

### Reason

Corresponde al flujo aprobado y evita combinaciones de períodos que no aportan
valor al listado administrativo.

### Impact

- Se limpian las demás parejas de fecha al aplicar el período seleccionado.
- El formato visible es `dd/MM/aaaa`; el API conserva ISO.
- El date range integrado de doble mes no es parte de esta API ni de esta
  implementación.

## 2026-09-22 - Component Lab Como Referencia

### Decision

Los bloques y los dos prototipos de rango del Component Lab son evidencia de
interacción y diseño, no fuente de código ni dependencia del producto.

### Reason

La promoción debe respetar primitives, tokens, i18n y contratos de estado del
frontend.

### Impact

No se agrega paquete ni se importa código desde `component-staging`.

## 2026-09-22 - Frontera Compartida Aprobada

### Decision

Crear la fundación bajo `src/components/table-filter/`, separada de
`src/components/filters/DashboardFilterMenu.tsx`.

### Reason

El menú existente es un popover simple, de selección única y sin borrador. El
diálogo de tabla tiene otra responsabilidad y no debe extender el contrato de
un componente que conserva usos compactos futuros.

### Impact

- La carpeta nueva contiene solo componentes compartidos de filtros de tabla.
- El módulo de Registros de servicio conserva adaptación de dominio, datos y
  URL fuera de esa carpeta.

## 2026-09-22 - Control Localizado De Fecha

### Decision

Crear `TableFilterDateInput` dentro de `src/components/table-filter/`.

### Reason

El control compone `Input`, `Popover` y `Calendar` canónicos para cubrir
captura `dd/MM/aaaa`, máscara, calendario y selectores de mes/año sin ampliar
una primitive con tres consumidores ajenos al flujo de filtros.

### Impact

- `LocalizedDateInput` no se modifica.
- La normalización ISO y la interacción de fecha pertenecen al control local;
  el rango decide únicamente qué campo y valores controla.

## 2026-09-22 - URLs Históricas Con Rangos Acumulados

### Decision

Conservar los rangos múltiples de una URL histórica hasta una confirmación
explícita del diálogo. La nueva selección única los sustituye; `Limpiar
filtros` los elimina deliberadamente.

### Reason

Evita modificar resultados o bookmarks silenciosamente durante la migración a
un único período activo.

### Impact

- El adaptador CSR reconoce el estado heredado sin convertirlo en un borrador
  sucio al abrir.
- La sección comunica que existen varios períodos heredados y solicita una
  acción explícita para reemplazarlos o limpiarlos.
