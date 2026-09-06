'use client';

import { Download, Ellipsis, Plus, Trash2 } from 'lucide-react';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { DashboardButton } from '@/components/ui/dashboard-button';

const variants = [
  {
    name: 'Primary',
    variant: 'default',
    description: 'Inicia la tarea principal del contexto visible. Solo una por contexto.',
    label: 'Crear invitación',
    icon: Plus,
  },
  {
    name: 'Secondary',
    variant: 'secondary',
    description: 'Complementa una primary de alcance completo de página.',
    label: 'Exportar registros',
    icon: Download,
  },
  {
    name: 'Outline',
    variant: 'outline',
    description: 'Acción visible con menor jerarquía dentro de un bloque operativo.',
    label: 'Cancelar',
    icon: undefined,
  },
  {
    name: 'Ghost',
    variant: 'ghost',
    description: 'Control de baja prominencia para toolbars y acciones locales.',
    label: 'Opciones',
    icon: Ellipsis,
  },
  {
    name: 'Destructive',
    variant: 'destructive',
    description: 'Acción sensible que solo se usa dentro de un flujo con confirmación.',
    label: 'Revocar invitación',
    icon: Trash2,
  },
] as const;

export function ButtonCatalogPlayground() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Acciones y botones', href: '/dashboard-playground/catalog/actions-buttons' },
        { label: 'Botones' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Componente base
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Botones</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Primitive local basado en shadcn. Sus roles visuales y estados consumen recetas explícitas
          del tema activo, sin cambiar la API compatible con las vistas existentes.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {variants.map(({ name, variant, description, label, icon: Icon }) => (
            <article
              key={name}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-sm"
            >
              <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
                {name}
              </p>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{description}</p>
              <DashboardButton variant={variant} className="mt-5">
                {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                {label}
              </DashboardButton>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
            Tamaños y estados
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <DashboardButton size="sm">Acción pequeña</DashboardButton>
            <DashboardButton>Acción estándar</DashboardButton>
            <DashboardButton size="lg">Acción amplia</DashboardButton>
            <DashboardButton size="icon" aria-label="Crear invitación">
              <Plus className="size-4" aria-hidden="true" />
            </DashboardButton>
            <DashboardButton disabled>Acción inactiva</DashboardButton>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Los tamaños son estructurales compartidos. Color, material, hover, foco y estado
            disabled pertenecen a la receta de cada tema.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-dashed border-[var(--secondary-300)] bg-[var(--secondary-50)]/45 p-5 sm:p-6">
          <p className="text-sm font-semibold">Límite de adopción actual</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Esta entrada valida roles y material, no autoriza una migración masiva de Legacy. Cada
            vista migrada adoptará el botón que corresponda a su contexto y a la taxonomía de
            acciones aprobada.
          </p>
        </section>
      </section>
    </DashboardPlaygroundFrame>
  );
}
