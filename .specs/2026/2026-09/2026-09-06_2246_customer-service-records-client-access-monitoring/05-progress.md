# Progress: Customer Service Records Client Access Monitoring

## 2026-09-06

- Se creo la iniciativa en `.specs`.
- Se corrigio el alcance contra la spec cerrada de API: modulo, permiso,
  frontera de visibilidad, endpoints y proyeccion dedicados.
- Se aprobo y documento la ampliacion del contrato: `operational_status` y las
  materializaciones de `customer_delivery` ya estan disponibles sin exponer
  datos de proveedor.
- La respuesta HTTP del contrato ampliado fue validada por confirmacion del
  usuario el 2026-09-06.
- Se creo `/Users/alberto/projects/icsacv/component-staging/component-lab` para
  evaluar bloques de tabla sin mezclar sus primitives con el frontend de
  producto. Lint y build con Webpack pasaron.
- Se aprobo `Portal` como espacio autenticado extensible y
  `/dashboard/portal/services` como primera ruta. El subgrupo inicial es
  `Servicios`.
- Se aprobo copy neutral en navegacion: `Portal` y `Seguimiento de servicios`
  para todo actor autorizado. No se usa `systemRole` como sustituto de
  `isInternalStaff`, clasificacion que el frontend no recibe.
- La composicion usara el `DataTable` compartido ya validado y promovido al
  frontend. Pendiente: registrar el diseno tecnico de adaptacion y construir
  la ruta.
- Se registro el diseno tecnico y se implemento la primera adopcion en
  `/dashboard/portal/services`: feature Redux exclusiva, estado Zustand de
  query, URL sincronizable, `DataTable` v9, navegacion `Portal`, shell Next y
  copy localizado.
- El MVP expone buscador con debounce, paginacion, ordenamiento permitido y
  expansion local de observaciones. No consulta detalle, lookups
  ni filtros multicampo y no importa artefactos administrativos.
- Pendiente: validacion manual con permisos y respuestas HTTP reales para
  cerrar la iniciativa.
