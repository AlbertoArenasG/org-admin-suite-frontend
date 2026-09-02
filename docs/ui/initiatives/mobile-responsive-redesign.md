# Rediseño Responsive para Móvil

## Estado

Esta iniciativa está diferida. La aplicación se prioriza actualmente para
escritorio; este documento conserva el diagnóstico y la dirección de migración
para retomarla cuando el uso móvil sea relevante para negocio.

Documentado el 31 de agosto de 2026.

Las reglas estructurales del shell que se hayan aprobado se consultan en
[`../dashboard-shell/guidelines.md`](../dashboard-shell/guidelines.md). Este
documento no las reemplaza ni es una guideline viva.

## Diagnóstico

La interfaz móvil actual no es una experiencia diseñada específicamente para pantallas reducidas. Es principalmente la composición de escritorio comprimida a un viewport menor. Esto genera los siguientes problemas:

- El shell conserva fondos laterales, marcos redondeados y padding propios de escritorio, reduciendo innecesariamente el área útil.
- El encabezado consume demasiado espacio vertical y los breadcrumbs de escritorio compiten con el contenido principal.
- Tablas, grids, gráficas y controles con anchos mínimos desbordan horizontalmente o se reducen hasta perder legibilidad.
- Las acciones y filtros se acumulan sin una jerarquía móvil clara.
- La apertura del sidebar desde móvil debe validarse como parte del shell. El trigger es compartido, por lo que un fallo no debe corregirse página por página.

Esto no debe tratarse como una serie de ajustes aislados de CSS. Es un rediseño responsive progresivo compuesto por un shell móvil y adaptaciones de contenido por módulo.

## Objetivo

Ofrecer una experiencia móvil intencional que aproveche el viewport, mantenga la navegación y acciones principales accesibles, y evite comprimir componentes de escritorio que requieren otra representación.

## Principios

- No migrar toda la aplicación en una sola entrega.
- Separar las reglas globales del shell de las reglas de contenido de cada módulo.
- Elegir el módulo inicial cuando se inicie formalmente la iniciativa; no queda preasignado en este documento.
- Mantener la funcionalidad existente mientras se sustituye gradualmente la presentación móvil.
- Preferir representaciones móviles propias para tablas, formularios y acciones complejas, en lugar de escalar o recortar la interfaz de escritorio.
- Validar en dispositivos y tamaños reales, no solo mediante reducción visual del navegador.

## Dirección de Migración

### Shell Móvil Global

La implementación deberá adoptar la variante móvil del shell definida en las
guidelines y validarla frente a las necesidades reales de los módulos:

- Usar el ancho disponible con padding compacto, normalmente 16 px, sin conservar los grandes gutters laterales de escritorio.
- Reducir o eliminar en móvil la superficie contenedora global con radio grande cuando no aporte jerarquía.
- Usar `Global Header` y `Workspace Header` como capas separadas, sin volver a
  mezclar controles globales, contexto de ruta y acciones de página.
- Resolver los breadcrumbs de manera compacta, con elipsis cuando aplique, sin
  perder el segmento actual.
- Mantener el sidebar como panel superpuesto (`Sheet`) y comprobar que el trigger abre y cierra desde cualquier vista.
- Definir z-index, focus trap, cierre por navegación y áreas táctiles para el panel móvil como responsabilidades del shell, no de las páginas.

La variante móvil debe reutilizar las capas compartidas del shell en lugar de
reconstruir encabezados página por página.

### Canvas de Contenido Móvil

En móvil, `Content Inset` no debe exponerse como una superficie visual
independiente. El canvas debe ocupar el ancho disponible del viewport con
padding compacto y conservar únicamente las superficies que representen
secciones funcionales de cada módulo.

Este cambio libera espacio horizontal y evita apilar dos niveles de contenedores
visuales. Debe resolverse en el layout compartido del dashboard, manteniendo
intacta la variante de escritorio; no mediante ajustes aislados en las páginas.

### Patrones por Módulo

Cada módulo debe decidir su representación móvil según el tipo de tarea:

- Listados: priorizar datos clave y acciones por registro mediante tarjetas, filas compactas o una tabla móvil deliberadamente reducida. No depender de un DataGrid de escritorio comprimido.
- Detalles: apilar secciones, reducir padding y agrupar acciones principales sin perder contexto.
- Formularios: una columna, etiquetas legibles, controles de ancho completo y acciones persistentes cuando el formulario sea largo.
- Filtros: mostrar los esenciales y mover los secundarios a un panel, popover o diálogo móvil.
- Gráficas y contenido ancho: definir una alternativa resumida o scroll horizontal intencional, nunca un recorte accidental.

## Secuencia de Implementación

1. Auditar el shell actual en viewports móviles y corregir la apertura, cierre y capas del sidebar.
2. Diseñar e implementar el shell móvil global sin cambiar todavía todas las representaciones de contenido.
3. Elegir el primer módulo según prioridad vigente de negocio y crear su variante móvil completa.
4. Validar navegación, accesibilidad, formularios, tablas, acciones y estados vacíos/carga/error en dicho módulo.
5. Migrar módulos posteriores de forma incremental, reutilizando los patrones y componentes aprobados.

## Criterios de Aceptación

- No existe desbordamiento horizontal accidental a 360 px de ancho.
- El sidebar móvil abre, cierra, recibe foco y se cierra al navegar desde cualquier vista del dashboard.
- El contenido principal utiliza el viewport sin los márgenes de escritorio innecesarios.
- La barra superior no desplaza ni oculta el contenido importante.
- Las áreas táctiles de navegación y acciones principales tienen al menos 44 px.
- Las tablas, filtros, formularios y gráficas de cada módulo migrado cuentan con una decisión móvil explícita.
- Las pruebas se realizan al menos en 360 px, 390 px y una tablet en orientación vertical.

## Fuera de Alcance Inicial

- Rediseñar todos los módulos en una única entrega.
- Cambiar flujos de negocio, permisos o contratos de API por razones exclusivamente visuales.
- Resolver el comportamiento móvil con reglas globales que oculten contenido o reduzcan tipografía sin una alternativa funcional.
