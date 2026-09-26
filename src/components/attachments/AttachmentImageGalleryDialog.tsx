'use client';

import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type AttachmentImage = {
  id: string;
  name: string;
  previewUrl: string;
  downloadUrl: string;
};

export type AttachmentImageGalleryCopy = {
  download: string;
  next: string;
  previous: string;
  title: string;
};

type AttachmentImageGalleryDialogProps = {
  copy: AttachmentImageGalleryCopy;
  images: readonly AttachmentImage[];
  initialIndex: number;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

/** A domain-neutral image viewer for a single attachment collection. */
export function AttachmentImageGalleryDialog({
  copy,
  images,
  initialIndex,
  onOpenChange,
  open,
}: AttachmentImageGalleryDialogProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)));
  }, [images.length, initialIndex, open]);

  const activeImage = images[activeIndex];
  const canNavigate = images.length > 1;
  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[92vh] w-[min(96vw,72rem)] max-w-none flex-col gap-4 p-4 sm:p-6"
        onKeyDown={(event) => {
          if (!canNavigate) return;
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          }
        }}
      >
        <DialogHeader className="pr-10">
          <DialogTitle>{copy.title}</DialogTitle>
        </DialogHeader>
        {activeImage ? (
          <>
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-muted/60"
              onPointerDown={(event) => setTouchStartX(event.clientX)}
              onPointerUp={(event) => {
                if (touchStartX === null || !canNavigate) return;
                const distance = event.clientX - touchStartX;
                if (Math.abs(distance) > 40) move(distance > 0 ? -1 : 1);
                setTouchStartX(null);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Supports both remote and Blob preview URLs. */}
              <img
                alt={activeImage.name}
                className="max-h-[58vh] w-full object-contain"
                src={activeImage.previewUrl}
              />
              {canNavigate ? (
                <>
                  <Button
                    aria-label={copy.previous}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    onClick={() => move(-1)}
                    size="icon"
                    type="button"
                    variant="secondary"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                  <Button
                    aria-label={copy.next}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => move(1)}
                    size="icon"
                    type="button"
                    variant="secondary"
                  >
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </>
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-muted-foreground">
                {activeImage.name}
                {canNavigate ? ` (${activeIndex + 1}/${images.length})` : null}
              </span>
              <Button asChild size="sm" variant="outline">
                <a download href={activeImage.downloadUrl}>
                  <Download aria-hidden="true" />
                  {copy.download}
                </a>
              </Button>
            </div>
            {canNavigate ? (
              <div className="hidden gap-2 overflow-x-auto pb-1 sm:flex">
                {images.map((image, index) => (
                  <button
                    aria-label={image.name}
                    className={cn(
                      'size-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      activeIndex === index
                        ? 'border-primary'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                    key={image.id}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- Supports both remote and Blob preview URLs. */}
                    <img alt="" className="size-full object-cover" src={image.previewUrl} />
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
