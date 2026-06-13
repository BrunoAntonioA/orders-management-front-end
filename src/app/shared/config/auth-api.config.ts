import { environment } from '../../../environments/environment';

export const authApi = {
  tokenUrl: `${environment.supabase.authUrl}/token`,
  userUrl: `${environment.supabase.authUrl}/user`,
  logoutUrl: `${environment.supabase.authUrl}/logout`,
} as const;
