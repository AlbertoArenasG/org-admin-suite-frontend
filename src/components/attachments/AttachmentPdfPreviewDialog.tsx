'use client';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type AttachmentPdf = {
  downloadUrl: string;
  name: string;
  previewUrl: string;
};

type AttachmentPdfPreviewDialogProps = {
  attachment: AttachmentPdf | null;
  copy: { download: string };
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

/** A domain-neutral inline PDF viewer for persisted attachments. */
export function AttachmentPdfPreviewDialog({
  attachment,
  copy,
  onOpenChange,
  open,
}: AttachmentPdfPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(90vh,56rem)] w-[min(96vw,72rem)] max-w-none flex-col gap-4 p-4 sm:p-6">
        <DialogHeader className="pr-10">
          <DialogTitle className="truncate">{attachment?.name}</DialogTitle>
        </DialogHeader>
        {attachment ? (
          <iframe
            className="min-h-0 flex-1 rounded-xl border bg-muted/30"
            src={attachment.previewUrl}
            title={attachment.name}
          />
        ) : null}
        {attachment ? (
          <div className="flex justify-end">
            <Button asChild size="sm" variant="outline">
              <a download href={attachment.downloadUrl}>
                <Download aria-hidden="true" />
                {copy.download}
              </a>
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
