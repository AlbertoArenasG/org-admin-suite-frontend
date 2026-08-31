# Decisions

## Decision 01. Listado

Se aprueba mostrar folio, tipo, Cliente, activo, estatus operativo,
compromiso con Cliente, retorno de Proveedor y actualización. Los filtros MVP
son búsqueda, estatus, tipo, Cliente, Proveedor, presencia de Proveedor y los
rangos date-only expuestos por backend.

## Decision 02. Formulario

Se aprueban secciones: general, Cliente, activo, compromiso con Cliente y
Proveedor/seguimiento opcional. Usuarios relacionados son un multiselect
dependiente del Cliente. Los campos omitidos en edición no se envían.

## Decision 03. Componentes

Los comboboxes usan componentes Radix/shadcn adaptados al multitema. Solo se
extraerán componentes compartidos con reutilización real: intervalo date-only,
selector dependiente Cliente/usuarios y semáforo.

## Decision 04. Lookups Y Fechas Estimadas

El selector de usuarios relacionados consume el lookup auxiliar no paginado
`GET /v1/customers/:customerId/users/options`; el listado paginado queda para
la administración de relaciones. Las fechas estimadas se recalculan en frontend
al modificar la fecha base o años, meses, semanas y días del intervalo. El
usuario puede ajustar el resultado antes de guardar.
