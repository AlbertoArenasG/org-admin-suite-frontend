# Sticky Collapsible Page Header

## Estado

Contrato aprobado el 1 de septiembre de 2026. La implementación se validará
primero en una ruta temporal de `/dashboard-playground`; no corresponde aún a
una adopción productiva.

## Propósito

Permitir que una ruta conserve el contexto esencial de su `Page Header` durante
un scroll largo sin mantener visible el encabezado expandido ni quitar espacio
innecesario al contenido operativo.

Es una variante opcional de `Page Header`. No aplica a todas las vistas.

## Estructura

```text
Workspace Header fijo
Sticky Collapsible Header opcional
Page Composition scrolleable
  Page Header expandido
  Page Content
```

- El `Page Header` expandido participa normalmente en el scroll y sale del
  viewport.
- `Sticky Collapsible Header` es una segunda representación compacta que
  aparece al cruzar un umbral de scroll y desaparece al regresar.
- No es una transformación ni una reducción del mismo nodo DOM.
- `Workspace Header` conserva su posición fija por encima del header compacto.

## Compatibilidad de Scroll

La primera implementación solo se permite con `Page Composition Scroll`:
`Workspace Header` queda fijo y `Page Composition` es el único dueño vertical
del scroll.

No se habilita inicialmente para `Page Content Scroll`, donde el `Page Header`
ya permanece fijo, ni para `Workspace Canvas Scroll`. Cualquier ampliación a
esos modos requiere una decisión y validación posterior.

## Contrato de Contenido

### Page Header Expandido

- `title`: obligatorio.
- `eyebrow`: opcional; identifica módulo, tipo de entidad o contexto breve.
- `description`: opcional; aporta contexto, no instrucciones extensas.
- `metadata`: opcional; estados, folios, badges o identificadores resumidos.
- `actions`: opcional; acciones propias de la página.

### Sticky Collapsible Header

- Es opcional y solo existe como contraparte de un `Page Header` expandido.
- La ruta provee `stickyContent` explícitamente; el componente no infiere ni
  comprime contenido por su cuenta.
- Debe mantener una identificación inequívoca de la vista, normalmente el
  título.
- Puede incluir metadata esencial y, de forma limitada, una acción primaria.
- No incluye descripción, filtros, tabs, formularios ni controles densos.
- Debe ocupar una sola línea en escritorio siempre que el contenido lo permita.

## Transición

- La aparición se activa mediante un umbral asociado al desplazamiento del
  `Page Header` expandido.
- La transición debe ser breve, elegante y reversible al regresar sobre el
  umbral.
- Se evita el salto de layout: el header sticky reserva su propia geometría
  mientras está activo.
- Con `prefers-reduced-motion`, el estado cambia sin movimiento ornamental.

## Accesibilidad

- Solo una representación de acciones equivalentes puede ser interactiva a la
  vez.
- La representación visualmente oculta no debe permanecer en el orden de tab
  ni anunciar contenido duplicado a tecnologías asistivas.
- El header sticky conserva semántica de encabezado y nombres accesibles para
  las acciones que muestre.

## Límites

- Filtros, tabs, búsqueda, ordenamiento, acciones masivas y encabezados de
  tabla pertenecen a `Page Content`, no a este componente.
- Las futuras `Sticky Content Regions` se definirán por separado. Pueden quedar
  debajo de este header, pero no forman parte de su primera implementación.
- En móvil no se traslada este comportamiento por inercia; se definirá una
  resolución específica cuando exista un caso de uso validado.
