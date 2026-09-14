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

## Fase 3. Familia Shark/Ark

- [x] Integrar la familia de formularios y overlays de Shark/Ark bajo
      `src/components/vendor/shark/` sin sobrescribir primitives canónicas.
      Status: completed
      Cierre: fuente, revisión, licencia, dependencias, estilos y actualización
      quedan documentados; el vendor consume los tokens globales sin wrapper.

## Fase 4. Exportación Y Verificación

- [x] Formalizar slots de acciones globales y locales en header o footer.
      Status: completed
      Cierre: frame y sección exponen `headerActions` y `footerActions`; la
      posición visual de `ResourceFormActions` no define atomicidad.

- [x] Implementar el contrato de presentación opcional y su anatomía visual.
      Status: completed
      Cierre: frame y sección mantienen la misma topología con superficie,
      densidad y encabezados opcionales; el preview expone el espécimen y sus
      diagramas de composición.

- [x] Exponer el contrato público y verificar fronteras de importación.
      Status: completed
      Cierre: no existen tipos de dominio ni imports a API, features, stores,
      permisos o navegación desde `src/components/resource-form/`.

- [x] Ejecutar typecheck, lint sin autofix y build.
      Status: completed
      Cierre: las validaciones estáticas terminan sin errores atribuibles a la
      fundación.

- [x] Realizar validación visual, de teclado, foco y temas activos.
      Status: completed
      Cierre: la persona usuaria validó composición de ruta, `Editable`
      controlado, superficies, acciones, estados simulados, temas, teclado,
      foco, responsive y ambas variantes de overlay en el preview oficial.
      La validación RHF y de mutación remota queda fuera de esta fundación,
      porque no crea formularios de dominio ni integra datos remotos.

## Cierre

## Fase 5. Navegación Intraformulario En Ruta

- [x] Formalizar e implementar `ResourceFormNavigation` y extender
      `ResourceFormRoute` con navegación intraformulario opcional.
      Status: completed
      Cierre: navegación propia por anclas y scroll spy, sin viewport interno,
      se integra únicamente en ruta y conserva tabs en móvil y lateral en
      escritorio según configuración.
- [x] Integrar la navegación en el preview oficial y validar scroll spy,
      accesibilidad, responsive y regiones sticky de ruta.
      Status: completed
      Cierre: la persona usuaria aprobó tabs sticky en móvil, navegación lateral
      sticky en escritorio, scroll spy, offsets acumulados de header y footer,
      y la ausencia de navegación en overlays.
- [x] Cerrar formalmente la iniciativa extendida.
      Status: completed
      Cierre: la fundación y su navegación intraformulario opcional quedaron
      implementadas y validadas. Los gates de dominio y adjuntos pertenecen a
      specs futuras.
