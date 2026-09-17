# Recetas De Toasts

**Estado:** Adoptadas en `/dashboard-playground/catalog/toasts`.

## Promesa Mínima

Es la receta predeterminada para crear, editar o guardar un recurso. Usa
`showSnackbarPromise` para conservar un único toast entre `loading` y el
resultado final. El éxito muestra únicamente un título y permanece cuatro
segundos; el error puede incluir una descripción cuando aporta la causa.

No se agrega contenido expandido para repetir el título, el estado ni el nombre
del recurso.

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
