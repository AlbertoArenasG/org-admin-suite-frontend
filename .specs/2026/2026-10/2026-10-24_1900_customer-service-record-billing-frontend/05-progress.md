# Progreso

## 2026-10-24 — definición

- Revisados el handoff del API, las rutas administrativas, los módulos de estado, la navegación y las recetas de Next Dashboard.
- Acordadas las acciones explícitas de envío y facturación, la separación de permisos y estado, y la omisión de políticas y grupos en el detalle de facturación.
- Redactados definición, análisis, plan, decisiones, diseño técnico, tareas, slices y matriz de validación. La implementación y las pruebas de esta nueva interfaz todavía no se han realizado.
- Aclarado que facturación omite el bloque de seguimiento al proveedor con reglas, grupos y políticas, pero conserva el estado y fecha del aviso por correo que envió el registro a facturación. Referencias de la spec actualizadas de manera transversal.

## Estado actual

- Definición: completada tras auditoría documental.
- Implementación: Slices 1, 2 y 3 codificadas; Slice 4 pendiente.
- Validación: pendiente; Slice 5.
- Documentación viva de adopción: pendiente hasta que exista implementación verificable.

## 2026-10-24 — implementación de Slices 1 y 2

- Contratos de fila y detalle extendidos con estado de facturación y último aviso; mapeo localizado compartido y transporte de archivos extraído sin cambiar el contrato. Thunks y slice de facturación separados de los administrativos, reducer registrado y store/URL propios para su tabla. La consulta de facturación no envía ordenamiento ni importa thunks, slices o selectores administrativos.
- Administración: columna y filtro de estado en el diálogo estándar, con contador, limpieza y sincronización URL; opciones localizadas del API con error y reintento. Acción de envío en fila y detalle solo para NOT_SUBMITTED con UPDATE, confirmación del correo y feedback para éxito, fallo de correo, conflicto y otros errores. El detalle muestra estado, último aviso y fecha en frame navegable; se agregó el cliente al header compacto sin cambiar el portal. El editor de factura evita retirar el último archivo si el registro ya está INVOICED.
- Verificación técnica: `npm run typecheck`, ESLint enfocado en los archivos TS/TSX modificados y `git diff --check` sin errores. Se revisó el handoff del API y la separación de estado. La validación manual de navegador, permisos, temas y dispositivos queda pendiente para Slice 5.
- El usuario confirmó que su revisión de las Slices 1 y 2 quedó bien. Se acortó únicamente el encabezado de la columna a «Facturación»/«Billing» tras su comentario. La matriz integral de Slice 5 sigue pendiente; esta confirmación no se atribuye a escenarios específicos que el usuario no detalló.

## 2026-10-24 — implementación de Slice 3

- Registradas ambas rutas de facturación en la política de Next Dashboard y creadas las fronteras READ para lista y detalle. El grupo visual «Facturación» aparece por el permiso BILLING_CUSTOMER_SERVICE_RECORDS/READ, sin depender del permiso administrativo.
- Compuesta tabla con columnas propias, vínculo de folio, acción primaria que sirve al menú contextual y doble clic, búsqueda, paginación global, columnas visibles, filtro de los dos estados permitidos con contador/limpieza y sincronización URL. No se envía ordenamiento ni se llaman rutas administrativas.
- Para que la navegación tenga destino real antes de Slice 4, el detalle abre una base de lectura del registro con carga, error/reintento, header de equipo y cliente, y resumen. Las secciones completas, documentos y edición de factura permanecen en Slice 4.
- Verificación técnica de la slice: `npm run typecheck`, ESLint enfocado y `git diff --check` sin errores. La validación manual de roles, navegación, filtros, pantalla móvil y temas sigue pendiente de confirmación del usuario.
- `npm run build` compiló el código, pero falló en `Collecting page data` con `PageNotFoundError` para rutas existentes de `dashboard-playground/catalog`. Durante la falla, `.next/server/app-paths-manifest.json` contenía solo cinco rutas visitadas, mientras los archivos de esas páginas sí existían en `src/app` y `.next/server/app`; esto apunta a interferencia con otra escritura en `.next`. No se considera build completo ni se modifica la configuración de Next para esta slice. La comprobación integral de build queda pendiente en Slice 5, cuando pueda ejecutarse sin procesos que compartan `.next`.
