'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { AttachmentImageGalleryDialog, type AttachmentImage } from './AttachmentImageGalleryDialog';
import {
  AttachmentUpload,
  type AttachmentRejectReason,
  type AttachmentUploadHandle,
  type AttachmentUploadItem,
} from '@/components/vendor/beui/attachment-upload/motion/attachment-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type AttachmentUploadDialogCopy = {
  attachmentsLabel: string;
  cancel: string;
  confirm: string;
  confirmEmpty: string;
  gallery: {
    download: string;
    next: string;
    previous: string;
    title: string;
  };
  maxFiles: (maxFiles: number) => string;
  maxFileSize: (maxFileSizeMb: number) => string;
  title: string;
  description?: string;
  uploadDescription: string;
  uploadTitle: string;
};

type AttachmentUploadDialogProps = {
  accept?: string;
  copy: AttachmentUploadDialogCopy;
  maxFiles?: number;
  maxFileSize?: number;
  multiple?: boolean;
  onConfirm: (files: File[]) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

/**
 * Generic, local-only attachment picker. It has no remote dependencies: the
 * consumer receives selected File objects and decides whether and when to upload.
 */
export function AttachmentUploadDialog({
  accept,
  copy,
  maxFiles = 10,
  maxFileSize = 20 * 1024 * 1024,
  multiple = true,
  onConfirm,
  onOpenChange,
  open,
}: AttachmentUploadDialogProps) {
  const uploadRef = useRef<AttachmentUploadHandle>(null);
  const progressTimersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [items, setItems] = useState<AttachmentUploadItem[]>([]);
  const [rejection, setRejection] = useState<AttachmentRejectReason | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const selectedImages = useMemo<AttachmentImage[]>(
    () =>
      items
        .filter((item) => item.kind === 'image' && item.previewUrl && item.href)
        .map((item) => ({
          id: item.id,
          name: item.name,
          previewUrl: item.previewUrl!,
          downloadUrl: item.href!,
        })),
    [items]
  );
  const selectedFiles = items.flatMap((item) => (item.file instanceof File ? [item.file] : []));
  const isPreparingSelection = items.some((item) => item.status === 'uploading');

  const clearProgressTimers = () => {
    for (const timer of progressTimersRef.current) clearTimeout(timer);
    progressTimersRef.current.clear();
  };

  useEffect(
    () => () => {
      for (const timer of progressTimersRef.current) clearTimeout(timer);
      progressTimersRef.current.clear();
    },
    []
  );

  const simulatePreparation = (addedItems: AttachmentUploadItem[]) => {
    const ids = new Set(addedItems.map((item) => item.id));
    setItems((current) =>
      current.map((item) => (ids.has(item.id) ? { ...item, status: 'uploading' } : item))
    );

    const completeTimer = setTimeout(() => {
      progressTimersRef.current.delete(completeTimer);
      setItems((current) =>
        current.map((item) => (ids.has(item.id) ? { ...item, status: 'complete' } : item))
      );

      const idleTimer = setTimeout(() => {
        progressTimersRef.current.delete(idleTimer);
        setItems((current) =>
          current.map((item) => (ids.has(item.id) ? { ...item, status: 'idle' } : item))
        );
      }, 800);
      progressTimersRef.current.add(idleTimer);
    }, 900);
    progressTimersRef.current.add(completeTimer);
  };

  const discard = () => {
    clearProgressTimers();
    setItems([]);
    setRejection(null);
    setGalleryIndex(null);
  };
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) discard();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          {copy.description ? <DialogDescription>{copy.description}</DialogDescription> : null}
        </DialogHeader>
        <AttachmentUpload
          ref={uploadRef}
          accept={accept}
          attachmentsLabel={copy.attachmentsLabel}
          description={copy.uploadDescription}
          maxFileSize={maxFileSize}
          maxFiles={maxFiles}
          multiple={multiple}
          onFilesAdded={(addedItems) => simulatePreparation(addedItems)}
          onFilesRejected={(_, reason) => setRejection(reason)}
          onImagePreview={(item) => {
            const imageIndex = selectedImages.findIndex((image) => image.id === item.id);
            if (imageIndex >= 0) setGalleryIndex(imageIndex);
          }}
          onValueChange={(nextItems) => {
            setRejection(null);
            setItems(nextItems);
          }}
          title={copy.uploadTitle}
          value={items}
        />
        {rejection ? (
          <p className="text-sm text-destructive">
            {rejection === 'max-files'
              ? copy.maxFiles(maxFiles)
              : copy.maxFileSize(Math.round(maxFileSize / (1024 * 1024)))}
          </p>
        ) : null}
        <DialogFooter className="mt-2 gap-2 sm:space-x-0">
          <Button onClick={() => handleOpenChange(false)} type="button" variant="outline">
            {copy.cancel}
          </Button>
          <Button
            disabled={selectedFiles.length > 0 && isPreparingSelection}
            onClick={() => {
              if (!selectedFiles.length) {
                uploadRef.current?.browse();
                return;
              }

              onConfirm(selectedFiles);
              discard();
              onOpenChange(false);
            }}
            type="button"
          >
            {selectedFiles.length ? copy.confirm : copy.confirmEmpty}
          </Button>
        </DialogFooter>
      </DialogContent>
      <AttachmentImageGalleryDialog
        copy={copy.gallery}
        images={selectedImages}
        initialIndex={galleryIndex ?? 0}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setGalleryIndex(null);
        }}
        open={galleryIndex !== null}
      />
    </Dialog>
  );
}
