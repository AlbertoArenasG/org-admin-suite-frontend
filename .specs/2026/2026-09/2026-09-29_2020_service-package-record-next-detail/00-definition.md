# Detalle Next Dashboard De Service Package Record

## Estado

- Definition status: completed
- Implementation ready: yes
- Implementation status: completed
- Validation status: completed
- Spec status: completed

## Problema

La funcionalidad legacy de detalle de `/dashboard/service-packages-records/[recordId]` fue retirada por completo: ruta, vista MUI, preview local, estado Redux individual, thunk y acción desde la tabla. El módulo conserva únicamente listado, filtros y eliminación.

Se requiere crear desde cero un detalle administrativo en Next Dashboard, sin restaurar artefactos legacy.

## Resultado Esperado

Una persona con `SERVICE_PACKAGES/READ` podrá consultar un registro individual en una composición de lectura de Next Dashboard, con primitives y recetas institucionales, los datos que exponía la vista retirada y archivos mediante el patrón documental reutilizable y URLs protegidas.

## Alcance Inicial

Incluido:

- Nueva ruta individual protegida, shell Next Dashboard, breadcrumb dinámico, carga, error, recurso no encontrado, reintento y limpieza de estado.
- Estado individual de `servicePackagesRecords`, separado de listado, filtros y eliminación, con protección contra respuestas obsoletas.
- Lectura con `ResourceFormRoute`, `ResourceFormFrame` y `ResourceFormSection`, sin edición simulada.
- Contacto, servicio, metadata, firmas, observaciones y equipo del contrato individual; inicialmente conserva `package_id` y `s3_folder_key`.
- Colección plana **Archivos recolectados** para `files[]`, ocultando `details.json`, con expansión, preview imagen/PDF y descarga por `download_url` y `preview_url`.
- Navegación responsive y accesible consistente con detalles Next Dashboard.

Excluido:

- Listado, restauración de su enlace a detalle, filtros, ordenamiento, paginación y eliminación; tendrán una spec independiente.
- Edición del registro o adjuntos, carga ZIP y PWA Recolección.
- Cambios a backend, dominio, persistencia, permisos, recipes, tokens o componentes compartidos salvo extensión aprobada.
- Compatibilidad temporal con detalle, estado, contrato o URLs legacy.

## Contratos Y Dependencias

- `GET /v1/service-packages/records/:recordId` requiere `service_packages:READ` y entrega el registro individual.
- `GET /v1/service-packages/records/:recordId/files/:fileId/download` entrega stream protegido para descarga o preview inline.
- Cada archivo usa `file_id`, `original_name`, `mime_type`, `size`, `download_url` y `preview_url`; nunca `s3_key` o `content_type`.
- El handoff vigente está en `org-admin-suite-api/docs/frontend/service-package-record-file-delivery-handoff.md`.

## Restricciones

- La fuente de verdad es código y contrato vigentes, no la spec eliminada ni specs históricas.
- No se crean, proponen ni ejecutan pruebas unitarias.
- Cualquier desviación de contrato o recipe se expone antes de escribir código.
- No se marca lista la spec mientras falte auditar estado, artefactos, responsive, permisos, composición o validación.

## Decisiones Cerradas De Definición

- `details` se adapta en el feature a un modelo de lectura tipado; nunca se entrega como `Record<string, unknown>` a un componente.
- La navegación tendrá tres destinos: **Información general**, **Equipo** y **Archivos recolectados**. El primer frame agrupa sections hermanas de contacto, servicio/metadata, firmas y observaciones; equipo y documentos son frames propios.

## Gate De Implementación

La definición, análisis, decisiones, diseño técnico, plan, registro de artefactos, implementación y matriz de validación están cerrados. La iniciativa completó sus verificaciones estáticas y validación manual; no conserva checks abiertos dentro de su alcance.
