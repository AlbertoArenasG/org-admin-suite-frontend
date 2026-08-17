'use client';

import { useEffect, useMemo, useState } from 'react';
import Slider from '@mui/material/Slider';
import {
  amber,
  blue,
  cyan,
  deepOrange,
  deepPurple,
  green,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '@mui/material/colors';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const SHADE_VALUES = [200, 300, 400, 500, 600, 700, 800] as const;

const COLOR_FAMILIES = [
  { id: 'red', palette: red },
  { id: 'pink', palette: pink },
  { id: 'purple', palette: purple },
  { id: 'deepPurple', palette: deepPurple },
  { id: 'indigo', palette: indigo },
  { id: 'blue', palette: blue },
  { id: 'lightBlue', palette: lightBlue },
  { id: 'cyan', palette: cyan },
  { id: 'teal', palette: teal },
  { id: 'green', palette: green },
  { id: 'lightGreen', palette: lightGreen },
  { id: 'lime', palette: lime },
  { id: 'yellow', palette: yellow },
  { id: 'amber', palette: amber },
  { id: 'orange', palette: orange },
  { id: 'deepOrange', palette: deepOrange },
] as const;

type ColorFamily = (typeof COLOR_FAMILIES)[number];
type ShadeValue = (typeof SHADE_VALUES)[number];

interface ColorShadePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  title: string;
  description?: string;
  shadeLabel: string;
  confirmLabel: string;
  cancelLabel: string;
  className?: string;
}

function normalizeHex(value: string): string {
  return value.trim().toLowerCase();
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return null;
  }

  const redValue = Number.parseInt(normalized.slice(0, 2), 16);
  const greenValue = Number.parseInt(normalized.slice(2, 4), 16);
  const blueValue = Number.parseInt(normalized.slice(4, 6), 16);

  if ([redValue, greenValue, blueValue].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return {
    r: redValue,
    g: greenValue,
    b: blueValue,
  };
}

function getPaletteColor(family: ColorFamily, shade: ShadeValue): string {
  return family.palette[shade];
}

function findClosestPaletteSelection(value: string) {
  const fallback = {
    familyId: 'green',
    shade: 500 as ShadeValue,
  };

  const target = hexToRgb(normalizeHex(value));

  if (!target) {
    return fallback;
  }

  let bestMatch = fallback;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const family of COLOR_FAMILIES) {
    for (const shade of SHADE_VALUES) {
      const candidate = hexToRgb(getPaletteColor(family, shade));

      if (!candidate) {
        continue;
      }

      const distance =
        (target.r - candidate.r) ** 2 +
        (target.g - candidate.g) ** 2 +
        (target.b - candidate.b) ** 2;

      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = {
          familyId: family.id,
          shade,
        };
      }
    }
  }

  return bestMatch;
}

export function ColorShadePicker({
  value,
  onChange,
  disabled = false,
  id,
  title,
  description,
  shadeLabel,
  confirmLabel,
  cancelLabel,
  className,
}: ColorShadePickerProps) {
  const initialSelection = useMemo(() => findClosestPaletteSelection(value), [value]);
  const [open, setOpen] = useState(false);
  const [draftFamilyId, setDraftFamilyId] = useState(initialSelection.familyId);
  const [draftShade, setDraftShade] = useState<ShadeValue>(initialSelection.shade);

  useEffect(() => {
    const nextSelection = findClosestPaletteSelection(value);
    setDraftFamilyId(nextSelection.familyId);
    setDraftShade(nextSelection.shade);
  }, [value]);

  const draftFamily =
    COLOR_FAMILIES.find((family) => family.id === draftFamilyId) ?? COLOR_FAMILIES[9];
  const committedSelection = findClosestPaletteSelection(value);
  const committedFamily =
    COLOR_FAMILIES.find((family) => family.id === committedSelection.familyId) ?? COLOR_FAMILIES[9];

  const selectedHex = getPaletteColor(draftFamily, draftShade);
  const committedHex = getPaletteColor(committedFamily, committedSelection.shade);
  const selectedShadeIndex = SHADE_VALUES.indexOf(draftShade);
  const tonePreviewShades = SHADE_VALUES.filter((_, index) => {
    return Math.abs(index - selectedShadeIndex) <= 1;
  });

  const syncDraftWithValue = () => {
    const nextSelection = findClosestPaletteSelection(value);
    setDraftFamilyId(nextSelection.familyId);
    setDraftShade(nextSelection.shade);
  };

  const handleFamilySelect = (familyId: string) => {
    setDraftFamilyId(familyId);
  };

  const handleShadeChange = (_: Event, newValue: number | number[]) => {
    const nextShade = Number(Array.isArray(newValue) ? newValue[0] : newValue) as ShadeValue;
    setDraftShade(nextShade);
  };

  const handleTonePreviewSelect = (shade: ShadeValue) => {
    setDraftShade(shade);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          syncDraftWithValue();
        }
        setOpen(nextOpen);
      }}
    >
      <div
        id={id}
        className={cn(
          'flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3',
          className
        )}
      >
        <DialogTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="flex w-full items-center justify-between gap-3 rounded-lg text-left transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="flex items-center gap-3">
              <span
                className="size-10 rounded-lg border border-border/60 shadow-sm"
                style={{ backgroundColor: committedHex }}
                aria-hidden="true"
              />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">{committedHex}</p>
                <p className="text-xs text-muted-foreground">
                  {shadeLabel}: {committedSelection.shade}
                </p>
              </div>
            </div>
          </button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-md rounded-3xl p-5">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="mb-4">
            <p className="text-2xl font-semibold tracking-tight text-foreground">{selectedHex}</p>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <p className="w-14 shrink-0 text-sm text-foreground">{shadeLabel}</p>
            <Slider
              value={draftShade}
              min={SHADE_VALUES[0]}
              max={SHADE_VALUES[SHADE_VALUES.length - 1]}
              step={100}
              marks={SHADE_VALUES.map((shade) => ({
                value: shade,
              }))}
              disabled={disabled}
              onChange={handleShadeChange}
              aria-label={shadeLabel}
              sx={{
                color: selectedHex,
                flex: 1,
                '& .MuiSlider-rail': {
                  opacity: 0.35,
                },
              }}
            />
            <p className="w-10 shrink-0 text-right text-sm text-foreground">{draftShade}</p>
          </div>

          <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-border/60">
            {COLOR_FAMILIES.map((family) => {
              const swatchColor = getPaletteColor(family, draftShade);
              const isSelected = family.id === draftFamilyId;

              return (
                <button
                  key={family.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleFamilySelect(family.id)}
                  className={cn(
                    'relative aspect-square border border-white/10 transition-transform hover:z-10 hover:scale-[1.03] disabled:cursor-not-allowed disabled:hover:scale-100',
                    isSelected && 'ring-2 ring-white/80 ring-inset'
                  )}
                  style={{ backgroundColor: swatchColor }}
                  aria-label={`${family.id}-${draftShade}`}
                  aria-pressed={isSelected}
                >
                  {isSelected ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className="size-7 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-xl border border-border/60">
            {tonePreviewShades.map((shade) => {
              const toneColor = getPaletteColor(draftFamily, shade);
              const isSelected = shade === draftShade;

              return (
                <button
                  key={shade}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleTonePreviewSelect(shade)}
                  className={cn(
                    'flex min-h-14 items-end justify-start border border-white/10 px-3 py-2 text-left transition-transform hover:z-10 hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100',
                    isSelected && 'ring-2 ring-white/80 ring-inset'
                  )}
                  style={{ backgroundColor: toneColor }}
                  aria-label={`${draftFamily.id}-${shade}`}
                  aria-pressed={isSelected}
                >
                  <span className="text-sm font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                    {toneColor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="mt-5 gap-2 sm:space-x-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              syncDraftWithValue();
              setOpen(false);
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={() => {
              onChange(selectedHex);
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
