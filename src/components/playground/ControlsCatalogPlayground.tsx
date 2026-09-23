import Link from 'next/link';
import { CalendarRange, Filter } from 'lucide-react';

import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { Button } from '@/components/ui/button';

const controls = [
  {
    title: 'Menú de filtros',
    description: 'Tabs, selección única, contador y reset para filtros de listados operativos.',
    href: '/dashboard-playground/catalog/controls/filter-menu',
    action: 'Revisar filtros',
    icon: Filter,
  },
  {
    title: 'Rango de fechas',
    description: 'Selección de un periodo mediante un calendario de dos meses.',
    href: '/dashboard-playground/catalog/controls/date-range-picker',
    action: 'Revisar rango',
    icon: CalendarRange,
  },
] as const;

export function ControlsCatalogPlayground() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Controles' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Catálogo
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Controles</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Piezas de interacción validadas de forma aislada antes de integrarlas a una vista de
          negocio.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {controls.map((control) => {
            const Icon = control.icon;

            return (
              <article
                key={control.href}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6"
              >
                <Icon className="size-5 text-[var(--secondary-600)]" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold">{control.title}</h2>
                <p className="mt-1 min-h-12 text-sm leading-6 text-muted-foreground">
                  {control.description}
                </p>
                <Button asChild variant="outline" className="mt-5">
                  <Link href={control.href}>{control.action}</Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </DashboardPlaygroundFrame>
  );
}
