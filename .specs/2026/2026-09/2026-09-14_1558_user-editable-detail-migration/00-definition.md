# Migración de Detalle Editable de Usuario

## Estado

- Definition status: completed
- Implementation status: completed
- Spec status: completed

## Problema

Usuarios mantiene dos vistas legacy separadas: detalle en
`/dashboard/users/[userId]` y edición en `/dashboard/users/[userId]/edit`.
La edición reutiliza `UserForm`, que mezcla intenciones de creación, invitación
y edición. La nueva fundación de formularios permite conservar una sola vista
canónica de detalle editable, pero aún no se ha integrado con el recurso.

## Resultado Esperado

La ruta canónica de detalle de Usuario presenta la misma topología en lectura y
edición, utiliza un formulario de dominio propio y separa la mutación global
de datos de la operación independiente de cambio de contraseña.

## Alcance Incluido

- Migrar `/dashboard/users/[userId]` a detalle editable dentro de Next
  Dashboard.
- Redirigir la ruta legacy `/dashboard/users/[userId]/edit` a la ruta canónica.
- Usar una instancia RHF y schema Zod propios para la actualización ordinaria.
- Componer grupos de datos generales/contacto y acceso/alcance dentro de un
  único formulario editable.
- Guardar los datos ordinarios mediante una única mutación `PATCH /v1/users/:id`.
- Exponer cambio de contraseña en un `Dialog` breve e independiente que consume
  `PATCH /v1/users/:id/password`.
- Adoptar como base el componente Phone Input de shadcn-phone-input y limitar
  su selector a México, Estados Unidos y Canadá.
- Usar modo editable controlado propio, una familia local reutilizable de
  combobox para rol y clientes, `Dialog` canónico para cambio de contraseña y
  un Phone Input propio.
- Respetar permisos, jerarquía, estados de carga/error, temas, responsive y
  accesibilidad.

## Alcance Excluido

- Migrar creación directa o invitación de Usuarios.
- Cambiar contratos backend, permisos, jerarquía o el lookup transversal de
  roles asignables.
- Resolver la deuda general de ownership de `SystemRole` fuera de los nuevos
  artefactos que esta ruta requiera.
- Definir una biblioteca visual obligatoria para todos los formularios futuros.
- Introducir adjuntos, navegación intraformulario o un overlay multi-sección.

## Decisiones Cerradas

- `/dashboard/users/[userId]` es la ruta canónica de detalle editable; no habrá
  una segunda UI de edición.
- En modo lectura se conserva la misma estructura sin controles ni acciones no
  autorizadas.
- La actualización ordinaria es atómica y usa acciones globales de guardar y
  cancelar.
- El cambio de contraseña es una operación independiente desde las acciones de
  header y abre un `Dialog` con su propio submit.
- La composición, RHF, Zod, permisos y adaptadores de payload son propios de
  la aplicación. Shark es opcional; bloques Pro de shadcn.io y botones de otras
  familias se evalúan por artefacto y no definen el comportamiento de dominio.
- La edición ordinaria comunica guardado, éxito y error en su host local. El
  cambio de contraseña conserva feedback local mientras el diálogo existe y
  comunica éxito con un toast al cerrarse.

## Decisiones Abiertas

No quedan decisiones de producto abiertas. La inspección técnica de archivos y
dependencias de los componentes externos es obligatoria antes de implementarlos.

## Criterios Iniciales de Aceptación

- Un actor con `USERS/READ` puede consultar el detalle; sin capacidad de
  actualización lo observa en modo lectura.
- Un actor con `USERS/UPDATE` y jerarquía permitida puede entrar, cancelar y
  confirmar una edición global sin duplicar ruta.
- Rol, `is_internal_staff` y clientes respetan las condiciones del contrato:
  clientes solo para objetivo `USER`; roles administrativos fuerzan personal
  interno.
- El cambio de contraseña solo aparece con `USERS/UPDATE_PASSWORD` y jerarquía
  permitida, incluido objetivo propio con esa capability.
- La contraseña nunca forma parte del schema ni payload de edición ordinaria.
- La ruta legacy de edición conserva compatibilidad mediante redirección.
- Correo electrónico es editable dentro de la mutación global. Frontend valida
  formato y backend conserva la validación de unicidad; no se agrega
  notificación ni verificación de correo en este alcance.
- El selector telefónico presenta solo México, Estados Unidos y Canadá.
- El modo editable no depende de `SharkEditable`; la ruta controla lectura y
  edición. Rol usa `FormCombobox`, clientes usa `FormMultiSelect`, contraseña
  usa el `Dialog` canónico y teléfono usa un Phone Input propio. Las acciones
  permanecen intercambiables.

## Cierre

La ruta canónica, el redirect legacy, las dos mutaciones independientes y sus
gates de autorización fueron implementados y validados manualmente. La vista
adopta los patrones compartidos de Resource Form, feedback local, toast tras
cierre de diálogo, skeleton estructural y transición de contenido de Next
Dashboard. La migración de consumidores legacy de `useSnackbarStore` queda
fuera de este alcance.
