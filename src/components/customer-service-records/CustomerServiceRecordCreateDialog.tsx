'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, FileText, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { WizardDialogContent } from '@/components/ui/wizard-dialog';
import {
  Stepper,
  type StepperNavigationContext,
  type StepperStep,
} from '@/components/vendor/shadcn-space/stepper';
import { showToast } from '@/components/toast';
import {
  createCustomerServiceRecord,
  resetCustomerServiceRecordCreateMutation,
  type CustomerServiceRecordCreateValues,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildCustomerServiceRecordCreatePayload,
  customerServiceRecordCreateAssetFields,
  customerServiceRecordCreateRequestFields,
  customerServiceRecordCreateSchema,
  getCustomerServiceRecordCreateDefaultValues,
} from './customerServiceRecordCreateSchema';
import { CustomerServiceRecordCreateAssetStep } from './CustomerServiceRecordCreateAssetStep';
import { CustomerServiceRecordCreateRequestStep } from './CustomerServiceRecordCreateRequestStep';
import { CustomerServiceRecordCreateSummary } from './CustomerServiceRecordCreateSummary';

type CustomerServiceRecordCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTypes: Array<{ value: string; label: string }>;
  customers: Array<{ value: string; label: string }>;
  customerUsers: Array<{ value: string; label: string }>;
  customerUsersLoading: boolean;
  onCustomerChange: (customerId: string | null) => void;
};

type WizardStep = 'request' | 'asset' | 'summary';

const stepOrder: WizardStep[] = ['request', 'asset', 'summary'];

function getStepIndex(step: WizardStep) {
  return stepOrder.indexOf(step);
}

export function CustomerServiceRecordCreateDialog({
  customerUsers,
  customerUsersLoading,
  customers,
  onCustomerChange,
  onOpenChange,
  open,
  serviceTypes,
}: CustomerServiceRecordCreateDialogProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const createStatus = useAppSelector(
    (state) => state.customerServiceRecords.mutations.createStatus
  );
  const [activeStep, setActiveStep] = useState<WizardStep>('request');
  const [discardConfirmation, setDiscardConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitInFlightRef = useRef(false);
  const form = useForm<CustomerServiceRecordCreateValues>({
    resolver: zodResolver(customerServiceRecordCreateSchema),
    defaultValues: getCustomerServiceRecordCreateDefaultValues(),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const isSubmitting = createStatus === 'loading';
  const isDraftDirty = form.formState.isDirty;
  const values = form.watch();

  const steps: StepperStep[] = [
    { id: 'request', label: t('createWizard.steps.request'), icon: ClipboardList },
    { id: 'asset', label: t('createWizard.steps.asset'), icon: Wrench },
    { id: 'summary', label: t('createWizard.steps.summary'), icon: FileText },
  ].map((step) => ({
    ...step,
    status:
      step.id === 'request' && Object.keys(form.formState.errors).some((key) => key !== 'asset')
        ? 'error'
        : step.id === 'asset' && form.formState.errors.asset
          ? 'error'
          : undefined,
  }));

  const resetCreationState = () => {
    form.reset(getCustomerServiceRecordCreateDefaultValues());
    setActiveStep('request');
    setDiscardConfirmation(false);
    setSubmitError(null);
    dispatch(resetCustomerServiceRecordCreateMutation());
  };

  const clearEmptyWizardFeedback = () => {
    form.clearErrors();
    setActiveStep('request');
    setSubmitError(null);
  };

  const requestClose = () => {
    if (isSubmitting || discardConfirmation) return;
    if (isDraftDirty) {
      setDiscardConfirmation(true);
      return;
    }
    clearEmptyWizardFeedback();
    onOpenChange(false);
  };

  const preventDirtyDraftDismissal = (event: { preventDefault: () => void }) => {
    if (isSubmitting || discardConfirmation) {
      event.preventDefault();
      return;
    }

    if (isDraftDirty) {
      event.preventDefault();
      setDiscardConfirmation(true);
    }
  };

  const handleStepNavigation = (_stepId: string, context: StepperNavigationContext) => {
    if (isSubmitting || context.targetIndex > context.currentIndex) return;
    setActiveStep(context.targetStep.id as WizardStep);
  };

  const advance = async () => {
    const fields =
      activeStep === 'request'
        ? customerServiceRecordCreateRequestFields
        : customerServiceRecordCreateAssetFields;
    const isValid = await form.trigger(fields);
    if (!isValid) return;

    setActiveStep(stepOrder[getStepIndex(activeStep) + 1]);
  };

  const submit = form.handleSubmit(async (nextValues) => {
    if (submitInFlightRef.current) return;

    submitInFlightRef.current = true;
    setSubmitError(null);
    try {
      const result = await dispatch(
        createCustomerServiceRecord(buildCustomerServiceRecordCreatePayload(nextValues))
      ).unwrap();
      resetCreationState();
      onOpenChange(false);
      showToast({
        duration: 4000,
        title: result.message ?? t('feedback.created'),
        type: 'success',
      });
      router.push(`/dashboard/customer-service-records/${result.record.customerServiceRecordId}`);
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : t('createWizard.errors.submit'));
    } finally {
      submitInFlightRef.current = false;
    }
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Only the explicit confirmation in the summary step may create a record.
    if (activeStep !== 'summary' || isSubmitting) {
      event.preventDefault();
      return;
    }

    void submit(event);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : requestClose())}
    >
      {discardConfirmation ? (
        <DialogContent
          onEscapeKeyDown={preventDirtyDraftDismissal}
          onPointerDownOutside={preventDirtyDraftDismissal}
          showCloseButton={false}
        >
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{t('createWizard.discard.title')}</DialogTitle>
              <DialogDescription>{t('createWizard.discard.description')}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 gap-2 p-6 pt-0 sm:space-x-0">
              <Button type="button" variant="outline" onClick={() => setDiscardConfirmation(false)}>
                {t('createWizard.discard.continue')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  resetCreationState();
                  onOpenChange(false);
                }}
              >
                {t('createWizard.discard.confirm')}
              </Button>
            </DialogFooter>
          </>
        </DialogContent>
      ) : (
        <WizardDialogContent
          onEscapeKeyDown={preventDirtyDraftDismissal}
          onPointerDownOutside={preventDirtyDraftDismissal}
        >
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleFormSubmit}>
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>{t('createWizard.title')}</DialogTitle>
              <DialogDescription>{t('createWizard.description')}</DialogDescription>
            </DialogHeader>
            <div className="px-6">
              <Stepper
                steps={steps}
                value={activeStep}
                onValueChange={handleStepNavigation}
                canNavigateTo={(context) => context.targetIndex <= context.currentIndex}
                ariaLabel={t('createWizard.stepperLabel')}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              {activeStep === 'request' ? (
                <CustomerServiceRecordCreateRequestStep
                  control={form.control}
                  errors={form.formState.errors}
                  setValue={form.setValue}
                  serviceTypes={serviceTypes}
                  customers={customers}
                  customerUsers={customerUsers}
                  customerUsersLoading={customerUsersLoading}
                  disabled={isSubmitting}
                  onCustomerChange={onCustomerChange}
                  labels={{
                    serviceType: t('form.labels.serviceType'),
                    requestedAt: t('form.labels.requestedAt'),
                    customer: t('form.labels.customer'),
                    customerUsers: t('form.labels.customerUsers'),
                    serviceTypePlaceholder: t('createWizard.placeholders.serviceType'),
                    customerPlaceholder: t('createWizard.placeholders.customer'),
                    customerUsersPlaceholder: t('createWizard.placeholders.customerUsers'),
                    searchOptions: t('createWizard.searchOptions'),
                    noOptions: t('form.noOptions'),
                    openCalendar: t('createWizard.openCalendar'),
                    invalidDate: t('createWizard.errors.invalidDate'),
                    required: t('createWizard.errors.required'),
                  }}
                />
              ) : null}
              {activeStep === 'asset' ? (
                <CustomerServiceRecordCreateAssetStep
                  register={form.register}
                  errors={form.formState.errors}
                  disabled={isSubmitting}
                  labels={{
                    name: t('form.labels.assetName'),
                    identifier: t('form.labels.identifier'),
                    brand: t('form.labels.brand'),
                    model: t('form.labels.model'),
                    serialNumber: t('form.labels.serialNumber'),
                    required: t('createWizard.errors.required'),
                  }}
                />
              ) : null}
              {activeStep === 'summary' ? (
                <CustomerServiceRecordCreateSummary
                  values={values}
                  serviceTypes={serviceTypes}
                  customers={customers}
                  customerUsers={customerUsers}
                  labels={{
                    requestSection: t('createWizard.steps.request'),
                    assetSection: t('createWizard.steps.asset'),
                    serviceType: t('form.labels.serviceType'),
                    requestedAt: t('form.labels.requestedAt'),
                    customer: t('form.labels.customer'),
                    customerUsers: t('form.labels.customerUsers'),
                    asset: t('form.labels.assetName'),
                    identifier: t('form.labels.identifier'),
                    brand: t('form.labels.brand'),
                    model: t('form.labels.model'),
                    serialNumber: t('form.labels.serialNumber'),
                    none: t('createWizard.none'),
                  }}
                />
              ) : null}
              {submitError ? <p className="mt-4 text-sm text-destructive">{submitError}</p> : null}
            </div>
            <DialogFooter className="border-t p-6 pt-4 sm:space-x-0">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={requestClose}
                >
                  {t('createWizard.cancel')}
                </Button>
                <div className="flex gap-2">
                  {activeStep !== 'request' ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => setActiveStep(stepOrder[getStepIndex(activeStep) - 1])}
                    >
                      {t('actions.previous')}
                    </Button>
                  ) : null}
                  {activeStep === 'summary' ? (
                    <Button
                      key="confirm"
                      type="submit"
                      loading={isSubmitting}
                      loadingLabel={t('createWizard.creating')}
                    >
                      {t('createWizard.confirm')}
                    </Button>
                  ) : (
                    <Button
                      key="next"
                      type="button"
                      disabled={isSubmitting}
                      onClick={(event) => {
                        event.preventDefault();
                        void advance();
                      }}
                    >
                      {t('actions.next')}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </WizardDialogContent>
      )}
    </Dialog>
  );
}
