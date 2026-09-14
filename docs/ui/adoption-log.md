# Registro de Adopción de UI

## Estado

Registro creado el 1 de septiembre de 2026. El catálogo interno valida patrones
compartidos; las adopciones de módulos de negocio se registran por separado.

## Registro

Las futuras entradas deben incluir:

- Fecha de adopción.
- Módulo, vista o componente afectado.
- Guideline, patrón o componente de referencia.
- Spec o iniciativa relacionada.
- Compatibilidad temporal pendiente, si existe.

## 2026-09-08 - DataTable Catalog Preview

- Alcance: `/dashboard-playground/catalog/data-table`.
- Patrón: `DataTable` compartido con TanStack v9, densidad global, settings,
  estados de respuesta y paginación controlada.
- Spec: `generic-data-table-foundation`.
- Propósito: validar el componente promovido con tokens y temas reales; no es
  una adopción de módulo de negocio ni importa Component Lab.

## 2026-09-13 - Resource Form Catalog Preview

- Alcance: `/dashboard-playground/catalog/resource-forms` y
  `src/components/resource-form/`.
- Patrón: composición neutral de detalle editable con frame, secciones,
  acciones globales/locales y hosts `Dialog` o `Drawer`.
- Spec: `editable-resource-form-foundation`.
- Propósito: validar superficies, densidad, estados simulados, temas,
  responsive, teclado y foco antes de adoptar el primer formulario de negocio.
- Compatibilidad temporal: la integración real con React Hook Form y mutación
  remota es un gate de la spec del primer consumidor, no responsabilidad del
  catálogo neutral.
