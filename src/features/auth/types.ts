export interface AuthUser {
  id: string;
  email: string;
  name: string;
  lastname: string;
  role: string;
  status: string;
  cellPhone: {
    countryCode: string;
    number: string;
  } | null;
}
