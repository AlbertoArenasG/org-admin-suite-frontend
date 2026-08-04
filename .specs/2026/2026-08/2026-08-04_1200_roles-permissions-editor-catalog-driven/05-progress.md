# Progress

## 2026-08-04

- Se creó la spec `roles-permissions-editor-catalog-driven`.
- Se documentó el problema de desalineación entre catálogo backend y editor de permisos frontend.
- Se aprobaron las decisiones críticas sobre contrato y regla de dependencia de `READ`.
- Se alineó la spec frontend con el contrato backend ya implementado: `GET /v1/roles/modules` enriquecido con `operations[]` y eliminación de `GET /v1/roles/operations`.
- Se completó el refactor del contrato del feature `roles`: tipos, thunks, slice y páginas `new/edit/detail` ya consumen solo `GET /v1/roles/modules`.
- Se completó el refactor del editor para renderizar y serializar permisos exclusivamente desde `module.operations`.
- Se endureció create/edit para descartar cualquier permiso fuera del catálogo visible antes de serializar el payload.
- Se registró la validación manual en ambiente desplegado como confirmación del comportamiento esperado.
