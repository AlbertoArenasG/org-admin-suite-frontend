# Recetas De Toasts

**Estado:** Adoptadas en `/dashboard-playground/catalog/toasts`.

## Promesa Mínima

Es la receta predeterminada para acciones cuyo resultado debe permanecer fuera
del recurso que la inició, como creación, eliminación, navegación o procesos
de fondo. Usa `showToastPromise` para conservar un único toast entre
`loading` y el resultado final. El éxito muestra únicamente un título y
su duración se define en cada invocación; el error puede incluir una
descripción cuando aporta la causa.

No se agrega contenido expandido para repetir el título, el estado ni el nombre
del recurso.

## Mutación Local

Una mutación cuyo contenedor permanece visible no muestra además un toast
global: usa `MutationFeedback` durante `saving` y `MutationRecovery` ante un
error remoto. El host lo determina el contenedor: `ResourceFormActions` en un
formulario, `DialogFooter` en un diálogo o el panel de acciones de un drawer.

Si el contenedor se cierra al resolver con éxito, como un diálogo de cambio de
contraseña, el éxito sí se comunica con toast global después de cerrarlo. Las
dos piezas usan la familia independiente `--feedback-*`; su apariencia puede
alinearse con Toast sin acoplarse a Sileo.

Usa `showToast({ type: 'success', title, duration })` para esa confirmación
posterior al cierre. `duration` es configurable por vista según el contexto.
No agregues `description`: la cápsula debe comunicar únicamente el resultado y
no repetir información fuera de contexto.

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

La geometría y la superficie se resuelven globalmente en el `Toaster` de
Sileo. Cada tema define `--toast-surface`; Nocturno usa una variante inversa
clara y el modo interno de Sileo se adapta para conservar el contraste del
contenido.
