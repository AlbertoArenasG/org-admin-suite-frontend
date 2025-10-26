'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { PublicServiceEntryFile } from '@/features/publicServiceEntry/types';
import { usePublicServiceEntryStore } from '@/stores/usePublicServiceEntryStore';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/components/providers/useSnackbarStore';

interface FilesSectionProps {
  certificate: PublicServiceEntryFile | null;
  attachments: PublicServiceEntryFile[];
  downloadsEnabled: boolean;
}

export function PublicServiceEntryFilesSection({
  certificate,
  attachments,
  downloadsEnabled,
}: FilesSectionProps) {
  const { t } = useTranslation('common');
  const { showSnackbar } = useSnackbar();
  const downloadFile = usePublicServiceEntryStore((state) => state.downloadFile);
  const downloadingFileId = usePublicServiceEntryStore((state) => state.downloadingFileId);

  const handleDownload = async (file: PublicServiceEntryFile) => {
    try {
      await downloadFile(file);
      showSnackbar({
        message: t('publicServiceEntry.files.success', {
          defaultValue: 'Download started.',
        }),
        severity: 'success',
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : t('publicServiceEntry.files.error', {
              defaultValue: 'Unable to download the file.',
            });
      showSnackbar({
        message,
        severity: 'error',
      });
    }
  };

  const files: Array<{
    title: string;
    file: PublicServiceEntryFile | null;
    isCertificate?: boolean;
  }> = [
    {
      title: t('publicServiceEntry.files.calibrationCertificate'),
      file: certificate,
      isCertificate: true,
    },
    ...attachments.map((attachment, index) => ({
      title:
        attachments.length > 1
          ? t('publicServiceEntry.files.attachmentIndexed', { index: index + 1 })
          : t('publicServiceEntry.files.attachment'),
      file: attachment,
    })),
  ];

  return (
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
      <div className="border-b border-border/50 px-6 py-4">
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
          {t('publicServiceEntry.files.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {downloadsEnabled
            ? t('publicServiceEntry.files.subtitleReady')
            : t('publicServiceEntry.files.subtitleLocked')}
        </Typography>
      </div>
      <div className="flex flex-col gap-4 px-6 py-6">
        {files.map(({ title, file, isCertificate }) => (
          <div key={title} className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">
                  {file ? file.original_name : t('publicServiceEntry.files.notAvailable')}
                </p>
              </div>
              <Button
                type="button"
                variant={isCertificate ? 'default' : 'outline'}
                size="sm"
                onClick={() => file && handleDownload(file)}
                disabled={!downloadsEnabled || !file || downloadingFileId === file.file_id}
                className="flex items-center gap-2"
              >
                <Download className="size-4" />
                {downloadingFileId === file?.file_id
                  ? t('publicServiceEntry.files.downloading')
                  : t('publicServiceEntry.files.download')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
}
