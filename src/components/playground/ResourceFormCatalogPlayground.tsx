'use client';

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Edit3, PanelRight } from 'lucide-react';
import { DashboardPlaygroundFrame } from '@/components/playground/DashboardPlaygroundFrame';
import {
  ResourceFormActions,
  ResourceFormOverlay,
  ResourceFormRoute,
  ResourceFormSection,
  ResourceFormSkeleton,
  type ResourceFormDensity,
  type ResourceFormSectionSurface,
  type ResourceFormStatus,
  type ResourceFormSurface,
} from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  SharkDrawer,
  SharkDrawerBody,
  SharkDrawerContent,
  SharkDrawerHeader,
  SharkDrawerTrigger,
} from '@/components/vendor/shark/forms/drawer';
import { SharkCheckbox } from '@/components/vendor/shark/forms/checkbox';
import {
  SharkEditable,
  SharkEditableArea,
  SharkEditableInput,
  SharkEditablePreview,
} from '@/components/vendor/shark/forms/editable';
import { SharkRadioGroup, SharkRadioGroupItem } from '@/components/vendor/shark/forms/radio-group';

type PreviewValues = {
  name: string;
  email: string;
  accessLevel: string;
  customerScope: string;
};
type ActionSlot = 'footer' | 'header' | 'hidden';
type SaveResult = 'success' | 'error';

type PreviewConfiguration = {
  density: ResourceFormDensity;
  globalActions: ActionSlot;
  sectionActions: ActionSlot;
  sectionSurface: ResourceFormSectionSurface;
  saveResult: SaveResult;
  showFrameHeader: boolean;
  showAdditionalSections: boolean;
  simulateLoading: boolean;
  showStickyRouteFooter: boolean;
  showStickyRouteHeader: boolean;
  showSecondSection: boolean;
  showSectionHeader: boolean;
  surface: ResourceFormSurface;
};

const initialValues: PreviewValues = {
  name: 'Mariana López',
  email: 'mariana.lopez@icsacv.mx',
  accessLevel: 'Operación',
  customerScope: 'Todos los clientes',
};

const initialConfiguration: PreviewConfiguration = {
  density: 'comfortable',
  globalActions: 'footer',
  sectionActions: 'hidden',
  sectionSurface: 'bare',
  saveResult: 'success',
  showFrameHeader: true,
  showAdditionalSections: false,
  showStickyRouteFooter: false,
  showStickyRouteHeader: false,
  simulateLoading: false,
  showSecondSection: true,
  showSectionHeader: true,
  surface: 'card',
};

export function ResourceFormCatalogPlayground() {
  const [configuration, setConfiguration] = useState(initialConfiguration);

  return (
    <DashboardPlaygroundFrame
      segments={[
        { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
        { label: 'Dashboard Playground', href: '/dashboard-playground' },
        { label: 'Catálogo', href: '/dashboard-playground/catalog' },
        { label: 'Formularios editables' },
      ]}
    >
      <section className="mx-auto w-full max-w-6xl py-4 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
          Fundamento en validación
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Formularios editables
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Espécimen completo de la composición neutral en ruta, diálogo y Drawer. No representa un
          recurso de negocio ni ejecuta una mutación remota.
        </p>

        <ValidationControls configuration={configuration} onChange={setConfiguration} />

        <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
          <RoutePreview configuration={configuration} />
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Hosts overlay
            </p>
            <h2 className="mt-2 text-lg font-semibold">Mismo contenido, distinto contexto</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              La spec de cada recurso escoge diálogo o Drawer; la fundación no impone esa decisión.
            </p>
            <div className="mt-5 grid gap-3">
              <DialogPreview configuration={configuration} />
              <DrawerPreview configuration={configuration} />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
            Estado de carga
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Skeleton estructural</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Reutiliza el frame y las orientaciones reales del formulario. Cada vista declara sus
            grupos de campos, sin reconstruir una card genérica ni imitar valores de negocio.
          </p>
          <div className="mt-6 max-w-4xl">
            <ResourceFormSkeleton
              contentSurface={{ base: 'bare', md: 'inset' }}
              density={{ base: 'compact', md: 'comfortable' }}
              dividers="hidden"
              groups={[
                { fields: 4, orientation: 'responsive' },
                { fields: 3, orientation: 'responsive' },
              ]}
              headerActions={2}
              surface={{ base: 'bare', md: 'card' }}
            />
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--secondary-700)] uppercase">
            Anatomía de la composición
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Capas estables, apariencia opcional
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Las piezas se mantienen aunque un recurso omita superficie, padding, títulos o
            descripciones. El preview superior las presenta todas para exponer el contrato completo.
          </p>
          <div className="mt-6 space-y-8">
            <CompositionDiagram
              kind="route"
              items={[
                { label: 'Page Header', note: 'Opcional. Contexto de la ruta.' },
                { label: 'ResourceFormRoute', note: 'Estructural. Contenedor de workspace.' },
                {
                  label: 'ResourceFormFrame',
                  note: 'Card o bare; puede alojar acciones globales en header o footer.',
                },
                {
                  label: 'ResourceFormSection y campos',
                  note: 'Una o varias agrupaciones; acciones locales solo para operaciones independientes.',
                },
                {
                  label: 'ResourceFormActions',
                  note: 'Reutilizable en slots globales o locales; su posición no define atomicidad.',
                },
              ]}
              title="Ruta dedicada"
            />
            <CompositionDiagram
              kind="overlay"
              items={[
                { label: 'Dialog o Drawer', note: 'Host decidido por la spec del recurso.' },
                { label: 'Encabezado del host', note: 'Título contextual opcional visible.' },
                {
                  label: 'ResourceFormFrame',
                  note: 'Card o bare; puede alojar acciones globales en header o footer.',
                },
                {
                  label: 'ResourceFormSection y campos',
                  note: 'Una o varias agrupaciones; acciones locales solo para operaciones independientes.',
                },
                {
                  label: 'ResourceFormActions',
                  note: 'Reutilizable en slots globales o locales; su posición no define atomicidad.',
                },
              ]}
              title="Overlay"
            />
          </div>
        </section>
      </section>
    </DashboardPlaygroundFrame>
  );
}

function ValidationControls({
  configuration,
  onChange,
}: {
  configuration: PreviewConfiguration;
  onChange: Dispatch<SetStateAction<PreviewConfiguration>>;
}) {
  const update = <Key extends keyof PreviewConfiguration>(
    key: Key,
    value: PreviewConfiguration[Key]
  ) => onChange((current) => ({ ...current, [key]: value }));

  return (
    <section className="mt-6 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Controles de validación
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Se aplican al espécimen en ruta y a ambos hosts overlay.
          </p>
        </div>
        <Button
          onClick={() => onChange(initialConfiguration)}
          size="sm"
          type="button"
          variant="ghost"
        >
          Restablecer
        </Button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ValidationRadioGroup
          label="Superficie"
          onValueChange={(value) => update('surface', value as ResourceFormSurface)}
          options={['card', 'bare']}
          value={configuration.surface}
        />
        <ValidationRadioGroup
          label="Densidad"
          onValueChange={(value) => update('density', value as ResourceFormDensity)}
          options={['comfortable', 'compact', 'none']}
          value={configuration.density}
        />
        <fieldset>
          <legend className="text-xs font-medium text-muted-foreground">Encabezados</legend>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            <ValidationCheckbox
              checked={configuration.showFrameHeader}
              label="Frame"
              onCheckedChange={(checked) => update('showFrameHeader', checked)}
            />
            <ValidationCheckbox
              checked={configuration.showSectionHeader}
              label="Sección"
              onCheckedChange={(checked) => update('showSectionHeader', checked)}
            />
            <ValidationCheckbox
              checked={configuration.showSecondSection}
              label="Segunda sección"
              onCheckedChange={(checked) => update('showSecondSection', checked)}
            />
            <ValidationCheckbox
              checked={configuration.showAdditionalSections}
              label="Más secciones"
              onCheckedChange={(checked) => update('showAdditionalSections', checked)}
            />
            <ValidationCheckbox
              checked={configuration.showStickyRouteHeader}
              label="Header sticky de ruta"
              onCheckedChange={(checked) => update('showStickyRouteHeader', checked)}
            />
            <ValidationCheckbox
              checked={configuration.showStickyRouteFooter}
              label="Footer sticky de ruta"
              onCheckedChange={(checked) => update('showStickyRouteFooter', checked)}
            />
          </div>
        </fieldset>
        <ValidationRadioGroup
          label="Acciones globales"
          onValueChange={(value) => update('globalActions', value as ActionSlot)}
          options={['header', 'footer', 'hidden']}
          value={configuration.globalActions}
        />
        <ValidationRadioGroup
          label="Acciones de sección"
          onValueChange={(value) => update('sectionActions', value as ActionSlot)}
          options={['header', 'footer', 'hidden']}
          value={configuration.sectionActions}
        />
        <ValidationRadioGroup
          label="Superficie de sección"
          onValueChange={(value) => update('sectionSurface', value as ResourceFormSectionSurface)}
          options={['bare', 'card']}
          value={configuration.sectionSurface}
        />
        <ValidationRadioGroup
          label="Resultado de guardado"
          onValueChange={(value) => update('saveResult', value as SaveResult)}
          options={['success', 'error']}
          value={configuration.saveResult}
        />
        <fieldset>
          <legend className="text-xs font-medium text-muted-foreground">Estados remotos</legend>
          <div className="mt-2">
            <ValidationCheckbox
              checked={configuration.simulateLoading}
              label="Simular carga"
              onCheckedChange={(checked) => update('simulateLoading', checked)}
            />
          </div>
        </fieldset>
      </div>
    </section>
  );
}

function ValidationRadioGroup({
  label,
  onValueChange,
  options,
  value,
}: {
  label: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
  value: string;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-medium text-muted-foreground">{label}</legend>
      <SharkRadioGroup
        className="mt-2 flex flex-row flex-wrap gap-x-4 gap-y-2"
        onValueChange={({ value: nextValue }) => {
          if (nextValue) onValueChange(nextValue);
        }}
        value={value}
      >
        {options.map((option) => (
          <SharkRadioGroupItem key={option} value={option}>
            <span className="capitalize">{option}</span>
          </SharkRadioGroupItem>
        ))}
      </SharkRadioGroup>
    </fieldset>
  );
}

function ValidationCheckbox({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
      <SharkCheckbox
        checked={checked}
        onCheckedChange={({ checked: nextChecked }) => onCheckedChange(nextChecked === true)}
      />
      {label}
    </label>
  );
}

function CompositionDiagram({
  kind,
  items,
  title,
}: {
  kind: 'route' | 'overlay';
  items: Array<{ label: string; note: string }>;
  title: string;
}) {
  return (
    <article className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ol className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li className="relative pl-11" key={item.label}>
            {index < items.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-4 top-8 h-6 border-l border-dashed border-border"
              />
            ) : null}
            <span className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs text-muted-foreground">
              {index + 1}
            </span>
            <div className="rounded-lg border border-border/70 bg-background px-3 py-2.5">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-7 border-t border-border/70 pt-5">
        <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Diagrama visual
        </p>
        <ContainmentDiagram kind={kind} />
      </div>
    </article>
  );
}

function ContainmentDiagram({ kind }: { kind: 'route' | 'overlay' }) {
  const hostLabel = kind === 'route' ? 'Page Header' : 'Dialog o Drawer';

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/20 p-3 sm:p-4">
      <div className="rounded-lg border border-border/80 bg-background p-2 shadow-sm">
        {kind === 'route' ? (
          <div className="rounded-md border border-border bg-card p-2">
            <DiagramLayer accent label={hostLabel} variant="header" />
            <DiagramLayer className="mt-2" label="ResourceFormRoute">
              <DiagramLayer label="ResourceFormFrame" variant="frame">
                <DiagramActionSlot label="Acciones globales en header" />
                <DiagramLayer label="ResourceFormSection" variant="section">
                  <DiagramActionSlot label="Acciones locales en header" />
                  <DiagramFields />
                  <DiagramActionSlot label="Acciones locales en footer" />
                </DiagramLayer>
                <DiagramActionSlot label="Acciones globales en footer" />
              </DiagramLayer>
            </DiagramLayer>
          </div>
        ) : (
          <div className="rounded-md bg-muted/60 p-3">
            <DiagramLayer accent className="mx-auto max-w-[18rem]" label={hostLabel} variant="host">
              <DiagramLayer label="Encabezado del host" variant="header" />
              <DiagramLayer label="ResourceFormFrame" variant="frame">
                <DiagramActionSlot label="Acciones globales en header" />
                <DiagramLayer label="ResourceFormSection" variant="section">
                  <DiagramActionSlot label="Acciones locales en header" />
                  <DiagramFields />
                  <DiagramActionSlot label="Acciones locales en footer" />
                </DiagramLayer>
                <DiagramActionSlot label="Acciones globales en footer" />
              </DiagramLayer>
            </DiagramLayer>
          </div>
        )}
      </div>
    </div>
  );
}

function DiagramLayer({
  accent = false,
  children,
  className,
  label,
  variant = 'container',
}: {
  accent?: boolean;
  children?: ReactNode;
  className?: string;
  label: string;
  variant?: 'container' | 'frame' | 'header' | 'host' | 'section';
}) {
  const styles = {
    container: 'border-dashed border-border bg-background/70',
    frame: 'border-border bg-card shadow-sm',
    header: 'border-primary/25 bg-primary/5',
    host: 'border-primary/30 bg-card shadow-md',
    section: 'border-border/70 bg-muted/25',
  }[variant];

  return (
    <div className={`rounded-md border p-2 ${styles} ${className ?? ''}`}>
      <p
        className={`text-[0.65rem] font-semibold tracking-[0.08em] uppercase ${
          accent ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        {label}
      </p>
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}

function DiagramFields() {
  return (
    <div>
      <p className="mb-1.5 text-[0.65rem] font-medium text-muted-foreground">Campos del recurso</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-7 rounded border border-border bg-background" />
        <div className="h-7 rounded border border-border bg-background" />
      </div>
    </div>
  );
}

function DiagramActionSlot({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center justify-between rounded border border-dashed border-primary/35 bg-primary/5 px-2 py-1.5">
      <p className="text-[0.6rem] font-semibold tracking-[0.06em] text-primary uppercase">
        {label} <span className="text-muted-foreground">(opcional)</span>
      </p>
      <div className="flex gap-1.5">
        <span className="h-5 w-8 rounded border border-border bg-background" />
        <span className="h-5 w-9 rounded bg-primary" />
      </div>
    </div>
  );
}

function RoutePreview({ configuration }: { configuration: PreviewConfiguration }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(initialValues);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const remote = usePreviewRemoteState(configuration);

  return (
    <div
      className="max-h-[34rem] overflow-y-auto rounded-2xl border border-border/80 bg-background shadow-sm"
      ref={scrollContainerRef}
    >
      <ResourceFormRoute
        footer={
          configuration.showStickyRouteFooter ? (
            <div className="border-t border-border bg-background px-4 py-3 text-right text-xs text-muted-foreground shadow-[0_-6px_16px_-14px_hsl(var(--foreground))] sm:px-5">
              Acciones globales de la ruta
            </div>
          ) : undefined
        }
        header={
          configuration.showStickyRouteHeader ? (
            <div className="flex h-12 items-center border-b border-border bg-background px-4 text-sm font-medium shadow-[0_6px_16px_-14px_hsl(var(--foreground))] sm:px-5">
              Contexto persistente de la ruta
            </div>
          ) : undefined
        }
        navigation={
          configuration.showSecondSection
            ? {
                items: [
                  { id: 'resource-form-preview-general', label: 'Datos generales' },
                  { id: 'resource-form-preview-access', label: 'Configuración' },
                  ...(configuration.showAdditionalSections
                    ? [
                        { id: 'resource-form-preview-notifications', label: 'Notificaciones' },
                        { id: 'resource-form-preview-logistics', label: 'Logística' },
                        { id: 'resource-form-preview-audit', label: 'Auditoría' },
                      ]
                    : []),
                ],
                className: 'md:ml-5',
                scrollContainerRef,
                sticky: true,
                variant: { base: 'tabs', md: 'sidebar' },
              }
            : undefined
        }
        stickyFooter={configuration.showStickyRouteFooter}
        stickyHeader={configuration.showStickyRouteHeader}
        stickyHeaderOffset={configuration.showStickyRouteHeader ? '3rem' : undefined}
      >
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:p-5">
          <EditableResourceForm
            configuration={configuration}
            editing={editing}
            onEditChange={setEditing}
            onValuesChange={setValues}
            remote={remote}
            values={values}
          />
        </div>
      </ResourceFormRoute>
    </div>
  );
}

function DialogPreview({ configuration }: { configuration: PreviewConfiguration }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left">
          <DialogTitle>Detalle editable</DialogTitle>
          <DialogDescription>Host de diálogo canónico.</DialogDescription>
        </DialogHeader>
        <div className="p-4 sm:p-6">
          <OverlayForm configuration={configuration} onClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DrawerPreview({ configuration }: { configuration: PreviewConfiguration }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useDesktopDrawer();

  return (
    <SharkDrawer
      onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
      open={open}
      swipeDirection={isDesktop ? 'end' : 'down'}
    >
      <SharkDrawerTrigger className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/60">
        <PanelRight className="size-4" aria-hidden="true" />
        Abrir Drawer
      </SharkDrawerTrigger>
      <SharkDrawerContent showCloseButton variant="inset">
        <SharkDrawerHeader description="Host inset de Shark/Ark." title="Detalle editable" />
        <SharkDrawerBody>
          <OverlayForm configuration={configuration} onClose={() => setOpen(false)} />
        </SharkDrawerBody>
      </SharkDrawerContent>
    </SharkDrawer>
  );
}

function OverlayForm({
  configuration,
  onClose,
}: {
  configuration: PreviewConfiguration;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(initialValues);
  const remote = usePreviewRemoteState(configuration);

  return (
    <ResourceFormOverlay
      density={configuration.density}
      description={
        configuration.showFrameHeader
          ? 'Los campos permanecen en la misma composición durante lectura y edición.'
          : undefined
      }
      footerActions={
        configuration.globalActions === 'footer' ? (
          <EditableResourceActions
            editing={editing}
            onEditChange={setEditing}
            onRetry={() => remote.save(onClose)}
            onSave={() => remote.save(onClose)}
            status={remote.status}
          />
        ) : undefined
      }
      headerActions={
        configuration.globalActions === 'header' ? (
          <EditableResourceActions
            editing={editing}
            onEditChange={setEditing}
            onRetry={() => remote.save(onClose)}
            onSave={() => remote.save(onClose)}
            status={remote.status}
          />
        ) : undefined
      }
      mode={editing ? 'edit' : 'read'}
      feedback={remote.feedback}
      renderContainer={(content) => content}
      status={remote.status}
      surface={configuration.surface}
      title={configuration.showFrameHeader ? 'Mariana López' : undefined}
    >
      <EditableResourceContent
        configuration={configuration}
        editing={editing}
        onValuesChange={setValues}
        values={values}
      />
    </ResourceFormOverlay>
  );
}

function EditableResourceForm({
  configuration,
  editing,
  onEditChange,
  onValuesChange,
  remote,
  values,
}: {
  configuration: PreviewConfiguration;
  editing: boolean;
  onEditChange: (editing: boolean) => void;
  onValuesChange: (values: PreviewValues) => void;
  remote: PreviewRemoteState;
  values: PreviewValues;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <ResourceFormOverlay
        density={configuration.density}
        description={
          configuration.showFrameHeader
            ? 'El modo controlado de Editable conserva la estructura y cambia únicamente los controles.'
            : undefined
        }
        footerActions={
          configuration.globalActions === 'footer' ? (
            <EditableResourceActions
              editing={editing}
              onEditChange={onEditChange}
              onRetry={() => remote.save(() => onEditChange(false))}
              onSave={() => remote.save(() => onEditChange(false))}
              status={remote.status}
            />
          ) : undefined
        }
        headerActions={
          configuration.globalActions === 'header' ? (
            <EditableResourceActions
              editing={editing}
              onEditChange={onEditChange}
              onRetry={() => remote.save(() => onEditChange(false))}
              onSave={() => remote.save(() => onEditChange(false))}
              status={remote.status}
            />
          ) : undefined
        }
        mode={editing ? 'edit' : 'read'}
        feedback={remote.feedback}
        renderContainer={(content) => content}
        status={remote.status}
        surface={configuration.surface}
        title={configuration.showFrameHeader ? 'Detalle editable en ruta' : undefined}
      >
        <EditableResourceContent
          configuration={configuration}
          editing={editing}
          onValuesChange={onValuesChange}
          values={values}
        />
      </ResourceFormOverlay>
    </form>
  );
}

function EditableResourceContent({
  configuration,
  editing,
  onValuesChange,
  values,
}: {
  configuration: PreviewConfiguration;
  editing: boolean;
  onValuesChange: (values: PreviewValues) => void;
  values: PreviewValues;
}) {
  return (
    <>
      <ResourceFormSection
        density={configuration.density}
        footerActions={
          configuration.sectionActions === 'footer' ? <SectionActionPreview /> : undefined
        }
        headerActions={
          configuration.sectionActions === 'header' ? <SectionActionPreview /> : undefined
        }
        surface={configuration.sectionSurface}
        title={configuration.showSectionHeader ? 'Datos generales' : undefined}
        id="resource-form-preview-general"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <EditableField
            edit={editing}
            label="Nombre"
            onChange={(name) => onValuesChange({ ...values, name })}
            value={values.name}
          />
          <EditableField
            edit={editing}
            label="Correo electrónico"
            onChange={(email) => onValuesChange({ ...values, email })}
            type="email"
            value={values.email}
          />
        </div>
      </ResourceFormSection>
      {configuration.showSecondSection ? (
        <>
          <ResourceFormSection
            density={configuration.density}
            footerActions={
              configuration.sectionActions === 'footer' ? <SectionActionPreview /> : undefined
            }
            headerActions={
              configuration.sectionActions === 'header' ? <SectionActionPreview /> : undefined
            }
            id="resource-form-preview-access"
            surface={configuration.sectionSurface}
            title={configuration.showSectionHeader ? 'Configuración complementaria' : undefined}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <EditableField
                edit={editing}
                label="Nivel de acceso"
                onChange={(accessLevel) => onValuesChange({ ...values, accessLevel })}
                value={values.accessLevel}
              />
              <EditableField
                edit={editing}
                label="Alcance de clientes"
                onChange={(customerScope) => onValuesChange({ ...values, customerScope })}
                value={values.customerScope}
              />
            </div>
          </ResourceFormSection>
          {configuration.showAdditionalSections ? (
            <>
              <ResourceFormSection
                className="min-h-[24rem]"
                density={configuration.density}
                id="resource-form-preview-notifications"
                surface={configuration.sectionSurface}
                title={configuration.showSectionHeader ? 'Notificaciones' : undefined}
              >
                <div aria-hidden />
              </ResourceFormSection>
              <ResourceFormSection
                className="min-h-[24rem]"
                density={configuration.density}
                id="resource-form-preview-logistics"
                surface={configuration.sectionSurface}
                title={configuration.showSectionHeader ? 'Logística' : undefined}
              >
                <div aria-hidden />
              </ResourceFormSection>
              <ResourceFormSection
                className="min-h-[24rem]"
                density={configuration.density}
                id="resource-form-preview-audit"
                surface={configuration.sectionSurface}
                title={configuration.showSectionHeader ? 'Auditoría' : undefined}
              >
                <div aria-hidden />
              </ResourceFormSection>
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}

function EditableResourceActions({
  editing,
  onEditChange,
  onRetry,
  onSave,
  status,
}: {
  editing: boolean;
  onEditChange: (editing: boolean) => void;
  onRetry: () => void;
  onSave: () => void;
  status: ResourceFormStatus;
}) {
  return (
    <ResourceFormActions
      cancelAction={editing ? { label: 'Cancelar', onClick: () => onEditChange(false) } : undefined}
      primaryAction={
        editing && status !== 'error'
          ? { label: 'Guardar', loadingLabel: 'Guardando…', onClick: onSave }
          : undefined
      }
      retryAction={status === 'error' ? { label: 'Reintentar', onClick: onRetry } : undefined}
      secondaryActions={
        !editing ? (
          <Button
            disabled={status === 'loading'}
            onClick={() => onEditChange(true)}
            type="button"
            variant="outline"
          >
            <Edit3 className="size-4" aria-hidden="true" />
            Editar
          </Button>
        ) : undefined
      }
      status={status}
    />
  );
}

type PreviewRemoteState = {
  status: ResourceFormStatus;
  feedback: ReactNode;
  save: (onSuccess: () => void) => void;
};

function usePreviewRemoteState(configuration: PreviewConfiguration): PreviewRemoteState {
  const [mutationStatus, setMutationStatus] = useState<ResourceFormStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const status = configuration.simulateLoading ? 'loading' : mutationStatus;

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const save = (onSuccess: () => void) => {
    if (status === 'loading' || status === 'saving') return;

    setMutationStatus('saving');
    timeoutRef.current = setTimeout(() => {
      if (configuration.saveResult === 'error') {
        setMutationStatus('error');
        return;
      }

      setMutationStatus('idle');
      onSuccess();
    }, 900);
  };

  const feedback =
    status === 'loading' ? (
      <div
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
        role="status"
      >
        <Spinner aria-hidden="true" />
        Cargando datos del recurso…
      </div>
    ) : status === 'error' ? (
      <div
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        role="alert"
      >
        No se pudieron guardar los cambios. Puedes reintentar la operación.
      </div>
    ) : undefined;

  return { status, feedback, save };
}

function SectionActionPreview() {
  return (
    <ResourceFormActions
      secondaryActions={
        <Button type="button" variant="outline">
          Acción de sección
        </Button>
      }
    />
  );
}

function EditableField({
  edit,
  label,
  onChange,
  type = 'text',
  value,
}: {
  edit: boolean;
  label: string;
  onChange: (value: string) => void;
  type?: 'email' | 'text';
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <SharkEditable
        activationMode="none"
        edit={edit}
        onValueChange={({ value: nextValue }) => onChange(nextValue)}
        submitMode="none"
        value={value}
      >
        <SharkEditableArea>
          <SharkEditablePreview aria-label={label} />
          <SharkEditableInput
            aria-label={label}
            className="h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
            type={type}
          />
        </SharkEditableArea>
      </SharkEditable>
    </label>
  );
}

function useDesktopDrawer() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isDesktop;
}
