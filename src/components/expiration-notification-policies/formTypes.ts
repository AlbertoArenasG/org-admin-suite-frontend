import type {
  ExpirationNotificationPolicyAnchorCode,
  ExpirationNotificationPolicyDetail,
  ExpirationNotificationPolicyOffset,
  ExpirationNotificationPolicyRepeatUntilCode,
  ExpirationNotificationPolicyStatusId,
  ExpirationNotificationPolicyTriggerModeCode,
} from '@/features/expiration-notification-policies/types';

export interface ExpirationNotificationPolicyRuleFormValue {
  ruleId?: string;
  anchor: ExpirationNotificationPolicyAnchorCode;
  startOffset: ExpirationNotificationPolicyOffset;
  triggerMode: ExpirationNotificationPolicyTriggerModeCode;
  recipientGroupIds: string[];
  repeatEvery: ExpirationNotificationPolicyOffset | null;
  repeatUntil: ExpirationNotificationPolicyRepeatUntilCode | null;
  repeatFor: ExpirationNotificationPolicyOffset | null;
}

export interface ExpirationNotificationPolicyFormValues {
  name: string;
  description: string;
  statusId: ExpirationNotificationPolicyStatusId;
  rules: ExpirationNotificationPolicyRuleFormValue[];
}

const EMPTY_OFFSET: ExpirationNotificationPolicyOffset = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
};

export function buildEmptyExpirationNotificationPolicyOffset(): ExpirationNotificationPolicyOffset {
  return {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
  };
}

export function hasExpirationNotificationPolicyOffsetValue(
  offset: ExpirationNotificationPolicyOffset | null | undefined
) {
  if (!offset) {
    return false;
  }

  return offset.years > 0 || offset.months > 0 || offset.weeks > 0 || offset.days > 0;
}

export function buildEmptyExpirationNotificationPolicyRule(): ExpirationNotificationPolicyRuleFormValue {
  return {
    anchor: 'BEFORE_EXPIRATION',
    startOffset: buildEmptyExpirationNotificationPolicyOffset(),
    triggerMode: 'ONE_TIME',
    recipientGroupIds: [],
    repeatEvery: null,
    repeatUntil: null,
    repeatFor: null,
  };
}

export function buildExpirationNotificationPolicyInitialValues(
  policy?: ExpirationNotificationPolicyDetail | null
): ExpirationNotificationPolicyFormValues {
  return {
    name: policy?.name ?? '',
    description: policy?.description ?? '',
    statusId: policy?.statusId ?? 'ACTIVE',
    rules:
      policy?.rules.map((rule) => ({
        ruleId: rule.ruleId,
        anchor: rule.anchor.code,
        startOffset: {
          years: rule.startOffset.years,
          months: rule.startOffset.months,
          weeks: rule.startOffset.weeks,
          days: rule.startOffset.days,
        },
        triggerMode: rule.triggerMode.code,
        recipientGroupIds: [...rule.recipientGroupIds],
        repeatEvery: rule.repeatEvery
          ? {
              years: rule.repeatEvery.years,
              months: rule.repeatEvery.months,
              weeks: rule.repeatEvery.weeks,
              days: rule.repeatEvery.days,
            }
          : null,
        repeatUntil: rule.repeatUntil?.code ?? null,
        repeatFor: rule.repeatFor
          ? {
              years: rule.repeatFor.years,
              months: rule.repeatFor.months,
              weeks: rule.repeatFor.weeks,
              days: rule.repeatFor.days,
            }
          : null,
      })) ?? [],
  };
}

export function normalizeExpirationNotificationPolicyOffset(
  offset: ExpirationNotificationPolicyOffset | null | undefined
) {
  const source = offset ?? EMPTY_OFFSET;

  return {
    years: Number(source.years) || 0,
    months: Number(source.months) || 0,
    weeks: Number(source.weeks) || 0,
    days: Number(source.days) || 0,
  };
}
