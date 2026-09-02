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
