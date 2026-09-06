# Acciones y Botones

## Estado

Taxonomía inicial en definición desde el 5 de septiembre de 2026. Se consulta
en `/dashboard-playground/catalog/actions-buttons` antes de incorporar un
componente externo o reutilizable.

## Roles

- `Primary`: una acción principal visible por contexto. Ejemplo: `Crear
invitación` desde el listado de invitaciones.
- `Secondary`: acciones complementarias visibles cuando aportan claridad.
  Ejemplo: `Administrar columnas` en la barra de la tabla de invitaciones.
- `Overflow`: acciones de menor frecuencia o prioridad agrupadas fuera de la
  superficie principal. Ejemplo: ver o reenviar una invitación desde el menú
  de una fila.
- `Destructive`: acciones sensibles o irreversibles con confirmación explícita.
  Ejemplo: `Revocar invitación` desde la fila, después de confirmar.

## Alcance

- `Page Header` admite cero o una acción `primary` y hasta dos `secondary`,
  únicamente cuando afectan el propósito completo de la página y no dependen de
  una tabla, filtro, card o entidad seleccionada.
- `Page Content` contiene filtros, tabs, búsqueda, comandos de tabla y acciones
  masivas. `Administrar columnas`, por ejemplo, pertenece a la barra de su
  tabla, no al `Page Header`.
- Las acciones de fila o entidad pertenecen al registro, tarjeta o detalle que
  afectan.

`Overflow` y `Destructive` no pertenecen al `Page Header` inicial. El primero
solo se incorporará mediante un caso de alcance de página que justifique su
complejidad; el segundo permanece en su flujo de entidad y confirmación.

## Adopción de Componentes

Antes de adoptar un candidato de ChatCN, ReUI u otra fuente se debe validar en
Playground su accesibilidad, API, dependencias, tokens temáticos y coherencia
con esta taxonomía. La vista de negocio no es el primer lugar de integración.
