# Plan

## Objetivo

Implementar una base de dashboard shell reusable y una ruta Playground neutral
que valide su jerarquía responsive y política de scroll sin impactar rutas de
negocio existentes.

## Diseño Objetivo

- `Content Inset` coordina `Global Header` y `Workspace Canvas`.
- `Workspace Canvas` contiene `Workspace Header` y la composición de una ruta.
- Los componentes reciben contenido mediante slots o `children`, sin conocer el
  dominio ni rutas concretas.
- La ruta Playground usa las mismas primitivas que consumirán migraciones
  futuras.
- Desktop permite `page-content` y `workspace` como variantes de scroll;
  móvil conserva `document` como resolución natural.

## Fases

### Fase 1. Primitivas del Shell

- Crear los componentes genéricos y sus contratos de composición.
- Definir la aplicación de los modos de scroll por viewport.
- Mantenerlos aislados del layout productivo y de `AppSidebar`.

### Fase 2. Playground Neutral

- Crear una ruta protegida de Playground para el shell.
- Componer Global Header, Workspace Header y contenido de muestra largo.
- Permitir inspeccionar las variantes desktop de scroll con contenido neutral.
- Resolver el mismo modelo en móvil mediante scroll de documento.

### Fase 3. Validación y Documentación

- Validar comportamiento manual en desktop y móvil.
- Ejecutar validaciones estáticas y de formato.
- Registrar la ruta Playground en el registro de adopción solo si se considera
  una adopción de referencia; las migraciones reales se registrarán después.

## Notas de Secuencia

- La implementación no sustituye `DashboardPageHeader` ni `DashboardLayout`.
- La migración de una ruta real solo se inicia mediante una spec o slice posterior.
- Los patrones de tablas, formularios y Page Header colapsable se definen fuera
  de esta iniciativa.

## Criterios de Salida

- Existe una ruta Playground neutral que usa los componentes reutilizables.
- El modo de scroll activo es único y visible en cada viewport.
- Desktop y móvil respetan las guidelines de shell aprobadas.
- No hay regresión en las rutas productivas existentes.
