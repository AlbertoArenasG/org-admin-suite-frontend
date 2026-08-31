# Tipografía Global

## Configuración Actual

La fuente sans base de la aplicación es `Manrope`, cargada con `next/font/google`.

- Fuente sans base: `Manrope`
- Fuente monoespaciada: `Geist Mono`
- Las variables CSS de ambas fuentes se aplican a `<html>` y la clase sans directa a `<body>` en `src/app/layout.tsx`.
- La pila base se declara como `--font-sans-stack` en `src/app/globals.css`.

La aplicación usa una fuente única en tres fronteras: `body` y Tailwind, Material UI y el SVG propio de encuestas.

## Historial De Fuentes

| Fecha               | Fuente            | Estado   | Nota                       |
| ------------------- | ----------------- | -------- | -------------------------- |
| Antes de 2026-08-30 | Geist             | Anterior | Fuente sans base original. |
| 2026-08-30          | Mona Sans         | Evaluada | No adoptada.               |
| 2026-08-30          | Plus Jakarta Sans | Evaluada | No adoptada.               |
| 2026-08-30          | Inter             | Evaluada | No adoptada.               |
| 2026-08-30          | Manrope           | Activa   | Fuente sans base adoptada. |
| 2026-08-30          | DM Sans           | Evaluada | No adoptada.               |

## Procedimiento Obligatorio Para Cambiar La Fuente Sans

Una sustitución tipográfica no se considera terminada al cambiar la importación. En esta aplicación intervienen Next Font, la clase de `body`, la variable de Tailwind v4, la pila usada por los overrides globales y la configuración de Tailwind. Actualizar **todos** los puntos de la siguiente tabla en el mismo cambio.

| Ubicación                                       | Cambio obligatorio                                                                                     | Qué cubre                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `src/app/layout.tsx`                            | Importación, instancia, variables CSS en `<html>` y `className` sans en `<body>`                       | Carga optimizada y resolución para preflight, herencia y contenido.       |
| `src/app/globals.css`                           | `--font-sans-stack` y `--font-sans`                                                                    | `body`, override CSS heredado y preflight/utilidades de Tailwind v4.      |
| `tailwind.config.ts`                            | `theme.extend.fontFamily.sans`                                                                         | Configuración explícita para utilidades y extensiones que lean el config. |
| `src/components/providers/MuiThemeProvider.tsx` | Mantener la fuente como `var(--font-sans-stack)` y añadir nuevos componentes MUI si requieren override | Componentes Material UI y encabezados/celdas/paginación de Data Grid.     |
| `src/components/providers/AppProviders.tsx`     | Mantener `MuiThemeProvider` alrededor de los providers de aplicación                                   | Propaga el tema a toda la aplicación, incluidas vistas públicas.          |
| SVG propios                                     | `fontFamily="var(--font-sans-stack)"` en el `<svg>` raíz                                               | Texto SVG, que no siempre hereda la fuente de HTML.                       |
| `docs/typography.md`                            | Fuente actual y ejemplos                                                                               | Evita que el siguiente cambio siga una receta obsoleta.                   |

No modificar la fuente monoespaciada salvo que ese también sea el objetivo del cambio.

### 1. Carga De Next Font

Archivo: `src/app/layout.tsx`

1. Sustituir la importación de `Manrope` por la fuente deseada desde `next/font/google`.
2. Crear la constante con una variable CSS descriptiva, por ejemplo `--font-nueva-sans`.
3. Configurar el peso variable cuando la fuente lo soporte.
4. Aplicar `nuevaFuente.variable` y la variable monoespaciada en `<html>`. Tailwind v4 define su preflight en ese elemento, por lo que no deben quedar solo en `<body>`.
5. Aplicar `nuevaFuente.className` en `<body>` para establecer la familia sans directamente como respaldo.
6. Mantener `geistMono.variable` mientras no se cambie la tipografía monoespaciada.

Ejemplo actual:

```tsx
import { Geist_Mono, Manrope } from 'next/font/google';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: 'variable',
});

<html className={`${manrope.variable} ${geistMono.variable}`} lang="es">
  <body className={`${manrope.className} antialiased`}>
```

### 2. Pila Global

Archivo: `src/app/globals.css`

Sustituir la referencia de `Manrope` por la nueva variable:

```css
:root {
  --font-sans-stack:
    var(--font-manrope), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

Añadir también esta línea en el mismo bloque. Es obligatoria para que Tailwind v4 no resuelva `system-ui`:

```css
--font-sans: var(--font-nueva-sans);
```

El bloque `:where(...)` dentro de `@layer base` cubre parcialmente `MuiTypography`, botones, inputs, Data Grid, paginación, chips, alertas, labels, listas y breadcrumbs. Mantenerlo como respaldo; la fuente de Material UI se controla desde `MuiThemeProvider`.

Si el inspector del navegador muestra `Helvetica`, `system-ui` u otra familia tras el cambio:

1. Confirmar que `<html>` tiene la clase `__variable_*` de la nueva fuente y que `<body>` tiene su clase `__className_*`.
2. Confirmar en estilos calculados que `--font-sans-stack` y `--font-sans` resuelven a la nueva familia.
3. Revisar si el componente tiene una declaración propia de `font-family`; esa declaración debe actualizarse solo si la excepción no es intencional.
4. No corregirlo con una regla global `!important`.

### 3. Tailwind

Archivo: `tailwind.config.ts`

Actualizar `theme.extend.fontFamily.sans` con la misma variable de la fuente sans:

```ts
sans: ['var(--font-nueva-sans)', 'system-ui', 'sans-serif'],
```

Esta configuración no sustituye `--font-sans` en Tailwind v4. Por eso el paso anterior en `globals.css` sigue siendo indispensable.

### 4. Material UI, Data Grid Y Tablas

Archivo: `src/components/providers/MuiThemeProvider.tsx`

Este provider ya está conectado desde `AppProviders`. Al cambiar `--font-sans-stack` en `globals.css`, MUI tomará automáticamente la nueva familia porque el tema usa esa variable, por lo que no se deben repetir familias en cada componente.

El tema debe conservar:

1. `typography.fontFamily: 'var(--font-sans-stack)'` para la tipografía base de MUI.
2. Overrides para `MuiTypography`, `MuiButtonBase`, `MuiInputBase`, `MuiFormLabel`, `MuiTableCell`, `MuiTablePagination`, `MuiChip` y `MuiAlert`.
3. `MuiDataGrid` con `root`, `columnHeader`, `columnHeaderTitle`, `cell` y `footerContainer`. Estos cubren expresamente encabezados, contenido y paginación de las tablas de Material UI.
4. `import type {} from '@mui/x-data-grid/themeAugmentation'`, necesario para que `MuiDataGrid` esté tipado dentro del tema.

Si se incorpora un componente MUI cuyo inspector no resuelva la fuente esperada, agregar su override a este tema. No agregar una familia en la vista consumidora ni usar `!important` global.

### 5. SVG Propios

Archivo actual: `src/components/serviceEntrySurveys/SurveyRatingStackedBarChart.tsx`.

El texto dentro de SVG no debe depender de herencia implícita. Cada SVG que genere texto debe declarar `fontFamily="var(--font-sans-stack)"` en su elemento raíz. Si se añade una biblioteca de gráficos, configurar su familia desde la opción de tema de esa biblioteca o verificarla en DevTools.

## Excepciones Tipográficas Locales

La fuente global se aplica intencionalmente desde tres niveles:

1. `body` usa `--font-sans-stack` en `src/app/globals.css`.
2. Tailwind v4 usa `--font-sans`, que apunta a la misma familia.
3. `MuiThemeProvider` asigna esa familia a los componentes Material UI y Data Grid.

Esto define el valor por defecto, no impide una excepción local. Una regla directa del componente tiene prioridad sobre la herencia global; para Material UI, `sx={{ fontFamily: ... }}` tiene prioridad sobre los `styleOverrides` del tema.

No repetir una familia literal por componente. Primero declarar un token semántico en `src/app/globals.css`:

```css
:root {
  --font-contextual: 'Familia alternativa', sans-serif;
}
```

La pila de respaldo es obligatoria si la familia alternativa no se distribuye como fuente web. Si todos los usuarios deben ver exactamente la misma fuente, cargarla mediante `next/font` o desde un archivo local con licencia compatible.

Aplicar el token solo al elemento que lo necesita:

```tsx
// Componente HTML.
<span className="[font-family:var(--font-contextual)]">Contenido</span>

// Componente Material UI.
<Typography sx={{ fontFamily: 'var(--font-contextual)' }}>Contenido</Typography>
```

No modificar `MuiThemeProvider`, `--font-sans-stack` ni `--font-sans` para una excepción local: esas son las fronteras de la tipografía global. Si una excepción debe aplicarse a un conjunto reutilizable de componentes, crear una clase o componente compartido que consuma el mismo token.

## Validación

Después de cambiar la fuente:

```bash
npm run typecheck
npm run build
```

`next/font/google` descarga fuentes durante la compilación. Si el entorno no tiene acceso a `fonts.googleapis.com`, el build puede fallar. Reiniciar `npm run dev` antes de evaluar cambios tipográficos.

Validación manual mínima:

1. Reiniciar `npm run dev` y hacer una recarga forzada en el navegador.
2. En DevTools, validar que un texto del dashboard resuelve a la nueva fuente y no a `system-ui` o `Helvetica`.
3. Validar navegación, formularios, data tables, paginación, modo claro, modo oscuro y pantallas públicas.
4. Revisar específicamente componentes MUI: inputs, selects, botones, tablas, paginación, diálogos y alertas.

## Memoria Histórica

### Mezcla De Helvetica Y System UI

La mezcla detectada en agosto de 2026 tuvo dos orígenes:

1. Material UI no tenía un `ThemeProvider` central. Sus `Typography`, inputs, botones, tablas y componentes de `@mui/x-data-grid` usaban el stack predeterminado de MUI (`Roboto`, `Helvetica`, `Arial`, `sans-serif`). En macOS ese stack terminaba mostrando `Helvetica`.
2. Tailwind v4 usa la variable interna `--font-sans` para su preflight y la utilidad `font-sans`. Sin apuntarla a la fuente de la aplicación, resolvía `system-ui`.

La corrección fue crear `MuiThemeProvider`, conectarlo desde `AppProviders`, definir `--font-sans` y declarar la pila global en el SVG de encuestas. El bloque global `:where(...)` de `src/app/globals.css` permanece como respaldo para componentes heredados, pero su especificidad es cero y no sustituye al tema MUI.
