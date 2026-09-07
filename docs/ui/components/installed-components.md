# Componentes Instalados y Vendor

**Estado:** Guideline viva para componentes y bloques externos incorporados al
Next Dashboard.

## Propósito

Un componente instalado desde shadcn.io u otra fuente externa conserva su
estructura y densidad de origen durante la evaluación inicial. La aplicación
lo adapta mediante una capa propia, sin convertir primitives compartidos en una
dependencia visual del dashboard o de Legacy.

## Estructura Obligatoria

```text
src/components/vendor/<fuente>/<componente>/
├─ <primitives instalados>.tsx
├─ <ComponentePropio>.tsx
└─ <ComponentePropio>.module.css
```

- Los primitives descargados se copian completos a `vendor`. No se modifican
  para adaptar temas, densidad o comportamientos de producto.
- El componente propio compone esos primitives y define la API que consumen
  las vistas: valores, callbacks, variantes aprobadas, límites y accesibilidad.
- Si un primitive descargado es dependencia exclusiva de ese componente propio,
  permanece en su mismo directorio `vendor`; no se promociona a
  `src/components/ui`.
- `src/components/ui` conserva los primitives de la aplicación y Legacy. No se
  reemplaza ni se sobrescribe al instalar un bloque externo.

## Staging Temporal de Descargas

Toda descarga inicial se hace exclusivamente en esta raíz ignorada por Git:

```text
/Users/alberto/projects/icsacv/org-admin-suite-frontend/.component-staging/
```

La ruta de cada descarga es aislada y predecible:

```text
.component-staging/<fuente>/<componente>/
```

Por ejemplo, el rango de fechas de shadcn.io se descargaría en
`.component-staging/shadcn/date-picker-with-range/`. Esta carpeta solo es un
área de inspección: el código de la aplicación nunca la importa, no es fuente
de verdad y nunca se versiona.

- Cada adopción inicia con un directorio nuevo o vacío para ese componente. No
  se descargan dos bloques en el mismo directorio ni se reutilizan archivos de
  una descarga anterior.
- Al terminar la integración, se conserva el bundle aprobado en
  `src/components/vendor/<fuente>/<componente>/`, no en staging.
- La limpieza del directorio exacto de staging es obligatoria al cerrar la
  adopción, después de revisar que los archivos y dependencias requeridos ya
  están registrados. Nunca se elimina `.component-staging/` completa ni el
  staging de otro componente por una adopción individual.
- El agente indicará la ruta exacta a limpiar antes de hacerlo; no creará ni
  manipulará staging fuera de este repositorio.

## Dependencias y Coincidencias

- Las dependencias de paquetes se revisan contra `package.json` antes de
  agregarlas. Si ya existe una versión compatible, se reutiliza; el gestor de
  paquetes mantiene una sola resolución del paquete en el proyecto.
- Archivos fuente con nombres coincidentes, como `button.tsx`, `popover.tsx` o
  `calendar.tsx`, no se deduplican por nombre. Cada bloque conserva sus
  primitives dentro de su carpeta `vendor` para que una actualización no altere
  otro componente ni Legacy.
- Una primitive solo se promueve a un componente compartido mediante una
  decisión explícita de diseño y una migración documentada. Una descarga nueva
  nunca sobrescribe `src/components/ui` ni el bundle de otro vendor para
  resolver una coincidencia.

## Estilos y Temas

- Los tokens, selectores y reglas exclusivos de un componente viven en su CSS
  local. El archivo contiene las recetas para cada tema activo con selectores
  `html.classic`, `html.ambient` y `html.ambient-deep`.
- Los archivos `styles/themes/dashboard-*.css` solo contienen recetas de capas
  estructurales compartidas: shell, navegación, canvas, composition y chrome.
  No deben acumular familias de `--<componente>-*`.
- Los valores cromáticos y de material se definen independientemente para cada
  tema, aunque coincidan hoy. La cercanía física al componente no elimina el
  requisito multitema.
- Cuando un componente usa un portal, su clase de scope también debe aplicarse
  al contenido portalled. De otro modo no hereda las variables del trigger.
- Radios, espaciado y otras decisiones estructurales compartidas consumen los
  tokens fundacionales aplicables, por ejemplo `--radius-input`; no se duplican
  por tema salvo que se apruebe una variación temática.

## Flujo de Adopción

1. Descargar el bloque completo en
   `.component-staging/<fuente>/<componente>/`, sin salir de
   `/Users/alberto/projects/icsacv`.
2. Revisar sus archivos y dependencias; si coincide el nombre de un primitive
   existente, no sobrescribirlo ni mezclarlo.
3. Copiar el bundle aprobado bajo
   `src/components/vendor/<fuente>/<componente>`.
4. Crear el componente propio y su CSS local para la API y recetas de tema.
5. Validarlo en `/dashboard-playground/catalog` con los temas y viewports
   aplicables antes de adoptarlo en una vista de negocio.
6. Limpiar el directorio exacto de staging y documentar el contrato aprobado
   en `docs/ui/components/` antes de cerrar la adopción.

## Caso Inicial

`vendor/shadcn/date-picker/` contiene el bundle completo del rango de fechas:
`Button`, `Popover`, `Calendar` y `ShadcnDatePickerWithRange`. Los tres
primitives permanecen intactos; el último es el adaptador propio y su módulo
CSS contiene las recetas `--date-picker-*` por tema para el trigger y el
popover portalled.

El `Filter Menu` no es vendor, pero sigue la misma regla de localización:
`FilterMenuTheme.module.css` concentra su familia `--filter-menu-*` por tema y
la aplica tanto al trigger como al `PopoverContent` portalled.
