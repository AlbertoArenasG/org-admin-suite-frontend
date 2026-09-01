'use client';

import { useTranslation } from 'react-i18next';
import { CustomerServiceRecordForm } from '@/components/customer-service-records/CustomerServiceRecordForm';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';

const serviceTypes = [
  { value: 'CALIBRACION', label: 'Calibracion' },
  { value: 'MANTENIMIENTO_PREVENTIVO', label: 'Mantenimiento preventivo' },
];

const customers = [
  { value: 'customer-acme', label: 'ACME INC' },
  { value: 'customer-seg', label: 'SEG' },
];

const customerUsers = [
  { value: 'user-ana', label: 'Ana Torres', description: 'ana.torres@acme.test' },
  { value: 'user-ricardo', label: 'Ricardo Garcia', description: 'ricardo.garcia@acme.test' },
];

const providers = [
  { value: 'provider-internal', label: 'Laboratorio ICSA' },
  { value: 'provider-external', label: 'Laboratorio Externo' },
];

const policies = [
  { value: 'policy-standard', label: 'Seguimiento estandar' },
  { value: 'policy-priority', label: 'Seguimiento prioritario' },
];

const recipientGroups = [
  { value: 'group-operations', label: 'Operaciones' },
  { value: 'group-commercial', label: 'Comercial' },
];

export function CustomerServiceRecordFormPlayground() {
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          {
            label: t('breadcrumbs:dashboard'),
            href: '/dashboard',
            hideOnDesktop: true,
          },
          {
            label: t('breadcrumbs:customerServiceRecords'),
            href: '/dashboard/customer-service-records',
          },
          { label: t('create.title') },
        ]}
      />

      <CustomerServiceRecordForm
        mode="create"
        serviceTypes={serviceTypes}
        customers={customers}
        customerUsers={customerUsers}
        providers={providers}
        statusPolicies={policies}
        notificationPolicies={policies}
        recipientGroups={recipientGroups}
        onCustomerChange={() => undefined}
        onSubmit={() => undefined}
        onCancel={() => undefined}
        isSubmitting={false}
        labels={{
          general: t('form.sections.general'),
          serviceType: t('form.labels.serviceType'),
          requestedAt: t('form.labels.requestedAt'),
          operationalStatus: t('form.labels.operationalStatus'),
          pending: t('statuses.pending'),
          inProgress: t('statuses.inProgress'),
          completed: t('statuses.completed'),
          cancelled: t('statuses.cancelled'),
          customer: t('form.labels.customer'),
          customerUsers: t('form.labels.customerUsers'),
          asset: t('form.sections.asset'),
          name: t('form.labels.assetName'),
          identifier: t('form.labels.identifier'),
          brand: t('form.labels.brand'),
          model: t('form.labels.model'),
          serialNumber: t('form.labels.serialNumber'),
          assetObservations: t('form.labels.assetObservations'),
          customerCommitment: t('form.sections.customerCommitment'),
          receivedAt: t('form.labels.receivedAt'),
          estimatedInterval: t('detail.fields.estimatedInterval'),
          estimatedDeliveryAt: t('form.labels.estimatedDeliveryAt'),
          deliveredToCustomerAt: t('form.labels.deliveredToCustomerAt'),
          statusPolicy: t('form.labels.statusPolicy'),
          notificationPolicy: t('form.labels.notificationPolicy'),
          provider: t('form.sections.provider'),
          useProvider: t('form.labels.useProvider'),
          providerDisabled: t('form.hints.providerDisabled'),
          deliveredToProviderAt: t('form.labels.deliveredToProviderAt'),
          estimatedReturnAt: t('form.labels.estimatedReturnAt'),
          returnedFromProviderAt: t('form.labels.returnedFromProviderAt'),
          followUp: t('form.labels.followUp'),
          recipients: t('form.labels.recipients'),
          copyRecipients: t('form.labels.copyRecipients'),
          addRule: t('form.actions.addRule'),
          removeRule: t('form.actions.removeRule'),
          observations: t('form.labels.observations'),
          observationsPlaceholder: t('form.placeholders.observations'),
          years: t('form.labels.years'),
          months: t('form.labels.months'),
          weeks: t('form.labels.weeks'),
          days: t('form.labels.days'),
          noOptions: t('form.noOptions'),
          cancel: t('form.actions.cancel'),
          create: t('form.actions.create'),
          save: t('form.actions.save'),
        }}
      />
    </div>
  );
}
