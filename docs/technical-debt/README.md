# Deuda Técnica

## Propósito

Esta carpeta registra deuda técnica identificada y pendiente de atender. Cada
tema debe tener su propia subcarpeta y documento para conservar su contexto,
estado, fechas, referencias y criterios de cierre.

## Estructura

```text
docs/technical-debt/
├─ README.md
└─ session-hydration/
   └─ auth-me-endpoint-inconsistency.md
└─ user-role-assignment-options/
   └─ role-options-capability-inconsistency.md
└─ user-form-boundary/
   └─ user-form-flow-coupling.md
└─ system-role-type-ownership/
   └─ system-role-type-ownership.md
└─ customer-service-records-list-filter-options/
   └─ list-filter-options-boundary.md
```

## Mantenimiento

- Crear un expediente por tema; no agrupar incidencias no relacionadas.
- Registrar la fecha de identificación y actualizar la fecha de última
  revisión cada vez que cambie su estado o análisis.
- Mantener el estado como `identificada`, `planificada`, `en progreso`,
  `resuelta` o `descartada`.
- Al resolver una deuda, conservar el expediente y documentar la decisión, la
  fecha de cierre y las pruebas realizadas.

## Expedientes Activos

- [Inconsistencia del endpoint para recuperar la sesión](session-hydration/auth-me-endpoint-inconsistency.md)
- [Inconsistencia de la capability de roles asignables](user-role-assignment-options/role-options-capability-inconsistency.md)
- [Acoplamiento de flujos en el formulario de usuario legacy](user-form-boundary/user-form-flow-coupling.md)
- [Propiedad inconsistente del tipo de rol de sistema](system-role-type-ownership/system-role-type-ownership.md)
- [Consumo cruzado de opciones de cliente en el listado de registros de servicio](customer-service-records-list-filter-options/list-filter-options-boundary.md)
