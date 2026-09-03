# Decisiones

## 2026-09-01 - Estrategia aprobada

- Se crea una iniciativa especifica para coexistencia y migracion gradual,
  separada de la foundation del Dashboard Shell.
- No se asume un modulo inicial; esa seleccion pertenece a una iniciativa de
  adopcion posterior.
- Las rutas migradas conservaran sus URLs bajo `/dashboard`.
- La coexistencia se resuelve con un boundary central bajo `/dashboard`, no con
  rutas duplicadas ni condicionales dentro de paginas.
- La adopcion se controla con un registro local, tipado y explicito; no se
  incorporan feature flags remotos.

## 2026-09-02 - Cierre de la iniciativa

- La spec se cierra al completar la estrategia y la infraestructura de
  coexistencia, sin una adopcion de ruta productiva.
- Las migraciones futuras y el retiro del shell legado se gestionaran con
  specs de alcance fijo y se documentaran en las guidelines vivas de UI.
