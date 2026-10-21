import { API_BASE_URL } from '@/config/env';

export type ServicePackageZipUploadOutcome =
  | {
      kind: 'confirmed';
      packageId: string;
      services: { recordId: string; serviceOrder: string; fileCount: number }[];
    }
  | { kind: 'server-error'; status: number; message: string }
  | { kind: 'uncertain'; reason: 'network' | 'unreadable-response' };

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readConfirmed(
  body: unknown
): Extract<ServicePackageZipUploadOutcome, { kind: 'confirmed' }> | null {
  if (!isObject(body) || body.success !== true || !isObject(body.data)) return null;

  const { package_id: packageId, services } = body.data;
  if (typeof packageId !== 'string' || !packageId || !Array.isArray(services)) return null;

  const mapped: Extract<ServicePackageZipUploadOutcome, { kind: 'confirmed' }>['services'] = [];
  for (const service of services) {
    if (!isObject(service)) return null;
    const { record_id: recordId, service_order: serviceOrder, file_count: fileCount } = service;
    if (
      typeof recordId !== 'string' ||
      !recordId ||
      typeof serviceOrder !== 'string' ||
      !serviceOrder ||
      typeof fileCount !== 'number' ||
      !Number.isInteger(fileCount) ||
      fileCount < 0
    ) {
      return null;
    }

    mapped.push({ recordId, serviceOrder, fileCount });
  }

  return { kind: 'confirmed', packageId, services: mapped };
}

function readErrorMessage(body: unknown): string {
  if (!isObject(body) || !isObject(body.error_details)) return '';
  const message = body.error_details.message;
  return typeof message === 'string' ? message.trim().slice(0, 500) : '';
}

export async function sendServicePackageZip(file: File): Promise<ServicePackageZipUploadOutcome> {
  const formData = new FormData();
  formData.append('package', file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/v1/service-packages/uploads?origin=backoffice`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'x-user-lang':
          typeof document !== 'undefined' ? document.documentElement.lang || 'es' : 'es',
      },
      body: formData,
    });
  } catch {
    return { kind: 'uncertain', reason: 'network' };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return response.ok
      ? { kind: 'uncertain', reason: 'unreadable-response' }
      : {
          kind: 'server-error',
          status: response.status,
          message: response.statusText.trim(),
        };
  }

  if (!response.ok) {
    return {
      kind: 'server-error',
      status: response.status,
      message: readErrorMessage(body) || response.statusText.trim(),
    };
  }

  return readConfirmed(body) ?? { kind: 'uncertain', reason: 'unreadable-response' };
}
