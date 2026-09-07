# Progress: Canonical Shadcn Primitives and Theme Migration

## 2026-09-07

- Se creó la iniciativa para reemplazar la estrategia temporal de primitivas
  aisladas y wrappers de tema.
- Se inventariaron `src/components/ui`, `src/components/vendor`, los archivos
  de tema, `globals.css` y los componentes instalados activos.
- Se identificó que el date picker duplica `button`, `calendar` y `popover`, y
  que date picker y filtros remapean tokens por tema desde CSS local.
- La implementación permanece bloqueada hasta confirmar la base oficial de
  shadcn que usará el producto.

## 2026-09-07 - Cierre de definición

- Se confirmó `new-york`/Radix como base oficial del frontend de producto.
- El laboratorio conserva `base-nova`/Base UI como entorno independiente de
  evaluación; no se traslada su runtime al producto.
- La definición queda lista para implementación.

## 2026-09-07 - Implementación

- Se actualizaron `Button` y `Popover` con el CLI oficial de shadcn y se
  instaló `Calendar` bajo `src/components/ui`.
- Los consumidores de tamaños de icono retirados se migraron a la variante
  oficial `icon` con tamaño local explícito. El caso no-portaled del combobox
  conserva su composición directa de Radix sin extender `ui/popover`.
- El date range picker ahora importa primitivas canónicas; se retiraron sus
  copias privadas de `button`, `calendar` y `popover`.
- Se eliminaron los scopes por tema del date picker, menú de filtros y hero de
  bienvenida. Los valores visuales se resuelven en los tres archivos de tema.
- `globals.css` conserva bootstrap, mappings de Tailwind y reglas globales; no
  declara defaults visuales de tema.
- Se actualizaron `docs/ui/tokens.md` y
  `docs/ui/components/installed-components.md` con la estrategia canónica.
- `npm run lint` terminó sin errores y con cuatro warnings preexistentes.
  `npm run typecheck` y `npm run build` pasaron.
- Pendiente: revisión manual de los controles en `classic`, `ambient` y
  `ambient-deep`.

## 2026-09-07 - Cierre

- Se detectó que declarar `tailwind.config.ts` en `components.json` hacía que
  el CLI generara la sintaxis inválida `h-[--cell-size]` para `Calendar`.
- Con `tailwind.config` vacío, la misma reinstalación de `Calendar` generó la
  sintaxis correcta de Tailwind 4: `h-(--cell-size)`.
- Se retiró `tailwind.config.ts`; Tailwind 4 permanece configurado desde CSS y
  `components.json` ya no declara una configuración JS heredada.
- La revisión manual confirmó que el Date Range Picker recuperó su estructura.
  La apariencia de sus esquinas se difiere como ajuste visual fuera de alcance.
