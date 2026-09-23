# Manual Validation: Next Dashboard View Access Foundation

## Pending Implementation

| Scenario                         | Expected evidence                                                                                                 | Status  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| Acceso autorizado de portal      | `READ` monta Seguimiento de servicios sin cambio visual ni funcional.                                             | pending |
| Acceso autorizado administrativo | `READ` monta Registros de servicio sin cambio visual ni funcional.                                                | pending |
| Acceso autorizado de Usuario     | `USERS/READ` monta el detalle editable sin cambio visual ni funcional.                                            | pending |
| Denegación de portal             | Sin `READ`, no monta contenedor ni fetch y reemplaza ruta por `/dashboard`.                                       | pending |
| Denegación administrativa        | Sin `READ`, no monta contenedor ni fetch y reemplaza ruta por `/dashboard`.                                       | pending |
| Denegación de Usuario            | Sin `USERS/READ`, no monta detalle ni fetch y reemplaza ruta por `/dashboard`.                                    | pending |
| Historial                        | Después de denegar, Atrás no restaura inmediatamente la ruta denegada.                                            | pending |
| Capacidades internas             | `useDashboardViewAccess` resuelve operaciones del módulo y falla descriptivamente fuera de boundary.              | pending |
| Capacidades de Usuario           | `UPDATE` y `UPDATE_PASSWORD` conservan modo edición y diálogo de contraseña según el permiso.                     | pending |
| Regresiones                      | URL, filtros, paginación, expansión, responsive, foco y temas de las tres vistas conservan comportamiento actual. | pending |
| Verificación automatizada        | `typecheck`, lint, build y `git diff --check` terminan sin errores nuevos.                                        | pending |
