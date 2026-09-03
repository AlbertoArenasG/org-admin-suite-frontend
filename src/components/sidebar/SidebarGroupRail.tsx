'use client';

import { House } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type {
  ResolvedSidebarNavigation,
  SidebarGroupId,
} from '@/components/sidebar/navigation/types';
import { cn } from '@/lib/utils';

type SidebarGroupRailProps = {
  dashboard: ResolvedSidebarNavigation['dashboard'];
  groups: ResolvedSidebarNavigation['groups'];
  selectedGroupId: SidebarGroupId;
  onSelectGroup: (groupId: SidebarGroupId) => void;
  orientation?: 'vertical' | 'horizontal';
};

export function SidebarGroupRail({
  dashboard,
  groups,
  selectedGroupId,
  onSelectGroup,
  orientation = 'vertical',
}: SidebarGroupRailProps) {
  const { t } = useTranslation('nav');
  const horizontal = orientation === 'horizontal';

  return (
    <nav
      aria-label={t('navigationGroups')}
      className={cn(
        'flex items-center gap-2.5',
        horizontal ? 'overflow-x-auto px-1 pb-1' : 'flex-col'
      )}
    >
      <RailButton
        icon={House}
        label={dashboard.title}
        active={selectedGroupId === 'dashboard'}
        onClick={() => onSelectGroup('dashboard')}
      />
      {groups.length > 0 ? (
        <span className={cn('bg-sidebar-border/80', horizontal ? 'h-8 w-px' : 'h-px w-8')} />
      ) : null}
      {groups.map((group) => (
        <RailButton
          key={group.id}
          icon={group.icon}
          label={group.title}
          active={selectedGroupId === group.id}
          onClick={() => onSelectGroup(group.id)}
        />
      ))}
    </nav>
  );
}

type RailButtonProps = {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
};

function RailButton({ icon: Icon, label, active, onClick }: RailButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          className={cn(
            'dashboard-navigation-item dashboard-navigation-rail-item flex size-11 items-center justify-center rounded-xl text-sidebar-foreground/70 outline-hidden transition-[background-color,border-color,box-shadow,color,transform] duration-200 ease-out hover:-translate-y-px hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring',
            active && 'dashboard-navigation-item--active text-sidebar-accent-foreground'
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
