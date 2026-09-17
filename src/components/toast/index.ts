'use client';

import { sileo, type SileoOptions, type SileoPosition } from 'sileo';

type ToastPromiseOptions<T> = {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((error: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
};

function showToast(options: SileoOptions) {
  return sileo.show(options);
}

function showToastPromise<T>(
  promise: Promise<T> | (() => Promise<T>),
  options: ToastPromiseOptions<T>
) {
  return sileo.promise(promise, options);
}

export { showToast, showToastPromise };
export type { ToastPromiseOptions };
