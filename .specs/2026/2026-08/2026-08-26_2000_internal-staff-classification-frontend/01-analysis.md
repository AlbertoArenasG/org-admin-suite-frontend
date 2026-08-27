# Analysis

## Initiative

- Name: `internal-staff-classification-frontend`
- Date: `2026-08-26`

## Current State

- Usuarios, invitaciones y Contactos ya tienen sus superficies administrativas separadas.
- La relacion Usuario-Cliente es independiente de la clasificacion interna.
- La API materializa la clasificacion en Contactos vinculados y no permite editarlos desde el backoffice.
- `company_names` solo representa nombres de Clientes relacionados o nombres administrados manualmente; no identifica pertenencia interna.
- La API elimino el campo y el filtro derivado `type` de Contactos; sus consumidores deben migrar al booleano explicito.

## Findings

- Frontend debe enviar y pintar `is_internal_staff` como la unica fuente de clasificacion.
- Los formularios deben respetar el rol final: para `ADMIN` y `MASTER_ADMIN` no debe ofrecerse una eleccion que backend rechazara.
- Las invitaciones `USER` requieren una seleccion explicita antes de enviarse.
- Los Contactos manuales requieren su propia seleccion, sin depender de que tengan o no Usuario vinculado.
- Los listados de Usuarios y Contactos pueden filtrar directamente con el query opcional `is_internal_staff=true|false`; en Usuarios se puede combinar con los filtros de Cliente ya existentes.
- Contactos conserva consumidores internos de `type` en modelos, mapeos, tabla, detalle y grupos de destinatarios; deben migrar en conjunto a `is_internal_staff` para no mantener contratos eliminados.

## Risks

- Mostrar terminologia tecnica que no sea comprensible para usuarios de negocio.
- Duplicar validaciones de backend o permitir una UI inconsistente con las restricciones de roles.
- Conservar inferencias visuales obsoletas a partir de empresa o Cliente relacionado.
- Intentar editar clasificacion de Contactos vinculados a Usuarios, que backend protege como inmutables.
- Mantener tipos, filtros o mapeos de frontend que dependan del contrato eliminado `type`.

## Constraints

- Mantener los patrones de componentes, formularios, localizacion y tema ya establecidos.
- Todo nuevo componente compartido e insignia debe adaptarse a los temas existentes mediante tokens y variables del sistema; no introduce colores fijos ni variantes aisladas de tema.
- No agregar una dependencia de capabilities auxiliares para esta funcionalidad.
- Mantener separadas las superficies de Usuarios, Invitaciones y Contactos.
