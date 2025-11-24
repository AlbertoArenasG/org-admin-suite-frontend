'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ServicePackageRecordFile } from '@/features/servicePackagesRecords';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordFilePreviewDialogProps {
  files: ServicePackageRecordFile[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  labels: {
    title: string;
    download: string;
    close: string;
    unsupported: string;
    error: string;
  };
}

const PREVIEWABLE_TEXT_TYPES = ['text/plain', 'application/json'];

function formatBytes(size: number | undefined) {
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

function isSignatureFile(file: ServicePackageRecordFile | null) {
  if (!file) {
    return false;
  }
  const hint = `${file.originalName ?? ''} ${file.relativePath ?? ''}`.toLowerCase();
  return hint.includes('firma') || hint.includes('signature');
}

export function RecordFilePreviewDialog({
  files,
  currentIndex,
  open,
  onClose,
  onNavigate,
  labels,
}: RecordFilePreviewDialogProps) {
  const file = files[currentIndex] ?? null;
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isImage = file?.contentType?.startsWith('image/');
  const isText = file?.contentType ? PREVIEWABLE_TEXT_TYPES.includes(file.contentType) : false;

  useEffect(() => {
    if (!open || !file || !isText) {
      setTextContent(null);
      setLoadError(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setLoadError(null);

    fetch(file.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load file preview');
        }
        return response.text();
      })
      .then((content) => {
        if (!isCancelled) {
          setTextContent(content);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadError(labels.error);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [file, isText, labels.error, open]);

  const previewContent = useMemo(() => {
    if (!file) {
      return null;
    }

    if (isImage) {
      const signature = isSignatureFile(file);
      return (
        <div
          className={cn(
            'relative flex items-center justify-center rounded-2xl border border-border/60 bg-muted p-4',
            signature ? 'max-h-[60vh]' : 'min-h-[60vh]'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.url}
            alt={file.originalName}
            className={cn(
              'w-auto rounded-xl object-contain shadow-lg',
              signature ? 'max-h-[55vh]' : 'max-h-[70vh]'
            )}
          />
        </div>
      );
    }

    if (isText) {
      if (loading) {
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        );
      }
      if (loadError) {
        return <p className="text-sm text-destructive">{loadError}</p>;
      }
      return (
        <div className="max-h-[60vh] overflow-auto rounded-2xl border border-border/60 bg-muted p-4">
          <pre className="whitespace-pre-wrap text-sm">{textContent ?? labels.unsupported}</pre>
        </div>
      );
    }

    if (file.contentType === 'application/pdf') {
      return (
        <iframe
          title={file.originalName}
          src={file.url}
          className="h-[70vh] w-full rounded-2xl border border-border/60 bg-muted"
        />
      );
    }

    return <p className="text-sm text-muted-foreground">{labels.unsupported}</p>;
  }, [file, isImage, isText, labels.unsupported, loadError, loading, textContent]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file?.originalName ?? labels.title}</DialogTitle>
          <DialogDescription>
            {file ? `${file.contentType ?? '—'} · ${formatBytes(file.size)}` : labels.title}
          </DialogDescription>
        </DialogHeader>
        <div className="relative rounded-2xl bg-background/50">
          {previewContent}
          {files.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/80 p-2 shadow-md backdrop-blur-md transition hover:bg-background"
                onClick={() => onNavigate((currentIndex - 1 + files.length) % files.length)}
                aria-label="Ver anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/80 p-2 shadow-md backdrop-blur-md transition hover:bg-background"
                onClick={() => onNavigate((currentIndex + 1) % files.length)}
                aria-label="Ver siguiente"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>
        <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3 sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {files.length > 0 ? `${currentIndex + 1} / ${files.length}` : null}
          </div>
          <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">
            <Button type="button" variant="outline" asChild>
              <a href={file?.url} target="_blank" rel="noreferrer">
                {labels.download}
              </a>
            </Button>
            <Button type="button" onClick={onClose}>
              {labels.close}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
