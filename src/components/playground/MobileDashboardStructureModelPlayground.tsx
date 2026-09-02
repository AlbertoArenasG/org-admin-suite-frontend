'use client';

import { ChevronRight, Home, Layers3, Menu, PanelTop, Sheet } from 'lucide-react';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { StructureModelLayerLabel } from '@/components/playground/StructureModelLayerLabel';

const layers = [
  ['App Shell', 'Viewport y fondo global.'],
  ['Navigation Shell', 'Se representa como Mobile Navigation Sheet.'],
  ['Navigation Rail', 'Selector de contextos dentro del sheet.'],
  ['Navigation Pane', 'Navegación contextual dentro del sheet.'],
  ['Content Inset', 'Estructural, sin superficie visual propia.'],
  ['Global Header', 'Trigger y utilidades globales.'],
  ['Workspace Canvas', 'Mobile Canvas a ancho completo.'],
  ['Workspace Header', 'Breadcrumbs compactos.'],
  ['Page Composition', 'Jerarquía de la vista en columna.'],
  ['Page Header', 'Título y acciones opcionales.'],
  ['Page Content Scroller', 'Participa en Document Scroll.'],
  ['Module Surfaces', 'Contenido funcional de la página.'],
] as const;

export function MobileDashboardStructureModelPlayground() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Modelo móvil' },
      ]}
    >
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <StructureModelLayerLabel>Modelo de referencia</StructureModelLayerLabel>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Estructura móvil del dashboard
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
          Representación de las mismas capas estructurales. Algunas se fusionan visualmente o se
          muestran como overlay, pero no desaparecen del modelo.
        </p>
        <p className="mt-3 text-sm font-medium text-[var(--secondary-700)]">
          Modo de scroll: Document Scroll.
        </p>

        <div className="mt-6 grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <ol className="space-y-2 rounded-2xl border border-border/70 bg-muted/35 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Layers3 className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
              Capas y resolución móvil
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
            <div className="mx-auto max-w-sm rounded-[2rem] border border-dashed border-[var(--secondary-400)] bg-background p-3 shadow-sm">
              <div className="flex items-center gap-2 px-1">
                <PanelTop className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
                <StructureModelLayerLabel>App Shell</StructureModelLayerLabel>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-[var(--secondary-300)] bg-muted/25 p-3">
                <div className="flex items-center gap-2">
                  <Sheet className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
                  <StructureModelLayerLabel>Navigation Shell</StructureModelLayerLabel>
                </div>
                <div className="mt-3 rounded-xl border border-dashed border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                      Mobile Navigation Sheet
                    </span>
                    <Menu className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-dashed border-border p-2">
                      <StructureModelLayerLabel>Navigation Rail</StructureModelLayerLabel>
                    </div>
                    <div className="rounded-lg border border-dashed border-border p-2">
                      <StructureModelLayerLabel>Navigation Pane</StructureModelLayerLabel>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-dashed border-[var(--secondary-300)] bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <StructureModelLayerLabel>Content Inset</StructureModelLayerLabel>
                  <span className="text-[11px] text-muted-foreground">Estructural</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Se fusiona visualmente con Mobile Canvas y no controla el scroll.
                </p>
                <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/25 p-3">
                  <StructureModelLayerLabel>Global Header</StructureModelLayerLabel>
                  <div className="mt-3 h-9 rounded-md border border-border bg-background" />
                </div>

                <div className="mt-3 rounded-xl border border-dashed border-[var(--secondary-400)] bg-background p-3">
                  <StructureModelLayerLabel>Workspace Canvas</StructureModelLayerLabel>
                  <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/25 p-3">
                    <StructureModelLayerLabel>Workspace Header</StructureModelLayerLabel>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Home className="size-3.5" aria-hidden="true" />
                      <ChevronRight className="size-3.5" aria-hidden="true" />
                      <span>...</span>
                      <ChevronRight className="size-3.5" aria-hidden="true" />
                      <span className="font-semibold text-foreground">Ruta actual</span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/15 p-3">
                    <StructureModelLayerLabel>Page Composition</StructureModelLayerLabel>
                    <div className="mt-3 rounded-lg border border-dashed border-border bg-background/80 p-3">
                      <StructureModelLayerLabel>Page Header</StructureModelLayerLabel>
                      <div className="mt-3 h-7 rounded-md bg-muted/70" />
                    </div>
                    <div className="mt-3 rounded-lg border border-dashed border-[var(--secondary-300)] bg-background/60 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <StructureModelLayerLabel>Page Content Scroller</StructureModelLayerLabel>
                        <span className="text-[11px] text-muted-foreground">Document Scroll</span>
                      </div>
                      <div className="mt-3 space-y-3">
                        <div className="rounded-lg border border-border bg-background p-3">
                          <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                          <div className="mt-3 h-8 rounded-md bg-muted/70" />
                        </div>
                        <div className="rounded-lg border border-border bg-background p-3">
                          <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                          <div className="mt-3 h-8 rounded-md bg-muted/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardPlaygroundFrame>
  );
}
