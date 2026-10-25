# Progreso

## 2026-10-24 — definición

- Revisados el handoff del API, las rutas administrativas, los módulos de estado, la navegación y las recetas de Next Dashboard.
- Acordadas las acciones explícitas de envío y facturación, la separación de permisos y estado, y la omisión de políticas y grupos en el detalle de facturación.
- Redactados definición, análisis, plan, decisiones, diseño técnico, tareas, slices y matriz de validación. La implementación y las pruebas de esta nueva interfaz todavía no se han realizado.
- Aclarado que facturación omite el bloque de seguimiento al proveedor con reglas, grupos y políticas, pero conserva el estado y fecha del aviso por correo que envió el registro a facturación. Referencias de la spec actualizadas de manera transversal.

## Estado actual

- Definición: completada tras auditoría documental.
- Implementación: Slices 1 a 4 codificadas; Slice 5 de validación y documentación completada.
- Validación: completada con evidencia técnica y confirmación manual del usuario.
- Documentación viva de adopción: actualizada en `docs/ui/adoption-log.md`.

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

## 2026-10-24 — implementación de Slice 4

- El detalle de facturación usa el header compacto con cliente y ResourceFormRoute con navegación a servicio, cliente/entrega, equipos, documentos y factura. Muestra varios equipos, sus adjuntos, documentos del registro y el último aviso a facturación; omite el seguimiento al proveedor y no solicita opciones administrativas.
- El editor documental específico de registros conserva la composición existente y separa el borrador en un hook. La factura de facturación permite guardar cambios o guardar y marcar como facturado con UPDATE; exige archivo para marcar y para editar un registro INVOICED. La coordinación del módulo sube pendientes, confirma PUT y luego PATCH. Tras fallo parcial consulta el detalle y permite reintentar solo PATCH, sin repetir la subida o el PUT. Ante 409 o respuesta incierta del PUT consulta el detalle antes de continuar. El GET conserva la vista durante una recarga del mismo registro y descarta datos obsoletos en 403/404.
- Copys de detalle, navegación y recuperación agregados en español e inglés. Se emplean tokens y componentes existentes; no se amplió ninguna primitiva genérica.
- Verificación técnica de la slice: `npm run typecheck`, ESLint enfocado y `git diff --check` sin errores. Build y matriz manual permanecen en Slice 5; no se atribuye todavía validación interactiva al usuario.

## 2026-10-24 — validación y cierre de Slice 5

- `npm run typecheck` y ESLint enfocado en los componentes y features administrativos y de facturación: sin errores. `git diff --check`: sin errores. El diseño técnico enumera rutas y artefactos existentes; revisión automática de rutas `src/` del registro: cero archivos faltantes. Inspección focalizada de adaptadores URL: administración acepta tres estados y conserva `billing_status` al construir la consulta; facturación acepta solo SUBMITTED/INVOICED y no agrega ordenamiento.
- El build sobre el directorio compartido `.next` compiló y pasó tipos, pero volvió a fallar durante `Collecting page data` por entradas faltantes de páginas existentes de Playground. Se repitió `NEXT_TELEMETRY_DISABLED=1 npm run build` en una copia temporal aislada del commit de implementación, con las mismas dependencias y configuración de entorno: terminó con código 0, generó 57 páginas e incluyó lista y detalle de facturación. La copia temporal se eliminó. Quedaron cinco warnings de lint en archivos ajenos al alcance de esta spec; ninguno bloqueó el build.
- El usuario confirmó el 2026-10-24 que validó toda la matriz de `08-manual-validation.md`, incluidos permisos y casos de error. La evidencia es su confirmación; no se atribuyen capturas o trazas no entregadas.
- Actualizado `docs/ui/adoption-log.md`, auditados los checks y estados de esta carpeta e indexado el cierre en `.specs/index.md`. La spec queda completada como trabajo de desarrollo; el despliegue no forma parte de su alcance.
