# Plan

## Solucion

1. Crear un cliente multipart aislado del JSX y un thunk de carga dentro del
   feature existente. El cliente usara `FormData` y `API_BASE_URL`; el thunk
   clasificara la confirmacion, el error del servidor y la incertidumbre en
   una rama `upload` de `servicePackagesRecordsSlice`.
2. Crear un dialogo de modulo con el control `AttachmentUpload`, sin modificar
   el dialogo generico ni su vendor. El `File` seleccionado sera local; el
   estado remoto vendra de Redux y seguira visible hasta cierre explicito.
   No habra slice independiente ni store Zustand nuevo.
3. Componer boton primario y dialogo desde el contenedor, pasar la accion por
   `toolbar.primaryActions`, reconsultar con `controller.refetch()` despues
   de confirmacion y añadir traducciones.
4. Ejecutar checks de codigo y validacion manual de respuesta exitosa,
   HTTP con error, corte de red, escritorio, movil, teclado y temas.

## Compatibilidad

Se conserva ruta, boundary READ, tabla, filtros, paginacion y acciones por
fila. El endpoint permanece publico y la PWA no cambia. No se crean ni
modifican tokens, primitives o normas de UI. La especificacion registra el
uso local del patron existente; no convierte la spec en documentacion viva.

## Orden

Las fases de `03-task-list.md` se ejecutan en orden. Las slices concretas y
su evidencia estan en `07-implementation-breakdown.md` y
`08-manual-validation.md`.
