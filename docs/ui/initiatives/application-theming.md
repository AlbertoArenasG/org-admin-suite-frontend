# Evolución de Temas de Aplicación

**Registrado:** 2 de septiembre de 2026  
**Estado:** Fundación inicial implementada el 2 de septiembre de 2026. La
adopción de tokens y la extensión de superficies continúan gradualmente por
componente y vista.

## Contexto Actual

La preferencia global se controla con `next-themes` y los identificadores
internos `classic`, `ambient` y `ambient-deep`. La preferencia se conserva
localmente con la clave `application-appearance`; no depende del selector
legado `light/dark/system`.

La primera implementación mantiene claro el `Workspace Canvas` y el contenido
operativo en ambos temas. `Navigation Shell` y `Content Inset` consumen la
misma receta de material del dashboard en cada tema, mientras el contrato de
tokens cubre todas las capas para extenderlos gradualmente sin reescribir los
componentes.

## Dirección Aprobada

Las primeras tres variantes de tema de aplicación son:

- `Clásico`: evolución de la apariencia clásica actual. Usa superficies sobrias,
  sin ambient mesh, blur ni elevación decorativa innecesaria.
- `Ambient clásico`: evolución de la apariencia morada ambient actual. Usa fondo,
  navegación, content inset y contenido como una composición coherente de
  materiales y ambient mesh sutiles.
- `Ambient profundo`: conserva la composición morada de mayor contraste creada
  durante la exploración visual. Difiere de `Ambient clásico` en la profundidad
  del shell, no en el contenido operativo.

Las tres variantes parten de un `Workspace Canvas` y contenido operativo claros.
En todos los casos, tablas, formularios, datos e inputs deberán ser la región más
legible, clara y menos decorada de la aplicación.

Cada apariencia declara explícitamente su receta de `Workspace Canvas`, aunque
las tres variantes iniciales compartan hoy valores claros. Una variante futura
puede modificar esa receta por tema sin cambiar `NextDashboardShell`, la
primitiva del canvas ni las vistas migradas.

### Frontera Temática del Next Dashboard

Los valores estructurales globales, como espaciado, tipografía, dimensiones,
duraciones y z-index, pueden compartirse entre apariencias. Todo valor de color
o material que consuma `NextDashboardShell`, sus primitivas compartidas o sus
overlays debe declararse en cada selector `html.<tema>`, incluso cuando los
valores iniciales coincidan.

Las variables cromáticas de `:root` se conservan como compatibilidad para
legacy y para superficies fuera del dashboard. No son fuente de apariencia para
el `Next Dashboard`. Al introducir un token cromático en un componente nuevo o
migrado, el mismo cambio debe añadir su valor a las tres apariencias activas.
Esto incluye los tokens genéricos de UI que un overlay portalizado pueda
consumir, como `--overlay-surface` para el scrim de un `Sheet`.

### Material Compartido del Dashboard

`Dashboard Shell` define el fondo base y el ambient mesh. `Navigation Shell` y
`Content Inset` aplican encima la misma receta semántica de material mediante
`--dashboard-shell-glass-*`: superficie, imagen, borde, sombra y backdrop.
Esto garantiza que ambos se perciban como una sola composición en escritorio y
mobile, sin duplicar fórmulas por componente o viewport. En `Next Dashboard`,
`Workspace Toolbar` y `Workspace Header` usan la superficie del canvas y no
introducen una receta de vidrio adicional. El `Global Header` exterior de
legacy se mantiene transparente y revela el material de `Content Inset`
mientras continúe la coexistencia.

El tema no será una apariencia parcial del dashboard: cada tema deberá resolver
fondo, navegación, content inset, workspace, superficies de módulo, controles,
estados y componentes de MUI como un conjunto.

Los temas finales deben usar nombres de apariencia comprensibles para usuarios,
en lugar de exponer nombres técnicos o el binario claro/oscuro.

## Transición Técnica Planeada

La fundación implementada reutiliza `next-themes` y:

- Expone nombres de apariencia; no expone identificadores técnicos ni
  claro/oscuro/sistema en la interfaz.
- Unifica el selector de cuenta, `ModeToggle` y la antigua apariencia temporal
  del dashboard en una sola preferencia.
- Elimina `DashboardAppearanceProvider`, evitando estados visuales paralelos.
- Mantiene la preferencia en frontend mediante `next-themes`; la persistencia
  de usuario en backend queda para una decisión posterior.
- Mantiene las notificaciones y la configuración actual de MUI en modo claro,
  coherente con las tres variantes iniciales.
- Conserva CSS heredado de modo oscuro solo como compatibilidad temporal; su
  eliminación deberá decidirse y verificarse explícitamente en otra spec.

MUI hoy contiene principalmente configuración tipográfica. Sus futuros colores
y superficies deben alinearse con el mismo contrato de tokens.

## Mobile Navigation Sheet y Transparencia Contextual

`Mobile Navigation Sheet` se renderiza mediante un portal. Conserva el rol de
`Navigation Shell`, pero no es descendiente DOM del `Dashboard Shell`; por eso
debe recibir explícitamente las mismas clases y tokens temáticos que consume la
navegación de escritorio.

Las variantes iniciales son oscuras y pueden permitir una transparencia
contextual sutil en el sheet: el usuario puede percibir vagamente la vista de
trabajo que permanece detrás sin comprometer la legibilidad de la navegación.
Este comportamiento es intencional mientras el contraste se mantenga dentro de
los requisitos de accesibilidad.

Al diseñar un tema claro, o uno cuya receta ambient sea suficientemente
translúcida para revelar de forma distractora el `Workspace Canvas`, se deberá
evaluar el sheet en dispositivos móviles. Si la transparencia contextual deja
de ser adecuada, la solución aprobada no será agregar colores o gradients
locales al componente móvil. El sheet deberá componerse con las mismas
primitivas compartidas del tema:

- Fondo base de `Dashboard Shell`: `--dashboard-shell-surface` y
  `--dashboard-shell-mesh`.
- Receta compartida de material para `Navigation Shell` y `Content Inset`:
  tinte, transparencia, borde, elevación y backdrop mediante tokens
  semánticos del tema.

La diferencia entre desktop y mobile será únicamente estructural, necesaria
por el portal. Los valores visuales y fórmulas deberán provenir del mismo
contrato de tokens. Esta reconstrucción del fondo dentro del sheet no se
implementa anticipadamente: requiere una spec cuando exista un tema que la
justifique y debe validarse junto con contraste, foco y cierre del overlay.

## Contrato Inicial

- Definir conjuntos completos de tokens semánticos por capa: shell,
  navegación, content inset, workspace, superficies de módulo, formularios,
  tablas, popovers, bordes, texto y estados.
- Mantener MUI alineado al mismo contrato conforme incorpore superficies y
  colores además de su configuración tipográfica actual.
- Mantener los componentes nuevos dependientes de tokens semánticos, no de
  colores directos, desde su primera implementación o migración.
- Completar progresivamente el contrato de tokens al construir o migrar
  componentes; no dejar ese refactor para la iniciativa de temas.
- Definir accesibilidad, contraste y combinaciones soportadas para cada tema
  que se agregue.

## Adopción Gradual

La definición de las tres variantes no autoriza a aplicar estilos manuales por vista.
Mientras la aplicación se migra, cada componente nuevo o reestructurado debe
adoptar los tokens semánticos que le correspondan. Las vistas heredadas pueden
conservar temporalmente su apariencia clara actual, pero no se deben crear
nuevos componentes dependientes de colores directos.
