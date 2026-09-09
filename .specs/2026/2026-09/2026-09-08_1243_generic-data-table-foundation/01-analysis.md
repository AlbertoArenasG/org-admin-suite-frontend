# Analysis: Generic Data Table Foundation

## Current State

- Las tablas legacy combinan TanStack Table, componentes de presentacion y
  componentes MUI en implementaciones por modulo.
- Ejemplos como Customer Service Records mantienen un store Zustand por tabla
  para paginacion, ordenamiento, visibilidad, busqueda y filtros; un
  contenedor sincroniza URL y dispara thunks; Redux Toolkit conserva la
  respuesta remota.
- El backend usa un envelope comun con `data` y, para colecciones paginadas,
  `pagination { page, per_page, total, total_pages }`.
- El contrato de Client Access confirma filtros, ordenamiento multiple y
  paginacion remotos; la primera adopcion prevista consumira ese contrato.

## Findings

- La separacion actual entre Zustand para interaccion y Redux Toolkit para
  estado remoto es una base valida, pero se repite por vista y no existe un
  contrato comun de `DataTable`.
- La capa de pagina no debe ejecutar consultas. El contenedor debe coordinar
  URL, store local y thunks sin trasladar esa responsabilidad al componente
  reutilizable.
- Los bloques de shadcn.io evaluados en el Component Lab aportan patrones de
  experiencia y presentacion, pero no un contrato de producto directamente
  reutilizable.
- El frontend usa `@tanstack/react-table` v9 como dependencia canonica. Las
  68 importaciones de tablas legacy consumen temporalmente el alias
  `@tanstack/react-table-v8`, por lo que no se mezclan APIs durante la
  migracion gradual.
- Virtualizacion, encabezados fijos e infinite scrolling son capacidades
  distintas. Solo encabezados fijos entran en v1.

## Dependencies

- Spec `customer-service-records-client-access-monitoring` para la primera
  adopcion funcional.
- Handoff API
  `org-admin-suite-api/docs/frontend/customer-service-records-client-access-handoff.md`.
- Primitives canonicas, tokens y reglas de tema consolidadas por
  `canonical-shadcn-primitives-theme-migration`.
- Component Lab local `component-staging/component-lab` como material de
  referencia no importable.

## Risks

- Convertir el componente comun en un contenedor de negocio o transporte HTTP.
- Generalizar prematuramente props que no tengan consumidor ni contrato claro.
- Acoplar la primera adopcion de Client Access a modelos administrativos legacy.
- Implementar redimensionamiento o sticky regions sin definir dueño de scroll,
  teclado y comportamiento tactil.
- Usar los bloques descargados como copia literal en lugar de referencias.
- Mezclar imports v8 y v9 bajo el mismo paquete durante la migracion.

## Constraints

- No se introducen cambios a primitives para resolver una necesidad exclusiva
  de tabla sin aprobacion explicita.
- La primera implementacion debe conservar compatibilidad con los temas
  existentes y no agregar overrides globales exclusivos de una vista.
- La configuracion del componente debe permitir extension posterior sin
  prometer ausencia absoluta de cambios ante requisitos nuevos.
