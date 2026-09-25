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

Una vista con tabla puede ubicar acciones primarias en cualquiera de estas
tres superficies: `Page Header`, encabezado de tabla o toolbar de tabla. La
spec de cada vista decide la superficie y la composición; esta guía no asigna
casos de uso ni prioridad a una ubicación específica.

Las acciones de fila o entidad permanecen en el registro, tarjeta o detalle
que afectan.

## Mutaciones Pendientes

`Button` admite `loading` y `loadingLabel` para mutaciones asíncronas. Mientras
está pendiente, se deshabilita, comunica `aria-busy` y muestra un spinner
animado junto al copy transitorio. Las vistas deben usar este contrato en vez
de ensamblar spinners locales o adoptar controles legados.

`Overflow` y `Destructive` no pertenecen al `Page Header` inicial. El primero
solo se incorporará mediante un caso de alcance de página que justifique su
complejidad; el segundo permanece en su flujo de entidad y confirmación.

## Adopción de Componentes

Antes de adoptar un candidato de ChatCN, ReUI u otra fuente se debe validar en
Playground su accesibilidad, API, dependencias, tokens temáticos y coherencia
con esta taxonomía. La vista de negocio no es el primer lugar de integración.
