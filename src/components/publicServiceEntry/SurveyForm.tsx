'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  PUBLIC_SURVEY_QUESTIONS,
  OBSERVATIONS_QUESTION,
  SURVEY_RATING_VALUES,
} from '@/features/publicServiceEntry/constants';
import type { SurveySubmissionAnswer } from '@/features/publicServiceEntry/types';
import {
  usePublicServiceEntryStore,
  isValidSurveyRating,
} from '@/stores/usePublicServiceEntryStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useTranslation } from 'react-i18next';

const ratingSchema = z
  .string()
  .min(1, 'publicServiceEntry.survey.errors.required')
  .refine(
    (value) => SURVEY_RATING_VALUES.includes(value as (typeof SURVEY_RATING_VALUES)[number]),
    'publicServiceEntry.survey.errors.required'
  );

const surveySchema = z
  .object(
    Object.fromEntries(PUBLIC_SURVEY_QUESTIONS.map((question) => [question.id, ratingSchema]))
  )
  .extend({
    observations: z
      .string()
      .max(1000, 'publicServiceEntry.survey.errors.observationsMax')
      .optional()
      .or(z.literal('')),
  });

type SurveyFormValues = z.infer<typeof surveySchema>;

interface SurveyFormProps {
  token: string;
  disabled: boolean;
  initialAnswers?: Record<string, string>;
}

export function PublicServiceEntrySurveyForm({ token, disabled, initialAnswers }: SurveyFormProps) {
  const { t } = useTranslation('common');
  const { showSnackbar } = useSnackbar();
  const submitSurvey = usePublicServiceEntryStore((state) => state.submitSurvey);
  const surveySubmitting = usePublicServiceEntryStore((state) => state.surveySubmitting);
  const surveyError = usePublicServiceEntryStore((state) => state.surveyError);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      ...(Object.fromEntries(
        PUBLIC_SURVEY_QUESTIONS.map((question) => [
          question.id,
          initialAnswers?.[question.id] && isValidSurveyRating(initialAnswers[question.id])
            ? (initialAnswers[question.id] as SurveyFormValues[keyof SurveyFormValues])
            : '',
        ])
      ) as SurveyFormValues),
      observations: '',
    },
  });

  useEffect(() => {
    if (initialAnswers) {
      form.reset({
        ...(Object.fromEntries(
          PUBLIC_SURVEY_QUESTIONS.map((question) => [
            question.id,
            initialAnswers[question.id] && isValidSurveyRating(initialAnswers[question.id])
              ? (initialAnswers[question.id] as SurveyFormValues[keyof SurveyFormValues])
              : '',
          ])
        ) as SurveyFormValues),
        observations: initialAnswers[OBSERVATIONS_QUESTION.id] ?? '',
      });
    }
  }, [form, initialAnswers]);

  useEffect(() => {
    if (surveyError) {
      showSnackbar({
        message: surveyError,
        severity: 'error',
      });
    }
  }, [surveyError, showSnackbar]);

  const onSubmit = form.handleSubmit(async (values) => {
    const answers: SurveySubmissionAnswer[] = PUBLIC_SURVEY_QUESTIONS.map((question) => ({
      questionId: question.id,
      type: 'RATING',
      value: values[question.id],
    }));

    const observationsValue = values.observations?.trim();

    if (observationsValue && observationsValue.length > 0) {
      answers.push({
        questionId: OBSERVATIONS_QUESTION.id,
        type: 'TEXT',
        value: observationsValue,
      });
    }

    try {
      await submitSurvey(token, {
        answers,
        observations: observationsValue ?? '',
      });
      showSnackbar({
        message: t('publicServiceEntry.survey.success', {
          defaultValue: 'Survey submitted successfully. You can now download the files.',
        }),
        severity: 'success',
      });
    } catch {
      // submitSurvey already sets the error which triggers snackbar via effect.
    }
  });

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid var(--surface-border)',
        bgcolor: 'var(--surface-bg)',
        color: 'var(--foreground)',
        boxShadow: 'var(--surface-shadow)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="border-b border-border/50 px-6 py-4">
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
          {t('publicServiceEntry.survey.title')}
        </Typography>
        <Typography variant="body2" color="text.foreground">
          {t('publicServiceEntry.survey.subtitle')}
        </Typography>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 px-6 py-6">
        {PUBLIC_SURVEY_QUESTIONS.map((question) => (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>{t(question.translationKey)}</Label>
            <select
              id={question.id}
              {...form.register(question.id)}
              disabled={disabled || surveySubmitting}
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <option value="">
                {t('publicServiceEntry.survey.placeholders.selectOption', {
                  defaultValue: 'Choose an option',
                })}
              </option>
              {SURVEY_RATING_VALUES.map((value) => (
                <option key={value} value={value}>
                  {t(`publicServiceEntry.survey.answers.${value}`)}
                </option>
              ))}
            </select>
            {form.formState.errors[question.id]?.message ? (
              <p className="text-xs text-destructive">
                {t(form.formState.errors[question.id]?.message ?? '')}
              </p>
            ) : null}
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor={OBSERVATIONS_QUESTION.id}>
            {t(OBSERVATIONS_QUESTION.translationKey)}
          </Label>
          <textarea
            id={OBSERVATIONS_QUESTION.id}
            rows={4}
            {...form.register('observations')}
            disabled={disabled || surveySubmitting}
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
          />
          {form.formState.errors.observations?.message ? (
            <p className="text-xs text-destructive">
              {t(form.formState.errors.observations?.message ?? '')}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
          <Button type="submit" disabled={disabled || surveySubmitting}>
            {surveySubmitting
              ? t('publicServiceEntry.survey.actions.submitting')
              : t('publicServiceEntry.survey.actions.submit')}
          </Button>
        </div>
      </form>
    </Paper>
  );
}
