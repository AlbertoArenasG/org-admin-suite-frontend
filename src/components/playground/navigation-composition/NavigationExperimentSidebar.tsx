'use client';

import Image from 'next/image';
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  PanelLeftClose,
  Search,
  SlidersHorizontal,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationGroups = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'operations', label: 'Operación', icon: Wrench },
  { id: 'directory', label: 'Directorio', icon: UsersRound },
  { id: 'settings', label: 'Configuración', icon: SlidersHorizontal },
] as const;

const panelEntries = [
  { id: 'overview', label: 'Visión general', icon: Grid2X2, badge: undefined },
  { id: 'workspace', label: 'Área de trabajo', icon: FolderKanban, badge: undefined },
  { id: 'recent', label: 'Actividad reciente', icon: FileText, badge: '12' },
] as const;

export type NavigationExperimentGroupId = (typeof navigationGroups)[number]['id'];

interface NavigationExperimentSidebarProps {
  activeGroup: NavigationExperimentGroupId;
  activeEntry: string;
  onGroupChange: (group: NavigationExperimentGroupId) => void;
  onEntryChange: (entry: string) => void;
}

export function NavigationExperimentSidebar({
  activeGroup,
  activeEntry,
  onGroupChange,
  onEntryChange,
}: NavigationExperimentSidebarProps) {
  return (
    <aside className="dashboard-navigation-shell flex shrink-0 text-sidebar-foreground md:w-[21rem]">
      <div data-slot="sidebar-inner" className="flex w-full border-b md:border-r md:border-b-0">
        <nav
          aria-label="Áreas principales de ejemplo"
          className="flex w-full items-center gap-1 overflow-x-auto border-r border-[var(--dashboard-shell-glass-border)] p-2 md:w-16 md:flex-col md:items-stretch md:overflow-visible md:py-3"
        >
          <div className="hidden items-center justify-center pb-3 md:flex">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--dashboard-navigation-logo-surface)] p-1">
              <Image
                src="/logo.jpeg"
                alt="Implementos Científicos"
                width={28}
                height={28}
                className="rounded-lg"
              />
            </div>
          </div>
          {navigationGroups.map((group) => {
            const Icon = group.icon;
            const isActive = activeGroup === group.id;

            return (
              <Button
                key={group.id}
                type="button"
                variant="ghost"
                size="icon"
                aria-label={group.label}
                aria-pressed={isActive}
                onClick={() => onGroupChange(group.id)}
                className={cn(
                  'size-10 shrink-0 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground',
                  isActive &&
                    'bg-sidebar-foreground/14 text-sidebar-foreground ring-1 ring-sidebar-foreground/20 hover:bg-sidebar-foreground/14'
                )}
              >
                <Icon className="size-[1.15rem]" aria-hidden="true" />
              </Button>
            );
          })}
        </nav>

        <section
          className="hidden min-w-0 flex-1 flex-col p-3 md:flex"
          aria-label="Navegación contextual de ejemplo"
        >
          <div className="flex items-center justify-between gap-3 px-1 pb-4">
            <span className="text-base font-semibold tracking-tight">Implementos Científicos</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Colapsar navegación de ejemplo"
              className="text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
            >
              <PanelLeftClose className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <button
            type="button"
            className="flex h-10 w-full items-center gap-2 rounded-xl border border-sidebar-foreground/10 bg-sidebar-foreground/5 px-3 text-left text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-foreground/10"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="flex-1">Buscar</span>
            <kbd className="rounded-md bg-sidebar-foreground/10 px-1.5 py-0.5 text-[10px] font-medium">
              ⌘ K
            </kbd>
          </button>

          <div className="mt-6">
            <p className="px-2 text-[11px] font-semibold tracking-[0.12em] text-sidebar-foreground/50 uppercase">
              {navigationGroups.find((group) => group.id === activeGroup)?.label}
            </p>
            <div className="mt-2 space-y-1">
              {panelEntries.map((entry) => {
                const Icon = entry.icon;
                const isActive = activeEntry === entry.id;

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onEntryChange(entry.id)}
                    className={cn(
                      'flex h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground',
                      isActive && 'bg-sidebar-foreground/14 text-sidebar-foreground'
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="flex-1">{entry.label}</span>
                    {entry.badge ? (
                      <span className="rounded-full bg-sidebar-foreground/10 px-2 py-0.5 text-[11px] font-medium">
                        {entry.badge}
                      </span>
                    ) : null}
                    {entry.id === 'workspace' ? (
                      <ChevronRight className="size-4" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-sidebar-foreground/10 pt-5">
            <p className="px-2 text-[11px] font-semibold tracking-[0.12em] text-sidebar-foreground/50 uppercase">
              Recursos
            </p>
            <button
              type="button"
              className="mt-2 flex h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
            >
              <CircleHelp className="size-4" aria-hidden="true" />
              Centro de ayuda
            </button>
          </div>

          <div className="mt-auto pt-5">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-sidebar-foreground/10 bg-sidebar-foreground/8 p-2.5 text-left transition-colors hover:bg-sidebar-foreground/12"
            >
              <Avatar className="size-8 border border-sidebar-foreground/20">
                <AvatarFallback className="bg-sidebar-foreground/12 text-[10px] font-semibold text-sidebar-foreground">
                  AA
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">Alberto Arenas</span>
                <span className="block truncate text-xs text-sidebar-foreground/55">
                  Administrador
                </span>
              </span>
              <ChevronDown className="size-4 text-sidebar-foreground/65" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}
