# Analysis

## Current Frontend State

El frontend usa `companyName` singular en:

- `features/contacts/types.ts`
- `features/contacts/contactsThunks.ts`
- `features/contacts/contactsSlice.ts`
- `components/contacts/types.ts`
- `components/contacts/ContactForm.tsx`
- `components/contacts/useContactsTableData.ts`
- `components/contacts/useContactsTableColumns.tsx`
- `app/dashboard/contacts/[contactId]/page.tsx`

También existe un consumidor secundario en `features/recipient-groups/recipientGroupsThunks.ts`.

## Confirmed Backend Contract

La API entrega `company_names: string[]` en el listado, búsqueda y detalle de Contactos. Creación y actualización reciben opcionalmente `company_names: string[]`; una lista vacía y múltiples nombres son válidos.

Los Contactos vinculados a Usuario son inmutables desde backoffice y sus nombres de empresa se derivan exclusivamente de sus relaciones con Clientes.

## Risks

- Mantener un mapeo de `company_name` causa datos vacíos o errores tras el cambio de API.
- Representar varios nombres como texto sin una regla consistente puede saturar la tabla.
- Los contactos vinculados a Usuario son inmutables desde backoffice y sus empresas provienen de sincronización; el formulario no debe habilitar su edición.
