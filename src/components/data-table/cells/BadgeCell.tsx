import type { CSSProperties, ReactNode } from 'react';

type BadgeCellVariant = 'outline' | 'subtle' | 'solid';

type BadgeCellProps = {
  label: string;
  color?: string | null;
  icon?: ReactNode;
  variant?: BadgeCellVariant;
  showColorIndicator?: boolean;
};

function getColorStyle(color: string | null | undefined, variant: BadgeCellVariant) {
  if (!color) return undefined;

  if (variant === 'solid') {
    return { backgroundColor: color, borderColor: color, color: '#fff' } satisfies CSSProperties;
  }

  return {
    borderColor: `${color}80`,
    ...(variant === 'subtle' ? { backgroundColor: `${color}1f` } : {}),
    color,
  } satisfies CSSProperties;
}

export function BadgeCell({
  label,
  color,
  icon,
  variant = 'outline',
  showColorIndicator = Boolean(color) && variant !== 'solid',
}: BadgeCellProps) {
  const neutralClassName =
    variant === 'solid'
      ? 'border-primary bg-primary text-primary-foreground'
      : variant === 'subtle'
        ? 'border-border bg-muted/60 text-foreground'
        : 'border-border bg-background text-foreground';

  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${neutralClassName}`}
      style={getColorStyle(color, variant)}
      title={label}
    >
      {icon ? (
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
      ) : null}
      {showColorIndicator && color ? (
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : null}
      <span className="truncate">{label}</span>
    </span>
  );
}
