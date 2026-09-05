'use client';

import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const previewSurfaces = [
  { title: 'Módulos recientes', description: 'Espacio operativo para contenido de negocio.' },
  {
    title: 'Acciones pendientes',
    description: 'Una superficie secundaria con jerarquía contenida.',
  },
  {
    title: 'Actividad del módulo',
    description: 'La navegación no compite con los datos de la ruta.',
  },
];

export function NavigationCompositionDemoContent() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-7 lg:px-9">
      <div className="flex flex-col gap-5 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Demo estructural
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Navegación y canvas integrados
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Esta ruta monta el Next Dashboard real para validar la toolbar dentro del canvas y la
            jerarquía de su área operativa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm">
            <Settings2 className="size-4" aria-hidden="true" />
            Configurar
          </Button>
          <Button type="button" size="sm">
            Crear
          </Button>
        </div>
      </div>

      <section className="mt-7 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-2xl border border-[var(--module-surface-border)] bg-[var(--module-surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Superficie principal
              </p>
              <h2 className="mt-2 text-lg font-semibold">Resumen operativo</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Esta superficie representa contenido real de módulo. El protagonismo queda en datos,
                acciones y contexto de la página.
              </p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Referencia
            </span>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {['Pendientes', 'En curso', 'Completados'].map((label, index) => (
              <div key={label} className="rounded-xl border border-border/70 bg-muted/35 p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{[18, 7, 42][index]}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-[var(--module-surface-border)] bg-[var(--module-surface)] p-5 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Principio evaluado
          </p>
          <h2 className="mt-2 text-lg font-semibold">Toolbar dentro del canvas</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Los controles globales comparten la superficie del workspace, mientras los breadcrumbs y
            el contexto de la ruta ocupan su propia fila.
          </p>
        </article>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {previewSurfaces.map((surface) => (
          <article
            key={surface.title}
            className="rounded-2xl border border-[var(--module-surface-border)] bg-[var(--module-surface)] p-5 shadow-sm"
          >
            <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Module Surface
            </p>
            <h2 className="mt-2 font-semibold">{surface.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{surface.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
