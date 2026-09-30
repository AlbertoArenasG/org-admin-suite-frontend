# Plan: Migracion Del Listado De Recepcion, Recoleccion Y Entrega

## Objetivo

Reconstruir el listado administrativo de Service Package Records como una
superficie nativa de Next Dashboard, reutilizando el patron `DataTable` sin
restaurar dependencias o arquitectura legacy.

## Diseno Objetivo

```text
page.tsx
  `- DashboardViewAccessBoundary(SERVICE_PACKAGES, READ)
       `- DashboardTableWorkspace
            `- ServicePackagesRecordsContainer
                 |- useServicePackagesRecordsListController
                 |- ServicePackagesRecordsTable(DataTable)
                 |- useServicePackageRecordRowActions
                 `- DestructiveConfirmationDialog
```

Redux es responsable de datos remotos de listado, opciones y baja. El hook
controlador coordina URL, preferencia global de limite, debounce, fetch y
Zustand; la tabla consume la preferencia global persistida de densidad. Los
componentes de tabla y columnas reciben modelos internos y callbacks; no hacen
HTTP ni interpretan autorizacion.

## Fases

### Fase 1. Fundacion De Datos Y Estado

- Reincorporar tipos de lista, mapper de coleccion, thunks de listado/opciones/
  baja y ramas Redux aisladas de `detail`.
- Crear parser y serializer de query, Zustand local y controlador de ciclo de
  vida con la preferencia global de page size.

### Fase 2. Superficie DataTable Y Navegacion

- Crear columnas, filtro de tipo de servicio, acciones por fila, contenedor y
  ruta protegida bajo el shell de tabla.
- Restaurar la entrada de sidebar, breadcrumb de listado y traducciones.

### Fase 3. Validacion Y Promocion

- Ejecutar verificaciones estaticas y validar manualmente todas las variantes.
- Registrar la adopcion en `docs/ui/adoption-log.md` despues de aprobacion.
- Auditar checks, estados, registro de artefactos y ausencia de legado antes de
  cerrar formalmente.

## Criterios De Salida

- La ruta de listado opera solo con componentes y contratos de Next Dashboard.
- Busqueda, filtro, paginacion, URL, limite persistente y densidad global se
  mantienen sincronizados sin requests duplicados ni estado cruzado con detalle.
- Detalle y baja son accionables solo con las capacidades correspondientes.
- No quedan artefactos, imports ni rutas legacy; la spec y documentacion viva
  reflejan el estado implementado y validado.
