'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileArchive } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  resetServicePackageZipUpload,
  uploadServicePackageZip,
} from '@/features/servicePackagesRecords';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  AttachmentUpload,
  type AttachmentUploadItem,
} from '@/components/vendor/beui/attachment-upload/motion/attachment-upload';

type ServicePackageZipUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefreshList: () => void;
};

export function ServicePackageZipUploadDialog({
  open,
  onOpenChange,
  onRefreshList,
}: ServicePackageZipUploadDialogProps) {
  const { t, i18n } = useTranslationHydrated('servicePackagesRecords');
  const dispatch = useAppDispatch();
  const upload = useAppSelector((state) => state.servicePackagesRecords.upload);
  const [items, setItems] = useState<AttachmentUploadItem[]>([]);
  const preparationTimersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const isSubmitting = upload.status === 'loading';
  const outcome = upload.outcome;
  const file = items[0]?.file ?? null;
  const isPreparingSelection = items.some((item) => item.status === 'uploading');

  useEffect(
    () => () => {
      for (const timer of preparationTimersRef.current) clearTimeout(timer);
      preparationTimersRef.current.clear();
    },
    []
  );

  useEffect(() => {
    if (open && outcome) resultHeadingRef.current?.focus();
  }, [open, outcome]);

  const clearPreparation = () => {
    for (const timer of preparationTimersRef.current) clearTimeout(timer);
    preparationTimersRef.current.clear();
  };

  const simulatePreparation = (addedItems: AttachmentUploadItem[]) => {
    const ids = new Set(addedItems.map((item) => item.id));
    setItems((current) =>
      current.map((item) => (ids.has(item.id) ? { ...item, status: 'uploading' } : item))
    );

    const completeTimer = setTimeout(() => {
      preparationTimersRef.current.delete(completeTimer);
      setItems((current) =>
        current.map((item) => (ids.has(item.id) ? { ...item, status: 'complete' } : item))
      );

      const idleTimer = setTimeout(() => {
        preparationTimersRef.current.delete(idleTimer);
        setItems((current) =>
          current.map((item) => (ids.has(item.id) ? { ...item, status: 'idle' } : item))
        );
      }, 800);
      preparationTimersRef.current.add(idleTimer);
    }, 900);
    preparationTimersRef.current.add(completeTimer);
  };

  const close = () => {
    if (isSubmitting) return;
    clearPreparation();
    setItems([]);
    setSelectionError(null);
    dispatch(resetServicePackageZipUpload());
    onOpenChange(false);
  };

  const submit = async () => {
    if (!file || isPreparingSelection || isSubmitting || outcome) return;
    const action = await dispatch(uploadServicePackageZip({ file }));
    if (uploadServicePackageZip.fulfilled.match(action)) onRefreshList();
  };

  const formatSize = (size: number) => {
    const megabytes = size / (1024 * 1024);
    const value = megabytes >= 1 ? megabytes : size / 1024;
    const unit = megabytes >= 1 ? 'MB' : 'KB';
    return `${new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(value)} ${unit}`;
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : close())}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl"
        onEscapeKeyDown={(event) => {
          if (isSubmitting || outcome) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isSubmitting || outcome) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('upload.title')}</DialogTitle>
          <DialogDescription>{t('upload.description')}</DialogDescription>
        </DialogHeader>

        {!outcome ? (
          <div className="mt-5 space-y-4">
            {isSubmitting && file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <FileArchive aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
              </div>
            ) : (
              <AttachmentUpload
                value={items}
                accept=".zip,application/zip"
                multiple={false}
                maxFiles={1}
                maxFileSize={Infinity}
                inputAriaLabel={t('upload.selectTitle')}
                maxReachedTitle={t('upload.selectedFile')}
                maxReachedDescription={t('upload.selectDescription')}
                title={t('upload.selectTitle')}
                description={t('upload.selectDescription')}
                attachmentsLabel={t('upload.selectedFile')}
                onFilesRejected={(_, reason) =>
                  setSelectionError(
                    reason === 'max-files' ? t('upload.oneFileOnly') : t('upload.invalidFile')
                  )
                }
                onValueChange={(nextItems) => {
                  const selected = nextItems[0]?.file;
                  if (!selected) {
                    clearPreparation();
                    setItems([]);
                    setSelectionError(null);
                    return;
                  }
                  if (!selected.name.toLowerCase().endsWith('.zip')) {
                    setSelectionError(t('upload.invalidType'));
                    setItems([]);
                    return;
                  }
                  if (selected.size === 0) {
                    setSelectionError(t('upload.emptyFile'));
                    setItems([]);
                    return;
                  }
                  setSelectionError(null);
                  setItems(nextItems);
                }}
                onFilesAdded={(addedItems, files) => {
                  if (files[0]?.name.toLowerCase().endsWith('.zip') && files[0].size > 0) {
                    simulatePreparation(addedItems);
                  }
                }}
              />
            )}

            {selectionError ? (
              <p role="alert" className="text-sm text-destructive">
                {selectionError}
              </p>
            ) : null}
            {isSubmitting ? (
              <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
                {t('upload.processingDescription')}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{t('upload.confirmDescription')}</p>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {outcome.kind === 'confirmed' ? (
              <div aria-live="polite" className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-primary"
                  />
                  <div className="min-w-0 space-y-1">
                    <h3
                      ref={resultHeadingRef}
                      tabIndex={-1}
                      className="font-semibold text-foreground outline-none"
                    >
                      {t('upload.confirmedTitle')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('upload.confirmedCount', { count: outcome.services.length })}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    {t('upload.packageId')}:{' '}
                    <span className="break-all font-mono text-foreground">{outcome.packageId}</span>
                  </p>
                  {outcome.services.length ? (
                    <div>
                      <p className="font-medium text-foreground">{t('upload.confirmedOrders')}</p>
                      <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-3">
                        {outcome.services.map((service) => (
                          <li key={service.recordId} className="break-words text-foreground">
                            {service.serviceOrder}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{t('upload.filteredListNote')}</p>
              </div>
            ) : (
              <div
                role="alert"
                className="space-y-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-destructive"
                  />
                  <div className="space-y-2">
                    <h3
                      ref={resultHeadingRef}
                      tabIndex={-1}
                      className="font-semibold text-foreground outline-none"
                    >
                      {outcome.kind === 'server-error'
                        ? t('upload.serverErrorTitle')
                        : t('upload.uncertainTitle')}
                    </h3>
                    <p className="text-sm text-foreground">
                      {outcome.kind === 'server-error'
                        ? outcome.message ||
                          t('upload.serverErrorFallback', { status: outcome.status })
                        : t(
                            outcome.reason === 'network'
                              ? 'upload.networkUncertain'
                              : 'upload.unreadableUncertain'
                          )}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {outcome.kind === 'server-error'
                    ? t('upload.partialWarning')
                    : t('upload.checkBeforeRetry')}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="mt-6 gap-2 sm:space-x-0">
          {outcome ? (
            <>
              <Button
                type="button"
                variant={outcome.kind === 'confirmed' ? 'default' : 'outline'}
                onClick={close}
              >
                {t('upload.close')}
              </Button>
              {outcome.kind !== 'confirmed' ? (
                <Button
                  type="button"
                  onClick={() => {
                    onRefreshList();
                    close();
                  }}
                >
                  {t('upload.verifyInList')}
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={close}>
                {t('upload.cancel')}
              </Button>
              <Button
                type="button"
                disabled={!file || isPreparingSelection}
                loading={isSubmitting}
                loadingLabel={t('upload.processing')}
                onClick={submit}
              >
                {t('upload.submit')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
