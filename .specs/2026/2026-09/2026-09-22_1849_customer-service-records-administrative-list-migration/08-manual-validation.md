# Manual Validation: Customer Service Records Administrative List Migration

## Pending Implementation

La matriz se ejecutará después de completar las slices de implementación.

| Scenario              | Expected evidence                                                                     | Status  |
| --------------------- | ------------------------------------------------------------------------------------- | ------- |
| Ruta y permisos       | `READ` conserva la vista; sin permiso conserva fallback; `CREATE` controla Crear.     | pending |
| Consulta remota       | Búsqueda con debounce, filtros, página y límite actualizan el fetch.                  | pending |
| Orden único           | Un header sortable actualiza un único criterio y reemplaza el anterior.               | pending |
| URL nueva             | Serializa un único orden y período; parámetros múltiples se descartan.                | pending |
| Navegación            | Folio abre el detalle; no hay expansión ni acciones de fila.                          | pending |
| Estados remotos       | Loading, error con reintento, vacío y vacío con criterios se presentan correctamente. | pending |
| Columnas              | Settings conserva visibilidad permitida y Folio permanece visible.                    | pending |
| Responsive y scroll   | Sticky/scroll disponible en escritorio; página y overflow horizontal local en móvil.  | pending |
| Accesibilidad y temas | Foco, teclado, lectores y temas activos no presentan regresiones.                     | pending |
