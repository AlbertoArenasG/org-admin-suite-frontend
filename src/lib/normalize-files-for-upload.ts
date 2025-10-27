'use client';

const HEIC_MIME = /image\/hei(c|f)/i;

async function convertHeicToJpeg(file: File): Promise<File> {
  if (typeof window === 'undefined') {
    return file;
  }

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not available.');
    }
    context.drawImage(image, 0, 0);

    const blob =
      (await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (result) => {
            resolve(result);
          },
          'image/jpeg',
          0.9
        );
      })) ?? (await (await fetch(dataUrl)).blob());

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';

    return new File([blob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('[normalize-files-for-upload] Unable to convert HEIC/HEIF image:', error);
    return file;
  }
}

async function normalizeFile(file: File): Promise<File> {
  if (HEIC_MIME.test(file.type)) {
    return convertHeicToJpeg(file);
  }
  return file;
}

export interface NormalizeFilesOptions {
  limit?: number;
}

export async function normalizeFilesForUpload(
  input: FileList | File[],
  options?: NormalizeFilesOptions
): Promise<File[]> {
  const files = Array.from(input);
  const sliced = typeof options?.limit === 'number' ? files.slice(0, options.limit) : files;
  return Promise.all(sliced.map((file) => normalizeFile(file)));
}
