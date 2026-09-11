# Decisiones

## Decisión 01. Contrato remoto propietario

**Estado:** approved

Frontend consumirá `GET /v1/roles/options`. El endpoint, capability
`ROLES/READ_OPTIONS`, derivación y jerarquía pertenecen a backend y no se
replican en estado ni gating de interfaz.

## Decisión 02. Thunk y estado compartidos

**Estado:** approved

Los tres flujos usarán un único thunk y el estado existente de opciones de
roles dentro de `features/users`. Se retirarán los dos thunks legacy después
de migrar todos sus consumidores.

## Decisión 03. Frontera de formularios

**Estado:** approved

Esta iniciativa no modifica `UserForm`. La separación de formularios requiere
primero un componente genérico de formularios y se resolverá durante su futura
migración a Next Dashboard.
