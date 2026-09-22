# Manual Validation: Table Filter Dialog Foundation

## Pending Definition Closure

La matriz se ejecutará después de cerrar los artefactos y antes de declarar la
iniciativa completada.

| Scenario                          | Expected evidence                                              | Status  |
| --------------------------------- | -------------------------------------------------------------- | ------- |
| Abrir y cerrar sin cambios        | No cambian URL, resultados ni filtros aplicados                | pending |
| Aplicar selección                 | URL, página y resultados usan el nuevo criterio                | pending |
| Limpiar criterios                 | `Mostrar todos` elimina criterios tras confirmar               | pending |
| Período de un campo               | No muestra selector de campo                                   | pending |
| Período multicampo                | Mantiene un único campo y rango activo                         | pending |
| URL histórica con varios períodos | Conserva resultados; cerrar no altera; aplicar único reemplaza | pending |
| Fecha manual `dd/MM/aaaa`         | Inserta separadores, valida y serializa ISO                    | pending |
| Atajos                            | Seleccionan rangos correctos y reflejan estado activo          | pending |
| Teclado y foco                    | Tab, Escape, foco visible y retorno al trigger                 | pending |
| Responsive y temas                | Sin overflow accidental en móvil ni regresión visual           | pending |
| Sin permiso READ                  | Conserva fallback actual, sin exponer interacción              | pending |
