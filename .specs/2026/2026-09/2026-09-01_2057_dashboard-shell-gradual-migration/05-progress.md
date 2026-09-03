# Progreso

## 2026-09-01

- Se inicio la spec de coexistencia despues de validar el nuevo shell y sus
  modos de scroll en `/dashboard-playground`.
- Se documento la limitacion de layouts anidados de `/dashboard` y la propuesta
  de un boundary central con shell legado preservado.
- No se modifico codigo productivo ni se eligio una ruta para migrar.
- Se aprobaron la conservacion de URLs, el boundary central y el registro local
  de adopciones. La spec queda lista para implementar la infraestructura de
  coexistencia.
- Inicio del Slice 1: extraccion mecanica del markup actual hacia
  `LegacyDashboardShell`, sin activar el shell nuevo para ninguna ruta.
- Se completo el Slice 1: `DashboardLayout` usa un boundary central y la
  politica de adopcion inicia vacia, por lo que todas las rutas resuelven a
  `legacy`. El soporte de `next` permanece bloqueado hasta el Slice 2. Queda
  pendiente la validacion manual de rutas legado representativas.
- Se validaron manualmente varias rutas existentes sin detectar diferencias de
  comportamiento o presentacion. El Slice 1 queda cerrado.
- Se completo la implementacion del Slice 2: `NextDashboardShell` queda
  conectado al boundary con breadcrumbs y modo de scroll declarativos. El
  registro de adopcion sigue vacio, por lo que ninguna ruta productiva lo usa.
- Se validaron rutas de ambos dashboards sin detectar regresiones. El Slice 2
  queda cerrado y la coexistencia esta lista para una primera adopcion real.

## 2026-09-02

- Se cerro la iniciativa al completar su proposito: estrategia aprobada y
  coexistencia preparada, sin rutas productivas activadas en `next`.
- La primera adopcion real y el retiro del shell legado se movieron a specs
  futuras de alcance fijo.
