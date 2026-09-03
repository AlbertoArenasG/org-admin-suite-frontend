'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Layers3, Monitor, PanelLeft, Smartphone, Sparkles } from 'lucide-react';
import {
  DashboardGlobalHeader,
  DashboardPageComposition,
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
  { label: 'Playground', href: '/dashboard-playground' },
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
  { value: 'page-composition', label: 'Page Composition Scroll' },
  { value: 'workspace', label: 'Workspace Canvas Scroll' },
];

const scrollModeLabels: Record<DashboardScrollMode, string> = {
  'page-content': 'Scroll: contenido',
  'page-composition': 'Scroll: composición',
  workspace: 'Scroll: canvas',
};

export function DashboardShellPlayground() {
  const [scrollMode, setScrollMode] = useState<DashboardScrollMode>('page-content');

  return (
    <DashboardShellFrame
      scrollMode={scrollMode}
      className="min-h-svh md:h-full md:min-h-0"
      contentInsetClassName="dashboard-content-inset md:min-h-0 md:p-4"
      workspaceCanvasClassName="rounded-none shadow-none md:rounded-[1.5rem] md:shadow-sm"
      globalHeader={
        <DashboardGlobalHeader
          className="text-sidebar-foreground"
          start={
            <SidebarTrigger className="size-9 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground md:flex" />
          }
          end={
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Notificaciones de ejemplo"
                className="size-9 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
              >
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cuenta de ejemplo"
                className="size-9 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
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
      <DashboardPageComposition>
        <section className="shrink-0 border-b border-border/70 px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
                <Layers3 className="size-3.5" aria-hidden="true" />
                Playground de referencia
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                Dashboard shell neutral
              </h1>
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
                  variant="ghost"
                  size="sm"
                  aria-pressed={scrollMode === mode.value}
                  onClick={() => setScrollMode(mode.value)}
                  className={
                    scrollMode === mode.value
                      ? 'bg-[var(--secondary-600)] text-white shadow-sm hover:bg-[var(--secondary-700)] hover:text-white'
                      : 'text-muted-foreground hover:bg-background hover:text-foreground'
                  }
                >
                  {mode.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground md:hidden">Modo móvil: Document Scroll</p>
          </div>
        </section>

        <DashboardPageContentScroller className="px-5 py-5 sm:px-7">
          <section className="mb-5 rounded-xl border border-[var(--secondary-300)] bg-[var(--secondary-50)]/55 p-4">
            <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
              Modelos de estructura
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Diagramas de referencia de las capas del dashboard en ambos viewports.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard-playground/structure-model">
                  <Monitor className="size-4" aria-hidden="true" />
                  Modelo desktop
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard-playground/mobile-structure-model">
                  <Smartphone className="size-4" aria-hidden="true" />
                  Modelo móvil
                </Link>
              </Button>
            </div>
          </section>

          <section className="mb-5 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
              Experimentos de interacción
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Patrones aislados para validar comportamiento antes de incorporarlos a una vista real.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard-playground/sticky-page-header">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Header sticky colapsable
                </Link>
              </Button>
            </div>
          </section>

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Contenido de prueba
            </p>
            <span className="rounded-full border border-border/80 bg-muted/35 px-2.5 py-1 text-xs text-muted-foreground">
              {scrollModeLabels[scrollMode]}
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
      </DashboardPageComposition>
    </DashboardShellFrame>
  );
}
