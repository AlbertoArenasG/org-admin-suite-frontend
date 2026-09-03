# Progress

## 2026-09-02

- Definición cerrada con temas iniciales `Clásico` y `Ambient`.
- Se confirmó que la fundación no incluye una migración masiva de componentes legacy.
- Se configuró `next-themes` con `classic`, `ambient` y `ambient-deep`, usando la clave local
  `application-appearance` para no heredar preferencias anteriores.
- Se retiró `DashboardAppearanceProvider` y se unificaron los selectores.
- Se establecieron roles semánticos iniciales para canvas, superficies,
  controles y materiales del shell.
- Validación: `npm run typecheck` correcto; `npm run lint` correcto con dos
  warnings existentes fuera de alcance.
