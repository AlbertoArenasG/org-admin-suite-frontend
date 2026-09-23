# Registro de Adopción de UI

## Estado

Registro creado el 1 de septiembre de 2026. El catálogo interno valida patrones
y las vistas de negocio registran sus adopciones de forma explícita. Ambas
categorías viven aquí para mantener una trazabilidad única.

## Registro

Las futuras entradas deben incluir:

- Fecha de adopción.
- Módulo, vista o componente afectado.
- Guideline, patrón o componente de referencia.
- Spec o iniciativa relacionada.
- Compatibilidad temporal pendiente, si existe.

## Catálogo Oficial

### 2026-09-08 - DataTable Catalog Preview

- Alcance: `/dashboard-playground/catalog/data-table`.
- Patrón: `DataTable` compartido con TanStack v9, densidad global, settings,
  estados de respuesta y paginación controlada.
- Spec: `generic-data-table-foundation`.
- Propósito: validar el componente promovido con tokens y temas reales; no es
  una adopción de módulo de negocio ni importa Component Lab.

### 2026-09-13 - Resource Form Catalog Preview

- Alcance: `/dashboard-playground/catalog/resource-forms` y
  `src/components/resource-form/`.
- Patrón: composición neutral de detalle editable con frame, secciones,
  acciones globales/locales y hosts `Dialog` o `Drawer`.
- Spec: `editable-resource-form-foundation`.
- Propósito: validar superficies, densidad, estados simulados, temas,
  responsive, teclado y foco antes de adoptar el primer formulario de negocio.
- Compatibilidad temporal: resuelta el 15 de septiembre con el detalle
  editable de Usuario.

### 2026-09-16 - Toast Catalog

- Alcance: `/dashboard-playground/catalog/toasts`.
- Patrón: recetas de feedback inmediato, promesas remotas y contenido
  expandible con información accionable sobre Sileo.
- Iniciativa: catálogo vivo de UI.
- Compatibilidad temporal: ninguna.

## Vistas De Negocio

### 2026-09-23 - Fundamento de Acceso de Vistas Next Dashboard

- Alcance: `/dashboard/portal/services`, `/dashboard/customer-service-records`
  y `/dashboard/users/[userId]`.
- Adopción: `DashboardViewAccessBoundary` declara el permiso `READ` de entrada
  y `useDashboardViewAccess` resuelve capacidades internas del mismo módulo.
- Guideline: [`dashboard-shell/guidelines.md`](./dashboard-shell/guidelines.md),
  sección `Acceso De Vista`.
- Spec: `next-dashboard-view-access-foundation`.
- Compatibilidad temporal: las rutas legacy permanecen fuera del patrón hasta
  adoptar Next Dashboard de forma explícita.

### 2026-09-22 - Tabla Administrativa de Registros de Servicio

- Alcance: `/dashboard/customer-service-records`.
- Adopción: `TableFilterDialog` con cinco selectores configurables, un período
  multicampo de aplicación exclusiva y confirmación explícita de borrador.
- Spec: `table-filter-dialog-foundation`.
- Compatibilidad temporal: URLs históricas con varios períodos se conservan
  hasta que una confirmación explícita las sustituye por un único período.

### 2026-09-09 - Seguimiento de Servicios del Portal

- Alcance: `/dashboard/portal/services`.
- Adopción: `Next Dashboard` con `DashboardTableWorkspace` y `DataTable` para
  la colección remota de servicios accesibles al cliente.
- Specs: `dashboard-shell-migration` y `generic-data-table-foundation`.
- Compatibilidad temporal: ninguna.

### 2026-09-15 - Detalle Editable de Usuario

- Alcance: `/dashboard/users/[userId]`.
- Adopción: `Next Dashboard` con breadcrumbs de recurso y `ResourceForm` para
  lectura y edición; usa campos responsive, skeleton estructural y feedback de
  mutación local en las acciones del formulario. El diálogo de cambio de
  contraseña conserva feedback local durante guardado o error y confirma éxito
  mediante toast después de cerrarse.
- Specs: `dashboard-shell-migration` y `editable-resource-form-foundation`.
- Compatibilidad temporal: ninguna.
