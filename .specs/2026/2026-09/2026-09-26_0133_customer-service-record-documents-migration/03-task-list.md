# Task List: Customer Service Record Documents Migration

## Slice 1: Shared Attachment Foundation

- [x] Crear el dialogo generico de adjuntos sobre el selector animado de BeUI.
- [x] Hacer que el dialogo entregue `File` en memoria, sin endpoints ni carga remota.
- [x] Mantener un progreso visual local de seleccion, sin carga remota, y
      redirigir su accion de imagen a la galeria compartida.
- [x] Crear la galeria reusable de adjuntos de imagen.
- [x] Validar foco, teclado, swipe, descarga y comportamiento movil.

## Slice 2: Feature Document Contract

- [x] Definir payloads, serializacion y estado remoto documental.
- [x] Implementar thunks propios de carga y mutacion.
- [x] Reemplazar el detalle canonico tras cada PUT exitoso.

## Slice 3: Documents Section Adoption

- [x] Crear cuatro formularios independientes y su cuadrícula.
- [x] Implementar draft local, carga diferida, retiro local y recuperacion.
- [x] Extender anclas, permisos y traducciones ES/EN.

## Slice 4: Verification And Closure

- [x] Ejecutar typecheck, lint focalizado y verificacion de diff.
- [x] Registrar validacion manual.
- [x] Documentar adopcion, actualizar indice y cerrar la spec.
