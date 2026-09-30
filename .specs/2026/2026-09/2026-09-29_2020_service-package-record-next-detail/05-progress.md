# Progreso

## 2026-09-29 - Definición, Análisis Y Diseño Técnico

- Se partió del módulo sin ruta, vista, preview, estado ni thunk legacy de detalle.
- Se verificó el GET individual protegido y el descriptor documental seguro de backend.
- Se decidió normalizar `details` en un mapper tipado local y no pasarlo como objeto dinámico al JSX.
- Se fijaron estado individual con identidad de request, tres frames de lectura y navegación responsive reutilizando recipes vigentes.
- La spec está lista para iniciar por la Slice 1.

## 2026-09-29 - Slice 1: Contrato Y Estado Individual

- Se separó el modelo del listado (`ServicePackageRecordListItem`) del modelo completo de detalle.
- Se agregó `servicePackagesRecordsMappers.ts` como única frontera entre el contrato HTTP y modelos internos; normaliza `details` y archivos sin entregar objetos dinámicos a UI futura.
- Se incorporó el GET individual, errores tipados, reset y guards por `recordId` y `requestId` para ignorar respuestas obsoletas.
- El listado y la eliminación conservan su flujo; solo migraron a su tipo explícito de item de tabla.
- Verificado: `npm run typecheck` y `git diff --check` completaron correctamente.

## 2026-09-29 - Slice 2: Ruta, Shell Y Frames De Lectura

- Se agregó la ruta individual protegida con `SERVICE_PACKAGES/READ` y su entrada de shell `page-content`.
- La página coordina fetch, reset, breadcrumb dinámico, carga, error recuperable y estado 404; no mezcla esos ciclos con las sections de presentación.
- Se compusieron los frames de solo lectura para información general y equipo con `ResourceFormRoute`, `ResourceFormFrame`, `ResourceFormSection` y `FormReadValue`.
- Se agregó navegación desktop, compacta y móvil para los anchors disponibles. **Archivos recolectados** se incorpora como tercer destino en la Slice 3, junto con su section, para no dejar una acción hacia un anchor inexistente.
- Verificado: `npm run typecheck` y `git diff --check` completaron correctamente.

## 2026-09-29 - Slice 3: Colección Documental

- Se agregó una única colección **Archivos recolectados** con `DocumentCollection` y `DocumentCollectionReadOnlyItem`.
- El adaptador filtra el JSON operativo y entrega los descriptores tipados a la colección reutilizable; no construye URLs ni incorpora preview, diálogo o CSS locales.
- La colección reutiliza las interacciones vigentes: expansión, reduced motion, previsualización de imágenes/PDF y descarga mediante URLs protegidas.
- Se incorporó el anchor y destino responsive de documentos junto con la section que lo resuelve.
- Verificado: `npm run typecheck` y `git diff --check` completaron correctamente.

## 2026-09-29 - Slice 4: Validación Y Cierre

- La persona usuaria validó funcionalmente la ruta con registros reales, incluyendo múltiples equipos, navegación, documentos, previsualización y descarga.
- Se marcó la matriz manual como validada para el alcance de la iniciativa.
- Verificado nuevamente: `npm run typecheck` y `git diff --check` completaron correctamente.
- Se registró la adopción de UI en `docs/ui/adoption-log.md` y se auditó que no permanecen checks ni estados abiertos en la spec.
