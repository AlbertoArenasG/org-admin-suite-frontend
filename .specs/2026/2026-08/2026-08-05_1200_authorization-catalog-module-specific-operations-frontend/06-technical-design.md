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
