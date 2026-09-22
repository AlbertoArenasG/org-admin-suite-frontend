# Implementation Breakdown: Table Filter Dialog Foundation

## Slice 1. Shared Filter Dialog Boundary

- Confirmar carpeta, API pública y separación entre diálogo, selector y
  período.
- Implementar únicamente la variante de período separado.

**Closure:** la base no conoce API, URL, permisos ni filtros de Registros de
servicio.

## Slice 2. Customer Service Records Adoption

- Montar trigger y diálogo desde la toolbar.
- Traducir las cinco selecciones y el período único a
  `CustomerServiceRecordsListFilters`.
- Identificar rangos acumulados de URL como estado heredado y conservarlos
  hasta una acción explícita.
- Conservar búsqueda global, ordenamiento, columnas, paginación y URL.

**Closure:** confirmar es el único punto que modifica filtros aplicados y
resetea la página.

## Slice 3. Quality And Promotion

- Validar estados de borrador, clear, close, errores de opciones y fechas.
- Validar desktop, móvil, teclado, foco, tema y textos `es/en`.
- Documentar el patrón en `docs/ui/` solo tras aprobación de su forma final.
