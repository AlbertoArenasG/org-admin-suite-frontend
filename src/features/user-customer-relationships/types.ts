export type RelationshipRequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface CustomerRelatedUser {
  id: string;
  name: string;
  lastname: string;
  fullName: string;
  email: string;
  systemRoleName: string;
  status: string;
  statusName: string;
}

export interface CustomerAvailableUser {
  id: string;
  name: string;
  lastname: string;
  fullName: string;
  email: string;
}

export interface CustomerRelatedUsersResult {
  users: CustomerRelatedUser[];
  pagination: { page: number; perPage: number; total: number; totalPages: number };
}

export interface UserCustomerRelationshipMutationError {
  message: string;
  status: number | null;
}

export interface UserCustomerRelationshipsState {
  related: {
    status: RelationshipRequestStatus;
    error: string | null;
    customerId: string | null;
    users: CustomerRelatedUser[];
    pagination: CustomerRelatedUsersResult['pagination'] | null;
  };
  available: {
    status: RelationshipRequestStatus;
    error: string | null;
    customerId: string | null;
    users: CustomerAvailableUser[];
  };
  mutation: {
    status: RelationshipRequestStatus;
    error: string | null;
    customerId: string | null;
  };
}
