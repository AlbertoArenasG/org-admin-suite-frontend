'use client';

import { useEffect, useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataTablePreferencesStore } from '@/stores/useDataTablePreferencesStore';

type DemoRecord = {
  id: string;
  client: string;
  service: string;
  asset: string;
  status: 'En tiempo' | 'Atención' | 'Retrasado';
  delivery: string;
  notes: string;
};

const clients = ['Bosch México', 'Kern & Sohn', 'Mitsubishi Electric', 'Keysight Technologies'];
const services = [
  'Calibración',
  'Mantenimiento preventivo',
  'Mantenimiento correctivo',
  'Verificación',
];
const assets = ['Calibrador de presión', 'Cámara térmica', 'Balanza de precisión', 'Multímetro'];

const records: DemoRecord[] = Array.from({ length: 50 }, (_, index) => ({
  id: `CSR-${String(index + 1).padStart(4, '0')}`,
  client: clients[index % clients.length],
  service: services[index % services.length],
  asset: assets[index % assets.length],
  status: (['En tiempo', 'Atención', 'Retrasado'] as const)[index % 3],
  delivery: `2026-10-${String((index % 28) + 1).padStart(2, '0')}`,
  notes:
    index % 3 === 2
      ? 'Se requiere actualizar el compromiso de entrega con el cliente.'
      : 'El seguimiento del servicio está disponible para consulta.',
}));

export function DataTableCatalogPlayground() {
  const density = useDataTablePreferencesStore((state) => state.density);
  const setDensity = useDataTablePreferencesStore((state) => state.setDensity);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [request, setRequest] = useState(0);
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [visibleColumnIds, setVisibleColumnIds] = useState([
    'record',
    'client',
    'service',
    'status',
    'delivery',
  ]);
  const filtered = useMemo(
    () =>
      records.filter((record) =>
        `${record.client} ${record.service} ${record.asset}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())
      ),
    [search]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visibleRows = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timeout);
  }, [request]);

  const reload = () => {
    setIsLoading(true);
    setRequest((value) => value + 1);
  };

  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'DataTable' },
      ]}
    >
      <section className="mx-auto w-full max-w-6xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Componente compartido
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">DataTable</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Contrato reusable para colecciones remotas, validado con los tokens y temas reales del
          dashboard.
        </p>
        <div className="mt-8">
          <DataTable
            rows={isLoading ? [] : visibleRows}
            loading={isLoading}
            header={{ title: 'Registros de servicio' }}
            getRowId={(row) => row.id}
            density={density}
            settings={{
              density: { value: density, onChange: setDensity },
              columnVisibility: { visibleColumnIds, onChange: setVisibleColumnIds },
            }}
            toolbar={{
              search: {
                value: search,
                onChange: (value) => {
                  setSearch(value);
                  setPage(1);
                  reload();
                },
                placeholder: 'Buscar registros...',
              },
            }}
            searchHighlight={{ query: search }}
            pagination={{
              page,
              perPage,
              total: filtered.length || records.length,
              totalPages,
              onChange: (nextPage) => {
                setPage(nextPage);
                reload();
              },
              onPerPageChange: (nextPerPage) => {
                setPerPage(nextPerPage);
                setPage(1);
                reload();
              },
            }}
            renderLoading={(column) =>
              column === 'client' ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ) : column === 'status' ? (
                <Skeleton className="h-5 w-20 rounded-full" />
              ) : (
                <Skeleton className="h-4 w-28" />
              )
            }
            selection={{
              selectedRowIds,
              onChange: setSelectedRowIds,
              bulkActions: (
                <Button size="sm" variant="outline">
                  Exportar selección
                </Button>
              ),
            }}
            expansion={{
              expandedRowIds,
              onChange: setExpandedRowIds,
              trigger: 'information',
              ariaLabel: 'Mostrar observaciones',
            }}
            renderDetail={(row) => <p className="text-sm text-muted-foreground">{row.notes}</p>}
            fullscreen={{ enterLabel: 'Expandir tabla', exitLabel: 'Salir de vista ampliada' }}
            getRowVisual={(row) =>
              row.status === 'Retrasado'
                ? {
                    indicatorClassName: 'bg-[var(--destructive)]',
                    className: 'bg-[color-mix(in_oklab,var(--destructive)_6%,transparent)]',
                  }
                : row.status === 'Atención'
                  ? { indicatorClassName: 'bg-[var(--warning-500)]' }
                  : undefined
            }
            getRowActions={() => (
              <button
                aria-label="Abrir acciones de fila"
                type="button"
                className="rounded p-1 hover:bg-muted"
              >
                <MoreHorizontal className="size-4" />
              </button>
            )}
            columns={[
              {
                id: 'record',
                header: 'Registro',
                accessor: (row) => row.id,
                visibility: { hideable: false },
                width: { initial: 110, min: 100, max: 200, resizable: true },
              },
              {
                id: 'client',
                header: 'Cliente',
                accessor: (row) => row.client,
                width: { initial: 180, min: 140, max: 320, resizable: true },
              },
              {
                id: 'service',
                header: 'Servicio',
                accessor: (row) => row.service,
                textBehavior: 'wrap',
              },
              {
                id: 'status',
                header: 'Estatus operativo',
                accessor: (row) => row.status,
                cell: (row) => (
                  <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs font-medium">
                    {row.status}
                  </span>
                ),
              },
              { id: 'delivery', header: 'Entrega estimada', accessor: (row) => row.delivery },
            ]}
          />
        </div>
      </section>
    </DashboardPlaygroundFrame>
  );
}
