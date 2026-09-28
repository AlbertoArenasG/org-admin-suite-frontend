# Manual Validation: Customer Service Record Equipment Migration

## Access And Rendering

- [x] Un usuario con `READ` ve las tres secciones y el primer equipo.
- [x] Un usuario sin `UPDATE` no puede entrar al modo de edición.
- [x] Un usuario con `UPDATE` edita solo Equipo sin alterar drafts o modos de
      los otros bloques.
- [x] La navegación desplaza a `Equipo` y refleja la sección visible.

## Form Behavior

- [x] Los cinco campos obligatorios bloquean guardar si están vacíos y muestran
      sus errores.
- [x] `Observaciones del equipo` acepta vacío y se serializa como `null`.
- [x] Cancelar restaura valores canónicos y no deja draft obsoleto.
- [x] Guardar evita doble envío y muestra el feedback corto estándar antes de
      volver a lectura.
- [x] Un error de servidor conserva draft, presenta recuperación y permite
      reintentar.

## Contract Integrity

- [x] La petición apunta al ID del primer equipo mostrado.
- [x] La petición de datos contiene solo los seis valores editables con nombres
      backend.
- [x] Cada colección documental envía exclusivamente su propio arreglo de IDs.
- [x] La respuesta exitosa actualiza los valores canónicos sin GET adicional.

## Boundaries

- [x] La interfaz no muestra más de un equipo ni acciones para agregar otro.
- [x] Las colecciones permiten cargar, eliminar, previsualizar y descargar sus
      adjuntos mediante la receta documental compartida.
- [x] Un registro sin primer equipo muestra estado seguro y no emite PATCH.
- [x] Los campos son horizontales en escritorio y apilados, utilizables, en
      móvil.
