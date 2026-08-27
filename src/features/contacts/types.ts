export type ContactStatusId = 'ACTIVE' | 'DELETED';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type SortDirection = 'asc' | 'desc';
export type ContactSortField = 'name' | 'lastname' | 'status' | 'created_at';

export interface ContactValue {
  value: string;
}

export interface ContactActorSummary {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface ContactListItem {
  contactId: string;
  isInternalStaff: boolean;
  userId: string | null;
  name: string;
  lastname: string;
  fullName: string;
  companyNames: string[];
  primaryEmail: string | null;
  primaryCellPhone: string | null;
  statusId: ContactStatusId;
  statusName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ContactSearchItem {
  contactId: string;
  isInternalStaff: boolean;
  userId: string | null;
  fullName: string;
  companyNames: string[];
  primaryEmail: string | null;
  primaryCellPhone: string | null;
}

export interface ContactDetail extends ContactListItem {
  emails: ContactValue[];
  phones: ContactValue[];
  cellPhones: ContactValue[];
  createdBy: ContactActorSummary | null;
  updatedBy: ContactActorSummary | null;
}

export interface ContactListFilters {
  status: ContactStatusId | null;
  isInternalStaff: boolean | null;
}

export interface ContactListSort {
  field: ContactSortField;
  direction: SortDirection;
}

export interface FetchContactsParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string | null;
  filters?: Partial<ContactListFilters>;
  sorts?: ContactListSort[];
}

export interface FetchContactsResult {
  items: ContactListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchContactsParams {
  q: string;
  limit?: number;
}

export interface ContactMutationPayload {
  name: string;
  lastname: string;
  companyNames: string[];
  emails: ContactValue[];
  phones: ContactValue[];
  cellPhones: ContactValue[];
  isInternalStaff?: boolean;
}

export type CreateContactPayload = ContactMutationPayload;

export interface UpdateContactPayload extends ContactMutationPayload {
  contactId: string;
}

export interface DeleteContactPayload {
  contactId: string;
}

export interface ContactsState {
  list: {
    items: ContactListItem[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    search: string;
    filters: ContactListFilters;
    sorts: ContactListSort[];
  };
  detail: {
    item: ContactDetail | null;
    status: RequestStatus;
    error: string | null;
    currentContactId: string | null;
  };
  search: {
    items: ContactSearchItem[];
    status: RequestStatus;
    error: string | null;
    query: string;
  };
  mutations: {
    createStatus: RequestStatus;
    updateStatus: RequestStatus;
    deleteStatus: RequestStatus;
    error: string | null;
    lastCreatedContactId: string | null;
    currentContactId: string | null;
    message: string | null;
  };
}
