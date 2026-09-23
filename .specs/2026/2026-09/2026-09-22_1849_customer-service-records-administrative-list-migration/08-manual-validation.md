# Manual Validation: Customer Service Records Administrative List Migration

## Executed Validation

La validación manual fue completada sobre la superficie migrada.

| Scenario              | Expected evidence                                                                                                                                                                                                          | Status |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Ruta y permisos       | `READ` conserva la vista Next Dashboard; sin permiso conserva fallback.                                                                                                                                                    | passed |
| Consulta remota       | Búsqueda con debounce, filtros, página y límite actualizan el fetch.                                                                                                                                                       | passed |
| Orden único           | Un header sortable actualiza un único criterio y reemplaza el anterior.                                                                                                                                                    | passed |
| URL nueva             | Serializa un único orden y período; parámetros múltiples se descartan.                                                                                                                                                     | passed |
| Navegación            | Folio abre el detalle; observaciones generales o del equipo habilitan el despliegue, sin acciones de fila.                                                                                                                 | passed |
| Estados remotos       | Loading, error con reintento, vacío y vacío con criterios se presentan correctamente.                                                                                                                                      | passed |
| Columnas              | Conserva la receta de Seguimiento: Folio, Equipo y servicio, Estado, Seguimiento, Recolección, Entrega, Detalles de equipo y Cliente; proveedor queda al final sin aumentar la altura del header. Folio permanece visible. | passed |
| Responsive y scroll   | Sticky/scroll disponible en escritorio; página y overflow horizontal local en móvil.                                                                                                                                       | passed |
| Accesibilidad y temas | Foco, teclado, lectores y temas activos no presentan regresiones.                                                                                                                                                          | passed |

## Automated Verification

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `git diff --check`: passed.
- `npm run lint`: passed with four pre-existing warnings outside this migration.
