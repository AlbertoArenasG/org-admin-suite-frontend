# Task List

## Shared UI

- [x] Crear `RadioGroup` reutilizable, accesible y adaptado al tema.
- [x] Crear helper de insignias y tooltip para clasificación de Usuario, Invitación y Contacto.
- [x] Agregar copies localizados en español e inglés.

## Contracts And State

- [x] Añadir `isInternalStaff` a los tipos, mapeos y payloads de Usuarios e Invitaciones.
- [x] Reemplazar `ContactType`, `type` y `typeLabel` por `isInternalStaff` en Contactos y Grupos de destinatarios.
- [x] Incluir `is_internal_staff` en los query params y estado de filtro de Usuarios y Contactos.

## Surfaces

- [ ] Integrar el `RadioGroup` en invitación, edición de Usuario y formularios de Contacto manual.
- [ ] Implementar reglas visuales para `ADMIN` y `MASTER_ADMIN`.
- [ ] Agregar filtros de personal a los toolbars de Usuarios y Contactos.
- [ ] Agregar insignias a listados y detalles pertinentes.

## Validation

- [ ] Ejecutar `npm run build` y `git diff --check`.
- [ ] Realizar validación manual de formularios, filtros, insignias, tema claro y oscuro.
