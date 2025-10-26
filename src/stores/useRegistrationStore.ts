'use client';

import { create } from 'zustand';

interface RegistrationCredentialsStoreState {
  email: string | null;
  password: string | null;
}

interface RegistrationCredentialsStoreActions {
  setEmail: (email: string | null) => void;
  setPassword: (password: string | null) => void;
  reset: () => void;
}

const initialState: RegistrationCredentialsStoreState = {
  email: null,
  password: null,
};

export const useRegistrationStore = create<
  RegistrationCredentialsStoreState & RegistrationCredentialsStoreActions
>((set) => ({
  ...initialState,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  reset: () => set(initialState),
}));
