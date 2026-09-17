'use client';

import { sileo, type SileoOptions, type SileoPosition } from 'sileo';

type SnackbarPromiseOptions<T> = {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((error: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
};

function showSnackbarPromise<T>(
  promise: Promise<T> | (() => Promise<T>),
  options: SnackbarPromiseOptions<T>
) {
  return sileo.promise(promise, options);
}

export { showSnackbarPromise };
export type { SnackbarPromiseOptions };
