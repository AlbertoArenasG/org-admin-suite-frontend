# Diseño Técnico

## Contrato Y Mapper

`ServicePackageRecordListItem` conserva los siete campos actuales de tabla. `ServicePackageRecordDetail` agrega identidad de paquete, contacto, servicio, metadata, timestamps, `details` tipado y archivos tipados.

El archivo nuevo `servicePackagesRecordsMappers.ts` declara los tipos API privados y expone mapper de lista y mapper de detalle. El segundo recibe `details` como `unknown`, valida objeto y normaliza únicamente `serviceTime`, `equipment`, `observations`, `synced`, `hasCollectorSignature` y `hasClientSignature`. Los valores inválidos usan `null`, `[]` o `false`; `raw` no cruza al modelo interno.

Cada archivo interno es `{ fileId, relativePath, originalName, mimeType, size, downloadUrl, previewUrl }`. No existen `s3_key`, `content_type` ni URLs construidas por frontend.

## Estado Individual

```ts
detail: {
  record: ServicePackageRecordDetail | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: { message: string; status: number } | null;
  currentRecordId: string | null;
}
```

`fetchServicePackageRecordDetail({ recordId })` consulta el GET individual y traduce `ApiError` a mensaje/status. `pending` guarda el id activo y limpia record/error. `fulfilled` y `rejected` ignoran acciones cuyo id no coincide; el reset restablece toda la rama. La página solo interpreta estados que coinciden con el parámetro activo y presenta not-found cuando el error tiene status `404`.

## Composición

```text
page.tsx
  `- DashboardViewAccessBoundary(SERVICE_PACKAGES, READ)
       `- ServicePackageRecordDetailPage
            `- ResourceFormRoute
                 |- #general-details -> ResourceFormFrame(read): contacto, servicio/metadata, firmas, observaciones
                 |- #equipment -> ResourceFormFrame(read): tabla de equipo
                 `- #documents -> DocumentCollection: una colección de lectura
```

La página coordina params, fetch, reset, breadcrumbs, carga, 404, error y reintento. Las sections solo reciben registro tipado y copy; no despachan ni conocen HTTP. El route adapter y la navegación compacta son adapters del módulo que reutilizan `ResourceFormRoute` y `useResourceFormNavigation` sin modificar sus contratos.

## Shell, Permisos Y Responsive

- La ruta usa `DashboardViewAccessBoundary` para `SERVICE_PACKAGES/READ`.
- `dashboardShellMigration.ts` registra el patrón individual con `page-content` y breadcrumb hacia el listado actual.
- El breadcrumb final se sincroniza con `serviceOrder` y se resetea al desmontar.
- Los anchors son `general-details`, `equipment` y `documents`; sidebar desde `lg`, navegación compacta con tooltip entre `md` y `lg`, y tabs en móvil.
- Los valores son `FormReadValue`, no inputs deshabilitados. La tabla de equipo vive en overflow horizontal. Skeleton y contenido comparten frame, inset y densidad.

## Documentos

La sección filtra `application/json`, usa una sola colección **Archivos recolectados** y mantiene únicamente `expanded` local. `DocumentCollectionReadOnlyItem` resuelve interacción, carpeta, preview de imagen/PDF, descarga, foco y reduced motion. No se crea diálogo ni preview propio.

## Registro De Artefactos

| Artefacto                 | Tipo                     | Ubicación                                                                                                                            | Responsabilidad                                                                                                                                  | Dependencias                                      | Estado         |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | -------------- |
| Ruta individual           | Ruta App Router          | `src/app/dashboard/service-packages-records/[recordId]/page.tsx`                                                                     | Declara READ y monta la página Next.                                                                                                             | Boundary, página de módulo.                       | new            |
| Shell migration           | Configuración            | `src/components/dashboard-shell/migration/dashboardShellMigration.ts`                                                                | Selecciona shell, breadcrumb base y scroll.                                                                                                      | Dashboard shell, locales.                         | modify         |
| Tipos del feature         | Tipos                    | `src/features/servicePackagesRecords/types.ts`                                                                                       | Separa modelos de lista y detalle.                                                                                                               | Contrato API.                                     | modify         |
| Mapper del feature        | Adaptador API            | `src/features/servicePackagesRecords/servicePackagesRecordsMappers.ts`                                                               | Normaliza respuestas y la frontera de `details`.                                                                                                 | Tipos internos, contrato GET.                     | new            |
| Thunks del feature        | Integración              | `src/features/servicePackagesRecords/servicePackagesRecordsThunks.ts`                                                                | Ejecuta GET individual y conserva listado/delete.                                                                                                | jsonRequest, ApiError, auth, mapper.              | modify         |
| Slice del feature         | Estado Redux             | `src/features/servicePackagesRecords/servicePackagesRecordsSlice.ts`                                                                 | Protege estado individual sin mezclar tabla.                                                                                                     | Thunk, tipos.                                     | modify         |
| Página de detalle         | Componente de módulo     | `src/components/servicePackagesRecords/ServicePackageRecordDetailPage.tsx`                                                           | Coordina ciclo remoto y estados de pantalla.                                                                                                     | Feature, shell, Resource Form.                    | new            |
| Route adapter             | Componente de módulo     | `src/components/servicePackagesRecords/ServicePackageRecordDetailRoute.tsx`                                                          | Compone layout y navegación responsive.                                                                                                          | ResourceFormRoute, compact navigation.            | new            |
| Navegación compacta       | Componente de módulo     | `src/components/servicePackagesRecords/ServicePackageRecordCompactNavigation.tsx`                                                    | Presenta iconos, tooltips y anchors.                                                                                                             | useResourceFormNavigation, Tooltip.               | new            |
| Sections generales/equipo | Componente de módulo     | `src/components/servicePackagesRecords/ServicePackageRecordReadOnlySections.tsx`                                                     | Renderiza los frames no documentales.                                                                                                            | Forms read-only, Resource Form, tipos.            | new            |
| Sección documental        | Componente de módulo     | `src/components/servicePackagesRecords/ServicePackageRecordDocumentsSection.tsx`                                                     | Adapta archivos visibles a colección compartida.                                                                                                 | DocumentCollection, tipos, i18n.                  | new            |
| Locales del módulo        | Traducciones             | `src/locales/es/servicePackagesRecords.json`, `src/locales/en/servicePackagesRecords.json`                                           | Provee copy de detalle, campos, errores y documentos.                                                                                            | i18next.                                          | modify         |
| Breadcrumb locales        | Traducciones             | `src/locales/es/breadcrumbs.json`, `src/locales/en/breadcrumbs.json`                                                                 | Añade etiqueta estática de detalle.                                                                                                              | Shell migration.                                  | modify         |
| Resource Form             | Componentes compartidos  | `src/components/resource-form/*`                                                                                                     | Aporta estructura, scroll y skeleton sin cambios.                                                                                                | Reuso directo.                                    | reuse          |
| Colección documental      | Componentes compartidos  | `src/components/documents/{DocumentCollection,DocumentCollectionReadOnlyItem}.tsx`                                                   | Aporta colección, preview y descarga sin cambios.                                                                                                | Reuso directo.                                    | reuse          |
| Boundary de vista         | Componente compartido    | `src/components/dashboard-shell/DashboardViewAccessBoundary.tsx`                                                                     | Protege entrada por READ sin cambios.                                                                                                            | Reuso directo.                                    | reuse          |
| Tabla actual              | Compatibilidad de módulo | `src/components/servicePackagesRecords/{ServicePackagesRecordsTableContainer,ServicePackagesRecordsDataTable,RecordsRowActions}.tsx` | Permanece sin enlace al detalle hasta la spec de tabla.                                                                                          | Lista y delete.                                   | reuse          |
| Estilos, temas y motion   | Estilos y temas          | N/A                                                                                                                                  | No agrega CSS, tokens, assets ni motion propios; la composición consume exclusivamente estilos y comportamiento de los componentes reutilizados. | Resource Form, DocumentCollection y tema vigente. | not_applicable |
| Recipes Resource Form     | Guideline                | `docs/ui/recipes/resource-form.md`                                                                                                   | No cambia: aplica directamente.                                                                                                                  | N/A.                                              | not_applicable |
| Adoption log              | Documentación viva       | `docs/ui/adoption-log.md`                                                                                                            | Registra la adopción después de validar.                                                                                                         | Spec cerrada.                                     | modify         |
| Pruebas unitarias         | Pruebas                  | N/A                                                                                                                                  | No aplican por acuerdo explícito.                                                                                                                | N/A.                                              | not_applicable |
| Validación manual         | Documento                | `.specs/2026/2026-09/2026-09-29_2020_service-package-record-next-detail/08-manual-validation.md`                                     | Conserva evidencia de aceptación.                                                                                                                | Navegador y API.                                  | new            |

No hay artefactos legacy, experimentos productivos ni limpieza diferida dentro del alcance. La futura migración de tabla es una iniciativa separada.

## Verificación Estática

- `npm run typecheck`
- `git diff --check`

No se crean ni ejecutan pruebas unitarias.
