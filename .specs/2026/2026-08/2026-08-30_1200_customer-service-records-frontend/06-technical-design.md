# Technical Design

La feature vivirá en `src/features/customer-service-records` y sus componentes
en `src/components/customer-service-records`. Seguirá el patrón Redux/thunks
de `internal-asset-control` y consumirá `/v1/customer-service-records`.

El formulario conserva estado por bloques. Cambiar Cliente limpia usuarios
relacionados; desactivar Proveedor elimina sus dependencias y envía
`provider: null`. El payload de edición se construye solo con campos cambiados.

Los semáforos se renderizan desde `status_materialization` recibido, incluidos
nombre localizado, color y fuente. Frontend no recalcula fechas ni políticas.
