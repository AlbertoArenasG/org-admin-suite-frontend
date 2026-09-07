'use client';

import {
  DashboardLookupDropdown,
  type DashboardLookupDropdownItem,
} from '@/components/vendor/smoothui/searchable-dropdown/DashboardLookupDropdown';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';

const customers = [
  {
    id: 'bosch',
    label: 'Robert Bosch México',
    description: 'Cliente corporativo',
  },
  {
    id: 'kern',
    label: 'Kern & Sohn',
    description: 'Cliente industrial',
  },
  {
    id: 'mitsubishi',
    label: 'Mitsubishi Electric',
    description: 'Cliente corporativo',
  },
  {
    id: 'keysight',
    label: 'Keysight Technologies',
    description: 'Proveedor y cliente',
  },
] satisfies DashboardLookupDropdownItem[];

const customersWithoutDescription = customers.map(({ id, label }) => ({ id, label }));

export default function SearchableDropdownCatalogPage() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Controles' },
        { label: 'Lookup con búsqueda' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Control en validación
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Lookup con búsqueda
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Instalación aislada de SmoothUI para buscar un lookup y seleccionar una opción.
        </p>

        <div className="mt-10">
          <p className="mb-2 text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Vista de interacción
          </p>
          <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Con descripción</p>
              <DashboardLookupDropdown
                className="w-full"
                clearable
                items={customers}
                label="Seleccionar cliente"
                placeholder="Buscar cliente..."
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Sin descripción</p>
              <DashboardLookupDropdown
                className="w-full"
                clearable
                items={customersWithoutDescription}
                label="Seleccionar cliente"
                placeholder="Buscar cliente..."
              />
            </div>
          </div>
        </div>
      </section>
    </DashboardPlaygroundFrame>
  );
}
