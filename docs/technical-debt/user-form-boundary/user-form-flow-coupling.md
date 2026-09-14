# Acoplamiento de Flujos en el Formulario de Usuario Legacy

## Estado

| Campo                   | Valor                                      |
| ----------------------- | ------------------------------------------ |
| Estado                  | Identificada                               |
| Prioridad               | Alta                                       |
| Fecha de identificación | 9 de septiembre de 2026                    |
| Última revisión         | 9 de septiembre de 2026                    |
| Área                    | Administración de usuarios y límites de UI |
| Alcance actual          | Componente reutilizable y páginas legacy   |
| Dependencia             | Capability transversal de roles asignables |

## Resumen

`UserForm` representa actualmente dos intenciones de producto distintas:
invitar a un usuario y editar un usuario. Al añadir el alta directa se
introdujo un tercer modo, `direct-create`, y se ampliaron sus valores con
`password` y `confirmPassword`.

Esa ampliación no se limita al componente. `UserFormValues` es parte del
contrato entre `UserForm` y sus páginas consumidoras mediante `defaultValues`
y `onSubmit`. Por ello, invitación y edición tuvieron que incorporar valores de
contraseña vacíos para satisfacer el tipo compartido, aun cuando esos flujos no
renderizan ni envían contraseña.

## Alcance Verificado

| Capa                               | Afectación                                                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Componente                         | `UserForm` crea y transporta `password` y `confirmPassword` en su estado para todos los modos.                         |
| Páginas de invitación y edición    | Sus `defaultValues` tipados como `UserFormValues` incluyen contraseñas vacías. Sus callbacks reciben esas propiedades. |
| Thunk de edición                   | No recibe ni serializa contraseña.                                                                                     |
| Endpoint `PATCH /v1/users/:userId` | No recibe contraseña por este flujo.                                                                                   |
| Invitación                         | No envía contraseña al endpoint de invitaciones.                                                                       |

No existe impacto actual en el contrato HTTP de edición o invitación. Sí existe
acoplamiento innecesario entre contratos de UI y entre páginas legacy.

## Impacto

- Un tipo compartido mezcla campos propios de alta directa con flujos que no
  los necesitan.
- Cada nuevo modo del formulario aumenta el riesgo de propagar campos y reglas
  ajenos a otros flujos.
- El componente deja de tener una responsabilidad cohesionada y su modo se
  convierte en un conmutador de procesos de negocio distintos.
- La migración futura del módulo de usuarios será más costosa si se sigue
  ampliando el formulario compartido.

## Solución Objetivo

Durante la migración del módulo de usuarios, sustituir `UserForm` por
formularios orientados a intención:

- `InviteUserForm` para invitación.
- `CreateUserForm` para alta directa con contraseña y confirmación.
- `EditUserForm` para actualización de perfil y asignaciones.

Solo podrán extraerse componentes de presentación o secciones de campos que
sean realmente comunes, por ejemplo identidad básica, teléfono o asociación de
clientes. Cada formulario debe definir su propio tipo de valores, validación y
payload; ningún formulario debe transportar campos que no pertenecen a su
operación.

## Dependencia Técnica

La deuda de [roles asignables](../user-role-assignment-options/role-options-capability-inconsistency.md)
ya quedó resuelta mediante una capability auxiliar transversal. Cualquier
resolución futura de este acoplamiento debe consumir esa fuente de opciones y
mantener valores, schemas y payloads separados por intención; no debe recrear
rutas ni permisos específicos para invitación, creación o edición.

## Criterios de Cierre

- Cada flujo usa un formulario y tipo de valores propios.
- Editar e invitar no inicializan, validan ni transportan contraseña.
- Los campos reutilizados son componentes de presentación sin mezclar los
  contratos de submit de los flujos.
- Los tres flujos consumen la capability transversal de roles asignables.
- Se verifican manual o automáticamente los payloads de invitación, creación y
  edición.

## Historial

| Fecha                   | Estado       | Nota                                                                                   |
| ----------------------- | ------------ | -------------------------------------------------------------------------------------- |
| 9 de septiembre de 2026 | Identificada | Detectada al agregar contraseña al tipo compartido de `UserForm` para el alta directa. |
