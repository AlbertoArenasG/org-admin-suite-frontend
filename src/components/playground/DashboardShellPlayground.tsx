'use client';

import { useState } from 'react';
import { Bell, Layers3, PanelLeft } from 'lucide-react';
import {
  DashboardGlobalHeader,
  DashboardPageContentScroller,
  DashboardShellFrame,
  type DashboardScrollMode,
  DashboardWorkspaceHeader,
} from '@/components/dashboard-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs, type BreadcrumbSegment } from '@/components/shared/PageBreadcrumbs';

const segments: BreadcrumbSegment[] = [
  { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
  { label: 'Playground', href: '/dashboard/playground' },
  { label: 'Dashboard shell' },
];

const neutralSurfaces = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  title: `Superficie neutral ${String(index + 1).padStart(2, '0')}`,
  description:
    index % 3 === 0
      ? 'Contenido de referencia para comprobar jerarquía, densidad y desplazamiento.'
      : 'Una agrupación genérica dentro de la composición de página.',
}));

const scrollModes: Array<{ value: DashboardScrollMode; label: string }> = [
  { value: 'page-content', label: 'Page Content Scroll' },
  { value: 'workspace', label: 'Workspace Canvas Scroll' },
];

export function DashboardShellPlayground() {
  const [scrollMode, setScrollMode] = useState<DashboardScrollMode>('page-content');

  return (
    <DashboardShellFrame
      scrollMode={scrollMode}
      className="min-h-0 md:h-[calc(100dvh-5rem)]"
      contentInsetClassName="bg-transparent md:rounded-[1.75rem] md:bg-[var(--sidebar)] md:p-3"
      workspaceCanvasClassName="rounded-2xl shadow-sm md:rounded-[1.25rem]"
      globalHeader={
        <DashboardGlobalHeader
          className="text-foreground md:text-sidebar-foreground"
          start={
            <SidebarTrigger className="size-9 text-foreground md:flex md:text-sidebar-foreground md:hover:bg-sidebar-foreground/10 md:hover:text-sidebar-foreground" />
          }
          end={
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Notificaciones de ejemplo"
                className="size-9 text-foreground md:text-sidebar-foreground md:hover:bg-sidebar-foreground/10 md:hover:text-sidebar-foreground"
              >
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cuenta de ejemplo"
                className="size-9 text-foreground md:text-sidebar-foreground md:hover:bg-sidebar-foreground/10 md:hover:text-sidebar-foreground"
              >
                <Avatar className="size-7 border border-current/20">
                  <AvatarFallback className="bg-current/10 text-[10px] font-semibold text-current">
                    AA
                  </AvatarFallback>
                </Avatar>
              </Button>
            </>
          }
        />
      }
      workspaceHeader={
        <DashboardWorkspaceHeader className="border-b border-border/70 px-4 sm:px-5">
          <PageBreadcrumbs segments={segments} />
        </DashboardWorkspaceHeader>
      }
    >
      <section className="shrink-0 border-b border-border/70 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
              <Layers3 className="size-3.5" aria-hidden="true" />
              Playground de referencia
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Dashboard shell neutral</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Esta vista utiliza las primitivas del nuevo shell sin representar un módulo de
              negocio. El contenido inferior existe para validar quién controla el scroll.
            </p>
          </div>

          <div className="hidden rounded-lg border border-border/80 bg-muted/35 p-1 md:flex">
            {scrollModes.map((mode) => (
              <Button
                key={mode.value}
                type="button"
                variant={scrollMode === mode.value ? 'secondary' : 'ghost'}
                size="sm"
                aria-pressed={scrollMode === mode.value}
                onClick={() => setScrollMode(mode.value)}
              >
                {mode.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground md:hidden">Modo móvil: Document Scroll</p>
        </div>
      </section>

      <DashboardPageContentScroller className="px-5 py-5 sm:px-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Contenido de prueba
          </p>
          <span className="rounded-full border border-border/80 bg-muted/35 px-2.5 py-1 text-xs text-muted-foreground">
            {scrollMode === 'page-content' ? 'Scroll: contenido' : 'Scroll: canvas'}
          </span>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {neutralSurfaces.map((surface) => (
            <article
              key={surface.id}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                    Module Surface
                  </p>
                  <h2 className="mt-2 text-sm font-semibold">{surface.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {surface.description}
                  </p>
                </div>
                <PanelLeft
                  className="mt-0.5 size-4 shrink-0 text-[var(--secondary-600)]"
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>
      </DashboardPageContentScroller>
    </DashboardShellFrame>
  );
}
