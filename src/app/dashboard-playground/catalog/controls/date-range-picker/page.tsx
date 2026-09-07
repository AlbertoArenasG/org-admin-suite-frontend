import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { ShadcnDatePickerWithRange } from '@/components/vendor/shadcn/date-picker/ShadcnDatePickerWithRange';

export default function DateRangePickerCatalogPage() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Controles' },
        { label: 'Rango de fechas' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Control en validación
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Rango de fechas</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Instalación aislada del ejemplo de shadcn.io con tokens de superficie y estado por tema.
        </p>

        <div className="mt-10">
          <p className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Vista de interacción
          </p>
          <ShadcnDatePickerWithRange />
        </div>
      </section>
    </DashboardPlaygroundFrame>
  );
}
