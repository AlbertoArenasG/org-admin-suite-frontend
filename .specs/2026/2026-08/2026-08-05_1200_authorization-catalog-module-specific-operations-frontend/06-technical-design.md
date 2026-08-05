# Technical Design

## Estado

Pendiente de definición detallada.

## Dirección Técnica Esperada

Este documento deberá aterrizar:

- el contrato backend final que consumirá frontend
- el shape interno del catálogo enriquecido por módulo
- la estrategia de render del editor de permisos
- el tratamiento visual de operaciones no-CRUD o sensibles
- el impacto en consumers secundarios y docs vivas
- la separación contractual entre `READ` y `READ_PUBLIC_ACCESS` para `customers` y `providers`, incluyendo:
  - qué pantallas autenticadas podrán solicitar el acceso público sensible
  - cómo se pedirá el nuevo endpoint sin volver a exponer `public_access_url` ni `public_access_token` en responses normales
  - cómo debe degradar la UI cuando el usuario tenga `READ` pero no tenga `READ_PUBLIC_ACCESS`

## Contrato Base Ya Aterrizado

- frontend debe consumir `GET /v1/roles/modules` como contrato único del catálogo de módulos y operaciones
- frontend no debe depender de `GET /v1/roles/operations`
- el editor debe respetar el orden de `operations[]` tal como backend lo entregue
- la disponibilidad visual de una operación depende exclusivamente de si backend la publica en el módulo correspondiente
- mientras backend no publique `ROLES/ACTIVATE` dentro de `operations[]`, frontend no debe modelarla como operación viva del editor
- `GET /v1/users/roles` seguirá funcionando como catálogo auxiliar absorbido por `USERS/READ` para create, invite y edit de usuarios
- `POST /v1/users` queda fuera del scope normal de negocio y no debe reaparecer en UI ordinaria

## Ajustes Técnicos Ya Identificados

- `customers` y `providers` requieren separar el acceso público sensible del shape normal de detalle/listado en frontend
- esa separación implica:
  - sacar `publicAccessToken` y `publicAccessUrl` del estado base normal de `Customer` y `Provider`, o al menos dejar de depender de ellos como parte del fetch ordinario
  - introducir un request dedicado para consultar acceso público sensible solo cuando la UI realmente lo necesite
  - condicionar esa acción en UI al permiso efectivo `READ_PUBLIC_ACCESS` del módulo correspondiente
- en `users` no hace falta migrar una vista existente fuera de `POST /v1/users`, porque el frontend ordinario ya trabaja por invitaciones; la obligación técnica es no reintroducir un alta directa normal en esta iniciativa

## Shape Interno Objetivo En Frontend

### Principio

- frontend no debe inventar un catálogo alterno ni un modelo semántico paralelo
- el shape interno debe ser un mapeo tipado y estable del contrato backend, con utilidades de UI encima pero sin reinterpretar el dominio

### Catálogo del editor de roles

El shape actual de `RoleModuleCatalogItem` va en la dirección correcta y debe conservar esta idea base:

- un módulo con metadata propia
- una lista ordenada de operaciones válidas para ese módulo
- labels y `nameKey` ya resueltos desde backend

Estructura objetivo:

```ts
interface RoleModuleCatalogItem {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleNameKey: string;
  statusId: string;
  isSystem: boolean;
  operations: Array<{
    operationId: string;
    operationCode: string;
    operationName: string;
    operationNameKey: string;
    statusId: string;
    isSystem: boolean;
  }>;
}
```

Reglas:

- `operations[]` debe conservar exactamente el orden entregado por backend
- frontend no debe completar operaciones faltantes
- frontend no debe reordenar para “forzar CRUD”
- cualquier ayuda de UX, como autoactivar `READ`, vive fuera de este DTO

### Autorización efectiva del usuario autenticado

El shape actual de `AuthAuthorization` también es válido como capa separada del catálogo editable:

```ts
interface AuthAuthorization {
  role: AuthRoleMetadata | null;
  modules: AuthModuleAccess[];
  permissions: AuthPermissionAccess[];
}
```

Reglas:

- `auth/me/permissions` sigue siendo la fuente para navegación, guards de UI y acciones rápidas
- `roles/modules` sigue siendo la fuente para construir el editor de permisos
- no conviene fusionar ambos shapes en un único store ni en un único DTO “universal”

### Estado local de UI permitido

Sí vale la pena mantener estado local derivado para interacción, por ejemplo:

- `Set<RolePermissionKey>` para selección temporal en formularios
- helpers como `buildPermissionKey(...)`
- sanitización contra el catálogo activo recibido

Pero ese estado:

- debe derivarse del catálogo backend
- no debe convertirse en otra fuente de verdad

### Customers y providers

Para `customers` y `providers`, el shape objetivo debe separar:

- detalle/listado ordinario del recurso
- acceso público sensible consultado bajo demanda

Dirección recomendada:

- `Customer` y `Provider` dejan de asumir `publicAccessToken` y `publicAccessUrl` en su shape normal
- si una vista necesita mostrar o copiar ese acceso, debe usar un DTO separado para public access
- ese DTO debe vivir en el módulo correspondiente y no mezclarse con el fetch ordinario

### Consecuencia de diseño

- el frontend quedará con dos planos explícitos y limpios:
  - catálogo editable de roles
  - autorización efectiva del actor autenticado
- y, además, con recursos sensibles desacoplados de los payloads ordinarios cuando backend ya los separó así

## Reglas De Render Para Operaciones No CRUD O Sensibles

### Regla 1. Render guiado por catálogo real

- el editor debe renderizar exactamente las operaciones que backend entregue en `GET /v1/roles/modules`
- frontend no debe completar operaciones faltantes ni fabricar una cuadrícula CRUD uniforme

### Regla 2. Semántica visual base uniforme

- toda operación válida de un módulo se muestra con la misma semántica visual base
- operaciones como `READ`, `DELETE` o `READ_PUBLIC_ACCESS` no requieren un layout especial por sí mismas dentro del editor

### Regla 3. Orden visual respetado

- el orden de `operations[]` debe respetarse tal como backend lo entregue
- frontend no debe reordenar las operaciones para imponer un orden conceptual distinto

### Regla 4. Labels y nombres desde backend

- los labels visibles del catálogo deben salir de `module_name`, `operation_name`, `module_name_key` y `operation_name_key`
- frontend no debe hardcodear nombres semánticos propios para módulos u operaciones del catálogo

### Regla 5. Operaciones ausentes no se renderizan

- si backend no publica una operación dentro del módulo, frontend no debe mostrar control para asignarla
- mientras `ROLES/ACTIVATE` no aparezca en el catálogo vivo de backend, el editor no debe renderizarla como opción asignable

### Regla 6. Ayudas de UX permitidas

- frontend sí puede aplicar ayudas locales de captura siempre que no reinterpreten el catálogo fuente
- la ayuda aprobada para esta iniciativa es:
  - si el usuario activa cualquier operación distinta de `READ`, frontend activa `READ` automáticamente
  - mientras exista otra operación activa en ese módulo, `READ` no puede desactivarse

### Regla 7. Sensibilidad gobernada por permiso, no por layout especial

- una operación sensible como `READ_PUBLIC_ACCESS` se muestra como una operación más del módulo
- su sensibilidad se gobierna por el catálogo backend y por el permiso efectivo, no por una categoría visual separada dentro del editor

## Impacto En Copy, Hints Y Docs Frontend Vivas

### Fuente de verdad de copies funcionales

- los copies funcionales del catálogo deben venir de backend
- eso incluye nombres visibles de módulos y operaciones
- frontend debe apoyarse en:
  - `module_name`
  - `module_name_key`
  - `operation_name`
  - `operation_name_key`

### Qué sí puede seguir viviendo en frontend

Frontend sí puede conservar textos propios cuando no describen el dominio del catálogo sino la interacción local de la UI, por ejemplo:

- títulos de página
- textos de carga, error y éxito
- hints de captura local
- copy de confirmaciones y diálogos
- ayudas de UX como la explicación de `READ` implícito

### Qué no debe seguir hardcodeado en frontend como verdad del catálogo

- nombres canónicos de módulos
- nombres canónicos de operaciones
- supuestos semánticos del tipo “este módulo siempre es CRUD”
- etiquetas funcionales inventadas para operaciones que backend ya nombra y localiza

### Docs frontend vivas

- cualquier doc viva de integración frontend que describa el catálogo o sus labels debe alinearse a backend como fuente de verdad
- la spec debe asumir que, si backend cambia el catálogo o su localización, frontend debe absorber el cambio sin redefinir semántica en archivos locales
