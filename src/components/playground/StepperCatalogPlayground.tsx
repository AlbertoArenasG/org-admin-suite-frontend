'use client';

import { useState } from 'react';
import { Building2, ClipboardList, PackageCheck, Send } from 'lucide-react';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Stepper,
  type StepperNavigationContext,
  type StepperStep,
} from '@/components/vendor/shadcn-space/stepper';

const steps: StepperStep[] = [
  { id: 'details', label: 'Detalles', icon: ClipboardList },
  { id: 'customer', label: 'Cliente', icon: Building2 },
  { id: 'asset', label: 'Activo', icon: PackageCheck },
  { id: 'review', label: 'Confirmar', icon: Send },
];

export function StepperCatalogPlayground() {
  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Stepper' },
      ]}
    >
      <section className="mx-auto w-full max-w-5xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Fundamento en validación
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Stepper</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Progreso controlado para flujos de varios pasos. La vista conserva la validación y decide
          si autoriza cada transición.
        </p>

        <section className="mt-8 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Ruta dedicada
          </p>
          <h2 className="mt-2 text-xl font-semibold">La validación pertenece al consumidor</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            El primer paso bloquea el avance hasta que el formulario anfitrión lo declara válido.
            Volver a pasos anteriores siempre está permitido.
          </p>
          <div className="mt-6 rounded-xl border border-border/70 bg-background p-4 sm:p-6">
            <StepperScenario />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Host alterno
          </p>
          <h2 className="mt-2 text-xl font-semibold">El mismo stepper dentro de un diálogo</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            El componente no asume el frame. Ruta, diálogo o modal aportan su propio encabezado,
            scroll y acciones.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-5" variant="outline">
                Abrir en diálogo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo registro de servicio</DialogTitle>
                <DialogDescription>
                  El host controla el contexto; el stepper conserva la misma API.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1">
                <StepperScenario compact />
              </div>
            </DialogContent>
          </Dialog>
        </section>
      </section>
    </DashboardPlaygroundFrame>
  );
}

function StepperScenario({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState('details');
  const [detailsValid, setDetailsValid] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const activeIndex = steps.findIndex((step) => step.id === value);

  const canNavigateTo = ({ targetIndex, currentIndex }: StepperNavigationContext) =>
    targetIndex <= currentIndex;

  const continueToNextStep = () => {
    if (value === 'details' && !detailsValid) {
      setValidationAttempted(true);
      return;
    }
    setValidationAttempted(false);
    const nextStep = steps[activeIndex + 1];
    if (nextStep) setValue(nextStep.id);
  };

  const previousStep = steps[activeIndex - 1];
  const stepStates = steps.map((step) =>
    step.id === 'details' && validationAttempted && !detailsValid
      ? { ...step, status: 'error' as const }
      : step
  );

  return (
    <div className="space-y-6">
      <Stepper
        steps={stepStates}
        value={value}
        onValueChange={setValue}
        canNavigateTo={canNavigateTo}
      />
      <div
        className={
          compact
            ? 'rounded-xl bg-muted/50 p-4'
            : 'rounded-xl border border-border/70 bg-muted/30 p-5'
        }
      >
        <p className="text-sm font-semibold">{steps[activeIndex].label}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {value === 'details'
            ? 'Simula una validación local antes de permitir continuar.'
            : 'La vista recibió y autorizó esta transición. El stepper no conoce la lógica del recurso.'}
        </p>
        {value === 'details' ? (
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm">
            <input
              checked={detailsValid}
              className="size-4 accent-primary"
              onChange={(event) => setDetailsValid(event.target.checked)}
              type="checkbox"
            />
            Datos obligatorios completos
          </label>
        ) : null}
        {validationAttempted && !detailsValid ? (
          <p className="mt-3 text-sm text-destructive">
            Completa los datos obligatorios antes de avanzar.
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button
          disabled={!previousStep}
          onClick={() => previousStep && setValue(previousStep.id)}
          type="button"
          variant="outline"
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Paso {activeIndex + 1} de {steps.length}
        </span>
        <Button
          disabled={activeIndex === steps.length - 1}
          onClick={continueToNextStep}
          type="button"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
