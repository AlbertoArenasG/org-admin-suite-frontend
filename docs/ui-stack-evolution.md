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

La iniciativa comienza aplicando estos principios al formulario de creacion de
un registro de servicio al cliente. Sus resultados solo se generalizaran cuando
representen un patron real para otros flujos.

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

## Candidatos Reutilizables

Los siguientes patrones pueden convertirse en componentes compartidos si el
primer formulario confirma que tienen uso mas alla de una sola pantalla:

- Contenedor de formulario para concentrar jerarquia, ancho y espaciado.
- Seccion de formulario con titulo, descripcion opcional y contenido compuesto.
- Grid de campos que adapte la distribucion sin que cada formulario replique
  sus breakpoints.
- Barra de acciones para formularios largos, con variantes normales o fijas
  segun el contexto.
- Tratamiento consistente de carga, error, vacio y acciones deshabilitadas.

Los campos, validaciones y agrupaciones que sean exclusivos de un flujo deben
permanecer dentro de su modulo. Un componente compartido no debe incluir reglas
de dominio ni asumir nombres de entidades.

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
- Acciones alcanzables cuando el formulario requiera desplazamiento prolongado.

Esto no reemplaza el rediseño responsive global. La revision del shell movil,
sidebar, encabezados, tablas y representaciones moviles se mantiene en
`docs/mobile-responsive-redesign.md` y debe ejecutarse como iniciativa
transversal separada cuando tenga prioridad de negocio.

## Fuera De Alcance

- Rediseñar toda la aplicacion en una sola entrega.
- Crear una biblioteca de componentes abstracta sin casos de uso reales.
- Cambiar funcionalidad bajo el pretexto de una mejora visual.
- Incorporar el rediseño movil global dentro de la mejora de un formulario.
