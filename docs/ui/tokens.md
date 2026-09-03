# Estrategia de Tokens de UI

**Registrado:** 2 de septiembre de 2026  
**Estado:** Guideline viva para componentes y patrones nuevos.

## Propósito

Los componentes nuevos deben consumir tokens semánticos en lugar de colores o
valores visuales directos. Esto permite mantener consistencia, preparar la
aplicación para futuros temas completos y evitar que cada vista defina su
propia variante visual.

Esta preparación no se difiere hasta una futura iniciativa de multitemas. Es un
requisito para cada componente nuevo y para cada componente o vista que se
reestructure durante la migración gradual.

## Niveles de Tokens

### Fundacionales

Representan valores compartidos de toda la interfaz: color de fondo, texto,
borde, radio, tipografía, espaciado y escalas de color. Antes de crear uno
nuevo, se deben revisar los tokens fundacionales existentes.

Ejemplos: `--background`, `--foreground`, `--card`, `--border`, `--ring`.

### Semánticos de Superficie

Representan el rol visual de una capa o región, no un color concreto. Deben
usarse cuando una superficie tenga una responsabilidad reutilizable.

Ejemplos: `--workspace-canvas-surface`, `--module-surface`,
`--module-surface-border`, `--control-surface`, `--surface-bg`,
`--data-grid-header-bg`, `--dashboard-shell-surface` y
`--dashboard-navigation-surface`.

### Específicos de Componente o Patrón

Se crean únicamente si un componente compartido o patrón reutilizable necesita
una variante visual que no expresa un token existente.

Ejemplos potenciales: encabezado de tabla, agrupación de formulario, panel de
detalle o controles de una lista.

## Criterio de Creación

Crear un token cuando el valor:

- Describe un rol visual con intención reutilizable.
- Puede requerir variación entre temas o apariencias.
- Se repite en más de un componente, módulo o patrón aprobado.

No crear un token cuando el valor es una decisión local, temporal o exclusiva
de una sola vista. En ese caso se deben componer los tokens existentes.

## Proceso Para Componentes Nuevos

1. Revisar los tokens existentes antes de agregar estilos visuales.
2. Componer con tokens fundacionales o semánticos cuando cubran el caso.
3. Si falta un rol reutilizable, proponer y definir un token con nombre
   semántico, sin asociarlo a un color concreto.
4. Usar el token desde el componente compartido o patrón correspondiente.
5. Al migrar una pieza heredada, reemplazar los valores visuales directos que
   toque esa migración por el contrato semántico aplicable.
6. Cuando el patrón esté aprobado, actualizar este documento o su guideline
   específica en `patterns/` o `components/`.

## Expresión Visual Futura

El contrato debe permitir temas completos con expresiones visuales distintas:

- **Plana:** superficies sobrias, sin textura ambiental, blur ni elevación
  decorativa innecesaria en toda la aplicación.
- **Ambient:** una composición coherente de fondo, navegación, content inset y
  contenido con ambient mesh, materiales o elevación sutiles.

Ambas expresiones deben cubrir todas las capas que compongan un tema. Un tema
ambient no debe limitarse al shell, ni un tema plano debe conservar decoración
ambient residual en el contenido.

Incluso en temas ambient, el contenido operativo debe preservar jerarquía,
contraste y sobriedad: tablas, formularios y datos son la región visualmente
más clara y menos decorada de la aplicación.

## Temas Futuros

Los tokens son la base para una futura iniciativa de temas completos. Un tema
podrá redefinir tokens por capa sin reescribir componentes. La evolución de esa
iniciativa está registrada en
[application-theming.md](./initiatives/application-theming.md) y requerirá una
spec propia antes de implementarse.

Las tres variantes iniciales son `Clásico`, `Ambient clásico` y `Ambient profundo`
(identificadores internos `classic`, `ambient` y `ambient-deep`), todas con contenido
operativo claro. Por ello, los componentes nuevos deben quedar preparados no
solo para variaciones de color, sino también para variaciones semánticas de
material: textura ambiental, transparencia, borde y elevación. Estas
variaciones se expresarán mediante tokens por rol, nunca mediante condiciones
visuales embebidas en una vista.

Los componentes de MUI también deberán alinearse con estos tokens cuando se
incorporen nuevos temas.
