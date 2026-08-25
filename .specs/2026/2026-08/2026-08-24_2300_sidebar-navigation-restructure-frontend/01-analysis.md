# Analysis

## Current Navigation

`src/components/sidebar/AppSidebar.tsx` concentra actualmente:

- construccion de los items de navegacion
- evaluacion de modulos y permisos
- resolucion de la ruta activa
- secciones visuales `operation`, `configuration` y `administration`
- estado de la seccion expandida
- logo, cuenta y accesos de tema e idioma

`NavMain` renderiza secciones, modulos y subitems. `NavUser` renderiza la cuenta autenticada y sus acciones de perfil/cierre de sesion. `SidebarLogo` es visual y estatico.

La concentracion de estas responsabilidades en `AppSidebar` dificulta introducir grupos, variantes responsivas y componentes de cuenta sin aumentar excesivamente su complejidad.

## Current Surfaces

| Superficie                 | Regla actual de visibilidad                   | Etiqueta actual |
| -------------------------- | --------------------------------------------- | --------------- |
| Dashboard                  | Siempre incluido en sidebar                   | operation       |
| Usuarios                   | `USERS`, crear invitacion o leer invitaciones | administration  |
| Roles                      | `ROLES/READ`                                  | administration  |
| Politicas de vencimiento   | lectura de alguna politica                    | configuration   |
| Control de activos y pagos | leer o crear registros internos               | operation       |
| Destinatarios              | leer contactos o grupos                       | configuration   |
| Clientes                   | modulo `CUSTOMERS`                            | operation       |
| Proveedores                | modulo `PROVIDERS`                            | operation       |
| Servicios                  | algun modulo de servicios                     | operation       |

## Invariants To Preserve

- Dashboard es accesible por autenticacion, no por permiso de modulo.
- Un modulo o subitem solo se muestra si cumple su regla actual de modulo/operacion.
- Un grupo no se muestra cuando no contiene superficies visibles.
- Una ruta directa identifica y activa su grupo correspondiente.
- Los subitems de un modulo conservan sus reglas independientes.
- No se cambian contratos ni autorizacion backend.

## Initial Architectural Direction

La reestructura debe separar:

- configuracion tipada de navegacion y grupos
- resolucion de visibilidad a partir de permisos existentes
- resolucion del grupo y modulo activos a partir de la ruta
- rail de grupos
- panel contextual de navegacion
- cuenta y preferencias
- variantes de escritorio y movil

La configuracion frontend describe organizacion visual, rutas e iconos. No representa una segunda fuente de verdad de autorizacion.
