# Manual Validation: Customer Service Record Documents Migration

## Access And Layout

- [x] `READ` muestra Documentos como quinta ancla y cuatro paneles sin editar.
- [x] `UPDATE` edita un panel sin afectar otros drafts.
- [x] Estados vacios, dos columnas de escritorio y una de movil funcionan.

## Forms And Files

- [x] Referencias documentales aceptan `null`; otros archivos no tiene campo.
- [x] Colecciones vacias y cancelacion persisten o restauran como corresponde.
- [x] El dialogo abre el selector animado, conserva los archivos en memoria y
      cerrar o cancelar no llama endpoints.
- [x] Confirmar Guardar carga solo archivos nuevos y persiste el panel completo.
- [x] Archivos seleccionados muestran progreso visual local, quedan pendientes
      y no usan preview individual de BeUI.
- [x] Se validan 10 archivos por carga y 20 MB por archivo.
- [x] Todos los archivos descargan correctamente.

## Gallery And Recovery

- [x] La galeria inicia en la imagen correcta y no mezcla otro panel.
- [x] Flechas, swipe, contador, miniaturas de escritorio y descarga funcionan.
- [x] Teclado, `Escape`, cierre, foco y movil sin miniaturas funcionan.
- [x] Error mantiene draft y exito reemplaza detalle con feedback estandar.
- [x] Thunks y estado son propios; BeUI sigue aislado de primitives canonicas.
