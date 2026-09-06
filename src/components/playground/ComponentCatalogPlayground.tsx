'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Blocks,
  Filter,
  LayoutTemplate,
  MousePointerClick,
  PanelsTopLeft,
  Sparkles,
} from 'lucide-react';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { Button } from '@/components/ui/button';

const catalogAreas = [
  {
    title: 'Componentes',
    description: 'Piezas reutilizables que nacen de necesidades comprobadas en vistas migradas.',
    icon: Blocks,
    status: 'Primer componente en definición',
  },
  {
    title: 'Composiciones',
    description: 'Patrones recurrentes que combinan componentes sin datos de negocio.',
    icon: PanelsTopLeft,
    status: 'Se incorporan con las migraciones',
  },
  {
    title: 'Templates',
    description: 'Estructuras de página reutilizables para módulos con necesidades equivalentes.',
    icon: LayoutTemplate,
    status: 'Se incorporan con las migraciones',
  },
  {
    title: 'Experimentos',
    description: 'Patrones aislados que todavía requieren validación antes de entrar al catálogo.',
    icon: Sparkles,
    status: 'Se mantienen fuera del catálogo estable',
  },
] as const;

export function ComponentCatalogPlayground() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Sistema en evolución
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Catálogo del dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Referencia viva de los patrones aprobados. Cada pieza se incorpora a partir de una
          necesidad real, se valida aquí y queda lista para reutilizarse en nuevas vistas.
        </p>

        <section className="mt-8 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Primera entrada
              </p>
              <h2 className="mt-1 text-lg font-semibold">Page Header</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Definirá jerarquía, información mínima, acciones y variantes de comportamiento para
                las rutas migradas.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/dashboard-playground/catalog/page-headers">
                Revisar Page Header
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Fundamento transversal
              </p>
              <h2 className="mt-1 text-lg font-semibold">Acciones y botones</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Define roles, alcance y criterios de adopción antes de elegir los primeros botones
                del catálogo.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/dashboard-playground/catalog/actions-buttons">
                <MousePointerClick className="size-4" aria-hidden="true" />
                Revisar acciones
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Control en validación
              </p>
              <h2 className="mt-1 text-lg font-semibold">Menú de filtros</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Tabs, selección única, contador y reset para filtros de listados operativos.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/dashboard-playground/catalog/controls/filter-menu">
                <Filter className="size-4" aria-hidden="true" />
                Revisar filtros
              </Link>
            </Button>
          </div>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {catalogAreas.map((area) => {
            const Icon = area.icon;

            return (
              <article
                key={area.title}
                className="rounded-xl border border-border/80 bg-card p-5 shadow-sm"
              >
                <Icon className="size-5 text-[var(--secondary-600)]" aria-hidden="true" />
                <h2 className="mt-4 text-base font-semibold">{area.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{area.description}</p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{area.status}</p>
              </article>
            );
          })}
        </div>
      </section>
    </DashboardPlaygroundFrame>
  );
}
