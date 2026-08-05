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
