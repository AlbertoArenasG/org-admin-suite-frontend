# Resource Form

## Estado

Contrato compartido aprobado y validado en
`/dashboard-playground/catalog/resource-forms`. Aún no tiene un consumidor de
negocio migrado; la primera adopción debe completar el gate de integración con
React Hook Form y su mutación remota.

## Propósito

`src/components/resource-form/` ofrece composición neutral para detalle
editable y formularios de recursos. No unifica valores, schemas, payloads,
permisos ni transporte remoto entre intenciones de negocio.

## Piezas

- `ResourceFormRoute`: contenedor estructural para un detalle editable en ruta.
- `ResourceFormOverlay`: reutiliza el frame dentro de un `Dialog` o `Drawer`
  decidido por la spec del recurso.
- `ResourceFormFrame`: superficie, encabezado, feedback y acciones globales.
- `ResourceFormSection`: agrupación visual semántica de campos.
- `ResourceFormActions`: clúster visual de acciones controladas.
- `ResourceFormNavigation`: navegación intraformulario opcional para rutas
  largas; no aplica a overlays.

La topología se conserva aunque algunos elementos no sean visibles:

```text
Ruta o host -> ResourceFormFrame -> ResourceFormSection -> campos
```

## Presentación

`ResourceFormFrame` y `ResourceFormSection` admiten `surface="card" | "bare"`
y densidad `"comfortable" | "compact" | "none"`. Ambas propiedades aceptan
un valor fijo o `{ base, md? }`, por ejemplo
`surface={{ base: "bare", md: "card" }}`. Las clases se resuelven de forma
estática; no hay lógica de viewport en JavaScript. Los encabezados,
descripciones y slots de acciones son opcionales. Estas variantes solo cambian
presentación, nunca persistencia ni atomicidad. La spec de cada recurso decide
y valida cualquier combinación responsive concreta.

## Acciones Y Persistencia

`headerActions` y `footerActions` existen tanto en el frame como en una
sección. La posición visual no define la operación:

- Una mutación `global` usa acciones del frame y una sola instancia de
  formulario, aunque tenga varias secciones visuales.
- Una acción de sección persiste solo cuando el backend ofrece una operación
  independiente para esa sección.

Los módulos son dueños de React Hook Form, Zod, carga, permisos, thunks,
payloads, mutaciones, feedback localizado y navegación posterior.

Con lectura sin edición, el módulo entrega `mode="read"` y omite controles y
acciones de edición. Se conserva la misma ruta y composición; `ResourceForm*`
no consulta permisos. El mismo formulario de dominio también decide el layout
de secciones y campos, incluidos grids y su respuesta por viewport.

## Reutilización Entre Intenciones

Creación, edición y detalle pueden compartir opcionalmente la composición y
grupos de campos presentacionales comunes. No es un patrón por defecto: cada
recurso solo lo adopta cuando existe una coincidencia semántica comprobable.
Cada intención conserva su propio formulario, valores iniciales, schema, payload
y submit. Operaciones con capacidades o efectos remotos distintos, como
invitación y alta directa de usuario, mantienen rutas y contratos separados
aunque compartan apariencia.

## Ruta Y Overlay

El overlay (`Dialog` o `Drawer`) se reserva para recursos breves de una sola
sección. Un recurso multi-sección, con navegación intraformulario o scroll
prolongado usa `ResourceFormRoute` en una ruta dedicada.

No se implementan overlays extensos, viewport interno ni regiones sticky sin
una spec futura de un recurso que justifique esas necesidades y defina dueño de
scroll, foco y comportamiento responsive.

## Navegación Intraformulario

`ResourceFormRoute` puede habilitar `ResourceFormNavigation` para recorrer un
formulario largo. Tabs y navegación lateral apuntan a secciones simultáneamente
montadas: no intercambian paneles ni rutas. El scroll spy sincroniza el destino
activo dentro del dueño de scroll de `Page Composition` y no crea un viewport
interno. La spec de cada recurso decide destinos, variante responsive y
regiones sticky de ruta. Si header y navegación sticky se apilan, el recurso
declara el offset del header. Esta capacidad no aplica a `Dialog` ni `Drawer`.

## Adjuntos

La carga de archivos y la persistencia de sus referencias no forman parte de
este contrato. Requieren una spec posterior que defina backend, permisos,
progreso, errores, reintentos, eliminación y el flujo para recursos todavía no
creados.

## Familia De Formularios

Shark UI/Ark UI es la familia aprobada para formularios nuevos y overlays de
Next Dashboard. Sus fuentes viven bajo `src/components/vendor/shark/forms/` y
no sustituyen primitives canónicas de `src/components/ui`. Consume tokens
semánticos globales directamente; no existe wrapper de traducción de estilos.

## Gate Del Primer Consumidor

La spec del primer recurso migrado debe validar:

- varias secciones con una instancia RHF y mutación global única;
- una sección con formulario y mutación independientes, si ese contrato backend
  existe;
- que reorganizar visualmente secciones no altere la estrategia de persistencia;
- temas, viewport, teclado, foco y estados remotos con datos de negocio reales.

La definición completa, decisiones y evidencia de implementación se conservan
en la spec `editable-resource-form-foundation`.
