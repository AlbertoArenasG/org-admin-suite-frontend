'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ChartColumn,
  Package,
  ShieldCheck,
  Truck,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { ServiceEntrySurveyStatsCard } from '@/components/dashboard/ServiceEntrySurveyStatsCard';
import { useAuthorization } from '@/features/auth';
import { useAppSelector } from '@/hooks/useAppSelector';

type DashboardLinkItem = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const authUser = useAppSelector((state) => state.auth.user);
  const { hasModule, hasPermission } = useAuthorization();

  const quickActions: DashboardLinkItem[] = [
    ...(hasPermission('USER_REGISTRATION_INVITATIONS', 'CREATE')
      ? [
          {
            key: 'invite-user',
            title: t('quickActions.inviteUser.title'),
            description: t('quickActions.inviteUser.description'),
            href: '/dashboard/users/invite',
            icon: Users,
          },
        ]
      : []),
    ...(hasPermission('CUSTOMERS', 'CREATE')
      ? [
          {
            key: 'create-customer',
            title: t('quickActions.createCustomer.title'),
            description: t('quickActions.createCustomer.description'),
            href: '/dashboard/customers/new',
            icon: Building2,
          },
        ]
      : []),
    ...(hasPermission('PROVIDERS', 'CREATE')
      ? [
          {
            key: 'create-provider',
            title: t('quickActions.createProvider.title'),
            description: t('quickActions.createProvider.description'),
            href: '/dashboard/providers/new',
            icon: Truck,
          },
        ]
      : []),
    ...(hasPermission('SERVICE_ENTRIES', 'CREATE')
      ? [
          {
            key: 'create-service-entry',
            title: t('quickActions.createServiceEntry.title'),
            description: t('quickActions.createServiceEntry.description'),
            href: '/dashboard/service-entries/new',
            icon: Wrench,
          },
        ]
      : []),
  ];

  const workspaceItems: DashboardLinkItem[] = [
    ...(hasModule('USERS')
      ? [
          {
            key: 'users',
            title: t('workspaces.users.title'),
            description: t('workspaces.users.description'),
            href: '/dashboard/users',
            icon: ShieldCheck,
          },
        ]
      : []),
    ...(hasModule('CUSTOMERS')
      ? [
          {
            key: 'customers',
            title: t('workspaces.customers.title'),
            description: t('workspaces.customers.description'),
            href: '/dashboard/customers',
            icon: Building2,
          },
        ]
      : []),
    ...(hasModule('PROVIDERS')
      ? [
          {
            key: 'providers',
            title: t('workspaces.providers.title'),
            description: t('workspaces.providers.description'),
            href: '/dashboard/providers',
            icon: Truck,
          },
        ]
      : []),
    ...(hasModule('SERVICE_ENTRIES')
      ? [
          {
            key: 'service-entries',
            title: t('workspaces.serviceEntries.title'),
            description: t('workspaces.serviceEntries.description'),
            href: '/dashboard/service-entries',
            icon: Wrench,
          },
        ]
      : []),
    ...(hasModule('SERVICE_ENTRY_SURVEYS')
      ? [
          {
            key: 'service-surveys',
            title: t('workspaces.serviceEntrySurveys.title'),
            description: t('workspaces.serviceEntrySurveys.description'),
            href: '/dashboard/service-entries/surveys',
            icon: ChartColumn,
          },
        ]
      : []),
    ...(hasModule('SERVICE_PACKAGES')
      ? [
          {
            key: 'service-packages',
            title: t('workspaces.servicePackages.title'),
            description: t('workspaces.servicePackages.description'),
            href: '/dashboard/service-packages-records',
            icon: Package,
          },
        ]
      : []),
  ];

  const hasSurveyWidget = hasModule('SERVICE_ENTRY_SURVEYS');
  const hasWorkspaceContent = workspaceItems.length > 0;
  const hasQuickActions = quickActions.length > 0;
  const displayName = authUser
    ? [authUser.name, authUser.lastname].filter(Boolean).join(' ').trim() || authUser.email
    : t('guestFallback');

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              {
                label: t('title'),
                hideOnDesktop: true,
              },
            ]}
          />
        </div>
      </header>

      <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle', { name: displayName })}</p>
        </div>

        {hasQuickActions ? (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t('sections.quickActions')}
                </h2>
                <p className="text-sm text-muted-foreground">{t('sections.quickActionsHint')}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="group rounded-2xl border border-border/60 bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-background"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl border border-border/50 bg-card p-2 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mt-5 space-y-1">
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)]">
          <div className="space-y-4">
            {hasSurveyWidget ? <ServiceEntrySurveyStatsCard /> : null}

            <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl border border-border/50 bg-card p-2 text-primary">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{t('profileCard.title')}</h2>
                  <p className="text-sm text-muted-foreground">{t('profileCard.description')}</p>
                </div>
              </div>
              <Link
                href="/dashboard/me"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {t('profileCard.cta')}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
            <div className="mb-4">
              <h2 className="font-semibold text-foreground">{t('sections.workspaces')}</h2>
              <p className="text-sm text-muted-foreground">{t('sections.workspacesHint')}</p>
            </div>

            {hasWorkspaceContent ? (
              <div className="space-y-3">
                {workspaceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="group flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-card/50 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl border border-border/50 bg-background p-2 text-primary">
                          <Icon className="size-4.5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-5 text-sm text-muted-foreground">
                {t('emptyState.description')}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
