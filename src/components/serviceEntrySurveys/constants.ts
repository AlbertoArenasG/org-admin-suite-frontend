import type { SurveyRatingValue } from '@/features/serviceEntrySurveys/serviceEntrySurveysThunks';
import { SURVEY_RATING_VALUES } from '@/features/publicServiceEntry/constants';

export const SERVICE_ENTRY_SURVEY_RATING_CLASSES: Record<SurveyRatingValue, string> = {
  EXCELENTE: 'bg-blue-500/15 text-blue-600 border border-blue-500/30',
  MUY_BUENO: 'bg-cyan-500/15 text-cyan-600 border border-cyan-500/30',
  BUENO: 'bg-amber-500/15 text-amber-600 border border-amber-500/30',
  REGULAR: 'bg-orange-500/15 text-orange-600 border border-orange-500/30',
  MALO: 'bg-rose-500/15 text-rose-600 border border-rose-500/30',
};

export const SERVICE_ENTRY_SURVEY_RATING_COLORS: Record<SurveyRatingValue, string> = {
  EXCELENTE: '#2563eb',
  MUY_BUENO: '#0ea5e9',
  BUENO: '#fbbf24',
  REGULAR: '#f97316',
  MALO: '#ef4444',
};

export function isSurveyRatingValue(value: unknown): value is SurveyRatingValue {
  return (
    typeof value === 'string' && (SURVEY_RATING_VALUES as ReadonlyArray<string>).includes(value)
  );
}
