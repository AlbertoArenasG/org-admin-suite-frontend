import type {
  ContactDetail,
  ContactListItem,
  ContactStatusId,
  ContactValue,
} from '@/features/contacts/types';

export interface ContactsTableRow {
  contactId: string;
  fullName: string;
  companyNames: string[];
  primaryEmail: string | null;
  primaryCellPhone: string | null;
  isInternalStaff: boolean;
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
  companyNames: string[];
  isInternalStaff: boolean | null;
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
