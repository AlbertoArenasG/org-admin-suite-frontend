'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type InternalAssetControlPlaceholderProps = {
  title: string;
  description: string;
  restrictedMessage: string;
  allowed: boolean;
};

export function InternalAssetControlPlaceholder({
  title,
  description,
  restrictedMessage,
  allowed,
}: InternalAssetControlPlaceholderProps) {
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
        minHeight: '60vh',
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, md: 4 },
          py: 3,
          borderBottom: '1px solid var(--surface-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.foreground">
          {description}
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {allowed ? (
          <div className="rounded-xl border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground">
            Este flujo se conectará en el siguiente slice sobre la base ya registrada del módulo.
          </div>
        ) : (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {restrictedMessage}
          </div>
        )}
      </Box>
    </Paper>
  );
}
