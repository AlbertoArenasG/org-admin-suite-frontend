'use client';

import { ChevronRight, Home, Layers3, PanelLeft, PanelsTopLeft } from 'lucide-react';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { StructureModelLayerLabel } from '@/components/playground/StructureModelLayerLabel';

const layers = [
  ['App Shell', 'Viewport, fondo y overflow global.'],
  ['Navigation Shell', 'Navegación principal autenticada.'],
  ['Navigation Rail', 'Selector entre áreas principales.'],
  ['Navigation Pane', 'Navegación contextual, marca y cuenta.'],
  ['Content Inset', 'Área disponible, fija y sin scroll.'],
  ['Global Header', 'Utilidades globales fuera del canvas.'],
  ['Workspace Canvas', 'Superficie de trabajo de la ruta.'],
  ['Workspace Header', 'Breadcrumbs y contexto de navegación.'],
  ['Page Composition', 'Jerarquía específica de la vista.'],
  ['Page Header', 'Título y acciones opcionales de la vista.'],
  ['Page Content Scroller', 'Dueño de scroll predeterminado.'],
  ['Module Surfaces', 'Agrupaciones funcionales de contenido.'],
] as const;

const scrollModes = [
  {
    name: 'Page Content Scroll',
    description:
      'Workspace Header y Page Header permanecen fijos; Page Content Scroller recibe el scroll.',
  },
  {
    name: 'Page Composition Scroll',
    description: 'Workspace Header permanece fijo; Page Header y contenido se desplazan juntos.',
  },
  {
    name: 'Workspace Canvas Scroll',
    description: 'Todo el canvas participa en el scroll, incluido Workspace Header y Page Header.',
  },
] as const;

export function DashboardStructureModelPlayground() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Modelo de estructura' },
      ]}
    >
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <div className="border-b border-border/70 pb-5">
          <StructureModelLayerLabel>Modelo de referencia</StructureModelLayerLabel>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Estructura del dashboard</h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            Modelo abstracto de escritorio. Todas las capas existen aunque su presentación final
            pueda fusionarse, ocultarse o cambiar visualmente.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <ol className="space-y-2 rounded-2xl border border-border/70 bg-muted/35 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Layers3 className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
              Capas del modelo
            </div>
            {layers.map(([name, description], index) => (
              <li key={name} className="flex gap-3 rounded-xl bg-background/75 p-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-100)] text-[11px] font-semibold text-[var(--secondary-700)]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-dashed border-[var(--secondary-300)] bg-[var(--secondary-50)]/55 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <PanelsTopLeft className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
              <StructureModelLayerLabel>App Shell</StructureModelLayerLabel>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="rounded-xl border border-dashed border-sidebar-foreground/45 bg-[var(--sidebar)] p-3 text-sidebar-foreground">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase">
                  <PanelLeft className="size-4" aria-hidden="true" /> Navigation Shell
                </div>
                <div className="mt-3 flex min-h-44 gap-2">
                  <div className="flex w-10 shrink-0 flex-col items-center gap-3 rounded-lg border border-dashed border-sidebar-foreground/45 bg-sidebar-foreground/10 py-3">
                    <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-semibold tracking-[0.08em] uppercase">
                      Rail
                    </span>
                    <span className="size-2 rounded-full bg-sidebar-foreground" />
                    <span className="size-2 rounded-full bg-sidebar-foreground/40" />
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg border border-dashed border-sidebar-foreground/45 bg-sidebar-foreground/10 p-3">
                    <span className="text-[10px] font-semibold tracking-[0.08em] uppercase">
                      Pane
                    </span>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 rounded-full bg-sidebar-foreground/45" />
                      <div className="h-2 w-3/4 rounded-full bg-sidebar-foreground/25" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-[var(--secondary-300)] bg-background/75 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <StructureModelLayerLabel>Content Inset</StructureModelLayerLabel>
                  <span className="text-[11px] text-muted-foreground">Fijo, sin scroll</span>
                </div>
                <div className="mt-3 rounded-lg border border-dashed border-[var(--secondary-400)] bg-muted/15 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <StructureModelLayerLabel>Global Header</StructureModelLayerLabel>
                    <span className="text-[11px] text-muted-foreground">Fijo</span>
                  </div>
                  <div className="mt-3 h-9 rounded-md border border-border/80 bg-background" />
                </div>
                <div className="mt-3 rounded-xl border border-dashed border-[var(--secondary-400)] bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <StructureModelLayerLabel>Workspace Canvas</StructureModelLayerLabel>
                    <span className="text-[11px] text-muted-foreground">Geometría fija</span>
                  </div>
                  <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/25 p-3">
                    <StructureModelLayerLabel>Workspace Header</StructureModelLayerLabel>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Home className="size-3.5" />
                      <ChevronRight className="size-3.5" />
                      <span>Área</span>
                      <ChevronRight className="size-3.5" />
                      <span className="font-semibold text-foreground">Ruta actual</span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/15 p-3">
                    <StructureModelLayerLabel>Page Composition</StructureModelLayerLabel>
                    <div className="mt-3 rounded-lg border border-dashed border-border bg-background/80 p-3">
                      <div className="flex items-center justify-between">
                        <StructureModelLayerLabel>Page Header</StructureModelLayerLabel>
                        <span className="text-[11px] text-muted-foreground">Opcional</span>
                      </div>
                      <div className="mt-3 h-7 rounded-md bg-muted/70" />
                    </div>
                    <div className="mt-3 rounded-lg border border-dashed border-[var(--secondary-300)] bg-background/60 p-3">
                      <div className="flex items-center justify-between">
                        <StructureModelLayerLabel>Page Content Scroller</StructureModelLayerLabel>
                        <span className="text-[11px] text-muted-foreground">
                          Modo predeterminado
                        </span>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-border bg-background p-3">
                          <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                          <div className="mt-3 h-10 rounded-md bg-muted/70" />
                        </div>
                        <div className="rounded-lg border border-border bg-background p-3">
                          <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                          <div className="mt-3 h-10 rounded-md bg-muted/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {scrollModes.map((mode) => (
            <article
              key={mode.name}
              className="rounded-xl border border-[var(--secondary-300)] bg-background/80 p-4"
            >
              <p className="text-xs font-semibold tracking-[0.08em] text-[var(--secondary-700)] uppercase">
                {mode.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{mode.description}</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardPlaygroundFrame>
  );
}
