import type {
  ExpirationStatusPolicyDetail,
  ExpirationStatusPolicyOffset,
  ExpirationStatusPolicyStatusId,
} from '@/features/expiration-status-policies/types';

export interface ExpirationStatusPolicyRuleFormValue {
  ruleId?: string;
  label: string;
  colorHex: string;
  startOffset: ExpirationStatusPolicyOffset;
}

export interface ExpirationStatusPolicyFormValues {
  name: string;
  description: string;
  statusId: ExpirationStatusPolicyStatusId;
  rules: ExpirationStatusPolicyRuleFormValue[];
}

export function compareExpirationStatusPolicyOffsets(
  left: ExpirationStatusPolicyOffset,
  right: ExpirationStatusPolicyOffset
) {
  const weight = (offset: ExpirationStatusPolicyOffset) =>
    offset.years * 1000000 + offset.months * 10000 + offset.weeks * 100 + offset.days;

  return weight(left) - weight(right);
}

export function sortExpirationStatusPolicyRules(rules: ExpirationStatusPolicyRuleFormValue[]) {
  return [...rules].sort((left, right) =>
    compareExpirationStatusPolicyOffsets(left.startOffset, right.startOffset)
  );
}

export function buildExpirationStatusPolicyInitialValues(
  policy?: ExpirationStatusPolicyDetail | null
): ExpirationStatusPolicyFormValues {
  return {
    name: policy?.name ?? '',
    description: policy?.description ?? '',
    statusId: policy?.statusId ?? 'ACTIVE',
    rules:
      policy?.rules.map((rule) => ({
        ruleId: rule.ruleId,
        label: rule.label,
        colorHex: rule.colorHex,
        startOffset: {
          years: rule.startOffset.years,
          months: rule.startOffset.months,
          weeks: rule.startOffset.weeks,
          days: rule.startOffset.days,
        },
      })) ?? [],
  };
}
