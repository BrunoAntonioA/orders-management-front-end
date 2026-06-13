import { environment } from '../../../environments/environment';

export const customersApi = {
  url: `${environment.supabase.restUrl}/customers`,
  select: '*',
  listOrder: 'last_name.asc,first_name.asc',
  filterById: (id: string) => ({ id: `eq.${id}` }),
} as const;

export const supabaseAuthApi = {
  usersUrl: `${environment.supabase.authUrl}/admin/users`,
} as const;
