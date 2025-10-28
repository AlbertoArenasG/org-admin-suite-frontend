export function getInitialsFromText(text: string, fallback = '??'): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return fallback;
  }

  const parts = normalized.split(' ');
  const first = parts[0]?.charAt(0) ?? '';
  const second = parts.length > 1 ? (parts[1]?.charAt(0) ?? '') : (parts[0]?.charAt(1) ?? '');
  const initials = `${first}${second}`.toUpperCase();

  return initials || fallback;
}
