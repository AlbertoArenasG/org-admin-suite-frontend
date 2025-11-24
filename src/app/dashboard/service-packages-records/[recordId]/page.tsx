'use client';

import { useParams } from 'next/navigation';
import { ServicePackagesRecordsDetailView } from '@/components/servicePackagesRecords/ServicePackagesRecordsDetailView';

export default function ServicePackagesRecordDetailPage() {
  const params = useParams<{ recordId: string }>();

  if (!params?.recordId) {
    return null;
  }

  return <ServicePackagesRecordsDetailView recordId={params.recordId} />;
}
