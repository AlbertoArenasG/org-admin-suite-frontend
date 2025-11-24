'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  fetchServicePackageRecordById,
  resetServicePackageRecordDetail,
  type ServicePackageRecordFile,
} from '@/features/servicePackagesRecords';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Skeleton } from '@/components/ui/skeleton';
import { RecordFilePreviewDialog } from '@/components/servicePackagesRecords/RecordFilePreviewDialog';
import {
  FileText,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  CalendarDays,
  User,
  Building2,
} from 'lucide-react';

interface ServicePackagesRecordsDetailViewProps {
  recordId: string;
}

function isPreviewableFile(file: ServicePackageRecordFile): boolean {
  if (!file.contentType) {
    return false;
  }
  if (file.contentType.startsWith('image/')) {
    return true;
  }
  return file.contentType === 'application/pdf';
}

export function ServicePackagesRecordsDetailView({
  recordId,
}: ServicePackagesRecordsDetailViewProps) {
  const router = useRouter();
  const { t, hydrated, i18n } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();
  const detail = useAppSelector((state) => state.servicePackagesRecords.detail);
  const { showSnackbar } = useSnackbar();
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!recordId) {
      return;
    }
    void dispatch(fetchServicePackageRecordById({ id: recordId }));
  }, [dispatch, recordId]);

  useEffect(
    () => () => {
      dispatch(resetServicePackageRecordDetail());
    },
    [dispatch]
  );

  useEffect(() => {
    if (detail.status === 'failed' && detail.error) {
      showSnackbar({
        message: detail.error,
        severity: 'error',
      });
    }
  }, [detail.error, detail.status, showSnackbar]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(hydrated ? i18n.language : 'es', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [hydrated, i18n.language]
  );

  const record = detail.record;
  const filteredFiles = useMemo(() => {
    const files = record?.files ?? [];
    return files.filter((file) => file.contentType !== 'application/json');
  }, [record]);
  const previewableFiles = useMemo(
    () => filteredFiles.filter((file) => isPreviewableFile(file)),
    [filteredFiles]
  );

  useEffect(() => {
    if (!previewableFiles.length) {
      setPreviewOpen(false);
      return;
    }
    setPreviewIndex((current) => {
      if (current >= previewableFiles.length) {
        return previewableFiles.length - 1;
      }
      return current;
    });
  }, [previewableFiles]);

  if (detail.status === 'idle' || detail.status === 'loading') {
    return <ServicePackagesRecordsDetailSkeleton />;
  }

  if (detail.status === 'failed' || !record) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <PageBreadcrumbs
              segments={[
                {
                  label: t('breadcrumbs.dashboard'),
                  href: '/dashboard',
                  hideOnDesktop: true,
                },
                {
                  label: t('breadcrumbs.servicePackagesRecords'),
                  href: '/dashboard/service-packages-records',
                },
              ]}
            />
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
          {detail.error ??
            t('servicePackagesRecords.detail.notFound', {
              defaultValue: 'Registro de servicio no encontrado.',
            })}
        </div>
      </div>
    );
  }

  const displayFiles = filteredFiles;
  const metaChips = [
    {
      label: record.serviceOrder,
      icon: FileText,
    },
    {
      label: record.visitDate ? dateFormatter.format(new Date(record.visitDate)) : '—',
      icon: CalendarDays,
    },
  ];

  const detailItems = [
    {
      label: t('servicePackagesRecords.detail.company'),
      value: record.company ?? '—',
      icon: Building2,
    },
    {
      label: t('servicePackagesRecords.detail.collector'),
      value: record.collectorName ?? '—',
      icon: User,
    },
    {
      label: t('servicePackagesRecords.detail.contact'),
      value: record.contactPerson ?? '—',
      icon: User,
    },
    {
      label: t('servicePackagesRecords.detail.email'),
      value: record.email ?? '—',
      icon: Mail,
    },
    {
      label: t('servicePackagesRecords.detail.phone'),
      value: record.phone ?? '—',
      icon: Phone,
    },
    {
      label: t('servicePackagesRecords.detail.address'),
      value: record.address ?? '—',
      icon: MapPin,
    },
  ];

  const handleOpenPreview = (file: ServicePackageRecordFile) => {
    const index = previewableFiles.findIndex((item) => item.id === file.id);
    if (index >= 0) {
      setPreviewIndex(index);
      setPreviewOpen(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              {
                label: t('breadcrumbs.servicePackagesRecords'),
                href: '/dashboard/service-packages-records',
              },
              { label: record.company ?? '—' },
            ]}
          />
        </div>
      </header>

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
        <Box
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
              {record.company ?? '—'}
            </Typography>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {metaChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/60 px-3 py-1 text-xs font-medium"
                >
                  <chip.icon className="size-3.5" />
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </Box>

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <SectionCard title={t('servicePackagesRecords.detail.section.contact')}>
              <div className="grid gap-4 md:grid-cols-2">
                {detailItems.map((item) => (
                  <DetailItem
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                  />
                ))}
              </div>
            </SectionCard>
            <SectionCard title={t('servicePackagesRecords.detail.section.service')}>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailItem
                  label={t('servicePackagesRecords.detail.serviceType')}
                  value={record.serviceType ?? '—'}
                />
                <DetailItem
                  label={t('servicePackagesRecords.detail.folderKey')}
                  value={record.folderKey ?? '—'}
                />
                <DetailItem
                  label={t('servicePackagesRecords.detail.createdAt')}
                  value={record.createdAt ? dateFormatter.format(new Date(record.createdAt)) : '—'}
                />
                <DetailItem
                  label={t('servicePackagesRecords.detail.updatedAt')}
                  value={record.updatedAt ? dateFormatter.format(new Date(record.updatedAt)) : '—'}
                />
              </div>
            </SectionCard>

            <SectionCard title={t('servicePackagesRecords.detail.section.flags')}>
              <div className="grid gap-4 md:grid-cols-2">
                <BooleanFlag
                  label={t('servicePackagesRecords.detail.flags.collectorSignature')}
                  value={Boolean(record.details?.hasCollectorSignature)}
                  trueLabel={t('servicePackagesRecords.detail.flags.yes')}
                  falseLabel={t('servicePackagesRecords.detail.flags.no')}
                />
                <BooleanFlag
                  label={t('servicePackagesRecords.detail.flags.clientSignature')}
                  value={Boolean(record.details?.hasClientSignature)}
                  trueLabel={t('servicePackagesRecords.detail.flags.yes')}
                  falseLabel={t('servicePackagesRecords.detail.flags.no')}
                />
              </div>
            </SectionCard>

            {record.details?.observations ? (
              <SectionCard title={t('servicePackagesRecords.detail.observations')}>
                <p className="text-sm text-muted-foreground">{record.details.observations}</p>
              </SectionCard>
            ) : null}

            <SectionCard title={t('servicePackagesRecords.detail.equipment')}>
              {record.details?.equipment?.length ? (
                <div className="overflow-x-auto rounded-2xl border border-border/60">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead className="bg-muted/80">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          {t('servicePackagesRecords.detail.equipmentNumber')}
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          {t('servicePackagesRecords.detail.equipmentName')}
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          {t('servicePackagesRecords.detail.equipmentBrand')}
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          {t('servicePackagesRecords.detail.equipmentModel')}
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          {t('servicePackagesRecords.detail.equipmentIdentification')}
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          {t('servicePackagesRecords.detail.equipmentSerial')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.details.equipment.map((equipment) => (
                        <tr
                          key={`${equipment.number}-${equipment.equipment}`}
                          className="border-t border-border/50"
                        >
                          <td className="px-4 py-2 font-mono text-xs">{equipment.number}</td>
                          <td className="px-4 py-2">{equipment.equipment}</td>
                          <td className="px-4 py-2">{equipment.brand}</td>
                          <td className="px-4 py-2">{equipment.model}</td>
                          <td className="px-4 py-2">{equipment.identification}</td>
                          <td className="px-4 py-2">{equipment.serialNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('servicePackagesRecords.detail.noEquipment')}
                </p>
              )}
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title={t('servicePackagesRecords.detail.files.title')}>
              <div className="space-y-3">
                {displayFiles.length ? (
                  displayFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      canPreview={isPreviewableFile(file)}
                      onPreview={() => handleOpenPreview(file)}
                      previewLabel={t('servicePackagesRecords.detail.files.preview')}
                      downloadLabel={t('servicePackagesRecords.detail.files.download')}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t('servicePackagesRecords.detail.files.empty')}
                  </p>
                )}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border/60 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/service-packages-records')}
          >
            {t('servicePackagesRecords.detail.back')}
          </Button>
          <Button variant="ghost" onClick={() => router.back()}>
            {t('servicePackagesRecords.detail.goBack')}
          </Button>
        </div>
      </Paper>

      {previewableFiles.length ? (
        <RecordFilePreviewDialog
          files={previewableFiles}
          currentIndex={previewIndex}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onNavigate={(index) => setPreviewIndex(index)}
          labels={{
            title: t('servicePackagesRecords.detail.files.previewTitle'),
            download: t('servicePackagesRecords.detail.files.download'),
            close: t('servicePackagesRecords.detail.files.close'),
            unsupported: t('servicePackagesRecords.detail.files.unsupported'),
            error: t('servicePackagesRecords.detail.files.previewError'),
          }}
        />
      ) : null}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="mt-4 space-y-3 text-sm text-foreground">{children}</div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/60 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium">
        {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
        {value || '—'}
      </p>
    </div>
  );
}

function BooleanFlag({
  label,
  value,
  trueLabel,
  falseLabel,
}: {
  label: string;
  value: boolean;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      {value ? (
        <span className="inline-flex items-center gap-1 text-sm text-success-700">
          <CheckCircle2 className="size-4" />
          {trueLabel}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <XCircle className="size-4" />
          {falseLabel}
        </span>
      )}
    </div>
  );
}

function FileCard({
  file,
  canPreview,
  onPreview,
  previewLabel,
  downloadLabel,
}: {
  file: ServicePackageRecordFile;
  canPreview: boolean;
  onPreview: () => void;
  previewLabel: string;
  downloadLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/60 p-4">
      <div>
        <p className="text-sm font-medium">{file.originalName}</p>
        <p className="text-xs text-muted-foreground">
          {file.contentType} · {formatSize(file.size)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {canPreview ? (
          <Button variant="outline" size="sm" onClick={onPreview}>
            {previewLabel}
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" asChild>
          <a href={file.url} target="_blank" rel="noreferrer">
            {downloadLabel}
          </a>
        </Button>
      </div>
    </div>
  );
}

function formatSize(size?: number) {
  if (!size || Number.isNaN(size)) {
    return '—';
  }
  if (size < 1024) {
    return `${size} B`;
  }
  const units = ['KB', 'MB', 'GB'];
  let value = size / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

function ServicePackagesRecordsDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </header>
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
        <Box sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="mt-2 h-4 w-1/4" />
        </Box>
        <div className="grid gap-6 p-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={`section-${idx}`} className="h-48 w-full rounded-3xl" />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={`aside-${idx}`} className="h-40 w-full rounded-3xl" />
            ))}
          </div>
        </div>
      </Paper>
    </div>
  );
}
