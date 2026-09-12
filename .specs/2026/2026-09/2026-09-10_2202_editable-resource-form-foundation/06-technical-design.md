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
title, description?: ReactNode
status?: idle | loading | saving | error
feedback?: ReactNode
children: ReactNode
actions?: ReactNode
```

El consumidor puede envolver el contenido con el elemento `form` de React Hook
Form. Así conserva tipos y submit propios, y la base no introduce un genérico
de valores que borre la frontera entre intenciones de negocio.

### `ResourceFormRoute`

Composición de workspace para detalle editable en ruta. Se monta dentro de la
`Page Composition` que corresponda al contenido y entrega una estructura
estable para `ResourceFormFrame`, secciones y acciones globales. No define
`Page Header`, breadcrumbs, dueño de scroll ni estrategia de shell.

Sirve tanto para detalle con una sola transacción `global` como para un recurso
con operaciones independientes por `section`.

### `ResourceFormOverlay`

Composición breve para un recurso acotado. Recibe un contenedor ya decidido por
la spec del recurso: `Dialog` o `Drawer`, junto con sus props de apertura y
cierre. Compone encabezado, cuerpo y acciones mediante `ResourceFormFrame`.

No elige variante, no administra foco fuera de lo que provea la primitive, no
transforma móvil/escritorio por cuenta propia y no contiene una ruta de detalle
oculta. Si su contenido necesita scroll prolongado, varias secciones o
dependencias complejas, el módulo usa `ResourceFormRoute`.

### `ResourceFormSection`

Agrupación visual semántica de un detalle amplio: título, descripción opcional,
contenido y acciones locales opcionales. No crea un formulario, no persiste ni
infiere la estrategia de datos.

- En `global`, sus acciones locales solo pueden controlar lectura/edición
  visual; guardar, validación y descarte viven en el detalle.
- En `section`, el consumidor conecta en esa sección su propia instancia de
  formulario, estado de mutación y acciones.

### `ResourceFormActions`

Presenta acciones ya autorizadas y sus estados visuales: guardar, cancelar,
eliminar, reintentar o una acción secundaria explícita. Recibe elementos o
callbacks controlados y no interpreta resultados remotos.

Debe impedir doble submit mientras `saving`, conservar foco visible, exponer
acciones destructivas de forma distinguible y mantener orden de teclado estable.

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

## Accesibilidad Y Responsive

- Todo modo editable conserva etiquetas asociadas, errores legibles por lector
  de pantalla y foco predecible al entrar, guardar, cancelar o fallar.
- Las acciones que cambian de `read` a `edit` se anuncian y no dependen de
  hover.
- El overlay usa las garantías de foco, escape y restauración de foco de la
  primitive canónica elegida.
- La composición no inventa breakpoints ni cambia `Dialog` por `Drawer` de
  manera implícita. Esa elección pertenece a cada spec de recurso.
- Copy, títulos y descripciones llegan localizados desde el módulo consumidor.

## Límites Invariables

- No hay tipo `ResourceFormValues` compartido.
- No hay schema, resolver, payload ni campo de dominio genérico.
- No hay imports a `features`, `api`, `stores`, `app` ni rutas desde esta
  carpeta.
- No hay lectura de permisos, HTTP, navegación, autosave, wizard ni auditoría.
- Shark/Ark no está incorporado todavía en producción. Cuando se integre,
  vivirá como familia vendor acotada y no sustituirá primitives canónicas.

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
