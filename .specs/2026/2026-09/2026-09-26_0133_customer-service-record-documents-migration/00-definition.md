# Definition: Customer Service Record Documents Migration

## Initiative

- Name: `customer-service-record-documents-migration`
- Date: `2026-09-26`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La vista individual Next Dashboard ya migro sus cuatro bloques de datos. Faltan
los documentos del registro: cotizacion, orden de compra, factura y otros
archivos, sin restaurar funcionalidad legacy.

## Expected Outcome

La ruta incorpora `Documentos` como quinta seccion con cuatro formularios
independientes, carga diferida, descarga y galeria de imagenes reutilizable.

## Migration Mandate

Esta iniciativa extiende exclusivamente la vista individual Next Dashboard. No
restaura, adapta, reutiliza ni imita rutas, componentes, payloads, estado,
formularios, permisos o estilos legacy. Tipos, mappers, thunks y estado remoto
viven en `customer-service-records`; no consume thunks ni estado de otros
features.

## Included Scope

- Anadir `Documentos` y su ancla semantica.
- Mostrar y editar cotizacion, orden de compra, factura y otros archivos.
- Adoptar BeUI dentro de un dialogo generico de seleccion de adjuntos.
- Cargar archivos solo al confirmar Guardar.
- Crear una galeria reusable con carrusel, swipe, flechas, miniaturas de
  escritorio, descarga y teclado.
- Aplicar `ResourceForm`, permisos locales, recuperacion, toast y feedback de
  exito de 800 ms a cada panel.

## Excluded Scope

- Adjuntos del equipo: recepcion, entrega y reportes.
- Limpieza de archivos huerfanos.
- Preview de formatos no visuales.
- Cambios a backend, permisos o limite de archivos.

## Constraints

- Maximo 10 archivos por carga y 20 MB por archivo, sin mas restricciones.
- Cotizacion, orden de compra y factura envian `reference_number`, que admite
  `null`, y `file_ids`, que admite arreglo vacio.
- Otros archivos envia solo `file_ids`, tambien con arreglo vacio.
- El dialogo generico conserva `File` y su progreso visual de seleccion solo en
  memoria; no conoce endpoints ni ejecuta cargas.
- Cancelar el dialogo o el panel descarta su draft local sin llamar endpoints.
- La galeria solo navega imagenes del panel que la abre.
- Escritorio usa cuadrícula de dos columnas; movil apila paneles y omite
  miniaturas de galeria.

## Acceptance Criteria

- `READ` muestra cuatro paneles, estados vacios, descargas y galeria sin
  controles de edicion.
- `UPDATE` habilita edicion local independiente por panel.
- Los archivos nuevos no llegan a `POST /v1/files` hasta que el formulario
  consumidor confirma Guardar.
- Cada PUT reemplaza el detalle canonico sin GET adicional.
- Los efectos permanecen dentro de `customer-service-records`.

## Open Decisions

Ninguna.
