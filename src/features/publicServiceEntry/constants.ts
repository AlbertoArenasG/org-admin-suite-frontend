import type { SurveyRatingValue } from '@/features/publicServiceEntry/types';

export const SURVEY_RATING_VALUES: SurveyRatingValue[] = [
  'EXCELENTE',
  'MUY_BUENO',
  'BUENO',
  'REGULAR',
  'MALO',
];

export const PUBLIC_SURVEY_QUESTIONS = [
  {
    id: 'staff_service_treatment',
    type: 'RATING' as const,
    translationKey: 'publicServiceEntry.survey.questions.staffServiceTreatment',
  },
  {
    id: 'response_time',
    type: 'RATING' as const,
    translationKey: 'publicServiceEntry.survey.questions.responseTime',
  },
  {
    id: 'staff_attitude',
    type: 'RATING' as const,
    translationKey: 'publicServiceEntry.survey.questions.staffAttitude',
  },
  {
    id: 'documentation_delivery_time',
    type: 'RATING' as const,
    translationKey: 'publicServiceEntry.survey.questions.documentationDelivery',
  },
];

export const OBSERVATIONS_QUESTION = {
  id: 'observations',
  type: 'TEXT' as const,
  translationKey: 'publicServiceEntry.survey.questions.observations',
};
