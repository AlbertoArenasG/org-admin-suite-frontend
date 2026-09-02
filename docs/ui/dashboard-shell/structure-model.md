# Modelo Abstracto de Estructura del Dashboard

## Estado

Documento de referencia para el vocabulario y las capas del dashboard. Acompaña
las guidelines del shell, pero no las sustituye.

Documentado el 1 de septiembre de 2026.

## Proposito

Describir el dashboard como una composicion de capas con responsabilidades
claras, independientemente de como este implementada una ruta concreta hoy.

Este modelo permite discutir y evolucionar la estructura sin confundir una
responsabilidad visual con un componente, una pagina o un detalle de CSS.

## Capas

### App Shell

Raiz de la experiencia interna autenticada. Define el contexto general del
dashboard, sus limites visuales globales y la coordinacion entre navegacion y
contenido.

### Navigation Shell

Composicion responsable de la navegacion principal. En escritorio agrupa el
rail y el panel de navegacion; en movil puede adoptar una representacion unica
dentro del panel de navegacion movil.

### Navigation Rail

Barra estrecha orientada a cambiar entre areas principales de la aplicacion.
Su funcion es seleccionar contexto mediante iconos, no presentar la navegacion
detallada de cada area.

### Navigation Pane

Panel contextual asociado al area seleccionada en el rail. Contiene grupos y
entradas de navegacion, identidad de la aplicacion y acceso a la cuenta.

### Content Inset

Area que separa el contenido de la navegacion y lo ubica dentro del shell. Es
responsable de los gutters, la relacion espacial con el sidebar y el espacio
disponible para la superficie de trabajo.

### Global Header

Cabecera de alcance transversal a la aplicacion dentro de `Content Inset` y
fuera de `Workspace Canvas`. Aloja controles globales, como el acceso a la
navegacion, notificaciones, ayuda o cuenta; no expresa el contexto de una ruta
concreta. La presencia y funcionalidad de cada control se define de manera
independiente.

### Workspace Canvas

Superficie que contiene la experiencia de una ruta del dashboard. Delimita el
area de trabajo de la pagina, sin definir por si misma los detalles de cada
modulo.

### Workspace Header

Cabecera contextual dentro de `Workspace Canvas`. Comunica la ruta activa,
por ejemplo mediante breadcrumbs, y el contexto de navegacion del espacio de
trabajo. No contiene controles globales de aplicacion.

### Page Header

Estructura opcional dentro de `Page Composition` para el titulo, descripcion y
acciones propias de una vista. No todas las rutas requieren esta capa: una
tabla, un formulario o un dashboard pueden resolver su jerarquia de manera
distinta dentro de su composicion.

### Page Content Scroller

Region que contiene la parte desplazable de `Page Composition` y sus
superficies de modulo. Es el dueño de scroll predeterminado en escritorio. En
movil se resuelve mediante el desplazamiento natural del documento.

### Page Composition

Organizacion especifica de una ruta dentro del workspace. Define la jerarquia
de titulo, contexto, acciones y contenido de trabajo segun el tipo de vista.

### Module Surfaces

Superficies que agrupan informacion o interaccion de un modulo: cards,
secciones de formulario, tablas, resumenes, paneles y estados. Solo existen
cuando expresan una agrupacion funcional real.

## Relacion Entre Capas

```text
App Shell
|- Navigation Shell
|  |- Navigation Rail
|  `- Navigation Pane
`- Content Inset
   |- Global Header
   `- Workspace Canvas
      |- Workspace Header
      `- Page Composition
         |- Page Header (opcional)
         `- Page Content Scroller
            `- Module Surfaces
```

## Politica de Scroll

La propiedad del scroll vertical no es una capa adicional. Es una politica que
cada ruta aplica mediante un unico dueño principal:

- `Page Content Scroll` es el modo predeterminado de escritorio:
  `Page Content Scroller` desplaza el contenido operativo y el contexto del
  workspace permanece fijo.
- `Workspace Canvas Scroll` es una variante explícita de escritorio:
  `Workspace Canvas` conserva su geometria fija dentro de `Content Inset`, pero
  recibe el scroll vertical. Sus headers pueden desplazarse, permanecer sticky
  o transformarse segun la composicion de la ruta.
- `Document Scroll` es el modo predeterminado de movil: la ruta participa en el
  desplazamiento natural del documento.

`Workspace Canvas` y `Page Content Scroller` no deben ser dueños de scroll
vertical simultáneamente. Las regiones anidadas se reservan para casos de uso
excepcionales y deliberados.

## Limites del Modelo

- No define aun colores, radios, espaciado, breakpoints ni componentes
  concretos.
- No describe problemas de la implementacion actual ni propone su solucion.
- No sustituye una spec futura; aporta el lenguaje base para construirla.
- No obliga a que cada capa corresponda a un solo archivo o componente React.
