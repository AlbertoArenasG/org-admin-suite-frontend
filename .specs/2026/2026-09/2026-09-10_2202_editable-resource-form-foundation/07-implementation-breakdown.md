# Desglose De Implementación

## Slice 1. Frame, Sección Y Acciones

1. Crear la carpeta `src/components/resource-form/`.
2. Implementar `ResourceFormFrame` como superficie neutral y controlada.
3. Implementar `ResourceFormSection` sin semántica de persistencia.
4. Implementar `ResourceFormActions` para acciones y estados visuales.

**Cierre:** ninguna pieza conoce formularios de dominio, endpoints, permisos o
estado Redux.

## Slice 2. Ruta Y Overlay

1. Implementar `ResourceFormRoute` para el patrón de detalle editable en ruta.
2. Implementar `ResourceFormOverlay` para encapsular el mismo ciclo en un
   `Dialog` o `Drawer` aportado por el consumidor.
3. Confirmar que ambas variantes overlay usan la misma composición interior y
   que no se convierten en workspace comprimido.

**Cierre:** la taxonomía aprobada tiene hosts reutilizables sin que la base tome
la decisión por recurso.

## Slice 3. Frontera Y Calidad

1. Crear `index.ts` con exportaciones públicas acotadas.
2. Verificar la ausencia de imports prohibidos y de tipos genéricos de dominio.
3. Ejecutar typecheck, lint sin autofix y build.
4. Validar temas, foco, teclado y viewport sobre un preview de producto.

**Cierre:** queda una fundación consumible y verificable; la primera migración
de recurso continúa en su propia spec.
