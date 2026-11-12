'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Camera, Check, ClipboardList, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  DashboardContentReveal,
  DashboardPageComposition,
  DashboardPageContentScroller,
} from '@/components/dashboard-shell';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Stepper, type StepperStep } from '@/components/vendor/shadcn-space/stepper';
import {
  convertServicePackageRecord,
  fetchServicePackageConversionCustomerUsers,
  fetchServicePackageConversionOptions,
  fetchServicePackageRecordDetail,
  resetServicePackageConversion,
  resetServicePackageRecordDetail,
} from '@/features/servicePackagesRecords';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildConversionPayload,
  getConversionDefaults,
  servicePackageRecordConversionSchema,
  type ServicePackageRecordConversionValues,
} from './servicePackageRecordConversionSchema';
import { ServicePackageRecordConversionSource } from './ServicePackageRecordConversionSource';
import { ServicePackageRecordConversionStep } from './ServicePackageRecordConversionStep';
import { ServicePackageRecordConversionPhotosStep } from './ServicePackageRecordConversionPhotosStep';

export function ServicePackageRecordConversionPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detail = useAppSelector((state) => state.servicePackagesRecords.detail);
  const conversion = useAppSelector((state) => state.servicePackagesRecords.conversion);
  const initializedId = useRef<string | null>(null);
  const submitInFlight = useRef(false);
  const [step, setStep] = useState(0);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const form = useForm<ServicePackageRecordConversionValues>({
    resolver: zodResolver(servicePackageRecordConversionSchema),
    defaultValues: { records: [] },
    mode: 'onChange',
  });
  const source = detail.currentRecordId === recordId ? detail.record : null;
  const count = source?.details.equipment.length ?? 0;
  const reviewStep = count * 2;
  const equipmentIndex = Math.min(Math.floor(step / 2), count - 1);
  const isPhotoStep = step < reviewStep && step % 2 === 1;
  const result = conversion.status === 'succeeded' ? conversion.result : null;
  const isSubmitting = conversion.status === 'loading';
  const currentCustomerId = form.watch(`records.${Math.max(0, equipmentIndex)}.customerId`);
  const users = currentCustomerId ? (conversion.usersByCustomer[currentCustomerId] ?? []) : [];

  useEffect(() => {
    if (!authHydrated || !recordId) return;
    void dispatch(fetchServicePackageRecordDetail({ recordId }));
    void dispatch(fetchServicePackageConversionOptions());
    return () => {
      dispatch(resetServicePackageRecordDetail());
      dispatch(resetServicePackageConversion());
    };
  }, [authHydrated, dispatch, recordId]);

  useEffect(() => {
    if (!source || initializedId.current === source.id) return;
    form.reset(getConversionDefaults(source));
    initializedId.current = source.id;
  }, [form, source]);

  useEffect(() => {
    if (
      !currentCustomerId ||
      conversion.usersByCustomer[currentCustomerId] ||
      conversion.usersLoadingCustomerId === currentCustomerId ||
      conversion.usersError
    )
      return;
    void dispatch(fetchServicePackageConversionCustomerUsers({ customerId: currentCustomerId }));
  }, [
    conversion.usersByCustomer,
    conversion.usersLoadingCustomerId,
    conversion.usersError,
    currentCustomerId,
    dispatch,
  ]);

  const verifySource = async () => {
    setVerificationError(null);
    try {
      const fresh = await dispatch(fetchServicePackageRecordDetail({ recordId })).unwrap();
      if (!fresh.convertedToCustomerServiceRecords) setNeedsVerification(false);
    } catch (error) {
      setVerificationError(
        typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : t('conversion.loadError')
      );
    }
  };

  const goNext = async () => {
    if (step >= reviewStep) return;
    const valid = isPhotoStep || (await form.trigger(`records.${equipmentIndex}`));
    if (valid) setStep(step + 1);
  };

  const submit = form.handleSubmit(async (values) => {
    if (
      submitInFlight.current ||
      needsVerification ||
      !source ||
      source.convertedToCustomerServiceRecords
    )
      return;
    submitInFlight.current = true;
    try {
      await dispatch(
        convertServicePackageRecord({ recordId, records: buildConversionPayload(values) })
      ).unwrap();
    } catch (error) {
      if (typeof error === 'object' && error && ('uncertain' in error || 'status' in error)) {
        const failure = error as { uncertain?: boolean; status?: number };
        if (failure.uncertain || failure.status === 409) setNeedsVerification(true);
      }
    } finally {
      submitInFlight.current = false;
    }
  });

  const leave = () => {
    if (form.formState.isDirty && !result) setDiscardOpen(true);
    else router.push('/dashboard/service-packages-records');
  };

  const steps: StepperStep[] = source
    ? [
        ...source.details.equipment.flatMap((item, index) => [
          {
            id: String(index * 2),
            label: t('conversion.equipmentStep', { number: index + 1, total: count }),
            description: item.equipment || undefined,
            icon: ClipboardList,
            status: form.formState.errors.records?.[index] ? ('error' as const) : undefined,
          },
          {
            id: String(index * 2 + 1),
            label: t('conversion.photosStep', { number: index + 1, total: count }),
            description: item.equipment || undefined,
            icon: Camera,
          },
        ]),
        { id: 'review', label: t('conversion.review'), icon: Check },
      ]
    : [];

  const sourceLoading =
    !authHydrated || detail.currentRecordId !== recordId || detail.status === 'loading';
  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">{t('conversion.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('conversion.description')}</p>
            </div>
            <Button type="button" variant="outline" onClick={leave} disabled={isSubmitting}>
              <ArrowLeft aria-hidden="true" />
              {t('conversion.backToList')}
            </Button>
          </div>

          {sourceLoading ? (
            <p role="status" className="text-sm text-muted-foreground">
              {t('conversion.loading')}
            </p>
          ) : null}
          {detail.status === 'failed' && !sourceLoading ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
            >
              {detail.error?.message || t('conversion.loadError')}
              <Button
                type="button"
                variant="outline"
                className="ml-3"
                onClick={() => void dispatch(fetchServicePackageRecordDetail({ recordId }))}
              >
                {t('actions.retry')}
              </Button>
            </div>
          ) : null}

          {source && !sourceLoading ? (
            <DashboardContentReveal>
              <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(17rem,21rem)_minmax(0,1fr)]">
                <ServicePackageRecordConversionSource
                  source={source}
                  equipmentIndex={equipmentIndex}
                />
                <div className="min-w-0 space-y-4">
                  {source.convertedToCustomerServiceRecords && !result ? (
                    <div
                      role="status"
                      className="rounded-xl border border-border bg-card p-5 text-sm"
                    >
                      {t('conversion.alreadyConverted')}
                    </div>
                  ) : null}
                  {!source.convertedToCustomerServiceRecords && count === 0 ? (
                    <div
                      role="status"
                      className="rounded-xl border border-border bg-card p-5 text-sm"
                    >
                      {t('conversion.noEquipment')}
                    </div>
                  ) : null}
                  {result ? (
                    <ResourceFormFrame
                      title={t('conversion.success')}
                      mode="read"
                      surface={{ base: 'card', md: 'card' }}
                      contentSurface={{ base: 'inset', md: 'inset' }}
                      headerDensity="compact"
                    >
                      <ResourceFormSection surface="bare">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {t('conversion.successCount', { count: result.records.length })}
                          </p>
                          {result.records.map((item) => (
                            <Link
                              key={item.equipmentIndex}
                              className="block rounded-lg border border-border p-3 text-sm text-primary underline-offset-4 hover:underline"
                              href={`/dashboard/customer-service-records/${item.customerServiceRecordId}`}
                            >
                              {t('conversion.createdRecord', {
                                number: item.equipmentIndex + 1,
                                folio: item.serviceNumberDisplay,
                              })}
                            </Link>
                          ))}
                        </div>
                      </ResourceFormSection>
                    </ResourceFormFrame>
                  ) : null}
                  {!result && !source.convertedToCustomerServiceRecords && count > 0 ? (
                    <>
                      <Stepper
                        steps={steps}
                        value={step === reviewStep ? 'review' : String(step)}
                        onValueChange={(_, context) => setStep(context.targetIndex)}
                        canNavigateTo={(context) => context.targetIndex <= context.currentIndex}
                        ariaLabel={t('conversion.steps')}
                      />
                      {conversion.optionsStatus === 'loading' ? (
                        <p role="status" className="text-sm text-muted-foreground">
                          {t('conversion.loadingOptions')}
                        </p>
                      ) : null}
                      {conversion.optionsStatus === 'failed' ? (
                        <div
                          role="alert"
                          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
                        >
                          {conversion.optionsError?.message || t('conversion.optionsError')}
                          <Button
                            type="button"
                            variant="outline"
                            className="ml-3"
                            onClick={() => void dispatch(fetchServicePackageConversionOptions())}
                          >
                            {t('actions.retry')}
                          </Button>
                        </div>
                      ) : null}
                      {conversion.optionsStatus === 'succeeded' &&
                      step < reviewStep &&
                      !isPhotoStep ? (
                        <ServicePackageRecordConversionStep
                          form={form}
                          source={source}
                          index={equipmentIndex}
                          customers={conversion.customers}
                          serviceTypes={conversion.serviceTypes}
                          users={users}
                          usersLoading={conversion.usersLoadingCustomerId === currentCustomerId}
                          disabled={isSubmitting}
                          onCustomerChange={(customerId) => {
                            if (!conversion.usersByCustomer[customerId])
                              void dispatch(
                                fetchServicePackageConversionCustomerUsers({ customerId })
                              );
                          }}
                        />
                      ) : null}
                      {step < reviewStep && isPhotoStep ? (
                        <ServicePackageRecordConversionPhotosStep
                          form={form}
                          source={source}
                          index={equipmentIndex}
                          disabled={isSubmitting}
                        />
                      ) : null}
                      {conversion.usersError && step < reviewStep && !isPhotoStep ? (
                        <div
                          role="alert"
                          className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                        >
                          {conversion.usersError.message}
                          <Button
                            type="button"
                            variant="outline"
                            className="ml-3"
                            onClick={() =>
                              currentCustomerId &&
                              void dispatch(
                                fetchServicePackageConversionCustomerUsers({
                                  customerId: currentCustomerId,
                                })
                              )
                            }
                          >
                            {t('actions.retry')}
                          </Button>
                        </div>
                      ) : null}
                      {step === reviewStep ? (
                        <ResourceFormFrame
                          title={t('conversion.review')}
                          mode="read"
                          surface={{ base: 'card', md: 'card' }}
                          contentSurface={{ base: 'inset', md: 'inset' }}
                          headerDensity="compact"
                        >
                          <ResourceFormSection surface="bare">
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                {t('conversion.reviewHelp', { count })}
                              </p>
                              {form.getValues().records.map((item, index) => (
                                <div
                                  key={index}
                                  className="rounded-lg border border-border p-3 text-sm"
                                >
                                  <strong>
                                    {index + 1}. {item.asset.name}
                                  </strong>
                                  <p>
                                    {conversion.customers.find(
                                      (option) => option.value === item.customerId
                                    )?.label || '—'}{' '}
                                    ·{' '}
                                    {conversion.serviceTypes.find(
                                      (option) => option.value === item.serviceTypeCode
                                    )?.label || '—'}
                                  </p>
                                  <p>
                                    {t('conversion.photoCount', {
                                      count: item.photoFileIds.length,
                                    })}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ResourceFormSection>
                        </ResourceFormFrame>
                      ) : null}
                      {conversion.error ? (
                        <div
                          role="alert"
                          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
                        >
                          <p>{conversion.error.message || t('conversion.submitError')}</p>
                          {needsVerification ? (
                            <p className="mt-2">{t('conversion.verifyBeforeRetry')}</p>
                          ) : null}
                        </div>
                      ) : null}
                      {verificationError ? (
                        <p role="alert" className="text-sm text-destructive">
                          {verificationError}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSubmitting || step === 0}
                          onClick={() => setStep(step - 1)}
                        >
                          <ArrowLeft aria-hidden="true" />
                          {t('conversion.previous')}
                        </Button>
                        {needsVerification ? (
                          <Button type="button" onClick={() => void verifySource()}>
                            <RotateCcw aria-hidden="true" />
                            {t('conversion.verify')}
                          </Button>
                        ) : step < reviewStep ? (
                          <Button
                            type="button"
                            disabled={conversion.optionsStatus !== 'succeeded'}
                            onClick={() => void goNext()}
                          >
                            {t(
                              !isPhotoStep
                                ? 'conversion.nextToPhotos'
                                : step === reviewStep - 1
                                  ? 'conversion.review'
                                  : 'conversion.nextEquipment'
                            )}
                            <ArrowRight aria-hidden="true" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void submit()}
                          >
                            {isSubmitting ? t('conversion.sending') : t('conversion.confirm')}
                          </Button>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </DashboardContentReveal>
          ) : null}
        </div>
      </DashboardPageContentScroller>
      <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('conversion.discardTitle')}</DialogTitle>
            <DialogDescription>{t('conversion.discardDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDiscardOpen(false)}>
              {t('conversion.keepEditing')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => router.push('/dashboard/service-packages-records')}
            >
              {t('conversion.discard')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageComposition>
  );
}
