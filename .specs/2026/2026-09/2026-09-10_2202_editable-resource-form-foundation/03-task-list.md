# Lista De Tareas

## Fase 1. Composición Neutral

- [x] Crear `ResourceFormFrame`, `ResourceFormSection` y `ResourceFormActions`.
      Status: completed
      Cierre: las tres piezas presentan estructura y estados controlados sin
      conocer tipos, schemas, permisos o integración remota.

## Fase 2. Hosts De Experiencia

- [x] Crear `ResourceFormRoute` y `ResourceFormOverlay`.
      Status: completed
      Cierre: una ruta y ambos contenedores overlay reutilizan el mismo frame;
      `Dialog` y `Drawer` son elección explícita del consumidor.

## Fase 3. Exportación Y Verificación

- [ ] Exponer el contrato público y verificar fronteras de importación.
      Status: pending
      Cierre: no existen tipos de dominio ni imports a API, features, stores,
      permisos o navegación desde `src/components/resource-form/`.

- [ ] Ejecutar typecheck, lint sin autofix y build.
      Status: pending
      Cierre: las validaciones estáticas terminan sin errores atribuibles a la
      fundación.

- [ ] Realizar validación visual, de teclado, foco y temas activos.
      Status: pending
      Cierre: la persona usuaria valida composición de ruta y ambas variantes
      de overlay en el catálogo o consumidor aprobado.
