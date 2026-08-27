# Implementation Breakdown

## Slice 1. Contratos y adaptadores

- Reemplazar tipos singulares por `companyNames: string[]` en Contactos y Grupos de destinatarios.
- Actualizar mapeos de respuesta y payloads a `company_names`.

## Slice 2. Formulario y componentes de Contactos

- Implementar componentes acotados para edición, resumen y chips de empresas.
- Integrar el campo repetible en crear y editar contactos manuales.

## Slice 3. Presentaciones y consumidor secundario

- Actualizar tabla y detalle de Contactos.
- Adaptar formularios y detalle de Grupos de destinatarios al nuevo contrato plural.

## Slice 4. Validación y cierre

- Ejecutar `npm run build` y `git diff --check`.
- Validar manualmente creación, edición, lectura, lista, contactos vinculados a Usuario y Grupos de destinatarios.
- Actualizar progreso, tareas e índice de la spec.
