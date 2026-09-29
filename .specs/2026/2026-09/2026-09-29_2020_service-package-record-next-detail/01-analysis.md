# Análisis

## Punto De Partida Limpio

El módulo `servicePackagesRecords` conserva listado paginado, opciones de tipo de servicio, eliminación, store local y componentes de tabla. Su modelo contiene solo identificador, orden, empresa, recolector, fecha de visita, tipo y creación.

No existen ruta `[recordId]`, vista de detalle, preview local, thunk GET individual ni rama `detail` en Redux. La nueva implementación debe agregarlos sin mezclar responsabilidades de tabla y detalle.

## Contrato Remoto Confirmado

El presenter backend usa `toViewResponse()` tanto para listado como detalle. El GET individual incluye identidad del paquete, servicio, contacto, metadata, `details`, timestamps y `files[]`.

Cada archivo expone `mime_type`, `download_url` y `preview_url`. La normalización debe ocurrir en el feature antes de llegar a UI; no se reconstruyen URLs de S3 ni se reutiliza preview legacy.

Aunque el HTTP declara `details` como objeto genérico, la ingesta backend lo valida y normaliza con esta forma estable:

```ts
type ServicePackageRecordDetailsView = {
  serviceTime: string | null;
  equipment: Array<{
    number: number | null;
    equipment: string | null;
    brand: string | null;
    model: string | null;
    identification: string | null;
    serialNumber: string | null;
  }>;
  observations: string | null;
  synced: boolean;
  hasCollectorSignature: boolean;
  hasClientSignature: boolean;
};
```

El mapper frontend recibe el objeto remoto como desconocido, extrae solo esos campos con coerciones defensivas y descarta `raw`. Contacto y servicio usan las propiedades top-level del presenter; no se duplican desde `details`.

## Estado Requerido

El listado no es fuente del detalle: no garantiza datos completos ni maneja recurso no encontrado. La rama individual debe pertenecer al mismo feature, tener identidad del request activo, carga, error y reset, e ignorar `fulfilled` o `rejected` cuyo `recordId` no coincida con la ruta actual.

## Composición Confirmada

`ResourceFormRoute` es dueño del layout y scroll. La página usa sidebar en escritorio, navegación compacta en el rango intermedio y tabs en móvil. Sus anchors son `general-details`, `equipment` y `documents`.

`general-details` contiene un `ResourceFormFrame` de lectura y sections hermanas para contacto, servicio/metadata, firmas y observaciones. `equipment` usa un frame propio con tabla desplazable horizontalmente. `documents` usa otro frame y la receta de colección documental compacta: `DocumentCollectionList` con una `ResourceFormSection` bare, sin anidar frames.

## Referencias Vivas A Investigar

- `CustomerServiceRecordDetailPage` y su route adapter para shell, breadcrumb, scroll, skeleton, retry y cleanup.
- `ResourceFormRoute`, `ResourceFormFrame` y `ResourceFormSection` para estructura de lectura.
- `DocumentCollectionList` y `DocumentCollectionReadOnlyItem` para colección plana e interacciones documentales.
- `dashboardShellMigration.ts` y `DashboardViewAccessBoundary` para ruta, permiso y ownership de scroll.

## Riesgos Iniciales

- Restaurar MUI o piezas retiradas viola la migración limpia.
- Consumir `details` como objeto sin normalizar traslada incertidumbre de contrato al JSX.
- Reutilizar estado de listado puede mostrar datos incompletos o desactualizados.
- Restaurar la acción de tabla expande el alcance; la ruta puede construirse sin punto de entrada hasta la spec del listado.
