'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

import { DashboardContentReveal } from '@/components/dashboard-shell';
import { Button } from '@/components/ui/button';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { ServicePackageZipUploadDialog } from './ServicePackageZipUploadDialog';
import { ServicePackagesRecordsTable } from './ServicePackagesRecordsTable';
import { useServicePackageRecordRowActions } from './useServicePackageRecordRowActions';
import { useServicePackagesRecordsListController } from './useServicePackagesRecordsListController';

export function ServicePackagesRecordsContainer() {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const [uploadOpen, setUploadOpen] = useState(false);
  const controller = useServicePackagesRecordsListController();
  const { rowActions, deletionDialog } = useServicePackageRecordRowActions({
    onDeleted: controller.refetch,
  });

  return (
    <DashboardContentReveal>
      <ServicePackagesRecordsTable
        controller={controller}
        rowActions={rowActions}
        primaryActions={
          <Button type="button" onClick={() => setUploadOpen(true)}>
            <Upload aria-hidden="true" />
            {t('upload.trigger')}
          </Button>
        }
      />
      {deletionDialog}
      <ServicePackageZipUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onRefreshList={controller.refetch}
      />
    </DashboardContentReveal>
  );
}
