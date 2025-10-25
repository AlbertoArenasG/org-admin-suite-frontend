'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UsersTableHeaderProps {
  title: string;
  summary?: string | null;
  canInvite: boolean;
  inviteLabel: string;
  inviteAriaLabel: string;
  onInvite: () => void;
  inviteIcon?: React.ReactNode;
  className?: string;
}

export function UsersTableHeader({
  title,
  summary,
  canInvite,
  inviteLabel,
  inviteAriaLabel,
  onInvite,
  inviteIcon,
  className,
}: UsersTableHeaderProps) {
  return (
    <Box
      sx={{
        px: { xs: 2.5, md: 4 },
        py: 3,
        borderBottom: '1px solid var(--surface-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
      className={cn(className)}
    >
      <div>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {title}
        </Typography>
      </div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {summary ? (
          <Typography variant="caption" color="text.secondary">
            {summary}
          </Typography>
        ) : null}
        <Button
          type="button"
          size="sm"
          onClick={onInvite}
          disabled={!canInvite}
          aria-label={inviteAriaLabel}
          className="inline-flex items-center gap-2 px-3"
        >
          {inviteIcon}
          {inviteLabel}
        </Button>
      </Box>
    </Box>
  );
}
