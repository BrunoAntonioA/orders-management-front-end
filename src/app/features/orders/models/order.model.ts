export type OrderStatus = 'created' | 'pending' | 'delivered' | 'cancelled';

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address: string;
  addressHint?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  ownerId: string;
  customerId: string;
  routeId?: string;
  orderDate: string;
  status: OrderStatus;
  total?: number;
  stopSequence?: number;
  notes?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderWithCustomer extends Order {
  customer: CustomerSummary;
  items: OrderItem[];
}

export interface OrderItemInput {
  product: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  customerId: string;
  orderDate: string;
  status: OrderStatus;
  notes?: string;
  items: OrderItemInput[];
}

export interface UpdateOrderPayload {
  customerId?: string;
  orderDate?: string;
  status?: OrderStatus;
  notes?: string;
  items?: OrderItemInput[];
}

export function canMarkAsDelivered(status: OrderStatus): boolean {
  return status === 'created' || status === 'pending';
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: 'Created',
  pending: 'Pending',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
