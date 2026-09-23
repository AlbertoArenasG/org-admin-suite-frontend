# Plan: Customer Service Records Administrative List Migration

## Architecture

Se crea un contenedor nuevo que conserva datos remotos, URL, permisos y
coordinación con el store de Zustand existente. Entrega filas, columnas,
toolbar, settings, sorting y paginación al `DataTable` canónico.

La capa de presentación no ejecuta HTTP ni interpreta permisos. El diálogo de
filtros se entrega como nodo de toolbar; su contrato genérico se conserva, su
adaptador se ajusta al período único y no se integra dentro de `DataTable`.

## Planned Changes

1. Ajustar el store de Zustand y la utilidad de query existentes al patrón de
   Seguimiento: sorting de un solo criterio, visibilidad por IDs y un único
   período de fecha.
2. Crear definiciones
   `DataTableColumn` que agrupen cliente/activo, compromiso y proveedor/retorno
   en celdas multilínea.
3. Crear la composición `DataTable`: header con crear, toolbar con búsqueda y filtros,
   settings de columnas, estado remoto, paginación, scroll y sticky header.
4. Traducir el orden único de UI al contrato API y normalizar URL al contrato
   nuevo, sin preservar parámetros múltiples históricos.
5. Sustituir la ruta por el contenedor nuevo y eliminar los componentes y
   columnas de presentación de la vista anterior.

## Verification

- Endpoint, debounce, fetch, paginación, permisos y filtros de la vista nueva
  operan correctamente.
- URL serializa un solo orden y un solo período; no conserva estado anterior
  no representable.
- Folio navega al detalle; no hay expansión ni menú de acciones.
- Estados loading, error, vacío y vacío con criterios usan `DataTable`.
- Escritorio valida scroll disponible y header sticky; móvil valida scroll de
  página, overflow horizontal local y toolbar adaptable.
- Permisos `READ` y `CREATE`, temas, foco y textos `es/en` no regresan.
