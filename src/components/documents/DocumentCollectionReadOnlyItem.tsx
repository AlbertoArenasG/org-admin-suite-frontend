'use client';

import { Eye, FileText, Paperclip } from 'lucide-react';
import { DownloadIcon } from 'lucide-animated';
import { useMemo, useState, type ReactNode } from 'react';

import {
  AttachmentImageGalleryDialog,
  AttachmentPdfPreviewDialog,
  type AttachmentImage,
  type AttachmentPdf,
} from '@/components/attachments';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DocumentCollectionItem } from './DocumentCollection';

export type DocumentCollectionReadOnlyAttachment = {
  fileId: string;
  originalName: string;
  mimeType: string;
  downloadUrl: string;
  previewUrl: string;
};

export type DocumentCollectionReadOnlyCopy = {
  closeFiles: string;
  download: string;
  empty: string;
  emptyFolder: string;
  fileCount: (count: number) => string;
  nextImage: string;
  openFiles: string;
  previousImage: string;
  preview: string;
};

type DocumentCollectionReadOnlyItemProps = {
  action?: ReactNode;
  collectionId: string;
  copy: DocumentCollectionReadOnlyCopy;
  expanded: boolean;
  files: readonly DocumentCollectionReadOnlyAttachment[];
  onExpandedChange: (expanded: boolean) => void;
  referenceLabel?: ReactNode;
  referenceNumber?: ReactNode;
  title: ReactNode;
};

/** Read-only document collection with expansion, image preview, and download actions. */
export function DocumentCollectionReadOnlyItem({
  action,
  collectionId,
  copy,
  expanded,
  files,
  onExpandedChange,
  referenceLabel,
  referenceNumber,
  title,
}: DocumentCollectionReadOnlyItemProps) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [pdfPreview, setPdfPreview] = useState<AttachmentPdf | null>(null);
  const images = useMemo<AttachmentImage[]>(
    () =>
      files
        .filter((file) => file.mimeType.startsWith('image/'))
        .map((file) => ({
          id: file.fileId,
          name: file.originalName,
          previewUrl: file.previewUrl,
          downloadUrl: file.downloadUrl,
        })),
    [files]
  );

  return (
    <>
      <DocumentCollectionItem
        action={action}
        attachmentsId={`${collectionId}-attachments`}
        closeLabel={copy.closeFiles}
        expanded={expanded}
        fileSummary={files.length ? copy.fileCount(files.length) : copy.emptyFolder}
        hasFiles={files.length > 0}
        onExpandedChange={onExpandedChange}
        openLabel={copy.openFiles}
        referenceLabel={referenceLabel}
        referenceNumber={referenceNumber}
        title={title}
      >
        <ReadOnlyAttachmentList
          copy={copy}
          files={files}
          onImageOpen={setGalleryIndex}
          onPdfOpen={setPdfPreview}
        />
      </DocumentCollectionItem>
      <AttachmentImageGalleryDialog
        copy={{
          download: copy.download,
          next: copy.nextImage,
          previous: copy.previousImage,
          title: typeof title === 'string' ? title : copy.preview,
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
        copy={{ download: copy.download }}
        onOpenChange={(open) => {
          if (!open) setPdfPreview(null);
        }}
        open={pdfPreview !== null}
      />
    </>
  );
}

function ReadOnlyAttachmentList({
  copy,
  files,
  onImageOpen,
  onPdfOpen,
}: {
  copy: DocumentCollectionReadOnlyCopy;
  files: readonly DocumentCollectionReadOnlyAttachment[];
  onImageOpen: (index: number) => void;
  onPdfOpen: (file: AttachmentPdf) => void;
}) {
  if (!files.length) return <p className="text-sm text-muted-foreground">{copy.empty}</p>;

  let imageIndex = -1;

  return (
    <ul className="space-y-2">
      {files.map((file) => {
        const isImage = file.mimeType.startsWith('image/');
        const isPdf = file.mimeType.toLowerCase() === 'application/pdf';
        const isPreviewable = isImage || isPdf;
        if (isImage) imageIndex += 1;
        const currentImageIndex = imageIndex;

        return (
          <li
            className={cn(
              'group relative flex min-w-0 items-center gap-3 rounded-lg border bg-muted/30 p-2 transition-colors',
              isPreviewable && 'cursor-pointer hover:bg-muted/60'
            )}
            key={file.fileId}
          >
            {isPreviewable ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    aria-label={`${copy.preview}: ${file.originalName}`}
                    className="absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() =>
                      isImage
                        ? onImageOpen(currentImageIndex)
                        : onPdfOpen({
                            downloadUrl: file.downloadUrl,
                            name: file.originalName,
                            previewUrl: file.previewUrl,
                          })
                    }
                    type="button"
                  />
                </TooltipTrigger>
                <TooltipContent>{copy.preview}</TooltipContent>
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
            {isImage ? (
              <span className="pointer-events-none relative z-10 size-10 shrink-0 overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element -- Preview URLs are backend-controlled and dynamic. */}
                <img alt="" className="size-full object-cover" src={file.previewUrl} />
                <span className="absolute inset-0 grid place-items-center bg-background/75 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <Eye aria-hidden="true" className="size-4" />
                </span>
              </span>
            ) : null}
            <span className="pointer-events-none relative z-10 min-w-0 flex-1 truncate text-sm font-medium">
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
                    aria-label={`${copy.download}: ${file.originalName}`}
                    download
                    href={file.downloadUrl}
                  >
                    <DownloadIcon animateOnHover aria-hidden="true" size={16} />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copy.download}</TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
}
