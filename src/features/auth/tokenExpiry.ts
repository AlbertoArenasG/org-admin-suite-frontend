export function getTokenExpiryMs(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = JSON.parse(atob(padded)) as unknown;
    if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) return null;

    const expiry = decoded.exp;
    return typeof expiry === 'number' && Number.isFinite(expiry) ? expiry * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const expiry = getTokenExpiryMs(token);
  return expiry !== null && Date.now() >= expiry;
}
