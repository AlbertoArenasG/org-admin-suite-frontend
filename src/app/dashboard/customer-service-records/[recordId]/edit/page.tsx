'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CustomerServiceRecordFormPageContainer } from '@/components/customer-service-records/CustomerServiceRecordFormPageContainer';
import { useAuthorization } from '@/features/auth';

export default function CustomerServiceRecordEditPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const { t } = useTranslation('customerServiceRecords');
  const { hasPermission } = useAuthorization();

  if (!hasPermission('CUSTOMER_SERVICE_RECORDS', 'UPDATE')) {
    return <p className="text-sm text-muted-foreground">{t('edit.restricted')}</p>;
  }

  return <CustomerServiceRecordFormPageContainer mode="edit" recordId={recordId} />;
}
