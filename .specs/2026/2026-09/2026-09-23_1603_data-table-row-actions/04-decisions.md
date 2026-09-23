# Decisions: DataTable Row Actions

## Actions Are Structured And Optional

**Decision:** sustituir `getRowActions` por `rowActions`, un contrato tipado,
opcional y extensible. Cada vista resuelve por fila su lista de acciones y
handlers autorizados.

**Reason:** evita JSX opaco dentro de `DataTable`, permite reutilizar la misma
fuente en ambos menus y no presupone que todas las tablas o filas tengan las
mismas acciones.

## Four Access Paths

**Decision:** `Ver detalle` se ofrece mediante folio enlazable, item de menu,
menu contextual y doble clic sobre una zona no interactiva.

**Reason:** el menu explicito es descubrible y accesible; folio y doble clic
son atajos. Clic simple sobre fila no navega.

## Discoverability

**Decision:** el trigger de tres puntos es persistente cuando existen acciones,
con tooltip solo sobre el control. No se anaden iconos de mano, tooltips sobre
datos ni `cursor-pointer` a toda la fila.

**Reason:** el trigger comunica acciones sin introducir ruido ni prometer una
accion de clic simple inexistente.

## Context Menu

**Decision:** crear una primitive local `ContextMenu` sobre Radix ya instalado.

**Reason:** evita dependencia nueva y mantiene la misma capa de wrappers que
el resto de primitives de UI. El menu contextual es complemento, no requisito
para descubrir o ejecutar acciones.

## Destructive Confirmation

**Decision:** crear `DestructiveConfirmationDialog` compartido para Next
Dashboard. No se reutiliza el `Sheet` legacy de eliminacion.

**Reason:** la migracion establece una experiencia visual y conductual
unificada. El dialogo compartido resuelve presentacion, foco y estados; la
vista conserva textos, sujeto, mutacion y feedback de negocio.

## Permission Ownership

**Decision:** la pagina conserva el boundary `READ`; el contenedor usa
`useDashboardViewAccess().can('UPDATE' | 'DELETE')` y genera solo acciones
permitidas.

**Reason:** reutiliza el patron institucional de Next Dashboard y mantiene la
seguridad final en backend.

## Deferred Work

La vista unificada de detalle/edicion, formularios y rutas futuras no se
preautorizan. Esta spec conserva las rutas actuales y solo navega hacia ellas.
