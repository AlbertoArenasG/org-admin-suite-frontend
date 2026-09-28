'use client';

import { Eye, Paperclip, Pencil, Plus, Trash2 } from 'lucide-react';
import { DownloadIcon } from 'lucide-animated';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  AttachmentImageGalleryDialog,
  AttachmentUploadDialog,
  type AttachmentImage,
} from '@/components/attachments';
import { DocumentCollectionItem } from '@/components/documents/DocumentCollection';
import { DocumentCollectionReadOnlyItem } from '@/components/documents/DocumentCollectionReadOnlyItem';
import type { MutationFeedback, MutationRecovery } from '@/components/feedback';
import { ResourceFormActions, type ResourceFormMode } from '@/components/resource-form';
import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { CustomerServiceRecordAttachment } from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { cn } from '@/lib/utils';

const SUCCESS_FEEDBACK_DURATION_MS = 800;
const MAX_PENDING_FILES = 10;

type CustomerServiceRecordDocumentFormProps = {
  canUpdate: boolean;
  collectionId: string;
  expanded: boolean;
  files: CustomerServiceRecordAttachment[];
  hasReferenceNumber: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onSubmit: (input: {
    existingFileIds: string[];
    files: File[];
    referenceNumber?: string | null;
  }) => Promise<{
    files: CustomerServiceRecordAttachment[];
    message: string | null;
    referenceNumber?: string | null;
  }>;
  referenceNumber?: string | null;
  title: string;
};

export function CustomerServiceRecordDocumentForm({
  canUpdate,
  collectionId,
  expanded: parentExpanded,
  files,
  hasReferenceNumber,
  onExpandedChange,
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
  const expanded = parentExpanded || !isReadOnly;
  const isMutationLocked =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';
  const attachmentCount = currentFiles.length + pendingFiles.length;
  const attachmentsId = `${collectionId}-attachments`;
  const attachmentSummary = attachmentCount
    ? t('detail.documents.fileCount', { count: attachmentCount })
    : t('detail.documents.emptyFolder');

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

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('detail.feedback.saving') });

    try {
      const result = await onSubmit({
        existingFileIds: currentFiles.map((file) => file.fileId),
        files: pendingFiles,
        ...(hasReferenceNumber ? { referenceNumber: referenceNumber.trim() || null } : {}),
      });
      setCurrentFiles(result.files);
      setReferenceNumber(result.referenceNumber ?? '');
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

  const editAction = canUpdate ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={`${t('actions.edit')}: ${title}`}
          disabled={!isReadOnly}
          onClick={() => {
            onExpandedChange(true);
            setMode('edit');
          }}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Pencil aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t('actions.edit')}</TooltipContent>
    </Tooltip>
  ) : null;

  if (isReadOnly) {
    return (
      <DocumentCollectionReadOnlyItem
        action={editAction}
        collectionId={collectionId}
        copy={{
          closeFiles: t('detail.documents.closeFiles'),
          download: t('detail.documents.download'),
          empty: t('detail.documents.empty'),
          emptyFolder: t('detail.documents.emptyFolder'),
          fileCount: (count) => t('detail.documents.fileCount', { count }),
          nextImage: t('detail.documents.nextImage'),
          openFiles: t('detail.documents.openFiles'),
          previousImage: t('detail.documents.previousImage'),
          preview: t('detail.documents.preview'),
        }}
        expanded={parentExpanded}
        files={currentFiles}
        onExpandedChange={onExpandedChange}
        referenceLabel={t('detail.documents.reference')}
        referenceNumber={hasReferenceNumber ? referenceNumber || '—' : undefined}
        title={title}
      />
    );
  }

  return (
    <form
      className={cn(mutationFeedback?.status === 'saving' && 'pointer-events-none opacity-70')}
      onSubmit={submit}
    >
      <DocumentCollectionItem
        action={editAction}
        attachmentsId={attachmentsId}
        closeLabel={t('detail.documents.closeFiles')}
        expanded={expanded}
        fileSummary={attachmentSummary}
        hasFiles={attachmentCount > 0}
        openLabel={t('detail.documents.openFiles')}
        onExpandedChange={() => onExpandedChange(true)}
        referenceLabel={t('detail.documents.reference')}
        referenceNumber={hasReferenceNumber ? referenceNumber || '—' : undefined}
        title={title}
      >
        {!isReadOnly && hasReferenceNumber ? (
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium" htmlFor={`${collectionId}-reference-number`}>
              {t('detail.documents.referenceNumber')}
            </label>
            <Input
              className="h-9 w-40"
              disabled={isMutationLocked}
              id={`${collectionId}-reference-number`}
              onChange={(event) => setReferenceNumber(event.target.value)}
              placeholder={t('detail.documents.referencePlaceholder')}
              value={referenceNumber}
            />
          </div>
        ) : null}
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
          previewLabel={t('detail.documents.preview')}
          removeLabel={t('detail.documents.remove')}
        />
        {!isReadOnly && pendingFiles.length ? (
          <PendingAttachmentList
            files={pendingFiles}
            onRemove={(index) =>
              setPendingFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))
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
        {!isReadOnly ? (
          <div className="border-t border-border/70 pt-3">
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
          </div>
        ) : null}
      </DocumentCollectionItem>
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
  previewLabel,
  removeLabel,
}: {
  downloadLabel: string;
  emptyLabel: string;
  files: readonly CustomerServiceRecordAttachment[];
  onImageOpen: (index: number) => void;
  onRemove?: (fileId: string) => void;
  previewLabel: string;
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
            className={cn(
              'group relative flex min-w-0 items-center gap-3 rounded-lg border bg-muted/30 p-2 transition-colors',
              isImage && 'cursor-pointer hover:bg-muted/60'
            )}
            key={file.fileId}
          >
            {isImage ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    aria-label={`${previewLabel}: ${file.originalName}`}
                    className="absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() => onImageOpen(currentImageIndex)}
                    type="button"
                  />
                </TooltipTrigger>
                <TooltipContent>{previewLabel}</TooltipContent>
              </Tooltip>
            ) : (
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <Paperclip aria-hidden="true" className="size-4" />
              </span>
            )}
            {isImage ? (
              <span className="relative z-10 size-10 shrink-0 overflow-hidden rounded-md pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element -- Preview URLs are backend-controlled and dynamic. */}
                <img alt="" className="size-full object-cover" src={file.previewUrl} />
                <span className="absolute inset-0 grid place-items-center bg-background/75 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <Eye aria-hidden="true" className="size-4" />
                </span>
              </span>
            ) : null}
            <span className="relative z-10 min-w-0 flex-1 truncate text-sm font-medium pointer-events-none">
              {file.originalName}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  className="relative z-10 hover:bg-primary/10 hover:text-primary"
                  size="icon-sm"
                  variant="ghost"
                >
                  <a
                    aria-label={`${downloadLabel}: ${file.originalName}`}
                    download
                    href={file.downloadUrl}
                  >
                    <DownloadIcon animateOnHover aria-hidden="true" size={16} />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{downloadLabel}</TooltipContent>
            </Tooltip>
            {onRemove ? (
              <Button
                aria-label={`${removeLabel}: ${file.originalName}`}
                className="relative z-10"
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
