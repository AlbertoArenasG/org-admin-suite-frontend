# Evolución de Temas de Aplicación

**Registrado:** 2 de septiembre de 2026  
**Estado:** Decisión aprobada. Requiere una spec de fundación antes de cambiar
el selector de tema o migrar componentes.

## Contexto Actual

La aplicación conserva el selector global de tema claro/oscuro. Ese selector es
el único responsable de la apariencia del `Workspace Canvas` y de su contenido:
superficies de módulos, tablas, formularios, inputs, popovers y estados.

De forma independiente, el dashboard ofrece dos apariencias transitorias de
frontend, sin persistencia ni backend:

- `Clásica`: conserva la apariencia previa a los experimentos visuales.
- `Ambient`: aplica la composición morada con mesh gradients y materiales
  translúcidos sutiles.

Estas apariencias solo modifican `Navigation Shell` y `Content Inset`. No deben
alterar el `Workspace Canvas` ni los tokens del contenido funcional.

## Dirección Aprobada

Los primeros dos temas completos de aplicación serán:

- `Plano`: evolución de la apariencia clásica actual. Usa superficies sobrias,
  sin ambient mesh, blur ni elevación decorativa innecesaria.
- `Ambient`: evolución de la apariencia morada ambient actual. Usa fondo,
  navegación, content inset y contenido como una composición coherente de
  materiales y ambient mesh sutiles.

Ambos temas partirán de un `Workspace Canvas` y contenido operativo claros. En
los dos casos, tablas, formularios, datos e inputs deberán ser la región más
legible, clara y menos decorada de la aplicación.

El tema no será una apariencia parcial del dashboard: cada tema deberá resolver
fondo, navegación, content inset, workspace, superficies de módulo, controles,
estados y componentes de MUI como un conjunto.

Los temas finales deben usar nombres de apariencia comprensibles para usuarios,
en lugar de exponer nombres técnicos o el binario claro/oscuro.

## Transición Técnica Planeada

La implementación deberá reutilizar `next-themes`, que hoy controla las clases
`light`, `dark` y `system`. La spec de fundación deberá:

- Reemplazar los identificadores expuestos por `flat` y `ambient`.
- Unificar el selector de tema con las apariencias temporales actuales del
  dashboard; `Clásica` evolucionará a `Plano` y `Ambient` conservará su nombre.
- Retirar el selector claro/oscuro/system de la interfaz una vez que los dos
  temas estén definidos como conjuntos completos.
- Conservar la preferencia inicialmente en frontend mediante `next-themes`; la
  persistencia de usuario en backend queda para una decisión posterior.
- Adaptar `SnackbarProvider`, `ModeToggle` y cualquier consumidor de
  `resolvedTheme` a los nuevos identificadores.
- Mantener cualquier CSS o compatibilidad heredada de modo oscuro solo mientras
  sea necesaria; su eliminación deberá decidirse y verificarse explícitamente,
  no quedar como deuda permanente.

MUI hoy contiene principalmente configuración tipográfica. La spec deberá
alinear sus futuros colores y superficies con el mismo contrato de tokens.

## Requisitos Para La Spec de Fundación

- Definir conjuntos completos de tokens semánticos por capa: shell,
  navegación, content inset, workspace, superficies de módulo, formularios,
  tablas, popovers, bordes, texto y estados.
- Alinear el tema de MUI con los mismos conjuntos de tokens.
- Mantener los componentes nuevos dependientes de tokens semánticos, no de
  colores directos, desde su primera implementación o migración.
- Completar progresivamente el contrato de tokens al construir o migrar
  componentes; no dejar ese refactor para la iniciativa de temas.
- Decidir si la preferencia se persiste localmente, en backend o en ambos.
- Definir accesibilidad, contraste y combinaciones soportadas.
- Implementar y validar el cambio mediante una spec explícitamente aprobada.

## Adopción Gradual

La definición de los dos temas no autoriza a aplicar estilos manuales por vista.
Mientras la aplicación se migra, cada componente nuevo o reestructurado debe
adoptar los tokens semánticos que le correspondan. Las vistas heredadas pueden
conservar temporalmente su apariencia clara actual, pero no se deben crear
nuevos componentes dependientes de colores directos.
