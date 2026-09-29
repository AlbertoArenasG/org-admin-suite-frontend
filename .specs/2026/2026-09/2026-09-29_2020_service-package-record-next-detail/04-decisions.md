# Decisiones

## D-01: Nueva Implementación Sin Compatibilidad Legacy

La vista se construye desde cero sobre Next Dashboard. No se restaura MUI, el preview local, el thunk anterior, el estado eliminado ni la acción de tabla.

La eliminación previa creó un límite claro: esta iniciativa añade artefactos nuevos con responsabilidades explícitas, no adapta piezas retiradas.

## D-02: Estado Individual Dentro Del Mismo Feature

El detalle vive en una rama nueva de `servicePackagesRecords`, separada de listado, opciones y eliminación. Incluye `record`, `status`, `error` y `currentRecordId`; reducers fulfilled/rejected ignoran respuestas obsoletas.

No se crea un slice paralelo. El recurso remoto es el mismo y el feature ya es su dueño; separar la rama evita acoplar el ciclo individual a la tabla.

## D-03: Adaptador Tipado Para Details

El feature agrega modelos API específicos de detalle y un mapper que normaliza `details` a campos de presentación estables. `raw` y propiedades no usadas no cruzan la frontera hacia los componentes.

Se descarta usar un cast directo o leer claves dinámicas en JSX porque el presenter HTTP declara `details` como `Record<string, unknown>`.

## D-04: Tres Frames Navegables De Lectura

La composición usa tres destinos: **Información general**, **Equipo** y **Archivos recolectados**. El primer frame contiene las sections hermanas de contacto, servicio/metadata, firmas y observaciones; los otros dos son frames propios.

La receta se adopta sin extensión. Los campos son valores de lectura, no inputs deshabilitados; la colección documental reutiliza sus componentes compartidos sin un preview local.
