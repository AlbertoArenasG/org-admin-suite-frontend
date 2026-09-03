# Evolución de Temas de Aplicación

**Registrado:** 2 de septiembre de 2026  
**Estado:** Fundación inicial implementada el 2 de septiembre de 2026. La
adopción de tokens continúa gradualmente por componente y vista.

## Contexto Actual

La preferencia global se controla con `next-themes` y los identificadores
internos `classic`, `ambient` y `ambient-deep`. La preferencia se conserva localmente
con la clave `application-appearance`; no depende del selector legado `light/dark/system`.

La primera implementación mantiene claro el `Workspace Canvas` y el contenido
operativo en ambos temas. La diferencia inicial vive en los materiales de
`Navigation Shell` y `Content Inset`, pero el contrato de tokens ya cubre todas
las capas para extenderlos gradualmente sin reescribir los componentes.

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

Ambos temas partirán de un `Workspace Canvas` y contenido operativo claros. En
los dos casos, tablas, formularios, datos e inputs deberán ser la región más
legible, clara y menos decorada de la aplicación.

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

MUI hoy contiene principalmente configuración tipográfica. La spec deberá
alinear sus futuros colores y superficies con el mismo contrato de tokens.

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
