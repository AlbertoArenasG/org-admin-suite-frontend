'use client';

import { CircleEllipsis, CirclePlus, MousePointerClick, ShieldAlert } from 'lucide-react';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';

const actionRoles = [
  {
    title: 'Primary',
    description: 'La acción principal de la página. Solo una por contexto visible.',
    example: 'Ejemplo: “Crear invitación” desde el listado de invitaciones.',
    icon: CirclePlus,
  },
  {
    title: 'Secondary',
    description: 'Acciones complementarias visibles cuando aportan claridad inmediata.',
    example: 'Ejemplo: “Administrar columnas” en la barra de la tabla de invitaciones.',
    icon: MousePointerClick,
  },
  {
    title: 'Overflow',
    description:
      'Acciones de menor frecuencia o prioridad agrupadas fuera de la superficie principal.',
    example: 'Ejemplo: ver o reenviar una invitación desde el menú de una fila.',
    icon: CircleEllipsis,
  },
  {
    title: 'Destructive',
    description:
      'Acciones con impacto irreversible o sensible; requieren un flujo de confirmación.',
    example: 'Ejemplo: “Revocar invitación” desde la fila, después de confirmación.',
    icon: ShieldAlert,
  },
] as const;

const actionScopes = [
  {
    title: 'Page Header',
    description:
      'Una primary y hasta dos secondary, solo si afectan el propósito completo de la página. No contiene controles de tabla ni de entidad.',
  },
  {
    title: 'Page Content',
    description: 'Filtros, tabs, búsqueda, comandos de tabla y acciones masivas.',
  },
  {
    title: 'Fila o entidad',
    description: 'Acciones locales de un registro, tarjeta o elemento específico.',
  },
] as const;

export function ActionsButtonsCatalogPlayground() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Acciones y botones' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Catálogo en definición
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Acciones y botones
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Contrato de intención antes de adoptar componentes externos. Define qué papel cumple una
          acción y dónde puede vivir; la apariencia concreta se validará después en Playground.
        </p>

        <section className="mt-8">
          <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
            Roles de acción
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {actionRoles.map((role) => {
              const Icon = role.icon;

              return (
                <article
                  key={role.title}
                  className="rounded-xl border border-border/80 bg-card p-5 shadow-sm"
                >
                  <Icon className="size-5 text-[var(--secondary-600)]" aria-hidden="true" />
                  <h2 className="mt-4 text-base font-semibold">{role.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{role.description}</p>
                  <p className="mt-3 text-sm font-medium text-[var(--secondary-700)]">
                    {role.example}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
            Alcance de uso
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {actionScopes.map((scope) => (
              <div key={scope.title} className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <h2 className="text-sm font-semibold">{scope.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{scope.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-dashed border-[var(--secondary-300)] bg-[var(--secondary-50)]/45 p-5 sm:p-6">
          <p className="text-sm font-semibold">Siguiente incorporación</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Los candidatos de ChatCN o ReUI se evaluarán aquí antes de entrar al catálogo: contrato
            de accesibilidad, dependencia, API, tokens temáticos y consistencia con los roles ya
            definidos. Ninguna pieza externa se adopta directamente en una vista de negocio.
          </p>
        </section>
      </section>
    </DashboardPlaygroundFrame>
  );
}
