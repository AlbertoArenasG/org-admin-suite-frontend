# Manual Validation: Customer Service Record Documents Migration

## Access And Layout

- [ ] `READ` muestra Documentos como quinta ancla y cuatro paneles sin editar.
- [ ] `UPDATE` edita un panel sin afectar otros drafts.
- [ ] Estados vacios, dos columnas de escritorio y una de movil funcionan.

## Forms And Files

- [ ] Referencias documentales aceptan `null`; otros archivos no tiene campo.
- [ ] Colecciones vacias y cancelacion persisten o restauran como corresponde.
- [ ] Seleccionar no carga; Guardar carga solo archivos nuevos y persiste el
      panel completo.
- [ ] Archivos seleccionados se comunican como pendientes, sin simulacion de
      carga completada ni preview individual de BeUI.
- [ ] Se validan 10 archivos por carga y 20 MB por archivo.
- [ ] Todos los archivos descargan correctamente.

## Gallery And Recovery

- [ ] La galeria inicia en la imagen correcta y no mezcla otro panel.
- [ ] Flechas, swipe, contador, miniaturas de escritorio y descarga funcionan.
- [ ] Teclado, `Escape`, cierre, foco y movil sin miniaturas funcionan.
- [ ] Error mantiene draft y exito reemplaza detalle con feedback estandar.
- [ ] Thunks y estado son propios; BeUI sigue aislado de primitives canonicas.
