# Manual Validation: Next Dashboard View Access Foundation

## Validación Aprobada

| Scenario                         | Expected evidence                                                                                                 | Status |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| Acceso autorizado de portal      | `READ` monta Seguimiento de servicios sin cambio visual ni funcional.                                             | passed |
| Acceso autorizado administrativo | `READ` monta Registros de servicio sin cambio visual ni funcional.                                                | passed |
| Acceso autorizado de Usuario     | `USERS/READ` monta el detalle editable sin cambio visual ni funcional.                                            | passed |
| Denegación de portal             | Sin `READ`, no monta contenedor ni fetch y reemplaza ruta por `/dashboard`.                                       | passed |
| Denegación administrativa        | Sin `READ`, no monta contenedor ni fetch y reemplaza ruta por `/dashboard`.                                       | passed |
| Denegación de Usuario            | Sin `USERS/READ`, no monta detalle ni fetch y reemplaza ruta por `/dashboard`.                                    | passed |
| Historial                        | Después de denegar, Atrás no restaura inmediatamente la ruta denegada.                                            | passed |
| Capacidades internas             | `useDashboardViewAccess` resuelve operaciones del módulo y falla descriptivamente fuera de boundary.              | passed |
| Capacidades de Usuario           | `UPDATE` y `UPDATE_PASSWORD` conservan modo edición y diálogo de contraseña según el permiso.                     | passed |
| Regresiones                      | URL, filtros, paginación, expansión, responsive, foco y temas de las tres vistas conservan comportamiento actual. | passed |
| Verificación automatizada        | `typecheck`, lint, build y `git diff --check` terminan sin errores nuevos.                                        | passed |
