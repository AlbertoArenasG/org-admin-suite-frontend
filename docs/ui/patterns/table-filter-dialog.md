# Table Filter Dialog

`src/components/table-filter/` es la composición compartida para filtros de
tablas complejas que requieren revisar cambios antes de alterar resultados. Se
usa cuando un popover compacto ya no ofrece espacio suficiente para criterios,
períodos o secciones configurables.

## Frontera

La fundación contiene únicamente presentación y estado de borrador:

- `TableFilterDialog` conserva el borrador, permite aplicar, limpiar o
  descartar y no ejecuta efectos remotos.
- `TableFilterSection` agrupa criterios y admite una o dos columnas.
- `TableFilterSelect` configura selección única o múltiple y búsqueda por
  selector. La única usa radio visual; la múltiple, checks.
- `TableFilterDateRange` coordina un único período, para un campo o varios
  campos de fecha.
- `TableFilterDateInput` presenta y captura `dd/MM/aaaa`; normaliza a ISO
  `yyyy-mm-dd` para el valor controlado.

La fundación no importa modelos de dominio, HTTP, rutas, URL, stores,
permisos ni clientes remotos. Cada módulo construye un adaptador entre su
modelo de filtros aplicado y el valor visual del diálogo.

## Contrato De Interacción

- La búsqueda global, el ordenamiento y la administración de columnas
  permanecen fuera del diálogo y siguen siendo responsabilidad de la tabla.
- La toolbar puede mostrar un conteo compacto por categorías aplicadas, sin
  convertirlo en una lista de chips. El módulo define cómo contar sus propios
  criterios y si ofrece una limpieza rápida junto al trigger.
- Abrir el diálogo clona el valor aplicado como borrador. `X`, Escape, clic
  fuera y Cancelar descartan el borrador sin actualizar URL, resultados ni
  fetch.
- Aplicar es el único punto que entrega el borrador al consumidor. El botón
  permanece deshabilitado mientras no exista diferencia con el estado
  aplicado.
- Limpiar modifica solo el borrador. La lista se muestra sin criterios hasta
  confirmar, por lo que el botón primario usa la leyenda `Mostrar todos`.
- Un período de fechas activa solo un campo a la vez. Si el módulo tiene un
  solo campo de fecha, no se muestra selector de campo.

## Adopción

Antes de adoptar el patrón, el contenedor debe conservar la propiedad de sus
thunks, paginación, URL y autorización. Debe pasar opciones remotas completas
al selector y mostrar su estado de carga o error sin trasladar esa lógica a
`table-filter`.

Una limpieza rápida externa es una acción aplicada, no una mutación del
borrador: debe usar el callback que el módulo ya emplea para actualizar
criterios, página, URL y resultados.

La primera adopción es la tabla administrativa de Registros de servicio. Su
adaptador preserva URLs históricas con varios rangos de fecha hasta que una
confirmación explícita sustituye esos criterios por un único período.

El rango integrado de dos meses permanece como experimento de Component Lab;
no es una variante productiva de esta composición.
