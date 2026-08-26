import type { AuthSystemRole } from '@/features/auth/types';
import type { CustomerRelationshipSummary } from '@/features/customers';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type UserRegistrationInvitationStatus = 'PENDING' | 'CONSUMED' | 'REVOKED';
export type InvitationDeliveryStatus = 'ACCEPTED' | 'FAILED' | null;
export type InvitationSortField = 'status' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export interface UserRegistrationInvitation {
  invitationId: string;
  email: string;
  status: UserRegistrationInvitationStatus;
  statusName: string;
  systemRole: Exclude<AuthSystemRole, 'MASTER_ADMIN'>;
  systemRoleName: string;
  roleId: string | null;
  roleName: string | null;
  createdAt: string | null;
  consumedAt: string | null;
  revokedAt: string | null;
  emailDelivery: {
    lastAttemptAt: string | null;
    lastAttemptStatus: InvitationDeliveryStatus;
  };
  resendCount: number;
  customers?: CustomerRelationshipSummary[];
}

export interface UserRegistrationInvitationsFilters {
  status: UserRegistrationInvitationStatus | null;
}

export interface UserRegistrationInvitationsSort {
  field: InvitationSortField;
  direction: SortDirection;
}

export interface FetchUserRegistrationInvitationsParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string | null;
  filters?: Partial<UserRegistrationInvitationsFilters>;
  sorts?: UserRegistrationInvitationsSort[];
}

export interface FetchUserRegistrationInvitationsResult {
  items: UserRegistrationInvitation[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface UserRegistrationInvitationMutationError {
  message: string;
  status: number | null;
}

export interface CreateUserRegistrationInvitationPayload {
  email: string;
  systemRole: Exclude<AuthSystemRole, 'MASTER_ADMIN'>;
  roleId: string;
  name: string;
  lastname: string;
  cellPhone: {
    countryCode: string;
    number: string;
  } | null;
  customerIds?: string[];
}

export interface UserRegistrationInvitationsState {
  list: {
    items: UserRegistrationInvitation[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  mutations: {
    create: {
      status: RequestStatus;
      error: string | null;
      message: string | null;
    };
    resend: {
      status: RequestStatus;
      targetId: string | null;
      error: string | null;
      message: string | null;
    };
    revoke: {
      status: RequestStatus;
      targetId: string | null;
      error: string | null;
      message: string | null;
    };
  };
}
