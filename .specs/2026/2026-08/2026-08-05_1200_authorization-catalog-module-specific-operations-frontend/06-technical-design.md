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
