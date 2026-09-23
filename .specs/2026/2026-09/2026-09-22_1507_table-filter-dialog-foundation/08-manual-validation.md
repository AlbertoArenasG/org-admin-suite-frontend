# Manual Validation: Table Filter Dialog Foundation

## Validation Status

La validacion funcional y visual fue aprobada el 2026-09-22, incluido el
desplazamiento de las listas de clientes y tipos de servicio.

| Scenario                          | Expected evidence                                                                              | Status   |
| --------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| Abrir y cerrar sin cambios        | No cambian URL, resultados ni filtros aplicados                                                | approved |
| Aplicar selección                 | URL, página y resultados usan el nuevo criterio                                                | approved |
| Limpiar criterios                 | `Mostrar todos` elimina criterios tras confirmar                                               | approved |
| Período de un campo               | No muestra selector de campo                                                                   | approved |
| Período multicampo                | Mantiene un único campo y rango activo                                                         | approved |
| URL histórica con varios períodos | Conserva resultados; cerrar no altera; aplicar único reemplaza                                 | approved |
| Fecha manual `dd/MM/aaaa`         | Inserta separadores, permite sustituir dígitos sin desplazar segmentos, valida y serializa ISO | approved |
| Atajos                            | Seleccionan rangos correctos y reflejan estado activo                                          | approved |
| Teclado y foco                    | Tab, Escape, foco visible y retorno al trigger                                                 | approved |
| Responsive y temas                | Sin overflow accidental en móvil ni regresión visual                                           | approved |
| Sin permiso READ                  | Conserva fallback actual, sin exponer interacción                                              | approved |
| Scroll de opciones                | Clientes y tipos de servicio muestran todas las opciones y permiten desplazamiento             | approved |
| Conteo y limpieza rápida          | Tooltip, salida breve, conteo por categoría y reset de URL, página y resultados                | approved |
