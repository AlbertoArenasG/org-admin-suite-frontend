import type {
  InvitationDeliveryStatus,
  UserRegistrationInvitation,
  UserRegistrationInvitationStatus,
} from '@/features/user-registration-invitations';

export interface UserRegistrationInvitationsTableRow {
  invitationId: string;
  email: string;
  roleLabel: string;
  systemRoleLabel: string;
  status: UserRegistrationInvitationStatus;
  statusLabel: string;
  statusDate: string | null;
  lastAttemptAt: string | null;
  lastAttemptStatus: InvitationDeliveryStatus;
  resendCount: number;
  createdAt: string | null;
  hasDeliveryFailure: boolean;
  source: UserRegistrationInvitation;
}
