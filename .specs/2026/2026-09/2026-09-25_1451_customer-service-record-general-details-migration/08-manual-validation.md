# Validación Manual: Customer Service Record General Details Migration

## Acceso Y Ruta

- [x] Con `CUSTOMER_SERVICE_RECORDS/READ`, abrir un registro existente por su
      `recordId` y confirmar breadcrumb con `Registro {folio}`.
- [x] Sin `READ`, confirmar el fallback de `DashboardViewAccessBoundary`.
- [x] Confirmar skeleton durante carga, recuperación al fallar GET y not-found
      cuando el registro no existe o no es accesible.

## Detalles Generales

- [x] Confirmar modo lectura con tipo de servicio, fecha, estado operativo y
      `Observaciones generales`.
- [x] Sin `UPDATE`, confirmar ausencia de edición y preservación de lectura.
- [x] Con `UPDATE`, entrar a edición, cambiar cada campo, cancelar y confirmar
      restauración del último valor canónico solo en este bloque.
- [x] Validar obligatoriedad de tipo, fecha y estado; confirmar que
      observaciones vacías se envían como `null`.

## Guardado Y Recuperación

- [x] Guardar una edición válida y confirmar una sola petición PUT con los
      cuatro campos contractuales.
- [x] Confirmar feedback de guardado y éxito, reemplazo de datos visibles,
      toast y vuelta a lectura después de 800 ms.
- [x] Forzar error remoto y confirmar conservación del draft, mensajes de
      recuperación y posibilidad de reintentar sin recargar.

## Calidad Visual Y Accesibilidad

- [x] Validar etiquetas a la izquierda e inputs a la derecha en escritorio.
- [x] Validar campos apilados, orden y acciones utilizables en móvil.
- [x] Confirmar navegación por teclado, foco visible y uso correcto de
      combobox, selector, fecha y textarea.

## Cierre

- [x] La persona usuaria confirma la matriz completa el 2026-09-25.
