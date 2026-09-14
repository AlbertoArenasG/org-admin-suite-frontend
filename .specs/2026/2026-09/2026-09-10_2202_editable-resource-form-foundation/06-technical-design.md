# Diseño Técnico: Editable Resource Form Foundation

## Estado

Diseño técnico aprobado para implementación. Esta iniciativa construye la
fundación compartida; no migra todavía un formulario ni una ruta de negocio.

## Ubicación Propuesta

```text
src/components/resource-form/
├─ ResourceFormFrame.tsx
├─ ResourceFormRoute.tsx
├─ ResourceFormOverlay.tsx
├─ ResourceFormSection.tsx
├─ ResourceFormActions.tsx
├─ ResourceFormNavigation.tsx
└─ index.ts
```

La carpeta es una composición de producto, no una primitive. Puede recibir
hosts construidos con primitives canónicas o con la familia de formularios
Shark/Ark aprobada bajo `src/components/vendor/shark/`, pero no importa código
del Component Lab ni implementa sus primitives.

No se crea CSS local ni tokens nuevos mientras las primitives existentes cubran
la superficie. Si una necesidad visual futura obliga a CSS propio, la carpeta
deberá incorporar su receta y un archivo completo por cada tema activo.

## Frontera De Integración

```text
API client -> thunk -> feature slice -> module container -> ResourceForm*
                                                    |
                                                    `-> React Hook Form + Zod
```

- El formulario de dominio crea `useForm`, declara valores, schema y adaptador
  de payload.
- El contenedor del módulo carga datos, obtiene permisos, despacha thunks y
  traduce estados remotos a props y callbacks.
- `ResourceForm*` recibe nodos, estado y callbacks ya controlados. No importa
  módulos, stores, rutas, capabilities, thunks ni clientes HTTP.
- Una composición no deriva si alguien puede editar. Recibe `mode`, acciones
  permitidas y copy localizado desde su consumidor.

## Artefactos Públicos

### `ResourceFormFrame`

Superficie neutral compartida por ruta u overlay. Compone encabezado,
descripción opcional, contenido, feedback y área de acciones. No crea un
formulario HTML ni conoce campos.

Contrato conceptual:

```text
mode: read | edit
surface: ResourceFormSurface | { base: ResourceFormSurface, md?: ResourceFormSurface }
density: ResourceFormDensity | { base: ResourceFormDensity, md?: ResourceFormDensity }
title?, description?: ReactNode
status?: idle | loading | saving | error
feedback?: ReactNode
children: ReactNode
headerActions?: ReactNode
footerActions?: ReactNode
```

El consumidor puede envolver el contenido con el elemento `form` de React Hook
Form. Así conserva tipos y submit propios, y la base no introduce un genérico
de valores que borre la frontera entre intenciones de negocio.

`surface` y `density` solo controlan presentación. Aceptan un valor fijo o una
declaración `{ base, md? }`, resuelta con clases CSS estáticas, sin lectura de
viewport en JavaScript. `card` presenta la superficie completa; `bare` conserva
el mismo nodo estructural sin fondo, borde, radio, sombra ni padding propio. El
título y la descripción son opcionales: el
recurso puede delegar su contexto visible al `Page Header`, `Dialog` o `Drawer`
sin eliminar el frame.

Las acciones globales son opcionales y pueden ocupar `headerActions` o
`footerActions`. Su ubicación visual no cambia la atomicidad: cuando el recurso
usa una mutación global, ambas posiciones pertenecen a la misma operación.

### `ResourceFormRoute`

Composición de workspace para detalle editable en ruta. Se monta dentro de la
`Page Composition` que corresponda al contenido y entrega una estructura
estable para `ResourceFormFrame`, secciones y acciones globales. No define
`Page Header`, breadcrumbs, dueño de scroll ni estrategia de shell.

Sirve tanto para detalle con una sola transacción `global` como para un recurso
con operaciones independientes por `section`.

Puede componer una `ResourceFormNavigation` opcional para una ruta larga. La
ruta recibe los destinos declarados por el recurso y el contexto de scroll de
su `Page Composition`; no crea un viewport interno. La navegación usa anclas
de secciones montadas, actualiza su elemento activo mediante scroll spy y puede
presentarse como tabs o navegación lateral según la configuración responsive
del recurso. También puede exponer regiones de header y footer sticky dentro de
la ruta; el recurso declara el offset del header cuando deba apilarse con una
navegación sticky.

### `ResourceFormNavigation`

Control de recorrido intraformulario exclusivo de `ResourceFormRoute`. Recibe
una lista tipada de destinos (`id`, etiqueta y descripción opcional), el
elemento de scroll entregado por la ruta y una variante visual responsive.
Navega mediante botones hacia las anclas existentes y conserva todas las
secciones montadas; no implementa paneles de tabs, rutas ni carga diferida.

Su scroll spy es propio y usa APIs de plataforma. No depende de ReUI ni altera
primitives de Shark/Ark. Mantiene semántica de navegación, foco visible y el
elemento activo accesible.

### `ResourceFormOverlay`

Composición breve para un recurso acotado. Recibe un contenedor ya decidido por
la spec del recurso: `Dialog` o `Drawer`, junto con sus props de apertura y
cierre. Compone encabezado, cuerpo y acciones mediante `ResourceFormFrame`.
Las acciones globales pueden exponerse en el header o footer del frame.

No elige variante, no administra foco fuera de lo que provea la primitive, no
transforma móvil/escritorio por cuenta propia y no contiene una ruta de detalle
oculta. Por política vigente no soporta recursos multi-sección, navegación
intraformulario, scroll prolongado ni regiones sticky: esos recursos usan
`ResourceFormRoute`. Una excepción futura se diseña en la spec de su recurso,
no como comportamiento implícito de esta fundación.

### `ResourceFormSection`

Expone `surface: bare | card` con `bare` como valor por defecto y la misma
capacidad responsive `{ base, md? }` del frame para superficie y densidad. La
superficie solo separa visualmente una agrupación: no altera la operación remota, el
alcance de las acciones ni el orden estructural del formulario.

Agrupación visual semántica de un detalle amplio: título y descripción
opcionales, contenido y acciones locales opcionales. Expone `headerActions` y
`footerActions`; ambas posiciones son opcionales y solo corresponden a una
operación local cuando el backend expone esa operación de forma independiente.
Comparte la densidad del frame cuando el consumidor la entrega, pero no crea un
formulario, no persiste ni infiere la estrategia de datos.

Una sección puede existir sin encabezado visible para conservar la topología
del detalle cuando un grupo pequeño no requiere jerarquía adicional.

- En `global`, sus acciones locales solo pueden controlar lectura/edición
  visual; guardar, validación y descarte viven en las acciones globales del
  frame, ya sea en header o footer.
- En `section`, el consumidor conecta en esa sección su propia instancia de
  formulario, estado de mutación y acciones.

### `ResourceFormActions`

Presenta acciones ya autorizadas y sus estados visuales: guardar, cancelar,
eliminar, reintentar o una acción secundaria explícita. Recibe elementos o
callbacks controlados y no interpreta resultados remotos.

Debe impedir doble submit mientras `saving`, conservar foco visible, exponer
acciones destructivas de forma distinguible y mantener orden de teclado estable.
Puede renderizarse en cualquiera de los cuatro slots de acciones (`header` o
`footer`, global o de sección); el consumidor decide su alcance y persistencia.

## Estados Y Estrategias

La composición solo representa estos estados de interfaz:

```text
mode: read | edit
remote: idle | loading | saving | error
persistence: global | section
```

`persistence` se declara en el detalle de dominio, no se deduce por cuántas
secciones se renderizan. La combinación `global` con varias `ResourceFormSection`
mantiene una única instancia RHF y una sola mutación. La combinación `section`
solo existe cuando backend expone operaciones independientes.

El módulo decide el modo `read` o `edit` a partir de sus permisos. En `read`,
conserva la misma topología de detalle, pero no entrega controles editables ni
acciones de edición o persistencia. La fundación no lee autorización ni
redirecciona.

El layout de secciones y campos es propiedad del formulario de dominio. Puede
usar una columna, grids responsivos o apilamiento según contenido; la fundación
no expone una abstracción de columnas. Cada frame y sección recibe sus propias
variantes visuales, fijas o responsive.

Las intenciones de un mismo recurso pueden, de forma opcional, componer piezas
visuales o grupos de campos realmente comunes. No es una abstracción por
defecto: si no hay coincidencia semántica comprobable, permanecen
independientes. Nunca comparten valores, schema, payload, submit ni mutación.
Cuando dos intenciones tienen capacidades o efectos remotos distintos, mantienen
rutas y contratos separados aunque su apariencia sea similar.

## Accesibilidad Y Responsive

- Todo modo editable conserva etiquetas asociadas, errores legibles por lector
  de pantalla y foco predecible al entrar, guardar, cancelar o fallar.
- Las acciones que cambian de `read` a `edit` se anuncian y no dependen de
  hover.
- El overlay usa las garantías de foco, escape y restauración de foco de la
  primitive canónica elegida.
- Un overlay permanece reservado a una única sección breve. No introduce un
  viewport interno ni header o footer fijo; una excepción futura debe definir
  explícitamente dueño de scroll, responsive y foco.
- La composición no inventa breakpoints ni cambia `Dialog` por `Drawer` de
  manera implícita. Esa elección pertenece a cada spec de recurso.
- La navegación intraformulario solo se habilita en una ruta larga y respeta el
  único dueño vertical de la `Page Composition`; no crea overflow interno ni
  se aplica a overlays.
- Copy, títulos y descripciones llegan localizados desde el módulo consumidor.

## Límites Invariables

- No hay tipo `ResourceFormValues` compartido.
- No hay schema, resolver, payload ni campo de dominio genérico.
- No hay imports a `features`, `api`, `stores`, `app` ni rutas desde esta
  carpeta.
- No hay lectura de permisos, HTTP, navegación, autosave, wizard ni auditoría.
- No hay carga, gestión ni persistencia genérica de adjuntos.
- Shark/Ark vive en `src/components/vendor/shark/forms/` como familia vendor
  acotada y no sustituye primitives canónicas. La validación manual del preview
  oficial es requisito antes de que un recurso de negocio lo adopte.

## Criterios De Aceptación Técnicos

- Los cinco artefactos compilan con consumidores tipados sin `any` ni tipos de
  dominio compartidos.
- Un consumidor puede usar la composición con RHF y Zod sin que la base cree o
  modifique su instancia.
- Un consumidor puede presentar `global` y `section` sin mezclar persistencia
  de los mismos campos.
- Un overlay puede montarse con `Dialog` o `Drawer` sin duplicar la composición
  interna y sin que el artefacto decida la variante.
- La carpeta no contiene imports de integración remota o autorización.
- Los componentes respetan primitives canónicas, temas activos, teclado, foco
  y viewport antes de que una ruta de negocio los adopte.
- Un recurso puede conservar `ResourceFormFrame` y `ResourceFormSection` con
  superficie, densidad y encabezados opcionales sin alterar la topología ni la
  estrategia de persistencia.
- Un recurso puede declarar superficie y densidad fijas o por breakpoint sin
  introducir lógica de viewport ni cambiar la estructura del formulario.

## Límite De Integración

La fundación no implementa ni simula mediante API una instancia RHF, mutación
global sobre varias secciones, una sección con operación independiente ni
persistencia de dominio. Cualquier iniciativa que adopte esta composición
definirá y validará esos comportamientos según su recurso.
