'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useTranslation } from 'react-i18next';

export default function CreateRolePage() {
  const { t } = useTranslation(['roles', 'breadcrumbs']);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('breadcrumbs:roles'), href: '/dashboard/roles' },
              { label: t('actions.create') },
            ]}
          />
        </div>
      </header>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          border: '1px solid var(--surface-border)',
          bgcolor: 'var(--surface-bg)',
          color: 'var(--foreground)',
          boxShadow: 'var(--surface-shadow)',
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('pending.title')}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {t('pending.description')}
        </Typography>
      </Paper>
    </div>
  );
}
