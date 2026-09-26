'use client';

import { Download, Paperclip, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  AttachmentImageGalleryDialog,
  AttachmentUploadDialog,
  type AttachmentImage,
} from '@/components/attachments';
import type { MutationFeedback, MutationRecovery } from '@/components/feedback';
import { FormField, FormReadValue } from '@/components/forms';
import {
  ResourceFormActions,
  ResourceFormFrame,
  ResourceFormSection,
  type ResourceFormMode,
} from '@/components/resource-form';
import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type {
  CustomerServiceRecordAttachment,
  CustomerServiceRecordDetail,
  CustomerServiceRecordDocumentType,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

const SUCCESS_FEEDBACK_DURATION_MS = 800;
const MAX_PENDING_FILES = 10;

type CustomerServiceRecordDocumentFormProps = {
  canUpdate: boolean;
  description: string;
  documentType: CustomerServiceRecordDocumentType;
  files: CustomerServiceRecordAttachment[];
  hasReferenceNumber: boolean;
  onSubmit: (input: {
    documentType: CustomerServiceRecordDocumentType;
    existingFileIds: string[];
    files: File[];
    referenceNumber?: string | null;
  }) => Promise<{ message: string | null; record: CustomerServiceRecordDetail }>;
  referenceNumber?: string | null;
  title: string;
};

export function CustomerServiceRecordDocumentForm({
  canUpdate,
  description,
  documentType,
  files,
  hasReferenceNumber,
  onSubmit,
  referenceNumber: initialReferenceNumber = null,
  title,
}: CustomerServiceRecordDocumentFormProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [referenceNumber, setReferenceNumber] = useState(initialReferenceNumber ?? '');
  const [currentFiles, setCurrentFiles] = useState(files);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedback>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecovery>();
  const successTimeoutRef = useRef<number | null>(null);
  const isReadOnly = mode === 'read';
  const isMutationLocked =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';

  useEffect(() => {
    if (!isReadOnly) return;
    setCurrentFiles(files);
    setReferenceNumber(initialReferenceNumber ?? '');
    setPendingFiles([]);
  }, [files, initialReferenceNumber, isReadOnly]);

  useEffect(() => {
    if (!canUpdate) setMode('read');
  }, [canUpdate]);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current);
    },
    []
  );

  const images = useMemo<AttachmentImage[]>(
    () =>
      currentFiles
        .filter((file) => file.mimeType.startsWith('image/'))
        .map((file) => ({
          id: file.fileId,
          name: file.originalName,
          previewUrl: file.previewUrl,
          downloadUrl: file.downloadUrl,
        })),
    [currentFiles]
  );

  const resetDraft = () => {
    setCurrentFiles(files);
    setReferenceNumber(initialReferenceNumber ?? '');
    setPendingFiles([]);
    setMutationFeedback(undefined);
    setMutationRecovery(undefined);
    setMode('read');
  };

  const getCanonicalDocument = (record: CustomerServiceRecordDetail) => {
    switch (documentType) {
      case 'quotation':
        return record.quotation;
      case 'purchase-order':
        return record.purchaseOrder;
      case 'invoice':
        return record.invoice;
      case 'other-files':
        return { files: record.otherFiles, referenceNumber: null };
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('detail.feedback.saving') });

    try {
      const result = await onSubmit({
        documentType,
        existingFileIds: currentFiles.map((file) => file.fileId),
        files: pendingFiles,
        ...(hasReferenceNumber ? { referenceNumber: referenceNumber.trim() || null } : {}),
      });
      const canonical = getCanonicalDocument(result.record);
      setCurrentFiles(canonical.files);
      setReferenceNumber(canonical.referenceNumber ?? '');
      setPendingFiles([]);
      setMutationFeedback({ status: 'success', title: t('detail.feedback.success') });
      showToast({
        duration: 4000,
        title: result.message ?? t('feedback.updated'),
        type: 'success',
      });
      successTimeoutRef.current = window.setTimeout(() => {
        setMode('read');
        setMutationFeedback(undefined);
      }, SUCCESS_FEEDBACK_DURATION_MS);
    } catch (error) {
      setMutationFeedback(undefined);
      setMutationRecovery({
        title: t('detail.feedback.errorTitle'),
        message: getMutationErrorMessage(error, t('feedback.error')),
        guidance: t('detail.feedback.errorGuidance'),
      });
    }
  };

  return (
    <form onSubmit={submit}>
      <ResourceFormFrame
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        description={description}
        dividers="hidden"
        footerActions={
          !isReadOnly ? (
            <ResourceFormActions
              cancelAction={{ label: t('form.actions.cancel'), onClick: resetDraft }}
              mutationFeedback={mutationFeedback}
              mutationRecovery={mutationRecovery}
              primaryAction={{
                label: t('form.actions.save'),
                loadingLabel: t('detail.feedback.saving'),
              }}
              status={mutationFeedback?.status === 'saving' ? 'saving' : 'idle'}
            />
          ) : null
        }
        headerActions={
          canUpdate ? (
            <Button disabled={!isReadOnly} onClick={() => setMode('edit')} size="sm" type="button">
              <Pencil aria-hidden="true" className="size-4" />
              {t('actions.edit')}
            </Button>
          ) : null
        }
        mode={mode}
        status={mutationFeedback?.status === 'saving' ? 'saving' : 'idle'}
        surface={{ base: 'bare', md: 'card' }}
        title={title}
      >
        <ResourceFormSection surface="bare">
          <FieldGroup>
            {hasReferenceNumber ? (
              <FormField
                htmlFor={isReadOnly ? undefined : `${documentType}-reference-number`}
                label={t('detail.documents.referenceNumber')}
                orientation="responsive"
              >
                {isReadOnly ? (
                  <FormReadValue>{referenceNumber || '—'}</FormReadValue>
                ) : (
                  <Input
                    disabled={isMutationLocked}
                    id={`${documentType}-reference-number`}
                    onChange={(event) => setReferenceNumber(event.target.value)}
                    placeholder={t('detail.documents.referencePlaceholder')}
                    value={referenceNumber}
                  />
                )}
              </FormField>
            ) : null}
            <FormField label={t('detail.documents.files')} orientation="responsive">
              <div className="space-y-3">
                <ExistingAttachmentList
                  downloadLabel={t('detail.documents.download')}
                  emptyLabel={t('detail.documents.empty')}
                  files={currentFiles}
                  onImageOpen={setGalleryIndex}
                  onRemove={
                    isReadOnly || isMutationLocked
                      ? undefined
                      : (fileId) =>
                          setCurrentFiles((items) => items.filter((file) => file.fileId !== fileId))
                  }
                  removeLabel={t('detail.documents.remove')}
                />
                {!isReadOnly && pendingFiles.length ? (
                  <PendingAttachmentList
                    files={pendingFiles}
                    onRemove={(index) =>
                      setPendingFiles((items) =>
                        items.filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                    removeLabel={t('detail.documents.remove')}
                    title={t('detail.documents.pendingFiles')}
                  />
                ) : null}
                {!isReadOnly ? (
                  <Button
                    disabled={isMutationLocked || pendingFiles.length >= MAX_PENDING_FILES}
                    onClick={() => setAttachmentDialogOpen(true)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Plus aria-hidden="true" />
                    {t('detail.documents.addFiles')}
                  </Button>
                ) : null}
              </div>
            </FormField>
          </FieldGroup>
        </ResourceFormSection>
      </ResourceFormFrame>
      <AttachmentUploadDialog
        copy={{
          attachmentsLabel: t('detail.documents.dialog.attachmentsLabel'),
          cancel: t('detail.documents.dialog.cancel'),
          confirm: t('detail.documents.dialog.confirm'),
          confirmEmpty: t('detail.documents.dialog.confirmEmpty'),
          gallery: {
            download: t('detail.documents.download'),
            next: t('detail.documents.nextImage'),
            previous: t('detail.documents.previousImage'),
            title: t('detail.documents.dialog.galleryTitle'),
          },
          maxFiles: (count) => t('detail.documents.dialog.maxFiles', { count }),
          maxFileSize: (megabytes) => t('detail.documents.dialog.maxFileSize', { megabytes }),
          title: t('detail.documents.dialog.title'),
          description: t('detail.documents.dialog.description'),
          uploadDescription: t('detail.documents.dialog.uploadDescription'),
          uploadTitle: t('detail.documents.dialog.uploadTitle'),
        }}
        maxFiles={MAX_PENDING_FILES - pendingFiles.length}
        onConfirm={(nextFiles) => setPendingFiles((files) => [...files, ...nextFiles])}
        onOpenChange={setAttachmentDialogOpen}
        open={attachmentDialogOpen}
      />
      <AttachmentImageGalleryDialog
        copy={{
          download: t('detail.documents.download'),
          next: t('detail.documents.nextImage'),
          previous: t('detail.documents.previousImage'),
          title,
        }}
        images={images}
        initialIndex={galleryIndex ?? 0}
        onOpenChange={(open) => {
          if (!open) setGalleryIndex(null);
        }}
        open={galleryIndex !== null}
      />
    </form>
  );
}

function ExistingAttachmentList({
  downloadLabel,
  emptyLabel,
  files,
  onImageOpen,
  onRemove,
  removeLabel,
}: {
  downloadLabel: string;
  emptyLabel: string;
  files: readonly CustomerServiceRecordAttachment[];
  onImageOpen: (index: number) => void;
  onRemove?: (fileId: string) => void;
  removeLabel: string;
}) {
  if (!files.length) return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;

  let imageIndex = -1;
  return (
    <ul className="space-y-2">
      {files.map((file) => {
        const isImage = file.mimeType.startsWith('image/');
        if (isImage) imageIndex += 1;
        const currentImageIndex = imageIndex;

        return (
          <li
            className="flex min-w-0 items-center gap-3 rounded-lg border bg-muted/30 p-2"
            key={file.fileId}
          >
            {isImage ? (
              <button
                aria-label={file.originalName}
                className="size-10 shrink-0 overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onImageOpen(currentImageIndex)}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Preview URLs are backend-controlled and dynamic. */}
                <img alt="" className="size-full object-cover" src={file.previewUrl} />
              </button>
            ) : (
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <Paperclip aria-hidden="true" className="size-4" />
              </span>
            )}
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.originalName}</span>
            <Button asChild size="icon-sm" variant="ghost">
              <a
                aria-label={`${downloadLabel}: ${file.originalName}`}
                download
                href={file.downloadUrl}
              >
                <Download aria-hidden="true" />
              </a>
            </Button>
            {onRemove ? (
              <Button
                aria-label={`${removeLabel}: ${file.originalName}`}
                onClick={() => onRemove(file.fileId)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function PendingAttachmentList({
  files,
  onRemove,
  removeLabel,
  title,
}: {
  files: readonly File[];
  onRemove: (index: number) => void;
  removeLabel: string;
  title: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li
            className="flex min-w-0 items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-2"
            key={`${file.name}-${file.lastModified}-${index}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Paperclip aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <Button
              aria-label={`${removeLabel}: ${file.name}`}
              onClick={() => onRemove(index)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
