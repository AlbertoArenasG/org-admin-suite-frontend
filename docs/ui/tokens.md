# Estrategia de Tokens de UI

**Registrado:** 2 de septiembre de 2026  
**Estado:** Guideline viva para componentes y patrones nuevos.

## Propósito

Los componentes nuevos deben consumir tokens semánticos en lugar de colores o
valores visuales directos. Esto permite mantener consistencia, preparar la
aplicación para futuros temas completos y evitar que cada vista defina su
propia variante visual.

## Niveles de Tokens

### Fundacionales

Representan valores compartidos de toda la interfaz: color de fondo, texto,
borde, radio, tipografía, espaciado y escalas de color. Antes de crear uno
nuevo, se deben revisar los tokens fundacionales existentes.

Ejemplos: `--background`, `--foreground`, `--card`, `--border`, `--ring`.

### Semánticos de Superficie

Representan el rol visual de una capa o región, no un color concreto. Deben
usarse cuando una superficie tenga una responsabilidad reutilizable.

Ejemplos: `--surface-bg`, `--surface-border`, `--data-grid-header-bg`,
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
5. Cuando el patrón esté aprobado, actualizar este documento o su guideline
   específica en `patterns/` o `components/`.

## Temas Futuros

Los tokens son la base para una futura iniciativa de temas completos. Un tema
podrá redefinir tokens por capa sin reescribir componentes. La evolución de esa
iniciativa está registrada en
[application-theming.md](./initiatives/application-theming.md) y requerirá una
spec propia antes de implementarse.

Los componentes de MUI también deberán alinearse con estos tokens cuando se
incorporen nuevos temas.
