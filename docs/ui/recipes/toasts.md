# Recetas De Toasts

**Estado:** Adoptadas en `/dashboard-playground/catalog/toasts`.

## Promesa Mínima

Es la receta predeterminada para acciones cuyo resultado debe permanecer fuera
del recurso que la inició, como creación, eliminación, navegación o procesos
de fondo. Usa `showSnackbarPromise` para conservar un único toast entre
`loading` y el resultado final. El éxito muestra únicamente un título y
permanece cuatro segundos; el error puede incluir una descripción cuando aporta
la causa.

No se agrega contenido expandido para repetir el título, el estado ni el nombre
del recurso.

## Mutación Local De Formulario

Guardar cambios dentro de un detalle o edición no muestra además un toast
global: adopta la receta [Confirmación Local De
Guardado](./resource-form.md#confirmación-local-de-guardado).
`FormMutationFeedback` se renderiza en el host de las acciones del formulario
y usa la familia independiente `--feedback-*`; su apariencia puede alinearse
con Toast sin acoplarse a Sileo.

## Resumen Expandible

Se reserva para resultados que aportan cifras, pendientes o próximos pasos. El
contenido se envía como `description: ReactNode`; `duration` controla la vida
total del toast y `autopilot.collapse` cuánto tiempo permanece expandido.

Una receta expandible nueva debe:

- representar una operación repetible de negocio;
- aportar información accionable que el título no comunica;
- validarse primero en el laboratorio externo;
- incorporarse después al catálogo del frontend con su ejemplo y criterio de uso.

## Tema

La geometría y la superficie se resuelven globalmente en `SnackbarProvider`.
Cada tema define `--toast-surface`; Nocturno usa una variante inversa clara y
el modo interno de Sileo se adapta para conservar el contraste del contenido.
