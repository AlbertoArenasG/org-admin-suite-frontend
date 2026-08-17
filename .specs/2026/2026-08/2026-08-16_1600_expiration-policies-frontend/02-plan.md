# Plan

## Objective

Definir e implementar la base frontend administrativa de:

- `expiration_status_policies`
- `expiration_notification_policies`

sin mezclar todavía su consumo dentro de `internal-asset-control`.

## Planned Sequence

1. Cerrar definición de alcance, navegación y estructura de pantallas.
2. Definir estado frontend y contratos realmente necesarios.
3. Implementar primero el módulo más simple estructuralmente.
4. Implementar el segundo módulo reutilizando patrones compartidos cuando convenga.
5. Validar flujos principales y dejar la spec lista para cierre.

## Out Of Scope

- integración de estas políticas dentro de `internal-asset-control`
- automatizaciones o visualizaciones consumidoras específicas de otro módulo
