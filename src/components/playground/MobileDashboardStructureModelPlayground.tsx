'use client';

import {
  Bell,
  ChevronRight,
  Home,
  Layers3,
  Menu,
  PanelTop,
  Sheet,
  SquareStack,
  UserRound,
} from 'lucide-react';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { StructureModelLayerLabel } from '@/components/playground/StructureModelLayerLabel';

const targetLayers = [
  ['App Shell', 'Marco global; no expone el marco decorativo de escritorio.'],
  ['Navigation Shell', 'Se resuelve como Mobile Navigation Sheet.'],
  ['Navigation Rail', 'Conserva el selector de contextos dentro del sheet.'],
  ['Navigation Pane', 'Conserva la navegación contextual dentro del sheet.'],
  ['Content Inset', 'Capa estructural sin superficie visual propia.'],
  ['Global Header', 'Trigger y utilidades globales de alcance transversal.'],
  ['Workspace Canvas', 'Área de ruta a ancho completo: Mobile Canvas.'],
  ['Workspace Header', 'Breadcrumbs compactos del contexto de ruta.'],
  ['Page Composition', 'Jerarquía específica de la vista en una columna.'],
  ['Page Header', 'Agrupación opcional de título y acciones.'],
  ['Page Content Scroller', 'En móvil usa el scroll natural del documento.'],
  ['Module Surfaces', 'Agrupaciones funcionales dentro de la composición.'],
] as const;

export function MobileDashboardStructureModelPlayground() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
          { label: 'Playground', href: '/dashboard/playground' },
          { label: 'Modelo móvil' },
        ]}
      />

      <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <StructureModelLayerLabel>Modelo de referencia</StructureModelLayerLabel>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Estructura móvil del dashboard
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Representación de las mismas capas estructurales del escritorio. Algunas se fusionan
                visualmente o se muestran como overlay, pero no desaparecen del modelo.
              </p>
            </div>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground sm:text-right">
            Modo de scroll: Document Scroll.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border/70 bg-muted/35 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers3 className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
              Capas y resolución móvil
            </div>
            <ol className="mt-4 space-y-2">
              {targetLayers.map(([name, description], index) => (
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
          </aside>

          <div className="rounded-2xl border border-dashed border-[var(--secondary-300)] bg-[var(--secondary-50)]/55 p-3 sm:p-5">
            <div className="mx-auto max-w-sm">
              <div className="rounded-[2rem] border border-dashed border-[var(--secondary-400)] bg-background p-3 shadow-sm">
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
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Overlay que conserva las piezas Navigation Rail y Navigation Pane.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-dashed border-border bg-muted/25 p-2">
                        <StructureModelLayerLabel>Navigation Rail</StructureModelLayerLabel>
                        <div className="mt-3 flex gap-1.5">
                          <span className="size-2 rounded-full bg-[var(--secondary-500)]" />
                          <span className="size-2 rounded-full bg-muted-foreground/35" />
                          <span className="size-2 rounded-full bg-muted-foreground/35" />
                        </div>
                      </div>
                      <div className="rounded-lg border border-dashed border-border bg-muted/25 p-2">
                        <StructureModelLayerLabel>Navigation Pane</StructureModelLayerLabel>
                        <div className="mt-3 space-y-1.5">
                          <div className="h-1.5 rounded-full bg-muted-foreground/35" />
                          <div className="h-1.5 w-4/5 rounded-full bg-muted-foreground/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-dashed border-[var(--secondary-300)] bg-background p-3">
                  <div className="flex items-center justify-between gap-3">
                    <StructureModelLayerLabel>Content Inset</StructureModelLayerLabel>
                    <span className="text-[11px] text-muted-foreground">Estructural</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Se fusiona visualmente con el Mobile Canvas: no expone fondos ni gutters de
                    escritorio y no controla el scroll.
                  </p>

                  <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/25 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <StructureModelLayerLabel>Global Header</StructureModelLayerLabel>
                      <span className="text-[11px] text-muted-foreground">Utilidades</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-md border border-border/80 bg-background px-3 py-2 text-muted-foreground">
                      <Menu className="size-4" aria-hidden="true" />
                      <span className="text-xs">Espacio global</span>
                      <div className="flex items-center gap-2">
                        <Bell className="size-4" aria-hidden="true" />
                        <UserRound className="size-4" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-dashed border-[var(--secondary-400)] bg-background p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StructureModelLayerLabel>Workspace Canvas</StructureModelLayerLabel>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Resolución visual: Mobile Canvas
                      </span>
                    </div>

                    <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/25 p-3">
                      <StructureModelLayerLabel>Workspace Header</StructureModelLayerLabel>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Home className="size-3.5" aria-hidden="true" />
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                        <span>...</span>
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                        <span className="truncate font-semibold text-foreground">Ruta actual</span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/15 p-3">
                      <StructureModelLayerLabel>Page Composition</StructureModelLayerLabel>

                      <div className="mt-3 rounded-lg border border-dashed border-border bg-background/80 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <StructureModelLayerLabel>Page Header</StructureModelLayerLabel>
                          <span className="text-[11px] text-muted-foreground">Opcional</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="h-2 w-28 rounded-full bg-muted-foreground/25" />
                          <div className="h-6 w-14 rounded-md border border-border bg-background" />
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-dashed border-[var(--secondary-300)] bg-background/60 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <StructureModelLayerLabel>Page Content Scroller</StructureModelLayerLabel>
                          <span className="text-[11px] text-muted-foreground">Document Scroll</span>
                        </div>
                        <div className="mt-3 space-y-3">
                          <div className="rounded-lg border border-border/80 bg-background p-4 shadow-sm">
                            <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                            <div className="mt-4 h-3 w-3/5 rounded-full bg-foreground/15" />
                            <div className="mt-2 h-2 w-full rounded-full bg-muted-foreground/20" />
                            <div className="mt-4 h-14 rounded-md bg-muted/70" />
                          </div>
                          <div className="rounded-lg border border-border/80 bg-background p-4 shadow-sm">
                            <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                            <div className="mt-4 h-3 w-1/2 rounded-full bg-foreground/15" />
                            <div className="mt-2 h-2 w-full rounded-full bg-muted-foreground/20" />
                          </div>
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
    </div>
  );
}
