'use client';

import { Eye, FileText, GripVertical, Paperclip, Pencil, Plus, Trash2 } from 'lucide-react';
import { DownloadIcon } from 'lucide-animated';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  AttachmentImageGalleryDialog,
  AttachmentPdfPreviewDialog,
  AttachmentUploadDialog,
  type AttachmentImage,
  type AttachmentPdf,
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

export type CustomerServiceRecordDocumentSubmissionItem =
  | { kind: 'existing'; fileId: string }
  | { file: File; kind: 'pending' };

type CustomerServiceRecordDocumentDraftItem =
  | { attachment: CustomerServiceRecordAttachment; id: string; kind: 'existing' }
  | { file: File; id: string; kind: 'pending' };

type CustomerServiceRecordDocumentFormProps = {
  canUpdate: boolean;
  collectionId: string;
  expanded: boolean;
  files: CustomerServiceRecordAttachment[];
  hasReferenceNumber: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onSubmit: (input: {
    items: CustomerServiceRecordDocumentSubmissionItem[];
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
  const [animateReadTransition, setAnimateReadTransition] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState(initialReferenceNumber ?? '');
  const [attachmentItems, setAttachmentItems] = useState<CustomerServiceRecordDocumentDraftItem[]>(
    () => createExistingAttachmentItems(files)
  );
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [pdfPreview, setPdfPreview] = useState<AttachmentPdf | null>(null);
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedback>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecovery>();
  const successTimeoutRef = useRef<number | null>(null);
  const isReadOnly = mode === 'read';
  const expanded = parentExpanded || !isReadOnly;
  const isMutationLocked =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';
  const attachmentCount = attachmentItems.length;
  const pendingAttachmentCount = attachmentItems.filter((item) => item.kind === 'pending').length;
  const attachmentsId = `${collectionId}-attachments`;
  const attachmentSummary = attachmentCount
    ? t('detail.documents.fileCount', { count: attachmentCount })
    : t('detail.documents.emptyFolder');

  useEffect(() => {
    if (!isReadOnly) return;
    setAttachmentItems(createExistingAttachmentItems(files));
    setReferenceNumber(initialReferenceNumber ?? '');
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
      attachmentItems
        .filter(
          (item): item is Extract<CustomerServiceRecordDocumentDraftItem, { kind: 'existing' }> =>
            item.kind === 'existing'
        )
        .filter((item) => item.attachment.mimeType.startsWith('image/'))
        .map((item) => ({
          id: item.attachment.fileId,
          name: item.attachment.originalName,
          previewUrl: item.attachment.previewUrl,
          downloadUrl: item.attachment.downloadUrl,
        })),
    [attachmentItems]
  );
  const existingFiles = useMemo(
    () => attachmentItems.flatMap((item) => (item.kind === 'existing' ? [item.attachment] : [])),
    [attachmentItems]
  );

  const resetDraft = () => {
    setAttachmentItems(createExistingAttachmentItems(files));
    setReferenceNumber(initialReferenceNumber ?? '');
    setMutationFeedback(undefined);
    setMutationRecovery(undefined);
    setAnimateReadTransition(true);
    setMode('read');
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('detail.feedback.saving') });

    try {
      const result = await onSubmit({
        items: attachmentItems.map((item) =>
          item.kind === 'existing'
            ? { fileId: item.attachment.fileId, kind: 'existing' }
            : { file: item.file, kind: 'pending' }
        ),
        ...(hasReferenceNumber ? { referenceNumber: referenceNumber.trim() || null } : {}),
      });
      setAttachmentItems(createExistingAttachmentItems(result.files));
      setReferenceNumber(result.referenceNumber ?? '');
      setMutationFeedback({ status: 'success', title: t('detail.feedback.success') });
      showToast({
        duration: 4000,
        title: result.message ?? t('feedback.updated'),
        type: 'success',
      });
      successTimeoutRef.current = window.setTimeout(() => {
        setAnimateReadTransition(true);
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
            setAnimateReadTransition(false);
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
        animateInitialExpansion={animateReadTransition}
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
        files={existingFiles}
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
        animateInitialExpansion
        attachmentsId={attachmentsId}
        closeLabel={t('detail.documents.closeFiles')}
        expanded={expanded}
        exposeFolderContents
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
        <SortableAttachmentList
          disabled={isMutationLocked}
          downloadLabel={t('detail.documents.download')}
          emptyLabel={t('detail.documents.empty')}
          items={attachmentItems}
          onImageOpen={setGalleryIndex}
          onPdfOpen={(file) =>
            setPdfPreview({
              downloadUrl: file.downloadUrl,
              name: file.originalName,
              previewUrl: file.previewUrl,
            })
          }
          onItemsChange={setAttachmentItems}
          onRemove={(itemId) =>
            setAttachmentItems((items) => items.filter((item) => item.id !== itemId))
          }
          pendingLabel={t('detail.documents.pending')}
          previewLabel={t('detail.documents.preview')}
          removeLabel={t('detail.documents.remove')}
          reorderLabel={t('detail.documents.reorder')}
        />
        {!isReadOnly ? (
          <Button
            disabled={isMutationLocked || pendingAttachmentCount >= MAX_PENDING_FILES}
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
        maxFiles={MAX_PENDING_FILES - pendingAttachmentCount}
        onConfirm={(nextFiles) =>
          setAttachmentItems((items) => [...items, ...createPendingAttachmentItems(nextFiles)])
        }
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
      <AttachmentPdfPreviewDialog
        attachment={pdfPreview}
        copy={{ download: t('detail.documents.download') }}
        onOpenChange={(open) => {
          if (!open) setPdfPreview(null);
        }}
        open={pdfPreview !== null}
      />
    </form>
  );
}

function SortableAttachmentList({
  disabled,
  downloadLabel,
  emptyLabel,
  items,
  onImageOpen,
  onItemsChange,
  onPdfOpen,
  onRemove,
  pendingLabel,
  previewLabel,
  removeLabel,
  reorderLabel,
}: {
  disabled: boolean;
  downloadLabel: string;
  emptyLabel: string;
  items: CustomerServiceRecordDocumentDraftItem[];
  onImageOpen: (index: number) => void;
  onItemsChange: (items: CustomerServiceRecordDocumentDraftItem[]) => void;
  onPdfOpen: (file: CustomerServiceRecordAttachment) => void;
  onRemove: (itemId: string) => void;
  pendingLabel: string;
  previewLabel: string;
  removeLabel: string;
  reorderLabel: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    onItemsChange(arrayMove(items, oldIndex, newIndex));
  };

  if (!items.length) return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;

  let imageIndex = -1;
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={disabled ? undefined : sensors}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {items.map((item) => {
            const isImage =
              item.kind === 'existing' && item.attachment.mimeType.startsWith('image/');
            if (isImage) imageIndex += 1;

            return (
              <SortableAttachmentItem
                disabled={disabled}
                downloadLabel={downloadLabel}
                imageIndex={isImage ? imageIndex : null}
                item={item}
                key={item.id}
                onImageOpen={onImageOpen}
                onPdfOpen={onPdfOpen}
                onRemove={onRemove}
                pendingLabel={pendingLabel}
                previewLabel={previewLabel}
                removeLabel={removeLabel}
                reorderLabel={reorderLabel}
              />
            );
          })}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableAttachmentItem({
  disabled,
  downloadLabel,
  imageIndex,
  item,
  onImageOpen,
  onPdfOpen,
  onRemove,
  pendingLabel,
  previewLabel,
  removeLabel,
  reorderLabel,
}: {
  disabled: boolean;
  downloadLabel: string;
  imageIndex: number | null;
  item: CustomerServiceRecordDocumentDraftItem;
  onImageOpen: (index: number) => void;
  onPdfOpen: (file: CustomerServiceRecordAttachment) => void;
  onRemove: (itemId: string) => void;
  pendingLabel: string;
  previewLabel: string;
  removeLabel: string;
  reorderLabel: string;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ disabled, id: item.id });
  const attachment = item.kind === 'existing' ? item.attachment : null;
  const name = item.kind === 'existing' ? item.attachment.originalName : item.file.name;
  const isImage = attachment?.mimeType.startsWith('image/') ?? false;
  const isPdf = attachment?.mimeType.toLowerCase() === 'application/pdf';
  const isPreviewable = Boolean(attachment && (isImage || isPdf));

  return (
    <li
      className={cn(
        'group relative flex min-w-0 items-center gap-3 rounded-lg border bg-muted/30 p-2 transition-[background-color,box-shadow,transform] duration-200',
        item.kind === 'pending' && 'border-dashed',
        isPreviewable && 'cursor-pointer hover:bg-muted/60',
        isDragging && 'z-20 bg-card shadow-lg ring-1 ring-ring/30'
      )}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {isPreviewable ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label={`${previewLabel}: ${name}`}
              className="absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => {
                if (isImage && imageIndex !== null) onImageOpen(imageIndex);
                if (isPdf && attachment) onPdfOpen(attachment);
              }}
              type="button"
            />
          </TooltipTrigger>
          <TooltipContent>{previewLabel}</TooltipContent>
        </Tooltip>
      ) : null}
      {!isImage ? (
        <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          {isPdf ? (
            <FileText aria-hidden="true" className="size-4" />
          ) : (
            <Paperclip aria-hidden="true" className="size-4" />
          )}
        </span>
      ) : null}
      {isImage && attachment ? (
        <span className="relative z-10 size-10 shrink-0 overflow-hidden rounded-md pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element -- Preview URLs are backend-controlled and dynamic. */}
          <img alt="" className="size-full object-cover" src={attachment.previewUrl} />
          <span className="absolute inset-0 grid place-items-center bg-background/75 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <Eye aria-hidden="true" className="size-4" />
          </span>
        </span>
      ) : null}
      <span className="relative z-10 min-w-0 flex-1 truncate text-sm font-medium pointer-events-none">
        {name}
      </span>
      {item.kind === 'pending' ? (
        <span className="relative z-10 rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground">
          {pendingLabel}
        </span>
      ) : null}
      {attachment ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              className="relative z-10 hover:bg-primary/10 hover:text-primary"
              size="icon-sm"
              variant="ghost"
            >
              <a aria-label={`${downloadLabel}: ${name}`} download href={attachment.downloadUrl}>
                <DownloadIcon animateOnHover aria-hidden="true" size={16} />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{downloadLabel}</TooltipContent>
        </Tooltip>
      ) : null}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={`${reorderLabel}: ${name}`}
            className="relative z-10 cursor-grab touch-none active:cursor-grabbing"
            disabled={disabled}
            ref={setActivatorNodeRef}
            size="icon-sm"
            type="button"
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            <GripVertical aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{reorderLabel}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={`${removeLabel}: ${name}`}
            className="relative z-10"
            disabled={disabled}
            onClick={() => onRemove(item.id)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{removeLabel}</TooltipContent>
      </Tooltip>
    </li>
  );
}

function createExistingAttachmentItems(files: CustomerServiceRecordAttachment[]) {
  return files.map((attachment, index) => ({
    attachment,
    id: `existing-${attachment.fileId}-${index}`,
    kind: 'existing' as const,
  }));
}

function createPendingAttachmentItems(files: File[]) {
  return files.map((file) => ({
    file,
    id: `pending-${crypto.randomUUID()}`,
    kind: 'pending' as const,
  }));
}

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
