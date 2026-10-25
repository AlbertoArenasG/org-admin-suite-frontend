# Matriz de validación manual

**Estado:** pendiente. Esta matriz describe escenarios por comprobar; ningún resultado se atribuye aún al usuario.

| Escenario                                            | Resultado esperado                                                                                                                                     | Criterios | Evidencia |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | --------- |
| Rol sin billing READ y rol con solo billing READ     | El primero no ve ni monta facturación; el segundo ve lista/detalle sin editor ni llamadas administrativas                                              | 1, 5      | Pendiente |
| Rol admin READ sin UPDATE y con UPDATE               | Ambos leen; solo UPDATE ve y ejecuta envío en NOT_SUBMITTED                                                                                            | 1, 2, 3   | Pendiente |
| Lista administrativa, tres estados                   | Columna localizada, filtro/contador/limpiar, URL y vuelta atrás coherentes; conserva orden y paginación previos                                        | 2         | Pendiente |
| Confirmar envío administrativo                       | El diálogo explica correo, evita doble envío y el éxito refresca lista/detalle con filtros vigentes                                                    | 3         | Pendiente |
| Fallo 502, conflicto 409 y red interrumpida en envío | No se afirma estado ni entrega no confirmados; se muestra error/reintento seguro y último aviso al recargar                                            | 3         | Pendiente |
| Lista de facturación                                 | Por defecto muestra SUBMITTED e INVOICED; búsqueda, paginación y filtro funcionan; no hay sort                                                         | 4         | Pendiente |
| Accesos desde fila                                   | Consecutivo, menú, clic derecho y doble clic navegan al detalle accesible sin disparos accidentales                                                    | 4         | Pendiente |
| Detalle con solo billing READ                        | Servicio, cliente, equipo, fechas y documentos legibles; no se ve seguimiento al proveedor, reglas, políticas ni grupos y no se consultan sus opciones | 5         | Pendiente |
| Último correo a facturación                          | El detalle de facturación conserva estado y fecha del último aviso a facturación; no aparecen avisos de seguimiento al proveedor                       | 5         | Pendiente |
| Guardar factura en SUBMITTED                         | Referencia/archivos persisten y estado continúa SUBMITTED; sin correo automático                                                                       | 6         | Pendiente |
| Guardar y marcar como facturado                      | Exige archivo; carga pendientes, PUT y luego PATCH; muestra INVOICED solo tras confirmación                                                            | 6         | Pendiente |
| PUT falla                                            | PATCH no se ejecuta y el borrador sigue disponible para corregir/reintentar                                                                            | 6         | Pendiente |
| PUT confirma, PATCH falla                            | Reconoce factura guardada, muestra SUBMITTED; reintentar ejecuta solo PATCH, sin duplicar subida                                                       | 6         | Pendiente |
| Conflicto 409 o respuesta incierta en factura        | Se consulta detalle antes de afirmar estado final o iniciar nueva mutación                                                                             | 6         | Pendiente |
| Factura INVOICED con último archivo                  | Ambos editores impiden guardar con cero archivos; referencia y otros cambios válidos siguen editables                                                  | 7         | Pendiente |
| Detalles en escritorio y móvil, temas activos        | Header compacto muestra cliente en admin/billing, navegación/frame y scroll coherentes; portal conserva aspecto                                        | 8         | Pendiente |
| Teclado y lector de pantalla                         | Diálogos tienen foco y retorno de foco; errores y progreso se anuncian; acciones alcanzables por teclado                                               | 8         | Pendiente |
| Adjuntos imagen y PDF                                | Carga, listado, previsualización y descarga siguen el comportamiento vigente                                                                           | 5, 6      | Pendiente |

La comprobación automática pertinente cubre typecheck, lint enfocado, build y verificaciones focalizadas de mapeos/URL; se registra el comando y resultado real en `05-progress.md`. No hay despliegue como condición de esta spec de desarrollo.
