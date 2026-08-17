import type {
  ExpirationNotificationPolicyListItem,
  ExpirationNotificationPolicyStatusId,
} from '@/features/expiration-notification-policies/types';

export interface ExpirationNotificationPoliciesTableRow {
  expirationNotificationPolicyId: string;
  name: string;
  statusId: ExpirationNotificationPolicyStatusId;
  statusLabel: string;
  rulesCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  source: ExpirationNotificationPolicyListItem;
}
