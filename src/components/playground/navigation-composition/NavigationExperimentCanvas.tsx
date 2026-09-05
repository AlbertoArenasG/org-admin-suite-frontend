'use client';

import { Bell, ChevronRight, CircleHelp, Menu, Settings2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

export function NavigationExperimentCanvas() {
  return (
    <section className="dashboard-workspace-canvas flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:my-3 md:mr-3 md:rounded-[1.5rem]">
      <header className="flex min-h-16 shrink-0 items-center gap-3 border-b border-border/70 px-4 sm:px-5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Abrir navegación de ejemplo"
        >
          <Menu className="size-4" aria-hidden="true" />
        </Button>
        <div className="flex flex-1 items-center justify-end gap-1">
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Ayuda de ejemplo">
            <CircleHelp className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Notificaciones de ejemplo"
          >
            <Bell className="size-4" aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Cuenta de ejemplo">
            <Avatar className="size-7 border border-border">
              <AvatarFallback className="bg-muted text-[10px] font-semibold text-foreground">
                AA
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      <div className="flex min-h-12 shrink-0 items-center gap-2 border-b border-border/70 px-4 sm:px-5">
        <span className="shrink-0 text-sm text-muted-foreground">Inicio</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="shrink-0 text-sm text-muted-foreground">Playground</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="truncate text-sm font-medium text-foreground">
          Composición de navegación
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-none">
        <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-7 lg:px-9">
          <div className="flex flex-col gap-5 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Experimento estructural
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Navegación y canvas integrados
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                El toolbar vive dentro del workspace para evaluar jerarquía y espacio operativo. No
                modifica el dashboard real ni define todavía un patrón aprobado.
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
                    Esta superficie representa contenido real de módulo. El protagonismo queda en
                    datos, acciones y contexto de la página.
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
                    <p className="mt-2 text-2xl font-semibold tracking-tight">
                      {[18, 7, 42][index]}
                    </p>
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
                El borde entre navegación y área operativa es claro sin convertir la franja superior
                en una capa externa adicional.
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
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {surface.description}
                </p>
              </article>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}
