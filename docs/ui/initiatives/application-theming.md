# Evolución de Temas de Aplicación

**Registrado:** 2 de septiembre de 2026  
**Estado:** Iniciativa diferida. Requiere una spec propia antes de cualquier implementación.

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

## Objetivo Futuro

En una iniciativa posterior, evaluar un sistema de temas completos de
aplicación. Cada tema podrá definir explícitamente la apariencia de todas las
capas, incluyendo combinaciones mixtas, por ejemplo navegación oscura y
workspace claro.

Los temas finales deben usar nombres de apariencia comprensibles para usuarios,
en lugar de exponer nombres técnicos o el binario claro/oscuro.

## Requisitos Para Una Spec Futura

- Definir conjuntos completos de tokens semánticos por capa: shell,
  navegación, content inset, workspace, superficies de módulo, formularios,
  tablas, popovers, bordes, texto y estados.
- Alinear el tema de MUI con los mismos conjuntos de tokens.
- Mantener los componentes nuevos dependientes de tokens semánticos, no de
  colores directos.
- Decidir si la preferencia se persiste localmente, en backend o en ambos.
- Definir accesibilidad, contraste y combinaciones soportadas.
- Implementar y validar el cambio mediante una spec explícitamente aprobada.

Esta iniciativa no autoriza por sí misma convertir las apariencias actuales del
dashboard en temas completos.
