'use client';

import {
  Controller,
  useFieldArray,
  useForm,
  type Path,
  type UseFormRegister,
} from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox, MultiSelect, type ComboboxOption } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordInterval,
  CustomerServiceRecordMutationPayload,
} from '@/features/customer-service-records';

interface FormValues extends CustomerServiceRecordMutationPayload {
  useProvider: boolean;
}

interface CustomerServiceRecordFormProps {
  mode: 'create' | 'edit';
  record?: CustomerServiceRecordDetail | null;
  serviceTypes: ComboboxOption[];
  customers: ComboboxOption[];
  customerUsers: ComboboxOption[];
  providers: ComboboxOption[];
  statusPolicies: ComboboxOption[];
  notificationPolicies: ComboboxOption[];
  recipientGroups: ComboboxOption[];
  onCustomerChange: (customerId: string | null) => void;
  onSubmit: (payload: CustomerServiceRecordMutationPayload) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  labels: Record<string, string>;
}

const EMPTY_INTERVAL: CustomerServiceRecordInterval = { years: 0, months: 0, weeks: 0, days: 0 };
const EMPTY_RULE = {
  interval: { ...EMPTY_INTERVAL },
  recipientGroupIds: [],
  ccRecipientGroupIds: [],
};

function cloneInterval(value?: CustomerServiceRecordInterval | null) {
  return { ...(value ?? EMPTY_INTERVAL) };
}

function toDate(value?: string | null) {
  return value?.slice(0, 10) ?? '';
}

function initialValues(record?: CustomerServiceRecordDetail | null): FormValues {
  const asset = record?.assets[0];
  return {
    serviceTypeCode: record?.serviceType.serviceTypeCode ?? '',
    requestedAt: toDate(record?.requestedAt),
    observations: record?.observations ?? '',
    customer: {
      customerId: record?.customer.customerId ?? '',
      customerUserIds: record?.customer.users.map((user) => user.userId) ?? [],
    },
    assets: [
      {
        name: asset?.name ?? '',
        identifier: asset?.identifier ?? '',
        brand: asset?.brand ?? '',
        model: asset?.model ?? '',
        serialNumber: asset?.serialNumber ?? '',
        observations: asset?.observations ?? '',
      },
    ],
    customerDelivery: {
      receivedAt: toDate(record?.customerDelivery.receivedAt),
      estimatedDeliveryInterval: cloneInterval(record?.customerDelivery.estimatedDeliveryInterval),
      estimatedDeliveryAt: toDate(record?.customerDelivery.estimatedDeliveryAt),
      deliveredToCustomerAt: toDate(record?.customerDelivery.deliveredToCustomerAt),
      statusPolicyId: record?.customerDelivery.statusPolicyId ?? '',
      notificationPolicyId: record?.customerDelivery.notificationPolicyId ?? '',
    },
    provider: record?.provider
      ? {
          providerId: record.provider.providerId,
          deliveredToProviderAt: toDate(record.provider.deliveredToProviderAt),
          estimatedReturnInterval: cloneInterval(record.provider.estimatedReturnInterval),
          estimatedReturnAt: toDate(record.provider.estimatedReturnAt),
          returnedFromProviderAt: toDate(record.provider.returnedFromProviderAt),
          statusPolicyId: record.provider.statusPolicyId ?? '',
          notificationPolicyId: record.provider.notificationPolicyId ?? '',
          followUp: record.provider.followUp,
        }
      : {
          providerId: '',
          deliveredToProviderAt: '',
          estimatedReturnInterval: { ...EMPTY_INTERVAL },
          estimatedReturnAt: '',
          returnedFromProviderAt: '',
          statusPolicyId: '',
          notificationPolicyId: '',
          followUp: { enabled: false, rules: [] },
        },
    operationalStatus: record?.operationalStatus.code ?? 'PENDING',
    useProvider: Boolean(record?.provider),
  };
}

function IntervalFields({
  prefix,
  register,
  labels,
}: {
  prefix: string;
  register: UseFormRegister<FormValues>;
  labels: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {(['years', 'months', 'weeks', 'days'] as const).map((unit) => (
        <div key={unit} className="grid gap-1.5">
          <Label>{labels[unit]}</Label>
          <Input
            type="number"
            min="0"
            {...register(`${prefix}.${unit}` as Path<FormValues>, { valueAsNumber: true })}
          />
        </div>
      ))}
    </div>
  );
}

export function CustomerServiceRecordForm({
  mode,
  record,
  serviceTypes,
  customers,
  customerUsers,
  providers,
  statusPolicies,
  notificationPolicies,
  recipientGroups,
  onCustomerChange,
  onSubmit,
  onCancel,
  isSubmitting,
  labels,
}: CustomerServiceRecordFormProps) {
  const { control, register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: initialValues(record),
  });
  const providerEnabled = watch('useProvider');
  const followUpEnabled = watch('provider.followUp.enabled');
  const { fields, append, remove } = useFieldArray({ control, name: 'provider.followUp.rules' });

  const submit = handleSubmit((values) => {
    const providerValues = values.provider!;
    const provider = values.useProvider
      ? {
          ...providerValues,
          deliveredToProviderAt: providerValues.deliveredToProviderAt || null,
          estimatedReturnAt: providerValues.estimatedReturnAt || null,
          returnedFromProviderAt: providerValues.returnedFromProviderAt || null,
          statusPolicyId: providerValues.statusPolicyId || null,
          notificationPolicyId: providerValues.notificationPolicyId || null,
        }
      : null;
    onSubmit({
      ...values,
      observations: values.observations?.trim() || null,
      assets: values.assets.map((asset) => ({
        ...asset,
        observations: asset.observations?.trim() || null,
      })),
      customerDelivery: {
        ...values.customerDelivery,
        receivedAt: values.customerDelivery.receivedAt || null,
        estimatedDeliveryAt: values.customerDelivery.estimatedDeliveryAt || null,
        deliveredToCustomerAt: values.customerDelivery.deliveredToCustomerAt || null,
        statusPolicyId: values.customerDelivery.statusPolicyId || null,
        notificationPolicyId: values.customerDelivery.notificationPolicyId || null,
      },
      provider,
    });
  });

  return (
    <form onSubmit={submit} className="grid gap-6">
      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">{labels.general}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>{labels.serviceType}</Label>
            <Controller
              control={control}
              name="serviceTypeCode"
              rules={{ required: true }}
              render={({ field }) => (
                <Combobox
                  options={serviceTypes}
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? '')}
                  placeholder={labels.serviceType}
                  searchPlaceholder={labels.serviceType}
                  emptyMessage={labels.noOptions}
                />
              )}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>{labels.requestedAt}</Label>
            <Input type="date" required {...register('requestedAt')} />
          </div>
          <div className="grid gap-1.5 md:col-span-2">
            <Label>{labels.operationalStatus}</Label>
            <select
              className="border-input h-10 rounded-md border bg-background px-3 text-sm"
              {...register('operationalStatus')}
            >
              <option value="PENDING">{labels.pending}</option>
              <option value="IN_PROGRESS">{labels.inProgress}</option>
              <option value="COMPLETED">{labels.completed}</option>
              <option value="CANCELLED">{labels.cancelled}</option>
            </select>
          </div>
          <div className="grid gap-1.5 md:col-span-2">
            <Label>{labels.observations}</Label>
            <Textarea {...register('observations')} placeholder={labels.observationsPlaceholder} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">{labels.customer}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>{labels.customer}</Label>
            <Controller
              control={control}
              name="customer.customerId"
              rules={{ required: true }}
              render={({ field }) => (
                <Combobox
                  options={customers}
                  value={field.value || null}
                  onValueChange={(value) => {
                    field.onChange(value ?? '');
                    setValue('customer.customerUserIds', []);
                    onCustomerChange(value);
                  }}
                  placeholder={labels.customer}
                  searchPlaceholder={labels.customer}
                  emptyMessage={labels.noOptions}
                />
              )}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>{labels.customerUsers}</Label>
            <Controller
              control={control}
              name="customer.customerUserIds"
              render={({ field }) => (
                <MultiSelect
                  options={customerUsers}
                  values={field.value}
                  onValuesChange={field.onChange}
                  placeholder={labels.customerUsers}
                  searchPlaceholder={labels.customerUsers}
                  emptyMessage={labels.noOptions}
                />
              )}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">{labels.asset}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(['name', 'identifier', 'brand', 'model', 'serialNumber'] as const).map((field) => (
            <div key={field} className="grid gap-1.5">
              <Label>{labels[field]}</Label>
              <Input required {...register(`assets.0.${field}`)} />
            </div>
          ))}
          <div className="grid gap-1.5 md:col-span-2">
            <Label>{labels.assetObservations}</Label>
            <Textarea {...register('assets.0.observations')} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">{labels.customerCommitment}</h2>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-1.5">
              <Label>{labels.receivedAt}</Label>
              <Input type="date" {...register('customerDelivery.receivedAt')} />
            </div>
            <div className="grid gap-1.5">
              <Label>{labels.estimatedDeliveryAt}</Label>
              <Input type="date" {...register('customerDelivery.estimatedDeliveryAt')} />
            </div>
            <div className="grid gap-1.5">
              <Label>{labels.deliveredToCustomerAt}</Label>
              <Input type="date" {...register('customerDelivery.deliveredToCustomerAt')} />
            </div>
          </div>
          <IntervalFields
            prefix="customerDelivery.estimatedDeliveryInterval"
            register={register}
            labels={labels}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="customerDelivery.statusPolicyId"
              render={({ field }) => (
                <Combobox
                  options={statusPolicies}
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? '')}
                  placeholder={labels.statusPolicy}
                  searchPlaceholder={labels.statusPolicy}
                  emptyMessage={labels.noOptions}
                  clearable
                />
              )}
            />
            <Controller
              control={control}
              name="customerDelivery.notificationPolicyId"
              render={({ field }) => (
                <Combobox
                  options={notificationPolicies}
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? '')}
                  placeholder={labels.notificationPolicy}
                  searchPlaceholder={labels.notificationPolicy}
                  emptyMessage={labels.noOptions}
                  clearable
                />
              )}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{labels.provider}</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register('useProvider')}
              onChange={(event) => {
                setValue('useProvider', event.target.checked);
                if (!event.target.checked) setValue('provider', initialValues(null).provider);
              }}
            />
            {labels.useProvider}
          </label>
        </div>
        {providerEnabled ? (
          <div className="grid gap-4">
            <Controller
              control={control}
              name="provider.providerId"
              rules={{ required: providerEnabled }}
              render={({ field }) => (
                <Combobox
                  options={providers}
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? '')}
                  placeholder={labels.provider}
                  searchPlaceholder={labels.provider}
                  emptyMessage={labels.noOptions}
                />
              )}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-1.5">
                <Label>{labels.deliveredToProviderAt}</Label>
                <Input type="date" {...register('provider.deliveredToProviderAt')} />
              </div>
              <div className="grid gap-1.5">
                <Label>{labels.estimatedReturnAt}</Label>
                <Input type="date" {...register('provider.estimatedReturnAt')} />
              </div>
              <div className="grid gap-1.5">
                <Label>{labels.returnedFromProviderAt}</Label>
                <Input type="date" {...register('provider.returnedFromProviderAt')} />
              </div>
            </div>
            <IntervalFields
              prefix="provider.estimatedReturnInterval"
              register={register}
              labels={labels}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="provider.statusPolicyId"
                render={({ field }) => (
                  <Combobox
                    options={statusPolicies}
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? '')}
                    placeholder={labels.statusPolicy}
                    searchPlaceholder={labels.statusPolicy}
                    emptyMessage={labels.noOptions}
                    clearable
                  />
                )}
              />
              <Controller
                control={control}
                name="provider.notificationPolicyId"
                render={({ field }) => (
                  <Combobox
                    options={notificationPolicies}
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? '')}
                    placeholder={labels.notificationPolicy}
                    searchPlaceholder={labels.notificationPolicy}
                    emptyMessage={labels.noOptions}
                    clearable
                  />
                )}
              />
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" {...register('provider.followUp.enabled')} />
                {labels.followUp}
              </label>
              {followUpEnabled ? (
                <div className="mt-4 grid gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="rounded-lg border border-border/60 p-3">
                      <div className="mb-3 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          {labels.removeRule}
                        </Button>
                      </div>
                      <IntervalFields
                        prefix={`provider.followUp.rules.${index}.interval`}
                        register={register}
                        labels={labels}
                      />
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <Controller
                          control={control}
                          name={`provider.followUp.rules.${index}.recipientGroupIds`}
                          render={({ field }) => (
                            <MultiSelect
                              options={recipientGroups}
                              values={field.value}
                              onValuesChange={field.onChange}
                              placeholder={labels.recipients}
                              searchPlaceholder={labels.recipients}
                              emptyMessage={labels.noOptions}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name={`provider.followUp.rules.${index}.ccRecipientGroupIds`}
                          render={({ field }) => (
                            <MultiSelect
                              options={recipientGroups}
                              values={field.value}
                              onValuesChange={field.onChange}
                              placeholder={labels.copyRecipients}
                              searchPlaceholder={labels.copyRecipients}
                              emptyMessage={labels.noOptions}
                            />
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() => append(EMPTY_RULE)}
                  >
                    <Plus className="mr-2 size-4" />
                    {labels.addRule}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{labels.providerDisabled}</p>
        )}
      </section>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {labels.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {mode === 'create' ? labels.create : labels.save}
        </Button>
      </div>
    </form>
  );
}
