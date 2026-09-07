# Componentes Instalados y Vendor

**Estado:** Guideline viva para bloques y componentes externos del frontend.

## Principio

`src/components/ui` es la única fuente de primitivas shadcn del producto. Los
componentes compuestos, construidos o externos siempre importan desde esa
carpeta; no copian `button`, `popover`, `calendar` u otra primitive dentro de
su propio directorio.

El frontend mantiene `style: new-york` y Radix en `components.json`. El
laboratorio puede evaluar otra base de shadcn, pero no define el runtime del
producto.

## Estructura

```text
src/components/
├─ ui/                        # Primitivas canónicas de shadcn.
├─ vendor/<fuente>/<bloque>/   # Fuente externa sin primitives copiadas.
└─ <dominio o control>/        # Composición y API de producto.
```

- `ui/` se actualiza mediante el CLI de shadcn desde la raíz del frontend.
  Sus primitivas canónicas no se personalizan para necesidades de producto, de
  un módulo o de una ruta.
- `vendor/` conserva sólo código de fuente externa que siga siendo útil. Puede
  importar `@/components/ui`, pero no redefine el contrato de tema.
- Un componente compuesto es dueño de comportamiento, copy, props y estructura
  local. No existe únicamente para inyectar una clase de tema.

## Variantes De Producto

Cuando una primitive canónica no cubra un caso, no se modifica su archivo en
`src/components/ui`. Se elige una de estas alternativas:

1. Crear un componente compuesto de producto que importe la primitive y exponga
   sólo la API necesaria. Es la opción preferida cuando la variación conserva el
   comportamiento base.
2. Crear una nueva primitive de producto, con nombre y directorio propios, si
   requiere una implementación o contrato deliberadamente distinto. No se
   presenta como sustitución de la primitive de shadcn.
3. Construir el componente desde cero cuando ni la primitive ni una composición
   permitan expresar el comportamiento requerido con claridad.

Clonar una primitive se reserva para el segundo caso y debe conservar una
frontera explícita: nombre propio, consumidores propios y documentación de por
qué no puede reutilizarse la base. Nunca se modifica una primitive canónica como
atajo ni se le agregan variantes privadas de compatibilidad.

## Encapsulación De Componentes

Un componente que tenga CSS local propio vive en su directorio dedicado. Ahí se
guardan su implementación, CSS estructural, agregador de temas, archivos por
tema y cualquier asset exclusivo. La carpeta usa `kebab-case` y evita mezclar
artefactos de componentes distintos.

Un componente sin CSS local, que sólo compone primitives canónicas y utilidades
compartidas, puede permanecer como archivo dentro de la carpeta de su sección o
dominio. No se crea una subcarpeta sin una razón de propiedad real.

Ejemplo:

```text
src/components/dashboard/dashboard-welcome-hero/
├─ DashboardWelcomeHero.tsx
├─ DashboardWelcomeHero.module.css
├─ DashboardWelcomeHero.theme.css
└─ themes/
   ├─ DashboardWelcomeHero.classic.css
   ├─ DashboardWelcomeHero.ambient.css
   └─ DashboardWelcomeHero.ambient-deep.css
```

## Flujo De Instalación

1. Descargar y evaluar el bloque en
   `/Users/alberto/projects/icsacv/component-staging/component-lab`.
2. Registrar fuente, licencia, comando, dependencias y resultado de evaluación
   en el laboratorio.
3. Identificar primitives requeridas. Desde el frontend, actualizarlas o
   instalarlas con `npx shadcn@latest add <primitive> --overwrite --yes`.
4. Revisar el diff y migrar los consumidores afectados. No se conservan
   variantes privadas de compatibilidad dentro de `ui/`.
5. Copiar sólo el bloque o composición aprobada al producto, importando las
   primitives desde `@/components/ui`.
6. Validar temas, viewport, teclado, foco y portales antes de adoptarlo en una
   vista de negocio.

El frontend usa Tailwind 4. Por ello `components.json` deja
`tailwind.config` vacío y apunta `tailwind.css` a `src/app/globals.css`, tal
como requiere el CLI actual. No se crea ni se declara un `tailwind.config.ts`:
aunque no se cargue mediante `@config` en el runtime, declararlo en
`components.json` puede alterar la plantilla que produce el CLI.

Las descargas y su historial permanecen dentro de
`/Users/alberto/projects/icsacv/component-staging/`. No se usan rutas de
sistema ni directorios temporales fuera de la carpeta de trabajo.

## Tokens Y Estilos

- Los tokens compartidos por varios componentes viven en
  `src/styles/themes/dashboard-{classic,ambient,ambient-deep}.css`. Cada tema
  resuelve el mismo contrato semántico global.
- `src/app/globals.css` sólo importa temas, declara mappings de Tailwind y
  contiene resets o reglas realmente globales.
- El CSS local de un componente define estructura, layout, animación y tamaños
  propios. Si una receta visual exclusiva requiere diferencias por tema, sus
  variables viven en archivos de tema co-localizados con el componente. Cada
  archivo se acota a una clase estable del componente y a `html.<tema>`, y se
  importa una sola vez desde `globals.css`. No se promueven al contrato global.
- Un componente con variantes propias conserva en su directorio el componente,
  CSS estructural, agregador de temas y subcarpeta `themes/`; no comparte una
  carpeta de variantes con otros componentes de dashboard.
- Los tokens locales cuyo valor sea idéntico en todos los temas permanecen en
  el CSS principal del componente. Los archivos co-localizados por tema sólo
  declaran las diferencias efectivas; no repiten invariantes.
- Un token se mantiene global únicamente si es semántico y lo consumen varios
  componentes o si es una compatibilidad temporal inventariada, como
  `--data-grid-*` durante la migración de tablas legacy.
- Una excepción puede requerir un selector global co-localizado cuando una
  librería externa porta contenido a `body` y no expone una clase.

## Actualización Controlada

Una actualización de primitives se trata como migración, no como descarga
inocua:

1. Consultar consumidores e incompatibilidades de API.
2. Ejecutar el CLI sobre las primitives exactas.
3. Adaptar consumidores sin extender la primitive descargada.
4. Ejecutar lint, typecheck y build.
5. Revisar visualmente rutas consumidoras y el catálogo de controles en cada
   tema.

El Date Range Picker ilustra la regla: conserva composición y CSS local en
`vendor/shadcn/date-picker`, pero usa `Button`, `Calendar` y `Popover`
canónicos de `src/components/ui`.
