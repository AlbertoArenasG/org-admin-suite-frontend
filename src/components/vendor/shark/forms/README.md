# Shark Forms Vendor

## Propósito

Familia aprobada para formularios nuevos y overlays de formulario en Next
Dashboard. No sustituye las primitives canónicas de `src/components/ui` ni se
usa fuera de ese dominio sin una decisión explícita.

## Procedencia

- Fuente: [Shark UI](https://github.com/sharkui-inc/shark-ui), evaluado en
  Component Lab.
- Primitives: Ark UI.
- Revisión integrada: `@ark-ui/react@5.39.1`,
  `tailwind-variants@3.3.1` y `tw-animate-css@1.4.0`.
- Primitives integradas: `Editable`, `Drawer`, `Checkbox`, `Radio Group` y sus
  dependencias `Field` y `Separator`.
- Licencia: MIT.
- Actualización: revisar source, licencia, dependencias, consumidores y diff
  antes de modificar esta familia.

## Límite De Estilos

Las primitives consumen los tokens semánticos globales existentes. Este vendor
no introduce wrapper de estilos ni tokens visuales propios. `tw-animate-css`
se importa una vez desde `src/app/globals.css` porque el Drawer usa portal.

## Consumidores

La fundación `ResourceForm*` puede recibir hosts de esta familia. Los módulos
de negocio solo deben consumir la API de formularios aprobada para su flujo.
