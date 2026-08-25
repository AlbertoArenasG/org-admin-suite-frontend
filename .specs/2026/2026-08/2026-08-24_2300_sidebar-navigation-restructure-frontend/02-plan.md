# Plan

## Objective

Reemplazar la navegación lateral actual por una estructura escalable de Rail de grupos y Sidebar de navegación, conservando sin cambios las reglas de autorización existentes.

## Implementation Order

1. Crear el dominio de navegación: tipos, definiciones, adaptador de visibilidad y resolvedor.
2. Crear los componentes aislados de marca, Rail de grupos, Sidebar de navegación y cuenta.
3. Sustituir completamente el contenido actual de `AppSidebar` e integrar los comportamientos de escritorio y móvil.
4. Simplificar Dashboard y retirar componentes de navegación heredados que dejen de utilizarse.
5. Validar autorización, rutas directas, responsive, preferencias y cierre formal de la spec.

## Constraints

- No modificar endpoints, catálogo backend, guards ni modelo de permisos.
- `hasModule` y `hasPermission` son la única autoridad para visibilidad.
- No mantener implementación anterior, fallback ni flags de migración.
- No implementar favoritos, accesos rápidos, preferencias persistidas de Dashboard ni panel derecho.
- Mantener localización en español e inglés para cualquier copy nuevo.
- No crear componentes monolíticos; `AppSidebar` solo compone responsabilidades aisladas.

## Validation Strategy

- Verificación estática: lint dirigido, typecheck y `git diff --check`.
- Validación manual de usuarios con combinaciones de permisos que dejen grupos completos visibles, parciales y vacíos.
- Validación manual de rutas directas, navegación entre grupos, escritorio expandido/colapsado y drawer móvil.
- Validación manual de Mi perfil, tema, idioma y cierre de sesión desde la cuenta.
- No se planean pruebas automatizadas nuevas, salvo que aparezca una necesidad concreta durante la implementación.

## Plan Status

`approved`
