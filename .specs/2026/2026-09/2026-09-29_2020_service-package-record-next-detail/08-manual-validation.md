# Validación Manual

| Caso                | Evidencia esperada                                                                                      | Estado              |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ------------------- |
| Permiso READ        | Usuario autorizado abre la ruta; sin READ no monta contenido y redirige.                                | validado 2026-09-29 |
| Carga               | Skeleton conserva navegación y geometría de frames.                                                     | validado 2026-09-29 |
| Error y reintento   | Error no-404 muestra recuperación y el reintento recupera el recurso.                                   | validado 2026-09-29 |
| Recurso ausente     | Un 404 muestra estado localizado sin contenido residual.                                                | validado 2026-09-29 |
| Request obsoleto    | Cambiar de `recordId` durante carga no muestra resultado ni error anterior.                             | validado 2026-09-29 |
| Información general | Contacto, servicio, metadata, firmas y observaciones se muestran en lectura.                            | validado 2026-09-29 |
| Equipo              | La tabla se desplaza horizontalmente cuando no cabe.                                                    | validado 2026-09-29 |
| Navegación          | Sidebar, compacta y tabs navegan a los tres anchors con foco visible.                                   | validado 2026-09-29 |
| Archivos vacíos     | La colección comunica vacío sin controles de mutación.                                                  | validado 2026-09-29 |
| Archivos visibles   | JSON operativo no aparece; expansión, preview y descarga funcionan.                                     | validado 2026-09-29 |
| Responsive          | Sidebar abierto/cerrado, compacto y móvil no producen solapamiento ni scroll competidor.                | validado 2026-09-29 |
| Accesibilidad       | Navegación y archivos son operables por teclado, labels y tooltips; reduced motion conserva usabilidad. | validado 2026-09-29 |
