# Analysis: Next Dashboard View Access Foundation

## Current State

- `useAuthorization` expone `hasPermission`, `hasModule` e `isReady` sobre el
  estado de autorización de Redux.
- El dashboard legacy mezcla autorización en `page.tsx`, contenedores y, en
  algunas tablas, mensajes de restricción tratados como error remoto.
- No existe un boundary compartido para autorización de vistas.
- Hay 36 páginas y 14 contenedores que consumen `useAuthorization`.
- Las tres vistas actuales de Next Dashboard difieren: Seguimiento protege en
  su contenedor y espera `isReady`; Registros de servicio protege desde su
  página, sin esa espera explícita; el detalle editable de Usuario no tiene
  aún una guardia explícita de entrada `USERS/READ`.

## Findings

- La protección de entrada pertenece a una frontera de vista, no al tipo de
  contenido que presente la vista. Debe servir del mismo modo para tablas,
  formularios, detalles y tableros.
- Montar un contenedor antes de resolver `READ` permite que efectos de URL,
  catálogos o fetch se activen sin que la persona tenga acceso a la vista.
- `AuthGuard` ya impide montar el dashboard antes de resolver sesión y
  autorización global; la fundación de vista no debe duplicar esa carga ni
  producir estados transitorios propios.
- Las acciones internas necesitan conocer capacidades como `CREATE`, `UPDATE`
  o `DELETE`, pero no deben convertirse en fronteras independientes de acceso
  de ruta.
- Los patrones legacy son evidencia del problema, no una norma para la nueva
  fundación.

## Design Direction To Evaluate

La dirección aprobada es un boundary compartido en la capa de Next Dashboard
que reciba el módulo y operación de entrada, no monte contenido sin
autorización, redireccione al dashboard y entregue capacidades del módulo a
descendientes. La ruta declara la política de entrada; el contenido se limita
a su responsabilidad funcional.

## Risks

- Convertir el boundary en un contenedor de negocio o transporte HTTP.
- Exponer un contexto global de permisos que pierda la frontera de cada vista.
- Forzar una migración del dashboard legacy junto con esta fundación.
- Duplicar fallbacks de carga o acceso en cada consumidor.
- Confundir guardia de UI con autorización efectiva de API.
