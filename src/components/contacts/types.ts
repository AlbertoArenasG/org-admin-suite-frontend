import type {
  ContactDetail,
  ContactListItem,
  ContactStatusId,
  ContactType,
  ContactValue,
} from '@/features/contacts/types';

export interface ContactsTableRow {
  contactId: string;
  fullName: string;
  companyName: string | null;
  primaryEmail: string | null;
  primaryCellPhone: string | null;
  type: ContactType;
  typeLabel: string;
  statusId: ContactStatusId;
  statusLabel: string;
  userId: string | null;
  canMutate: boolean;
  createdAt: string | null;
  source: ContactListItem;
}

export type ContactFormMode = 'create' | 'edit';

export interface ContactFormValues {
  name: string;
  lastname: string;
  companyName: string;
  emails: ContactValue[];
  phones: ContactValue[];
  cellPhones: ContactValue[];
}

export interface ContactMutability {
  isLinkedToUser: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function isContactLinkedToUser(
  contact: Pick<ContactListItem | ContactDetail, 'userId'> | null
) {
  return Boolean(contact?.userId);
}
