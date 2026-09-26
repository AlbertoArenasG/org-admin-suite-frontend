# Validación Manual: Customer Service Record Customer And Delivery Migration

## Navigation

- [x] Confirmar enlaces a ambos bloques, scroll correcto, sección activa y
      ausencia de contenido oculto o semántica de tabs.
- [x] Confirmar foco visible y navegación por teclado de los enlaces.

## Client And Delivery

- [x] Confirmar lectura de cliente, usuarios, fechas, intervalo y políticas.
- [x] Sin `UPDATE`, confirmar que el bloque no permite editar.
- [x] Con `UPDATE`, cambiar cliente y confirmar limpieza, recarga y selección
      válida de usuarios relacionados; comprobar arreglo vacío permitido.
- [x] Validar cliente obligatorio e intervalo no negativo.
- [x] Confirmar cálculo de fecha estimada, sobrescritura manual y recálculo
      backend al limpiarla.
- [x] Confirmar fechas y políticas opcionales.

## Save And Recovery

- [x] Confirmar una única petición PUT con el body completo contractual.
- [x] Confirmar cancelación local sin afectar `Detalles generales`.
- [x] Confirmar feedback de envío y éxito durante 800 ms, toast, valores
      canónicos devueltos y vuelta a lectura.
- [x] Forzar error remoto y confirmar draft, recuperación y reintento.

## Visual Quality

- [x] Confirmar etiquetas a la izquierda e inputs a la derecha en escritorio.
- [x] Confirmar campos apilados, controles utilizables y navegación correcta
      en móvil.

## Closure

- [x] La persona usuaria confirma la matriz completa el 2026-09-25.
