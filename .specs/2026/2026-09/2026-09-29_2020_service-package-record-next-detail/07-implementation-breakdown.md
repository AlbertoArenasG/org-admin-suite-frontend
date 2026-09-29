# Breakdown De Implementación

## Slice 1: Contrato Y Estado Individual

- **Estado:** completada el 2026-09-29.
- **Objetivo:** introducir el modelo completo y su ciclo remoto aislado del listado.
- **Artefactos:** `types.ts`, `servicePackagesRecordsMappers.ts`, thunks y slice del feature.
- **Pasos:** separar tipos de lista/detalle; normalizar `details` y archivos; crear GET individual; agregar `detail.currentRecordId`, `activeRequestId`, guards de respuestas obsoletas y reset.
- **Límites:** no rutas, JSX, i18n, tabla ni componentes compartidos.
- **Validación:** typecheck, inspección de URL/modelo/reducers y `git diff --check`.
- **Cierre:** completado. El feature carga, representa y limpia detalle tipado sin afectar listado o eliminación.

## Slice 2: Ruta, Shell Y Frames De Lectura

- **Estado:** pendiente.
- **Objetivo:** montar la vista Next Dashboard con estados de pantalla y datos no documentales.
- **Artefactos:** page, shell migration, breadcrumbs, página, route adapter, navegación compacta, sections y locales.
- **Pasos:** agregar boundary READ, shell y breadcrumb dinámico; implementar carga, error/reintento, 404 y reset; componer frames de información general y equipo; aplicar navegación y tabla responsive.
- **Límites:** no documentos, edición, enlace de tabla ni cambios compartidos.
- **Validación:** typecheck, permisos, carga, error, 404, desktop, rango compacto, móvil, teclado, foco y anchors.
- **Cierre:** un usuario autorizado consulta los datos no documentales con patrones Next Dashboard.

## Slice 3: Colección Documental

- **Estado:** pendiente.
- **Objetivo:** presentar archivos mediante componente reutilizable y contrato seguro.
- **Artefactos:** sección documental y locales de módulo.
- **Pasos:** filtrar JSON operativo, derivar adjuntos, implementar expansión, preview imagen/PDF y descarga por URLs backend.
- **Límites:** no diálogo local, MUI, cambios a `DocumentCollection`, edición ni carga.
- **Validación:** typecheck, vacío, archivos mixtos, expansión, preview, descarga, foco, teclado y reduced motion.
- **Cierre:** no existe lógica documental local ni rutas de storage en la vista.

## Slice 4: Validación Y Cierre

- **Estado:** pendiente.
- **Objetivo:** demostrar aceptación y cerrar la iniciativa con evidencia.
- **Artefactos:** matriz `08`, task list, progreso, definición, índice y adoption log.
- **Pasos:** ejecutar verificación estática, registrar validación manual, auditar checks/documentos y cerrar solo después de confirmación manual.
- **Límites:** no agrega funcionalidad ni absorbe migración de tabla.
- **Validación:** matriz manual completa, typecheck y `git diff --check`.
- **Cierre:** no quedan tareas, artefactos ni documentación viva pendientes.
