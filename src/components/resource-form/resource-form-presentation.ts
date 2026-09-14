type ResourceFormResponsiveValue<Value extends string> =
  | Value
  | {
      base: Value;
      md?: Value;
    };

type ResolvedResourceFormResponsiveValue<Value extends string> = {
  base: Value;
  md?: Value;
};

function resolveResponsiveValue<Value extends string>(
  value: ResourceFormResponsiveValue<Value> | undefined,
  fallback: Value
): ResolvedResourceFormResponsiveValue<Value> {
  if (!value) return { base: fallback };
  return typeof value === 'string' ? { base: value } : value;
}

function responsiveClasses<Value extends string>(
  value: ResourceFormResponsiveValue<Value> | undefined,
  fallback: Value,
  classes: {
    base: Record<Value, string>;
    md: Record<Value, string>;
  }
) {
  const resolved = resolveResponsiveValue(value, fallback);
  return [classes.base[resolved.base], resolved.md ? classes.md[resolved.md] : undefined]
    .filter(Boolean)
    .join(' ');
}

export { resolveResponsiveValue, responsiveClasses };
export type { ResourceFormResponsiveValue };
