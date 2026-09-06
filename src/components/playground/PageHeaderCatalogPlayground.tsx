'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { DashboardPageContentScroller } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/page-header';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { DashboardButton } from '@/components/ui/dashboard-button';

type PageHeaderVariant = 'minimal' | 'contextual' | 'with-actions';

interface PageHeaderVariantDefinition {
  label: string;
  title: string;
  eyebrow?: string;
  description?: string;
  metadata?: string;
  detail: string;
  actions?: {
    primary: string;
    secondary?: string;
  };
}

const variants: Record<PageHeaderVariant, PageHeaderVariantDefinition> = {
  minimal: {
    label: 'Minimalista',
    title: 'Invitaciones de usuario',
    detail:
      'La variante más contenida: solo identifica la vista y expone la acción necesaria para continuar.',
    actions: {
      primary: 'Crear invitación',
    },
  },
  contextual: {
    label: 'Con contexto',
    title: 'Invitaciones de usuario',
    eyebrow: 'Acceso y usuarios',
    description: 'Encabezado compacto para una vista de listado con contexto suficiente.',
    metadata: '24 invitaciones activas',
    detail:
      'El título organiza la página; el contexto y la metadata aparecen solo cuando aportan información operativa.',
  },
  'with-actions': {
    label: 'Con contexto y acción',
    title: 'Registros de servicio',
    eyebrow: 'Operación',
    description: 'Acciones de alcance de página, sin absorber controles propios del contenido.',
    metadata: '36 registros',
    detail:
      'La acción primaria y las secundarias se mantienen compactas. Filtros, tabs y comandos permanecen en Page Content.',
    actions: {
      primary: 'Crear registro',
    },
  },
};

const variantKeys = Object.keys(variants) as PageHeaderVariant[];

export function PageHeaderCatalogPlayground() {
  const [variant, setVariant] = useState<PageHeaderVariant>('minimal');
  const definition = variants[variant];

  return (
    <DashboardPlaygroundFrame
      childrenArePageComposition
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Page Header' },
      ]}
    >
      <PageHeader
        title={definition.title}
        eyebrow={definition.eyebrow}
        description={definition.description}
        metadata={definition.metadata ? <span>{definition.metadata}</span> : undefined}
        actionsPlacement={variant === 'minimal' ? 'title' : 'end'}
        actions={
          definition.actions ? (
            <>
              <DashboardButton size="sm">
                <Plus className="size-4" aria-hidden="true" />
                {definition.actions.primary}
              </DashboardButton>
            </>
          ) : undefined
        }
      />

      <DashboardPageContentScroller padding="default">
        <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
            Catálogo de componentes
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Variantes de Page Header</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            El preview se muestra arriba como primer bloque de la composición. Cambia de variante
            sin alterar el espacio real que ocupa el encabezado.
          </p>

          <div
            role="tablist"
            aria-label="Variantes de Page Header"
            className="mt-5 flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-border/80 bg-muted/35 p-1"
          >
            {variantKeys.map((key) => {
              const isSelected = variant === key;

              return (
                <DashboardButton
                  key={key}
                  type="button"
                  role="tab"
                  id={`page-header-tab-${key}`}
                  size="sm"
                  variant={isSelected ? 'secondary' : 'ghost'}
                  aria-selected={isSelected}
                  aria-controls="page-header-catalog-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setVariant(key)}
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                      return;
                    }

                    event.preventDefault();
                    const direction = event.key === 'ArrowRight' ? 1 : -1;
                    const nextIndex =
                      (variantKeys.indexOf(key) + direction + variantKeys.length) %
                      variantKeys.length;
                    const nextVariant = variantKeys[nextIndex];
                    setVariant(nextVariant);
                    event.currentTarget.parentElement
                      ?.querySelector<HTMLButtonElement>(`#page-header-tab-${nextVariant}`)
                      ?.focus();
                  }}
                >
                  {variants[key].label}
                </DashboardButton>
              );
            })}
          </div>

          <div
            id="page-header-catalog-panel"
            role="tabpanel"
            aria-labelledby={`page-header-tab-${variant}`}
            className="mt-5"
          >
            <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
                Contenido de referencia
              </p>
              <h3 className="mt-2 text-lg font-semibold">Jerarquía posterior al header</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {definition.detail}
              </p>
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
              Anatomía y combinaciones
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border/80">
              <div className="border-b border-border/70 bg-muted/35 px-4 py-3 text-sm font-semibold">
                <code>PageHeader</code>
              </div>
              <div className="grid gap-px bg-border/70 md:grid-cols-[minmax(0,1fr)_14rem]">
                <div className="space-y-3 bg-card p-4">
                  <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2">
                    <code className="text-sm font-medium">eyebrow</code>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Opcional · arriba del título
                    </span>
                  </div>
                  <div className="pl-3 text-xs text-muted-foreground" aria-hidden="true">
                    ↓
                  </div>
                  <div>
                    <code className="text-sm font-semibold text-[var(--page-header-foreground)]">
                      title
                    </code>
                    <span className="ml-2 rounded-full bg-[var(--secondary-100)] px-2 py-0.5 text-xs font-medium text-[var(--secondary-700)]">
                      obligatorio
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Núcleo y encabezado de la vista.
                    </p>
                  </div>
                  <div className="pl-3 text-xs text-muted-foreground" aria-hidden="true">
                    ↓
                  </div>
                  <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2">
                    <code className="text-sm font-medium">description</code>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Opcional · debajo del título
                    </span>
                  </div>
                  <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2">
                    <code className="text-sm font-medium">metadata</code>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Opcional · después de la descripción
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-end bg-card p-4">
                  <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2">
                    <code className="text-sm font-medium">actions</code>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Opcional · junto al título en mínima; al final en la variante estándar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              <code>titleAs</code> es un ajuste semántico para previews o composiciones que ya
              tienen un <code>h1</code>; no cambia el contenido del header.
            </p>
          </section>

          <section className="mt-5 rounded-2xl border border-dashed border-[var(--secondary-300)] bg-[var(--secondary-50)]/45 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-[var(--secondary-600)]" aria-hidden="true" />
                  Experimento disponible
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  El header colapsable permanece como experimento aislado. Su resultado puede
                  informar una variante futura, pero no define el comportamiento base.
                </p>
              </div>
              <DashboardButton asChild variant="outline" className="shrink-0">
                <Link href="/dashboard-playground/experiments/sticky-page-header">
                  Abrir experimento
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </DashboardButton>
            </div>
          </section>
        </section>
      </DashboardPageContentScroller>
    </DashboardPlaygroundFrame>
  );
}
