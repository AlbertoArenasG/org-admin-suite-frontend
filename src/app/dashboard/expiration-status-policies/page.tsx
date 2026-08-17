'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationStatusPoliciesPage() {
  const { t } = useTranslationHydrated(['expirationStatusPolicies', 'breadcrumbs']);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              {
                label: t('breadcrumbs:dashboard'),
                href: '/dashboard',
                hideOnDesktop: true,
              },
              {
                label: t('breadcrumbs:expirationStatusPolicies'),
              },
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
            {t('title')}
          </Typography>
          <Typography variant="body2" color="text.foreground">
            {t('routeShells.list')}
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}
