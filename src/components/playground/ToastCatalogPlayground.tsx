'use client';

import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { Button } from '@/components/ui/button';

export function ToastCatalogPlayground() {
  const { showSnackbar, showSnackbarPromise } = useSnackbar();

  const runMinimalPromise = () => {
    const request = new Promise<void>((resolve) => window.setTimeout(resolve, 1200));

    void showSnackbarPromise(request, {
      error: {
        autopilot: { collapse: 5200, expand: 160 },
        description: 'Verifica tu conexión e inténtalo de nuevo.',
        duration: 6000,
        title: 'No se guardaron los cambios',
      },
      loading: {
        title: 'Guardando usuario',
      },
      success: {
        duration: 4000,
        title: 'Usuario actualizado',
      },
    }).catch(() => undefined);
  };

  const runExpandedSummary = () => {
    const request = new Promise<void>((resolve) => window.setTimeout(resolve, 1200));

    void showSnackbarPromise(request, {
      error: {
        autopilot: { collapse: 5200, expand: 160 },
        description: 'No se pudo terminar la importación. Inténtalo de nuevo.',
        duration: 6000,
        title: 'Importación incompleta',
      },
      loading: {
        title: 'Importando clientes',
      },
      success: {
        autopilot: { collapse: 5200, expand: 160 },
        description: <ImportSummaryContent />,
        duration: 7000,
        title: 'Importación completada',
      },
    }).catch(() => undefined);
  };

  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Toasts' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Feedback transversal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Toasts</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Recetas aprobadas para comunicar el resultado de una acción. La variante mínima es la
          referencia; el contenido expandido solo se usa cuando muestra información accionable.
        </p>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <RecipeCard
            description="Para crear, editar o guardar un recurso. Conserva la transición de carga a éxito sin repetir el resultado en una descripción."
            title="Promesa mínima"
          >
            <Button onClick={runMinimalPromise} type="button">
              Simular guardado
            </Button>
          </RecipeCard>
          <RecipeCard
            description="Para operaciones cuyo resultado aporta cifras, pendientes o próximos pasos. El contenido debe sumar datos, no repetir el título o el estado."
            title="Resumen expandible"
          >
            <Button onClick={runExpandedSummary} type="button" variant="outline">
              Simular importación
            </Button>
          </RecipeCard>
        </section>

        <section className="mt-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
            Estados inmediatos
          </p>
          <h2 className="mt-2 text-lg font-semibold">Feedback sin operación pendiente</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            Úsalos para mensajes breves que no representan una transición remota. La apariencia se
            resuelve con la receta del tema activo, incluido Nocturno.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              onClick={() =>
                showSnackbar({
                  message: 'Los cambios se guardaron correctamente.',
                  severity: 'success',
                })
              }
              type="button"
            >
              Éxito
            </Button>
            <Button
              onClick={() =>
                showSnackbar({ message: 'No fue posible completar la acción.', severity: 'error' })
              }
              type="button"
              variant="outline"
            >
              Error
            </Button>
            <Button
              onClick={() =>
                showSnackbar({
                  message: 'Hay información pendiente de revisar.',
                  severity: 'warning',
                })
              }
              type="button"
              variant="outline"
            >
              Advertencia
            </Button>
            <Button
              onClick={() =>
                showSnackbar({
                  message: 'Los cambios pueden tardar unos minutos en reflejarse.',
                  severity: 'info',
                })
              }
              type="button"
              variant="outline"
            >
              Información
            </Button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-dashed border-[var(--secondary-300)] bg-[var(--secondary-50)]/45 p-5 sm:p-6">
          <p className="text-sm font-semibold">Criterio para ampliar el catálogo</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Una receta nueva debe responder a un resultado repetible de negocio y aportar datos o
            una acción que el título no comunica. Se valida primero en el laboratorio y después se
            incorpora aquí con su contrato de uso.
          </p>
        </section>
      </section>
    </DashboardPlaygroundFrame>
  );
}

function ImportSummaryContent() {
  return (
    <div className="grid gap-3">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] opacity-60 uppercase">
          Importación de clientes
        </p>
        <p className="mt-1 text-base font-semibold">42 registros procesados</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-current/15 bg-current/5 px-3 py-2">
          <p className="opacity-60">Actualizados</p>
          <p className="mt-1 text-base font-semibold">40</p>
        </div>
        <div className="rounded-lg border border-current/15 bg-current/5 px-3 py-2">
          <p className="opacity-60">Por revisar</p>
          <p className="mt-1 text-base font-semibold">2</p>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <article className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.1em] text-[var(--secondary-700)] uppercase">
        Receta aprobada
      </p>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </article>
  );
}
