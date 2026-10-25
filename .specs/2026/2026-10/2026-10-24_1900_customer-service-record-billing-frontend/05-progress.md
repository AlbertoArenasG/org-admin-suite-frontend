# Progreso

## 2026-10-24 — definición

- Revisados el handoff del API, las rutas administrativas, los módulos de estado, la navegación y las recetas de Next Dashboard.
- Acordadas las acciones explícitas de envío y facturación, la separación de permisos y estado, y la omisión de políticas y grupos en el detalle de facturación.
- Redactados definición, análisis, plan, decisiones, diseño técnico, tareas, slices y matriz de validación. La implementación y las pruebas de esta nueva interfaz todavía no se han realizado.
- Aclarado que facturación omite el bloque de seguimiento al proveedor con reglas, grupos y políticas, pero conserva el estado y fecha del aviso por correo que envió el registro a facturación. Referencias de la spec actualizadas de manera transversal.

## Estado actual

- Definición: completada tras auditoría documental.
- Implementación: Slices 1 y 2 codificadas; Slices 3 y 4 pendientes.
- Validación: pendiente; Slice 5.
- Documentación viva de adopción: pendiente hasta que exista implementación verificable.

## 2026-10-24 — implementación de Slices 1 y 2

- Contratos de fila y detalle extendidos con estado de facturación y último aviso; mapeo localizado compartido y transporte de archivos extraído sin cambiar el contrato. Thunks y slice de facturación separados de los administrativos, reducer registrado y store/URL propios para su tabla. La consulta de facturación no envía ordenamiento ni importa thunks, slices o selectores administrativos.
- Administración: columna y filtro de estado en el diálogo estándar, con contador, limpieza y sincronización URL; opciones localizadas del API con error y reintento. Acción de envío en fila y detalle solo para NOT_SUBMITTED con UPDATE, confirmación del correo y feedback para éxito, fallo de correo, conflicto y otros errores. El detalle muestra estado, último aviso y fecha en frame navegable; se agregó el cliente al header compacto sin cambiar el portal. El editor de factura evita retirar el último archivo si el registro ya está INVOICED.
- Verificación técnica: `npm run typecheck`, ESLint enfocado en los archivos TS/TSX modificados y `git diff --check` sin errores. Se revisó el handoff del API y la separación de estado. La validación manual de navegador, permisos, temas y dispositivos queda pendiente para Slice 5.
- El usuario confirmó que su revisión de las Slices 1 y 2 quedó bien. Se acortó únicamente el encabezado de la columna a «Facturación»/«Billing» tras su comentario. La matriz integral de Slice 5 sigue pendiente; esta confirmación no se atribuye a escenarios específicos que el usuario no detalló.
