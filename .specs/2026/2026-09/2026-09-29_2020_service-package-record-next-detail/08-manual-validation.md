# Validación Manual

| Caso                | Evidencia esperada                                                                                      | Estado    |
| ------------------- | ------------------------------------------------------------------------------------------------------- | --------- |
| Permiso READ        | Usuario autorizado abre la ruta; sin READ no monta contenido y redirige.                                | pendiente |
| Carga               | Skeleton conserva navegación y geometría de frames.                                                     | pendiente |
| Error y reintento   | Error no-404 muestra recuperación y el reintento recupera el recurso.                                   | pendiente |
| Recurso ausente     | Un 404 muestra estado localizado sin contenido residual.                                                | pendiente |
| Request obsoleto    | Cambiar de `recordId` durante carga no muestra resultado ni error anterior.                             | pendiente |
| Información general | Contacto, servicio, metadata, firmas y observaciones se muestran en lectura.                            | pendiente |
| Equipo              | La tabla se desplaza horizontalmente cuando no cabe.                                                    | pendiente |
| Navegación          | Sidebar, compacta y tabs navegan a los tres anchors con foco visible.                                   | pendiente |
| Archivos vacíos     | La colección comunica vacío sin controles de mutación.                                                  | pendiente |
| Archivos visibles   | JSON operativo no aparece; expansión, preview y descarga funcionan.                                     | pendiente |
| Responsive          | Sidebar abierto/cerrado, compacto y móvil no producen solapamiento ni scroll competidor.                | pendiente |
| Accesibilidad       | Navegación y archivos son operables por teclado, labels y tooltips; reduced motion conserva usabilidad. | pendiente |
