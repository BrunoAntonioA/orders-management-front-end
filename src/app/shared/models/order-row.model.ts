import { OrderStatus } from '../../features/orders/models/order.model';

export interface OrderItemRow {
  id: string;
  order_id: string;
  product: string;
  quantity: number;
  unit_price: number;
}

export interface CustomerEmbedRow {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  address: string;
  address_hint: string | null;
}

export interface OrderRow {
  id: string;
  owner_id: string;
  customer_id: string;
  route_id: string | null;
  order_date: string;
  status: OrderStatus;
  total: number | null;
  stop_sequence: number | null;
  notes: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  customers: CustomerEmbedRow | null;
  order_items: OrderItemRow[] | null;
}

export type OrderInsertRow = Pick<
  OrderRow,
  'owner_id' | 'customer_id' | 'order_date' | 'status'
> &
  Partial<Pick<OrderRow, 'notes' | 'total'>>;

export type OrderItemInsertRow = Pick<
  OrderItemRow,
  'order_id' | 'product' | 'quantity' | 'unit_price'
>;
