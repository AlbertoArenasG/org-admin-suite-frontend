# Definition

## Purpose

Actualizar el frontend administrativo de Contactos para consumir y editar el contrato `company_names` del API, reemplazando el campo singular obsoleto `company_name` / `companyName`.

## Scope

Superficies previstas:

- listado de contactos
- creación de contacto manual
- edición de contacto manual
- detalle de contacto
- contratos, mapeos y payloads del feature `contacts`

Fuera de alcance inicial:

- cambios en backend
- cambio de reglas de sincronización de contactos vinculados a usuarios
- rediseño del módulo de grupos de destinatarios

## Overall Status

- Initiative: `contacts-company-names-frontend`
- Definition status: `in progress`
- Implementation ready: `no`

---

## Decision 01. Alcance de consumidores del contrato de contacto

### Context

El feature `contacts` mantiene el contrato singular en sus tipos, thunks, tabla, formulario y detalle. Además, `recipientGroupsThunks` aún mapea `contact.company_name`, por lo que existe un consumidor adicional del contrato de respuesta.

Una transición solo visual de las cuatro superficies administrativas dejaría al menos un mapeo desalineado con el API.

### Options

1. Actualizar solo las cuatro superficies administrativas y dejar consumidores secundarios para una corrección posterior.
2. Actualizar todos los mapeos frontend que consumen datos de Contacto, pero limitar cambios visuales a la administración de Contactos.
3. Ampliar esta spec para rediseñar también los grupos de destinatarios alrededor de múltiples empresas.

### Recommendation

Opción 2.

La transición del contrato debe ser completa para no dejar fallos de mapeo. No hace falta ampliar la UX de grupos de destinatarios si esa superficie solo requiere conservar un resumen compatible del contacto.

### Decision Final

Se aprueba la opción 2.

La implementación actualizará todos los mapeos frontend que consumen contratos de Contacto, incluido el consumidor de grupos de destinatarios. Los cambios de interfaz quedan limitados al módulo administrativo de Contactos.

### Status

approved

---

## Decision 03. Reglas del campo repetible de empresas

### Context

Los Contactos manuales pueden tener cero, uno o varios nombres de empresa. El formulario debe evitar valores vacíos o duplicados antes de construir el payload.

### Recommendation

Usar una lista opcional que normalice cada valor en frontend y envíe siempre el arreglo canónico al API.

### Decision Final

Se aprueba:

- `companyNames` es una lista opcional.
- al agregar, se recortan espacios en los extremos;
- no se agregan duplicados;
- cada valor agregado puede removerse;
- creación y actualización envían siempre `company_names`, incluido `[]`.

### Status

approved

---

## Decision 02. Representación de múltiples empresas

### Context

`company_names` puede contener más de un nombre. La interfaz debe evitar que el listado se sature, pero permitir lectura completa y edición clara en las superficies que corresponden.

### Options

1. Mostrar todos los nombres como texto separado por comas en todas las superficies.
2. Resumen compacto en el listado, lista completa en detalle y campo repetible para contactos manuales.
3. Sustituir el campo por una selección desde el catálogo de Clientes.

### Recommendation

Opción 2.

Mantiene la densidad de la tabla, permite lectura completa donde hay espacio y reutiliza el patrón ya existente de valores repetibles. No confunde nombres de empresa con relaciones a entidades `Customer`.

### Decision Final

Se aprueba la opción 2.

- Listado: primera empresa y contador `+N` cuando aplique, con tooltip de lista completa.
- Detalle: todas las empresas como chips de solo lectura.
- Crear y editar contacto manual: campo repetible de nombres de empresa.
- Contacto vinculado a Usuario: empresas visibles, sin edición manual.

### Status

approved
