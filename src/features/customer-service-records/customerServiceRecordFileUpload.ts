import { API_BASE_URL } from '@/config/env';
import { invalidateAuthSessionIfCurrent } from '@/features/auth/sessionInvalidation';
import type { UploadedCustomerServiceRecordFile } from './types';

type ApiUploadedFile = {
  id: string;
  original_name: string;
  mime_type: string;
  size: number;
};

/** Shared transport only; each permission module owns its Redux request state. */
export async function uploadCustomerServiceRecordFilesRequest(
  files: File[],
  token: string
): Promise<UploadedCustomerServiceRecordFile[]> {
  if (!files.length) return [];

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`${API_BASE_URL}/v1/files`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'x-user-lang':
        typeof document !== 'undefined'
          ? (document.documentElement.getAttribute('lang') ?? 'es')
          : 'es',
    },
    body: formData,
  });
  if (response.status === 401) invalidateAuthSessionIfCurrent(token);
  const body = (await response.json()) as {
    data?: ApiUploadedFile[];
    error_details?: { message?: string };
  };
  if (!response.ok) {
    throw new Error(body.error_details?.message ?? 'No fue posible subir los archivos');
  }

  return (body.data ?? []).map((file) => ({
    fileId: file.id,
    originalName: file.original_name,
    mimeType: file.mime_type,
    size: file.size,
  }));
}
