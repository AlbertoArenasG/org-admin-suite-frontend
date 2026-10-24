# Instrucciones del repositorio frontend

## Acuerdos de trabajo

- Los mensajes de commit y las propuestas de `git commit` van en español. Si el usuario pide el comando, dar `git commit -m "..."` para ejecutarlo desde este repositorio, sin `git -C`.
- No agregar archivos al stage, crear commits ni hacer push salvo petición explícita. Una petición de mensaje de commit no autoriza esas operaciones.
- Respetar las decisiones y el alcance aprobados. Para trabajo de una spec activa, seguir `.specs/SPEC_WORKFLOW.md`; un cambio solicitado fuera de la spec no se incorpora a ella por defecto.
- Antes de ampliar el contrato de un componente genérico, revisar sus consumidores y discutir el cambio cuando implique una decisión arquitectónica o afecte otros módulos. Preferir una composición específica cuando el caso sea excepcional.

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

- Ejecutar typecheck, lint enfocado y build según el alcance del cambio; comprobar interacciones, permisos, temas y tamaños de pantalla cuando sean relevantes. No afirmar validación manual que no se hizo.
- Antes de cerrar una spec, revisar tareas, estados, evidencia de validación y documentación viva aplicable. No marcar como completada una validación que no ocurrió.
