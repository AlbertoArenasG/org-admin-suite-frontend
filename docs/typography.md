# Tipografía Global

## Configuración Actual

La fuente sans global de la aplicación es `Geist`, cargada con `next/font/google`.

- Fuente sans: `Geist`
- Peso: variable, gestionado por `next/font/google`
- Fuente monoespaciada: `Geist Mono`

La fuente sans se resuelve mediante la variable CSS `--font-sans`. Tailwind, los estilos base y los componentes MUI deben consumir esa misma variable.

## Cambiar La Fuente Sans

Para cambiar la fuente global, actualizar estos dos puntos:

### 1. Carga de Next Font

Archivo: `src/app/layout.tsx`

1. Sustituir la importación de `Geist` por la fuente deseada desde `next/font/google`.
2. Crear la constante de fuente con una variable CSS descriptiva.
3. Mantener esa variable en el atributo `className` de `<html>`, no de `<body>`.

Ejemplo actual:

```tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

<html className={`${geistSans.variable} ${geistMono.variable}`}>
```

La variable debe vivir en `<html>` porque `--font-sans` se declara en `:root`, que corresponde a ese elemento. Si se aplica solo en `<body>`, la resolución de la pila tipográfica puede caer al fallback del sistema.

### 2. Pila Tipográfica Global

Archivo: `src/app/globals.css`

Actualizar únicamente el valor de `--font-sans`:

```css
:root {
  --font-sans:
    var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

No crear aliases adicionales para la fuente sans. `body`, Tailwind y los overrides de MUI ya usan `var(--font-sans)`.

## Tailwind Y MUI

- `tailwind.config.ts` usa `var(--font-sans)`, por lo que no debe apuntar a una fuente concreta.
- `globals.css` aplica la misma variable a componentes MUI. Esto cubre en particular celdas, encabezados y paginación de data tables, que tienen declaraciones tipográficas propias.
- No retirar el bloque MUI salvo que se sustituya por una configuración equivalente de tema MUI y se valide visualmente toda la aplicación.

## Validación

Después de cambiar la fuente:

```bash
npm run typecheck
npm run build
```

`next/font/google` descarga fuentes durante la compilación. Si el entorno no tiene acceso a `fonts.googleapis.com`, el build puede fallar o el servidor de desarrollo puede conservar artefactos anteriores. Ejecutar el build con acceso a red y reiniciar `npm run dev` antes de evaluar visualmente.

Validar de forma manual:

- navegación y formularios
- data tables: encabezados, celdas y paginación
- modo claro y oscuro
- pantallas públicas y autenticadas
