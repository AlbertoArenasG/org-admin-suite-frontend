# Instrucciones del repositorio frontend

## Acuerdos de trabajo

- Los mensajes de commit y las propuestas de `git commit` van en español y siguen Conventional Commits, exigido por `commitlint.config.js`: `tipo: descripción` (por ejemplo, `docs: aclarar criterio de validación`). Si el usuario pide el comando, dar `git commit -m "..."` para ejecutarlo desde este repositorio, sin `git -C`.
- No agregar archivos al stage, crear commits ni hacer push salvo petición explícita. Una petición de mensaje de commit no autoriza esas operaciones.
- Respetar las decisiones y el alcance aprobados. Para trabajo de una spec activa, seguir `.specs/SPEC_WORKFLOW.md`; un cambio solicitado fuera de la spec no se incorpora a ella por defecto.
- Antes de ampliar el contrato de un componente genérico, revisar sus consumidores y discutir el cambio cuando implique una decisión arquitectónica o afecte otros módulos. Preferir una composición específica cuando el caso sea excepcional.

## Antes de redactar una spec

- Investigar el código y los contratos vigentes, conversar el alcance y resolver con el usuario las decisiones relevantes antes de crear los documentos de la spec. El propósito es evitar escribir como definitivas afirmaciones todavía provisionales que luego se repitan en varios documentos y deban corregirse. Buscar reducir esas incertidumbres, sin prohibir preguntas ni cambios posteriores.
- Si una decisión cambia durante la redacción, actualizar todas sus referencias en definición, análisis, plan, decisiones, diseño técnico, tareas, slices y validación que correspondan. Revisar la carpeta completa antes de afirmar que la spec está lista, para no conservar premisas obsoletas o documentos contradictorios.

## Next Dashboard

- Para rutas nuevas o migradas, consultar `docs/ui/dashboard-shell/guidelines.md` y las recetas de `docs/ui/`. Usar la composición vigente de shell, vistas, encabezados, formularios y acciones; no crear variantes locales por conveniencia.
- Declarar el acceso a vistas de Next Dashboard mediante `DashboardViewAccessBoundary`; las acciones usan el permiso disponible en `useDashboardViewAccess()`. El backend conserva la autorización efectiva.
- En tablas, seguir `docs/ui/patterns/data-table.md`: la vista controla datos, columnas, acciones y permisos; `DataTable` no hace fetching ni interpreta reglas del módulo.
- Para formularios y detalles, seguir `docs/ui/recipes/resource-form.md` y `docs/ui/patterns/resource-form.md` cuando correspondan. Separar componentes de presentación, contenedores, estado y fetching de acuerdo con el patrón del módulo.
- Usar tokens semánticos y contratos de `docs/ui/tokens.md` para que las vistas funcionen en todos los temas. Mantener responsive, accesibilidad y traducciones ES/EN.

## Vistas legacy y migraciones

- Un ajuste puntual en una vista legacy se hace dentro de su composición y contratos actuales. Revisar consumidores de componentes, estado y rutas compartidas; conservar el comportamiento de las otras vistas. No introducir piezas de Next Dashboard ni iniciar una migración por un ajuste aislado.
- Una migración a Next Dashboard sigue `docs/ui/dashboard-shell/migration.md`: identificar qué es host/layout legacy, qué es lógica de dominio y qué primitives son neutrales. Reconstruir la composición con los contratos nuevos; no envolver JSX legacy en el shell nuevo ni importar host o layout legacy en una ruta adoptada.
- Cuando el alcance aprobado incluya retirar la funcionalidad legacy, localizar y eliminar sus artefactos exclusivos —componentes, estado, fetching, rutas y estilos— tras comprobar sus consumidores. Evitar mezclar implementaciones antiguas y nuevas o dejar código huérfano; preservar explícitamente lo que siga teniendo otros consumidores.
- No cambiar la política central de adopción ni retirar infraestructura global legacy por iniciativa propia. Seguir la spec de migración cuando exista y registrar la adopción en la documentación viva aplicable. Los cambios que el usuario pida fuera de una spec se trabajan sin agregarlos a ella automáticamente.

## Estado con Redux y Zustand

- Redux Toolkit en `src/features/<módulo>/` posee los datos obtenidos del API, la sesión y el estado de las solicitudes y mutaciones que deben compartirse. Separar `*Thunks.ts` para operaciones asíncronas, cliente HTTP, parámetros y adaptación de respuestas; `*Slice.ts` para estado, reducers, transiciones `pending/fulfilled/rejected`, errores y limpieza; y `types.ts`/mappers del feature para contratos y transformaciones cuando la complejidad lo justifique. Los thunks no contienen estado de UI ni los slices hacen peticiones HTTP. Registrar el reducer en `src/store/store.ts` y consumirlo con `useAppDispatch`/`useAppSelector`.
- Zustand posee estado de interfaz y preferencias del usuario: paginación y filtros controlados por la vista, búsqueda en edición, columnas visibles, densidad y preferencias persistidas cuando corresponda. Los stores de una tabla viven junto a su módulo; los transversales, en `src/stores/` o `src/hooks/`. Definir su ciclo de vida, sincronización con URL y limpieza al salir cuando aplique.
- Los hooks controladores de la vista coordinan Redux, Zustand, URL, permisos y eventos; los componentes de presentación reciben datos y callbacks. No duplicar en Zustand la colección remota ni hacer fetching desde un componente genérico como `DataTable`.
- Estado React local para interacciones efímeras que solo conciernen a un componente. Elegir cada mecanismo por propiedad y duración del estado; una operación excepcional no exige crear thunk y slice si no aporta estado remoto compartido, pero tampoco debe saltarse el patrón para evitar trabajo.

## Verificación

- Por agilidad y ahorro de tiempo, no añadir ni ejecutar pruebas unitarias, de integración o e2e por iniciativa propia; hacerlo cuando el usuario lo pida explícitamente y con el alcance acordado. Ejecutar typecheck, lint enfocado y build según el alcance del cambio; comprobar interacciones, permisos, temas y tamaños de pantalla cuando sean relevantes. No afirmar validación manual que no se hizo.
- Antes de cerrar una spec, revisar tareas, estados, evidencia de validación y documentación viva aplicable. No marcar como completada una validación que no ocurrió.

## Para afirmar que una spec está completada

- Auditar la carpeta completa de la spec y `.specs/index.md` antes de decir al usuario que está cerrada o que no queda ningún check o estado abierto. Seguir `.specs/SPEC_WORKFLOW.md`; una revisión parcial o un build correcto no bastan.
- **Definición:** comprobar en `00-definition.md` que `Definition status`, `Implementation status`, `Validation status` y `Spec status` estén en `completed`, y que el alcance y las decisiones abiertas estén resueltos. `Implementation ready: yes` solo autoriza iniciar; no equivale a completada.
- **Implementación:** cotejar rutas, componentes, estado, contratos y demás artefactos de `06-technical-design.md` con las slices de `07-implementation-breakdown.md`. Confirmar que cada slice tiene su resultado y evidencia de cierre; revisar limpieza legacy y documentación de adopción cuando formen parte del alcance aprobado.
- **Tareas:** revisar todo `03-task-list.md`. No debe quedar ningún `- [ ]` ni una tarea actual con `Status: pending` o `in_progress`; cada tarea completada debe usar `[x]` y `Status: done` o `completed`, según el formato de esa spec. No cerrar una tarea por suposición ni dejar contradicciones entre checkbox y estatus.
- **Validación:** comprobar en `05-progress.md` y `08-manual-validation.md`, si existe, qué se ejecutó realmente, qué confirmó el usuario y qué límites tiene esa evidencia. Registrar typecheck, lint, build y validaciones manuales acordadas; no atribuir al usuario escenarios concretos que no haya confirmado.
- **Documentación e índice:** verificar que decisiones, contratos y documentación viva aplicable en `docs/` reflejen la implementación; actualizar `.specs/index.md` para que la entrada diga completada y enlace a la spec correcta. La carpeta cerrada queda como historia, mientras `docs/` conserva los patrones vigentes.
- Buscar marcas actuales sin cerrar (`[ ]`, `pending`, `in_progress`, `TODO` y equivalentes) en los documentos de la spec y resolver cada hallazgo. Distinguir tareas o estados vigentes de anotaciones históricas en `05-progress.md`; no reescribir el historial solo para eliminar coincidencias de texto. Si falta evidencia o queda una tarea, decir exactamente cuál y mantener el estado abierto.
- El despliegue, la supervisión y otras tareas DevOps no son requisitos de cierre de una spec de desarrollo, salvo que el usuario los haya incluido expresamente en su alcance aprobado. Nunca añadirlos como condición por iniciativa propia.
