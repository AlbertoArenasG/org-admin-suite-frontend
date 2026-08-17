import type {
  ExpirationStatusPolicyListItem,
  ExpirationStatusPolicyStatusId,
} from '@/features/expiration-status-policies/types';

export interface ExpirationStatusPoliciesTableRow {
  expirationStatusPolicyId: string;
  name: string;
  description: string | null;
  statusId: ExpirationStatusPolicyStatusId;
  statusLabel: string;
  rulesCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  source: ExpirationStatusPolicyListItem;
}
