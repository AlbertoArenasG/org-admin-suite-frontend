# Evolucion Del UI Stack

## Estado

Esta iniciativa define una evolucion progresiva de la interfaz del backoffice.
Su objetivo es elevar el aspecto visual y la consistencia de la aplicacion sin
desestabilizar los flujos existentes ni hacer un rediseño masivo.

Documentado el 31 de agosto de 2026.

## Objetivo

Construir, a medida que se mejoran modulos y vistas, una capa propia de
componentes de interfaz reutilizables. Esta capa debe permitir que los
formularios y superficies complejas tengan una presentacion mas refinada,
coherente y mantenible.

La fundación `Resource Form` ya fue aprobada y validada como composición
neutral en el catálogo de Next Dashboard. La primera adopción de negocio será
la edición de usuarios; los registros de servicio a cliente validarán después
el caso amplio con varias secciones. La adopción se mantiene gradual y cada
recurso conserva su propia spec.

## Principios

- Mejorar la presentacion sin cambiar comportamiento, reglas de negocio,
  permisos ni contratos de API.
- Avanzar pantalla por pantalla para limitar el riesgo y mantener entregas
  funcionales.
- Extraer componentes cuando resuelvan una necesidad repetible, no por cada
  fragmento pequeño de JSX.
- Preferir composicion sobre componentes monoliticos y conservar archivos
  enfocados.
- Mantener la integracion con los componentes base existentes de la aplicacion
  mientras se consolida la capa propia.
- Respetar los patrones visuales aprobados: tipografia global, colores, radios,
  espaciado, estados de foco, borde y sombra.

## Fundación De Formularios Aprobada

`src/components/resource-form/` concentra los patrones ya aprobados:

- Frame con superficie, densidad, encabezado, feedback y acciones globales.
- Secciones semánticas con presentación opcional y acciones locales cuando la
  operación remota sea independiente.
- Detalle editable en ruta para recursos amplios o multi-sección.
- Overlay breve con `Dialog` o `Drawer` para recursos de una sola sección.
- Estados visuales controlados de carga, guardado, error y reintento.

Los campos, validaciones y agrupaciones que sean exclusivos de un flujo deben
permanecer dentro de su modulo. Un componente compartido no debe incluir reglas
de dominio ni asumir nombres de entidades.

La navegación intraformulario y regiones fijas no forman parte todavía de la
fundación adoptada. Se evaluaron como dirección futura para formularios largos,
pero se implementarán solo cuando una spec de recurso tenga esa necesidad.

## Proceso De Trabajo

1. Auditar la pantalla elegida y separar estructura visual de integracion con
   datos, validacion y mutaciones.
2. Identificar los patrones visuales que se repiten dentro de esa pantalla.
3. Construir el componente compartido solo cuando su API sea pequena y neutral
   respecto al dominio.
4. Aplicarlo en la pantalla actual y conservar el comportamiento funcional.
5. Validar escritorio, estados y responsive basico antes de reutilizarlo en
   otro modulo.
6. Extraer patrones posteriores solo despues de que aparezcan necesidades reales
   de reutilizacion.

## Responsive

Los componentes nuevos deben contar desde su origen con responsive basico:

- Grids que se apilen de forma legible en anchos reducidos.
- Controles de ancho disponible y espaciado compacto.
- En formularios largos de ruta, la spec del recurso decide navegación y
  acciones alcanzables según un único dueño de scroll. Los overlays se reservan
  para una sección breve y no se extienden con scroll prolongado.

Esto no reemplaza el rediseño responsive global. La revision del shell movil,
sidebar, encabezados, tablas y representaciones moviles se mantiene en
`docs/ui/initiatives/mobile-responsive-redesign.md` y debe ejecutarse como iniciativa
transversal separada cuando tenga prioridad de negocio.

## Fuera De Alcance

- Rediseñar toda la aplicacion en una sola entrega.
- Crear una biblioteca de componentes abstracta sin casos de uso reales.
- Cambiar funcionalidad bajo el pretexto de una mejora visual.
- Incorporar el rediseño movil global dentro de la mejora de un formulario.
