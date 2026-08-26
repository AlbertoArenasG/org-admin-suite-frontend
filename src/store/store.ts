import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import servicesReducer from '@/features/services/servicesSlice';
import usersReducer from '@/features/users/usersSlice';
import serviceEntriesReducer from '@/features/serviceEntries/serviceEntriesSlice';
import serviceEntrySurveysReducer from '@/features/serviceEntrySurveys/serviceEntrySurveysSlice';
import myProfileReducer from '@/features/myProfile/myProfileSlice';
import customersReducer from '@/features/customers/customersSlice';
import servicePackagesRecordsReducer from '@/features/servicePackagesRecords/servicePackagesRecordsSlice';
import providersReducer from '@/features/providers/providersSlice';
import rolesReducer from '@/features/roles/rolesSlice';
import contactsReducer from '@/features/contacts/contactsSlice';
import recipientGroupsReducer from '@/features/recipient-groups/recipientGroupsSlice';
import expirationStatusPoliciesReducer from '@/features/expiration-status-policies/expirationStatusPoliciesSlice';
import expirationNotificationPoliciesReducer from '@/features/expiration-notification-policies/expirationNotificationPoliciesSlice';
import internalAssetControlReducer from '@/features/internal-asset-control/internalAssetControlSlice';
import userRegistrationInvitationsReducer from '@/features/user-registration-invitations/userRegistrationInvitationsSlice';
import userCustomerRelationshipsReducer from '@/features/user-customer-relationships/userCustomerRelationshipsSlice';

/**
 * Central Redux store setup. Extend the reducer map as new slices are added.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    users: usersReducer,
    serviceEntries: serviceEntriesReducer,
    serviceEntrySurveys: serviceEntrySurveysReducer,
    myProfile: myProfileReducer,
    customers: customersReducer,
    servicePackagesRecords: servicePackagesRecordsReducer,
    providers: providersReducer,
    roles: rolesReducer,
    contacts: contactsReducer,
    recipientGroups: recipientGroupsReducer,
    expirationStatusPolicies: expirationStatusPoliciesReducer,
    expirationNotificationPolicies: expirationNotificationPoliciesReducer,
    internalAssetControl: internalAssetControlReducer,
    userRegistrationInvitations: userRegistrationInvitationsReducer,
    userCustomerRelationships: userCustomerRelationshipsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
