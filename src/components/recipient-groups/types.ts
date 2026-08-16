import type {
  RecipientGroupDetail,
  RecipientGroupListItem,
  RecipientGroupStatusId,
} from '@/features/recipient-groups/types';

export interface RecipientGroupsTableRow {
  recipientGroupId: string;
  name: string;
  code: string;
  description: string | null;
  enabledChannels: RecipientGroupListItem['enabledChannels'];
  channelsLabel: string;
  contactsCount: number;
  statusId: RecipientGroupStatusId;
  statusLabel: string;
  createdAt: string | null;
  source: RecipientGroupListItem;
}

export interface RecipientGroupFormValues {
  name: string;
  description: string;
  enabledChannels: string[];
  contactIds: string[];
}

export function buildRecipientGroupInitialValues(
  recipientGroup?: RecipientGroupDetail | null
): RecipientGroupFormValues {
  return {
    name: recipientGroup?.name ?? '',
    description: recipientGroup?.description ?? '',
    enabledChannels: recipientGroup?.enabledChannels.map((channel) => channel.code) ?? [],
    contactIds: recipientGroup?.contacts.map((contact) => contact.contactId) ?? [],
  };
}

export function buildContactLookupLabel(contact: {
  companyName: string | null;
  primaryEmail: string | null;
  primaryCellPhone: string | null;
}) {
  return [contact.companyName, contact.primaryEmail, contact.primaryCellPhone]
    .filter(Boolean)
    .join(' · ');
}
