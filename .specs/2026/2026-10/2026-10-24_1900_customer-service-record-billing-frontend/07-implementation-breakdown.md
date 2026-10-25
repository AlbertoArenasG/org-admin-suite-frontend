# Breakdown de implementación

Cada slice requiere revisar el `Registro de Artefactos` antes de editar; si cambia una ubicación o responsabilidad, actualizar primero el diseño y las decisiones. No iniciar una slice posterior con la anterior incompleta.

## Slice 1 — contratos y estado

**Status:** completed.

- Extender tipos y mapeos compartidos de fila/detalle para estado y último aviso; preservar valores localizados del API.
- Extraer el transporte de archivos sin cambiar su contrato. Mantener thunks y slices separados entre administración y facturación; registrar el nuevo reducer.
- Incorporar opción/filtro administrativos y estado de tabla de facturación en Zustand/URL; usar preferencia global de filas por página.
- Verificar que el módulo de facturación no importe thunks, slices ni selectores administrativos y que el query billing no envíe ordenamiento.

**Salida verificable:** datos y opciones tipados para los dos módulos; mapeos, filtros y estados de petición independientes. Cubre aceptación 1, 2 y 4 como base de integración.

## Slice 2 — administración

**Status:** completed.

- Añadir columna de estado y filtro de tres valores en el diálogo existente, con contador y limpieza.
- Añadir acción de fila y detalle «Enviar a facturación» solo con NOT_SUBMITTED y UPDATE; confirmar correo y reflejar carga, éxito, 502 y conflicto.
- Mostrar estado y último aviso en frame navegable; actualizar menús normal y compacto del detalle y header con cliente.
- Aplicar regla del último archivo al editor de factura administrativa en INVOICED; preservar portal.

**Salida verificable:** administración refleja estado y envío sin selector de enum; documento y navegación coherentes. Cubre aceptación 2, 3, 7 y 8.

## Slice 3 — navegación y lista de facturación

**Status:** pending.

- Añadir grupo visual, enlace, breadcrumb, política central de shell/scroll, traducciones y route boundary con billing READ.
- Componer tabla DataTable con búsqueda, paginación, filtro SUBMITTED/INVOICED y enlace, menú, contexto y doble clic a detalle.
- Resolver loading, vacío, error, permisos y reset/sync URL sin solicitudes administrativas ni sort.

**Salida verificable:** un rol solo de facturación puede ver y usar el listado; roles sin billing READ no lo montan. Cubre aceptación 1 y 4.

## Slice 4 — detalle y factura de facturación

**Status:** pending.

- Crear detalle con ResourceFormRoute, secciones y documentos de lectura; omitir el bloque de seguimiento al proveedor, reglas, políticas y grupos, sin consultar sus opciones.
- Reutilizar header compacto con cliente y editor documental especializado; mostrar estado de facturación y último aviso por correo a facturación, sin confundirlo con el seguimiento al proveedor.
- Implementar guardar borrador y guardar y marcar, validación de archivo, PUT seguido de PATCH, 409/refetch y reintento exclusivo de PATCH tras fallo parcial.
- Aplicar permisos UPDATE y reglas INVOICED sin ampliar componentes genéricos.

**Salida verificable:** flujo editable, confirmaciones y recuperación parcial documentada. Cubre aceptación 1, 5, 6, 7 y 8.

## Slice 5 — validación y documentación

**Status:** pending.

- Ejecutar typecheck, lint enfocado y build; revisar la matriz de `08-manual-validation.md` con el usuario para los escenarios que exigen interacción real.
- Corregir defectos encontrados, registrar evidencia en `05-progress.md` y actualizar `docs/ui/adoption-log.md`.
- Auditar `03-task-list.md`, slices, definición, registro de artefactos e índice; cerrar solo cuando implementación y validación estén confirmadas.

**Salida verificable:** evidencia técnica y manual, documentación viva e índice alineados. Cubre aceptación 1 a 8.
