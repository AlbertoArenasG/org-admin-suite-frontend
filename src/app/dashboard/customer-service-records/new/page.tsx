'use client';

import { useTranslation } from 'react-i18next';
import { CustomerServiceRecordFormPageContainer } from '@/components/customer-service-records/CustomerServiceRecordFormPageContainer';
import { useAuthorization } from '@/features/auth';

export default function CustomerServiceRecordCreatePage() {
  const { t } = useTranslation('customerServiceRecords');
  const { hasPermission } = useAuthorization();

  if (!hasPermission('CUSTOMER_SERVICE_RECORDS', 'CREATE')) {
    return <p className="text-sm text-muted-foreground">{t('create.restricted')}</p>;
  }

  return <CustomerServiceRecordFormPageContainer mode="create" />;
}
