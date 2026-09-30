import type { ServicePackageRecordAttachment } from './types';

const signatureFileNames = {
  client: 'firma-cliente.png',
  collector: 'firma-recolector.png',
} as const;

const excludedDocumentFileNames = new Set([
  ...Object.values(signatureFileNames),
  'detalles-visita.txt',
  'details.json',
  'reporte-servicio.xlsx',
]);

type ServicePackageRecordSignatureAttachments = {
  client: ServicePackageRecordAttachment | null;
  collector: ServicePackageRecordAttachment | null;
};

function filenameFromPath(path: string) {
  return path.split('/').at(-1)?.trim().toLowerCase() ?? '';
}

function matchesSignatureFile(file: ServicePackageRecordAttachment, filename: string) {
  return (
    filenameFromPath(file.relativePath) === filename ||
    filenameFromPath(file.originalName) === filename
  );
}

export function getServicePackageRecordSignatureAttachments(
  files: readonly ServicePackageRecordAttachment[]
): ServicePackageRecordSignatureAttachments {
  return {
    client: files.find((file) => matchesSignatureFile(file, signatureFileNames.client)) ?? null,
    collector:
      files.find((file) => matchesSignatureFile(file, signatureFileNames.collector)) ?? null,
  };
}

export function isServicePackageRecordDocumentAttachment(file: ServicePackageRecordAttachment) {
  return (
    file.mimeType.toLowerCase() !== 'application/json' &&
    ![file.relativePath, file.originalName].some((value) =>
      excludedDocumentFileNames.has(filenameFromPath(value))
    )
  );
}
