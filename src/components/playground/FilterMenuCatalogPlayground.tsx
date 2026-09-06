'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import {
  DashboardFilterMenu,
  type DashboardFilterCategory,
} from '@/components/filters/DashboardFilterMenu';
import { DashboardSingleFilterMenu } from '@/components/filters/DashboardSingleFilterMenu';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { DashboardButton } from '@/components/ui/dashboard-button';

const filterCategories = [
  {
    id: 'service-type',
    label: 'Tipo',
    options: [
      { value: 'calibration', label: 'Calibración' },
      { value: 'corrective-maintenance', label: 'Mantenimiento correctivo' },
      { value: 'preventive-maintenance', label: 'Mantenimiento preventivo' },
      { value: 'verification', label: 'Verificación' },
    ],
  },
  {
    id: 'customer',
    label: 'Cliente',
    searchable: true,
    searchPlaceholder: 'Buscar cliente...',
    options: [
      { value: 'bosch', label: 'Robert Bosch México Sistemas Automotrices' },
      { value: 'kern', label: 'Kern & Sohn' },
      { value: 'mitsubishi', label: 'Mitsubishi Electric' },
    ],
  },
  {
    id: 'status',
    label: 'Estado',
    options: [
      { value: 'pending', label: 'Pendiente' },
      { value: 'in-progress', label: 'En proceso' },
      { value: 'completed', label: 'Completado' },
    ],
  },
] as const satisfies readonly DashboardFilterCategory[];

export function FilterMenuCatalogPlayground() {
  const [variant, setVariant] = useState<'simple' | 'tabs' | 'searchable'>('tabs');
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [singleStatus, setSingleStatus] = useState<string | undefined>();
  const visibleCategories =
    variant === 'searchable'
      ? filterCategories
      : filterCategories.map((category) => ({ ...category, searchable: false }));
  const activeCount =
    variant === 'simple'
      ? Number(Boolean(singleStatus))
      : Object.values(filters).filter(Boolean).length;

  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Controles' },
        { label: 'Menú de filtros' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Control en validación
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Menú de filtros</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Variantes compactas para filtros independientes de selección única. La búsqueda solo se
          habilita dentro de una categoría cuando su volumen realmente lo necesita.
        </p>

        <section className="mt-8 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap gap-2 border-b border-border/70 pb-5">
            <DashboardButton
              type="button"
              size="sm"
              variant={variant === 'simple' ? 'secondary' : 'outline'}
              onClick={() => setVariant('simple')}
            >
              Simple
            </DashboardButton>
            <DashboardButton
              type="button"
              size="sm"
              variant={variant === 'tabs' ? 'secondary' : 'outline'}
              onClick={() => setVariant('tabs')}
            >
              Con tabs
            </DashboardButton>
            <DashboardButton
              type="button"
              size="sm"
              variant={variant === 'searchable' ? 'secondary' : 'outline'}
              onClick={() => setVariant('searchable')}
            >
              Tabs con búsqueda
            </DashboardButton>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Vista de interacción
              </p>
              <h2 className="mt-1 text-lg font-semibold">Registros de servicio</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {variant === 'simple'
                  ? 'Un campo, una categoría y una selección directa.'
                  : 'Una selección por categoría, con contador, palomita y reset.'}
              </p>
            </div>
            {variant === 'simple' ? (
              <DashboardSingleFilterMenu
                category={filterCategories[2]}
                label="Estado"
                value={singleStatus}
                onValueChange={setSingleStatus}
                onReset={() => setSingleStatus(undefined)}
              />
            ) : (
              <DashboardFilterMenu
                categories={visibleCategories}
                values={filters}
                onValueChange={(categoryId, value) => {
                  setFilters((current) => ({ ...current, [categoryId]: value }));
                }}
                onReset={() => setFilters({})}
              />
            )}
          </div>

          <div className="mt-6 border-t border-border/70 pt-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="size-4" aria-hidden="true" />
              El buscador de texto y los rangos de fecha se definirán como controles separados.
            </div>
            <p className="mt-4 text-sm font-medium">
              {activeCount
                ? `${activeCount} filtro${activeCount === 1 ? '' : 's'} activo${activeCount === 1 ? '' : 's'}`
                : 'Sin filtros activos'}
            </p>
          </div>
        </section>
      </section>
    </DashboardPlaygroundFrame>
  );
}
