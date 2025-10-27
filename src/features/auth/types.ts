import type { UserRole } from '@/features/users/roles';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  lastname: string;
  role: UserRole;
  status: string;
  cellPhone: {
    countryCode: string;
    number: string;
  } | null;
}
