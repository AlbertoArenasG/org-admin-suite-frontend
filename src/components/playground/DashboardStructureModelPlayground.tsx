'use client';

import {
  Bell,
  ChevronRight,
  Home,
  Layers3,
  Menu,
  PanelLeft,
  PanelsTopLeft,
  SquareStack,
  UserRound,
} from 'lucide-react';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { StructureModelLayerLabel } from '@/components/playground/StructureModelLayerLabel';

const layerDescriptions = [
  ['App Shell', 'Marco global autenticado: viewport, fondo y overflow.'],
  ['Navigation Shell', 'Composición de navegación principal.'],
  ['Navigation Rail', 'Cambio entre áreas principales.'],
  ['Navigation Pane', 'Navegación contextual, marca y cuenta actuales.'],
  ['Content Inset', 'Área fija entre navegación y espacio de trabajo.'],
  ['Global Header', 'Utilidades globales, fuera del Workspace Canvas.'],
  ['Workspace Canvas', 'Superficie fija de trabajo de una ruta.'],
  ['Workspace Header', 'Breadcrumbs y contexto de navegación de la ruta.'],
  ['Page Composition', 'Jerarquía específica de la vista.'],
  ['Page Header', 'Agrupación opcional de título y acciones de la vista.'],
  ['Page Content Scroller', 'Única región de scroll interno por defecto.'],
  ['Module Surfaces', 'Agrupaciones funcionales de contenido.'],
] as const;

export function DashboardStructureModelPlayground() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
          { label: 'Playground', href: '/dashboard/playground' },
          { label: 'Modelo de estructura' },
        ]}
      />

      <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <StructureModelLayerLabel>Modelo de referencia</StructureModelLayerLabel>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Estructura del dashboard</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Modelo estructural de escritorio. Cada etiqueta representa una capa aunque su
                presentación final pueda fusionarse, ocultarse o cambiar visualmente.
              </p>
            </div>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground sm:text-right">
            No prescribe colores, spacing ni componentes definitivos.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border/70 bg-muted/35 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers3 className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
              Capas del modelo
            </div>
            <ol className="mt-4 space-y-2">
              {layerDescriptions.map(([name, description], index) => (
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
            <div className="flex items-center gap-2">
              <PanelsTopLeft className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
              <StructureModelLayerLabel>App Shell</StructureModelLayerLabel>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[15rem_minmax(0,1fr)]">
              <div className="rounded-xl border border-dashed border-[var(--secondary-300)] bg-[var(--sidebar)]/95 p-3 text-sidebar-foreground">
                <div className="flex items-center gap-2">
                  <PanelLeft className="size-4" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-[0.08em] uppercase">
                    Navigation Shell
                  </span>
                </div>
                <div className="mt-3 flex min-h-40 gap-2">
                  <div className="flex w-11 shrink-0 flex-col items-center gap-3 rounded-lg border border-dashed border-sidebar-foreground/45 bg-sidebar-foreground/10 py-3">
                    <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-semibold tracking-[0.08em] uppercase">
                      Rail
                    </span>
                    <span className="size-2 rounded-full bg-sidebar-foreground/70" />
                    <span className="size-2 rounded-full bg-sidebar-foreground/35" />
                    <span className="size-2 rounded-full bg-sidebar-foreground/35" />
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg border border-dashed border-sidebar-foreground/45 bg-sidebar-foreground/10 p-3">
                    <span className="text-[10px] font-semibold tracking-[0.08em] uppercase">
                      Pane
                    </span>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 rounded-full bg-sidebar-foreground/45" />
                      <div className="h-2 w-4/5 rounded-full bg-sidebar-foreground/25" />
                      <div className="h-2 w-3/5 rounded-full bg-sidebar-foreground/25" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-[var(--secondary-300)] bg-background/70 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <StructureModelLayerLabel>Content Inset</StructureModelLayerLabel>
                  <span className="text-[11px] text-muted-foreground">Fijo, sin scroll</span>
                </div>

                <div className="mt-3 rounded-lg border border-dashed border-[var(--secondary-400)] bg-muted/15 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <StructureModelLayerLabel>Global Header</StructureModelLayerLabel>
                    <span className="text-[11px] text-muted-foreground">Fijo</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-border/80 bg-background px-3 py-2">
                    <Menu className="size-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-xs text-muted-foreground">Utilidad global futura</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bell className="size-4" aria-hidden="true" />
                      <UserRound className="size-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-dashed border-[var(--secondary-400)] bg-background p-4 shadow-sm sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <SquareStack
                        className="size-4 text-[var(--secondary-600)]"
                        aria-hidden="true"
                      />
                      <StructureModelLayerLabel>Workspace Canvas</StructureModelLayerLabel>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Fijo en el shell</span>
                  </div>

                  <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/25 p-3">
                    <StructureModelLayerLabel>Workspace Header</StructureModelLayerLabel>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Home className="size-3.5" aria-hidden="true" />
                      <ChevronRight className="size-3.5" aria-hidden="true" />
                      <span>Área</span>
                      <ChevronRight className="size-3.5" aria-hidden="true" />
                      <span className="font-semibold text-foreground">Ruta actual</span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/15 p-3">
                    <StructureModelLayerLabel>Page Composition</StructureModelLayerLabel>

                    <div className="mt-3 rounded-lg border border-dashed border-border bg-background/80 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <StructureModelLayerLabel>Page Header</StructureModelLayerLabel>
                        <span className="text-[11px] text-muted-foreground">Opcional</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="h-2 w-36 rounded-full bg-muted-foreground/25" />
                        <div className="h-7 w-20 rounded-md border border-border bg-background" />
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg border border-dashed border-[var(--secondary-300)] bg-background/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <StructureModelLayerLabel>Page Content Scroller</StructureModelLayerLabel>
                        <span className="text-[11px] text-muted-foreground">
                          Modo predeterminado
                        </span>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-border/80 bg-background p-4 shadow-sm">
                          <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                          <div className="mt-4 h-3 w-2/3 rounded-full bg-foreground/15" />
                          <div className="mt-2 h-2 w-full rounded-full bg-muted-foreground/20" />
                          <div className="mt-4 h-16 rounded-md bg-muted/70" />
                        </div>
                        <div className="rounded-lg border border-border/80 bg-background p-4 shadow-sm">
                          <StructureModelLayerLabel>Module Surface</StructureModelLayerLabel>
                          <div className="mt-4 h-3 w-1/2 rounded-full bg-foreground/15" />
                          <div className="mt-2 h-2 w-full rounded-full bg-muted-foreground/20" />
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="h-10 rounded-md bg-muted/70" />
                            <div className="h-10 rounded-md bg-muted/70" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--secondary-300)] bg-background/80 p-4">
              <p className="text-xs font-semibold tracking-[0.08em] text-[var(--secondary-700)] uppercase">
                Page Content Scroll
              </p>
              <p className="mt-1 text-sm font-medium">Modo predeterminado de escritorio</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                El canvas conserva su geometría fija. Page Content Scroller recibe el scroll y los
                headers de contexto permanecen visibles.
              </p>
            </div>
            <div className="rounded-xl border border-dashed border-[var(--secondary-400)] bg-background/80 p-4">
              <p className="text-xs font-semibold tracking-[0.08em] text-[var(--secondary-700)] uppercase">
                Workspace Canvas Scroll
              </p>
              <p className="mt-1 text-sm font-medium">Variante explícita de escritorio</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                El canvas recibe el scroll. Workspace Header y Page Header pueden desplazarse,
                hacerse sticky o transformarse; no se combina con el scroll interno de Page Content
                Scroller.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
