# Implementation Breakdown: Customer Service Record Documents Migration

## Slice 1. Shared Attachment Foundation

- Goal: superficies reutilizables sin reglas de negocio.
- Work: crear el dialogo generico que adapta BeUI para seleccion animada y
  progreso visual local en memoria, y la galeria con carrusel, swipe,
  miniaturas, descarga, foco y teclado.
- Limits: sin endpoints, Redux, permisos ni formularios documentales.
- Close: contrato neutral y verificacion estatica.

## Slice 2. Feature Document Contract

- Goal: carga y actualizacion documental dentro del feature dueño.
- Work: declarar tipos, serializacion, carga propia, PUT generico y reemplazo
  del detalle.
- Limits: sin imports de operaciones de otros features ni UI de negocio.
- Close: contrato backend alineado y respuesta canonica aplicada.

## Slice 3. Documents Section Adoption

- Goal: leer y editar cuatro documentos dentro de la ruta.
- Work: ancla, cuadrícula, formularios, apertura del dialogo de adjuntos,
  drafts, carga al guardar, galeria, permisos y copy.
- Limits: sin adjuntos del equipo, huerfanos ni preview no visual.
- Close: cuatro contratos aislados y receta `ResourceForm` respetada.

## Slice 4. Verification And Closure

- Goal: confirmar comportamiento y documentar resultado.
- Work: checks, validacion manual, tareas, progreso, adopcion e indice.
- Close: sin pendientes y validacion registrada.
