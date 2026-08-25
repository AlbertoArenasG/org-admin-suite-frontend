# Definition

## Purpose

Esta spec define la reestructura frontend de la navegacion principal para que el sidebar escale con nuevos modulos sin alterar el modelo backend de modulos, operaciones o permisos.

Reglas de trabajo:

- no iniciar implementacion mientras existan decisiones criticas pendientes
- la visibilidad de modulos y acciones conserva como fuente de verdad `hasModule` y `hasPermission`
- la agrupacion es una capa de presentacion frontend; no concede, deriva ni persiste permisos
- los componentes visuales, la configuracion de navegacion y la resolucion de visibilidad se mantendran separados
- no se incorpora panel derecho ni cambios backend dentro de esta spec

## Overall Status

- Initiative: `sidebar-navigation-restructure-frontend`
- Definition status: `complete`
- Implementation status: `completed`
- Validation status: `completed`

## Approved Scope

- Reestructurar la navegacion izquierda en dos niveles: rail de grupos y panel contextual de modulos.
- Mantener Dashboard fuera de grupos como acceso fijo para todo usuario autenticado.
- Dejar Dashboard sin cards, widgets ni consultas de negocio para una futura spec dedicada.
- Convertir el logo de la organizacion en acceso accesible a `/dashboard`.
- Mover la cuenta autenticada a un componente aislado al pie del shell.
- Concentrar perfil, tema, idioma y cierre de sesion dentro del menu de cuenta.
- Mantener la experiencia responsiva en escritorio expandido, escritorio colapsado y movil.
- Preservar rutas directas, estado activo y visibilidad por permisos actuales.
- Organizar los modulos con los grupos iniciales Operación, Directorio, Comunicación, Configuración y Administración.
- Mantener la pertenencia de cada entrada a un grupo como configuración de presentación fácilmente reasignable.
- Elevar la calidad percibida con jerarquía espacial, estados activos y transiciones fluidas inspiradas en Slack y Discord, sin copiar su estética ni alterar el lenguaje visual vigente.

## Explicitly Out Of Scope

- Panel derecho alternativo.
- Personalizacion funcional de Dashboard.
- Refactor de catalogos, permisos, guards o endpoints backend.
- Nuevas reglas de autorizacion o derivacion de permisos.

## Definition Closure

- Las decisiones de alcance, experiencia, permisos, responsive y arquitectura están cerradas.
- La implementación, verificación automática y validación manual finalizaron correctamente.
- Spec cerrada.
