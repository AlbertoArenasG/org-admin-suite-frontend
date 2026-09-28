# Validacion Manual

| Caso                         | Evidencia esperada                                                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Acceso permitido             | Usuario con `READ` abre un registro asociado y ve cuatro bloques, sin proveedor ni editar.                                                                       |
| Entrada desde tabla          | `Detalle` aparece junto al folio y el folio tambien enlaza al mismo registro; ambos conservan foco visible y tooltip, sin activar la expansion de observaciones. |
| Acceso no permitido          | Ruta muestra el fallback seguro del boundary o error remoto sin filtrar datos.                                                                                   |
| Carga y reintento            | Skeleton conserva la topologia; un error muestra reintento funcional.                                                                                            |
| Timeline                     | Inicia con recepcion desde cliente; no existen hitos de solicitud ni proveedor; el compromiso conserva estado.                                                   |
| Navegacion escritorio        | Menu lateral alinea anclas y timeline; cada item hace scroll al bloque correcto.                                                                                 |
| Navegacion compacta          | Entre `md` y `lg` aparecen iconos con tooltip; no se muestra timeline.                                                                                           |
| Documentos raiz              | Cada fila abre/cierra desde toda su zona principal; preview de imagen y descarga funcionan; no hay editar.                                                       |
| Documentos equipo            | Las tres colecciones comparten el mismo comportamiento documental y no ofrecen mutacion.                                                                         |
| Responsive                   | Sidebar abierto/cerrado y ancho reducido no superponen metadata de colecciones; la container query las apila.                                                    |
| Localizacion y accesibilidad | Espanol e ingles traducen todos los copys; foco visible, tooltip, `aria-expanded` y teclado funcionan.                                                           |
