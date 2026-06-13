import { environment } from '../../../../environments/environment';

export const deliveryApi = {
  url: `${environment.supabase.restUrl}/delivery_routes`,
  select: '*',
  listOrder: 'route_date.desc,created_at.desc',
  filterById: (id: string) => ({ id: `eq.${id}` }),
} as const;
