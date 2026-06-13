import { environment } from '../../../../environments/environment';

export const ordersApi = {
  url: `${environment.supabase.restUrl}/orders`,
  itemsUrl: `${environment.supabase.restUrl}/order_items`,
  selectWithRelations:
    '*,customers(id,first_name,last_name,phone,email,address,address_hint),order_items(*)',
  listOrder: 'order_date.desc,created_at.desc',
  filterById: (id: string) => ({ id: `eq.${id}` }),
  filterItemsByOrderId: (orderId: string) => ({ order_id: `eq.${orderId}` }),
  filterByCustomerId: (customerId: string) => ({ customer_id: `eq.${customerId}` }),
  filterByRouteId: (routeId: string) => ({ route_id: `eq.${routeId}` }),
  filterUnassigned: { route_id: 'is.null' },
  filterAssignable: { route_id: 'is.null', status: 'in.(created,pending)' },
  routeOrderList: 'stop_sequence.asc,order_date.asc',
} as const;
