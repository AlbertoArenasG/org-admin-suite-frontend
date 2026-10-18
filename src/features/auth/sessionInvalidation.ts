type SessionInvalidator = (token: string) => void;

let invalidateSession: SessionInvalidator | null = null;

export function registerSessionInvalidator(handler: SessionInvalidator) {
  invalidateSession = handler;

  return () => {
    if (invalidateSession === handler) invalidateSession = null;
  };
}

export function invalidateAuthSessionIfCurrent(token: string) {
  invalidateSession?.(token);
}
