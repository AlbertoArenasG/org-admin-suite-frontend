'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ChartColumn,
  Package,
  ShieldCheck,
  ShieldPlus,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MotionConfig, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

import { ServiceEntrySurveyStatsCard } from '@/components/dashboard/ServiceEntrySurveyStatsCard';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useAuthorization } from '@/features/auth';
import { useAppSelector } from '@/hooks/useAppSelector';

type DashboardLinkItem = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const sectionAnimation: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const itemAnimation: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + index * 0.055, duration: 0.36, ease: 'easeOut' },
  }),
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
    ...(hasPermission('ROLES', 'CREATE')
      ? [
          {
            key: 'create-role',
            title: t('quickActions.createRole.title'),
            description: t('quickActions.createRole.description'),
            href: '/dashboard/roles/new',
            icon: ShieldPlus,
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
    ...(hasPermission('ROLES', 'READ')
      ? [
          {
            key: 'roles',
            title: t('workspaces.roles.title'),
            description: t('workspaces.roles.description'),
            href: '/dashboard/roles',
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

  const displayName = authUser
    ? [authUser.name, authUser.lastname].filter(Boolean).join(' ').trim() || authUser.email
    : t('guestFallback');
  const hasSurveyWidget = hasModule('SERVICE_ENTRY_SURVEYS');

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-1 flex-col gap-5">
        <motion.div animate="visible" initial="hidden" variants={sectionAnimation}>
          <DashboardPageHeader segments={[{ label: t('title'), hideOnDesktop: true }]} />
        </motion.div>

        <motion.section
          animate="visible"
          className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur"
          initial="hidden"
          transition={{ delay: 0.05 }}
          variants={sectionAnimation}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
            <p className="text-sm text-muted-foreground">{t('subtitle', { name: displayName })}</p>
          </div>

          {quickActions.length ? (
            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t('sections.quickActions')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('sections.quickActionsHint')}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {quickActions.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.key}
                      animate="visible"
                      custom={index}
                      initial="hidden"
                      variants={itemAnimation}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <Link
                        key={item.key}
                        href={item.href}
                        className="group block rounded-2xl border border-border/60 bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-background"
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
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div
            className={
              hasSurveyWidget
                ? 'mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)]'
                : 'mt-8'
            }
          >
            {hasSurveyWidget ? (
              <motion.div animate="visible" initial="hidden" variants={itemAnimation} custom={0}>
                <ServiceEntrySurveyStatsCard />
              </motion.div>
            ) : null}

            <motion.div
              animate="visible"
              className="rounded-2xl border border-border/60 bg-background/40 p-5"
              custom={hasSurveyWidget ? 1 : 0}
              initial="hidden"
              variants={itemAnimation}
            >
              <div className="mb-4">
                <h2 className="font-semibold text-foreground">{t('sections.workspaces')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('sections.workspacesHint')}</p>
              </div>

              {workspaceItems.length ? (
                <div className="space-y-3">
                  {workspaceItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.key}
                        animate="visible"
                        custom={index + 2}
                        initial="hidden"
                        variants={itemAnimation}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Link
                          key={item.key}
                          href={item.href}
                          className="group flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-card/50 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-card"
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-xl border border-border/50 bg-background p-2 text-primary">
                              <Icon className="size-[18px]" />
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium text-foreground">{item.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-5 text-sm text-muted-foreground">
                  {t('emptyState.description')}
                </div>
              )}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </MotionConfig>
  );
}
