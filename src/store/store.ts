import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import servicesReducer from '@/features/services/servicesSlice';
import usersReducer from '@/features/users/usersSlice';
import serviceEntriesReducer from '@/features/serviceEntries/serviceEntriesSlice';
import serviceEntrySurveysReducer from '@/features/serviceEntrySurveys/serviceEntrySurveysSlice';
import myProfileReducer from '@/features/myProfile/myProfileSlice';
import customersReducer from '@/features/customers/customersSlice';

/**
 * Central Redux store setup. Extend the reducer map as new slices are added.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    services: servicesReducer,
    users: usersReducer,
    serviceEntries: serviceEntriesReducer,
    serviceEntrySurveys: serviceEntrySurveysReducer,
    myProfile: myProfileReducer,
    customers: customersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
