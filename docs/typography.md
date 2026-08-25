# Tipografía Global

## Configuración Actual

La fuente sans base de la aplicación es `Geist`, cargada con `next/font/google`.

- Fuente sans base: `Geist`
- Fuente monoespaciada: `Geist Mono`
- La clase con las variables de ambas fuentes se aplica a `<body>` en `src/app/layout.tsx`.
- La pila base se declara como `--font-sans-stack` en `src/app/globals.css`.

La aplicación no fuerza Geist sobre todos los componentes MUI. El override global usa `:where(...)` y no `!important`, de modo que los componentes MUI que declaran su propia fuente conservan su prioridad visual. Esto reproduce el comportamiento histórico de la aplicación, particularmente en data tables, inputs y paginación.

## Cambiar La Fuente Sans

Para cambiar la fuente global, actualizar de forma coordinada estos tres puntos:

### 1. Carga De Next Font

Archivo: `src/app/layout.tsx`

1. Sustituir la importación de `Geist` por la fuente deseada desde `next/font/google`.
2. Crear la constante con una variable CSS descriptiva.
3. Mantener su variable en `className` de `<body>` junto con `Geist Mono`, o actualizar ambas si también se sustituye la fuente monoespaciada.

Ejemplo actual:

```tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
```

### 2. Pila Global

Archivo: `src/app/globals.css`

Actualizar la variable usada por `body` y los overrides MUI:

```css
:root {
  --font-sans-stack:
    var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

No añadir `!important` al bloque MUI sin validar visualmente toda la aplicación. Ese cambio fuerza la fuente sobre controles cuya tipografía era previamente administrada por MUI y cambia el aspecto de data tables y formularios.

### 3. Tailwind

Archivo: `tailwind.config.ts`

Actualizar `theme.extend.fontFamily.sans` con la misma variable de la fuente sans:

```ts
sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
```

## Validación

Después de cambiar la fuente:

```bash
npm run typecheck
npm run build
```

`next/font/google` descarga fuentes durante la compilación. Si el entorno no tiene acceso a `fonts.googleapis.com`, el build puede fallar. Reiniciar `npm run dev` antes de evaluar cambios tipográficos.

Validar manualmente navegación, formularios, data tables, paginación, modo claro, modo oscuro y pantallas públicas.
