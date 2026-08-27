# Technical Design

## Contract Boundary

`companyNames: string[]` reemplaza de forma definitiva a `companyName` en los contratos internos de Contactos y Grupos de destinatarios.

Los adaptadores de API:

- leen `company_names` desde las respuestas;
- envían `company_names` en creación y actualización, incluido `[]`;
- no conservan una propiedad singular derivada del primer elemento.

## Components

Los componentes viven dentro del feature `contacts`; no se crea una abstracción global para un concepto específico de Contactos.

- `CompanyNamesField`: controla la entrada temporal, agregado, remoción, trim y prevención de duplicados en formularios de contactos manuales.
- `CompanyNamesSummary`: muestra la primera empresa y `+N` cuando corresponda; expone la lista completa mediante tooltip.
- `CompanyNamesChips`: muestra la lista completa como chips de solo lectura para el detalle.

Los componentes de presentación se reutilizan en las superficies de Contactos y en Grupos de destinatarios cuando la composición lo permita. Se deben ajustar a los temas existentes de la aplicación.

## Surface Behavior

| Surface                      | Representation                                           |
| ---------------------------- | -------------------------------------------------------- |
| Lista de Contactos           | Resumen con primera empresa, contador y tooltip.         |
| Crear/editar contacto manual | Campo repetible de nombres de empresa.                   |
| Detalle de Contacto          | Chips de solo lectura con todos los nombres.             |
| Contacto vinculado a Usuario | Empresas visibles, sin edición manual.                   |
| Grupos de destinatarios      | Resumen compatible de la lista, sin rediseñar el módulo. |

## State Rules

El formulario mantiene `companyNames` como arreglo. Cada valor se limpia antes de agregarse; valores vacíos o duplicados no ingresan al estado. La eliminación actualiza el arreglo y el payload resultante conserva `company_names`, incluso vacío.

La transformación de contratos se concentra en `features/contacts` y `features/recipient-groups`; las vistas consumen los tipos internos ya normalizados.
