# Componentes Instalados y Adopción de Fuentes Externas

**Estado:** Guideline viva para primitives y componentes externos del frontend.

## Principio

`src/components/ui` conserva las primitives canónicas y transversales del
producto. Los componentes compuestos importan desde esa carpeta cuando usan
esa familia canónica; no copian `button`, `popover`, `calendar` u otra
primitive dentro de su propio directorio.

El frontend mantiene `style: new-york` y Radix en `components.json`. El
laboratorio puede evaluar otra base de shadcn, pero no define el runtime del
producto.

## Estructura

```text
src/components/
├─ ui/                        # Primitives canónicas y transversales.
├─ vendor/<fuente>/<familia>/  # Subsistema externo aprobado y acotado.
└─ <dominio o control>/        # Composición y API de producto.
```

- Una primitive externa puede instalarse directamente en `ui/` únicamente si
  conserva el contrato global existente y no sustituye ni altera una primitive
  transversal con consumidores activos.
- `vendor/<fuente>/<familia>/` es una frontera válida para una familia externa
  cohesionada que necesita primitives dependientes propias o resulta
  incompatible con los contratos globales. No es un directorio genérico para
  bloques aislados ni una segunda biblioteca de producto.
- La familia vendor debe registrar fuente, versión o revisión, licencia,
  dependencias, primitives internas, consumidores y procedimiento de
  actualización. Sus componentes interactivos no se mezclan arbitrariamente
  con primitives canónicas en el mismo flujo.
- `vendor` es una frontera de fuente y dependencias, nunca un wrapper para
  traducir clases o tokens de estilos.
- Esta política describe la decisión vigente, no una prohibición permanente.
  La persona responsable del producto puede aprobar otra familia vendor, una
  integración directa o el cambio de una adopción existente cuando exista una
  evaluación explícita de su alcance, contratos, dependencias y consumidores.
- Un componente compuesto es dueño de comportamiento, copy, props y estructura
  local. No existe únicamente para inyectar una clase de tema.

## Familias Vendor Aprobadas

### Shark Forms

`src/components/vendor/shark/forms/` es la familia aprobada para formularios
nuevos y overlays asociados de Next Dashboard. Usa Ark UI y contiene
`Editable`, `Drawer`, `Checkbox`, `Radio Group` y sus dependencias. No
sobrescribe `Button` ni `Spinner` canónicos; consume los tokens semánticos
globales sin wrapper de estilos.

La procedencia, revisión, licencia, dependencias y actualización viven en su
[`README`](../../../src/components/vendor/shark/forms/README.md). Su adopción
en un recurso de negocio exige seguir el patrón
[`Resource Form`](../patterns/resource-form.md).

## Variantes De Producto

Cuando una primitive canónica no cubra un caso local, primero se elige una de
estas alternativas:

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
qué no puede reutilizarse la base.

Una modificación directa de `ui/` es una excepción válida, no una regla
absoluta prohibida, cuando el ajuste se convierte deliberadamente en
comportamiento compartido de producto o corrige una incompatibilidad verificable
del registro. Requiere decisión explícita del responsable del producto,
inventario de consumidores, motivo y condición para revisarla en la siguiente
actualización del CLI. No se usa para resolver una diferencia exclusiva de una
ruta, pantalla, componente creado o bloque descargado, ni para ocultar una
regresión sin analizarla. La sesión de IA debe informar ese caso y evaluar con
el responsable si corresponde una adaptación local o una modificación con fines
compartidos de producto antes de editar una primitive.

## Composición De Producto

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
3. Identificar primitives requeridas y qué archivos o dependencias modificará
   el CLI. Definir explícitamente si se integran en `src/components/ui` o como
   una familia acotada en `src/components/vendor/<fuente>/<familia>/`.
4. No permitir que un registro externo sustituya una primitive canónica con
   consumidores activos sin una decisión independiente de migración. Si el
   bloque requiere su propio stack, copiar o adaptar sus fuentes dentro de su
   frontera vendor con procedencia verificable.
5. Inspeccionar el diff de cada primitive, source o dependencia incorporada:
   API pública, clases,
   dependencias, sintaxis de Tailwind, consumidores y compatibilidad con la
   configuración real del proyecto.
6. Si se detecta una regresión o una incompatibilidad del registro, la sesión
   de IA la comunica antes de corregirla. Debe presentar el archivo afectado,
   impacto, evidencia reproducible y alternativas: actualización oficial,
   corrección compartida aprobada, componente propio o descarte del bloque.
7. Usar primitives canónicas desde `@/components/ui` y una familia vendor solo
   desde su boundary aprobado. Las composiciones de producto viven bajo su
   dominio o control y no replican esa implementación.
8. Validar temas, viewport, teclado, foco y portales antes de adoptarlo en una
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
- Si una receta local tiene variantes de tema, su carpeta `themes/` contiene un
  archivo por cada tema activo. Cada archivo declara todos los tokens locales
  de esa receta, incluso si temporalmente comparte valores con otras
  apariencias. El CSS principal del componente sólo conserva estructura,
  layout, animación y tamaños: nunca valores visuales de respaldo.
- Un token se mantiene global únicamente si es semántico y lo consumen varios
  componentes o si es una compatibilidad temporal inventariada, como
  `--data-grid-*` durante la migración de tablas legacy.
- Una excepción puede requerir un selector global co-localizado cuando una
  librería externa porta contenido a `body` y no expone una clase.

## Actualización Controlada

Una actualización de primitives se trata como migración, no como descarga
inocua:

1. Consultar consumidores e incompatibilidades de API antes del comando.
2. Informar al responsable qué primitives serán sobreescritas y esperar su
   autorización cuando el comando lo requiera.
3. Ejecutar el CLI sobre las primitives exactas y revisar el diff resultante.
4. Detener la integración y comunicar cualquier regresión antes de añadir un
   workaround. Nunca se deja una corrección tentativa sin una decisión explícita.
5. Adaptar consumidores o aprobar una modificación compartida de la primitive
   siguiendo la excepción documentada en esta guía.
6. Ejecutar lint, typecheck y build.
7. Revisar visualmente rutas consumidoras y el catálogo de controles en cada
   tema.

El Date Range Picker ilustra la regla: conserva su composición y CSS local bajo
su control de producto, pero usa `Button`, `Calendar` y `Popover` canónicos de
`src/components/ui`.
