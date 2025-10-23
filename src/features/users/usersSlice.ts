import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'invited' | 'suspended';
}

export interface UsersState {
  entities: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  entities: [],
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.entities.push(action.payload);
    },
    resetUsersState(state) {
      state.entities = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: () => {
    // register async thunk handlers in future iterations
  },
});

export const { addUser, resetUsersState } = usersSlice.actions;
export default usersSlice.reducer;
