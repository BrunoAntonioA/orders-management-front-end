import {
  CreateOrderPayload,
  CustomerSummary,
  OrderItem,
  OrderItemInput,
  OrderWithCustomer,
  UpdateOrderPayload,
} from '../../features/orders/models/order.model';
import {
  CustomerEmbedRow,
  OrderInsertRow,
  OrderItemInsertRow,
  OrderItemRow,
  OrderRow,
} from './order-row.model';

export function calculateItemsTotal(items: OrderItemInput[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function mapCustomerEmbed(row: CustomerEmbedRow): CustomerSummary {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    address: row.address,
    addressHint: row.address_hint ?? undefined,
  };
}

function mapOrderItemFromDb(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    product: row.product,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
  };
}

export function mapOrderFromDb(row: OrderRow): OrderWithCustomer {
  if (!row.customers) {
    throw new Error('Order is missing customer data.');
  }

  return {
    id: row.id,
    ownerId: row.owner_id,
    customerId: row.customer_id,
    routeId: row.route_id ?? undefined,
    orderDate: row.order_date,
    status: row.status,
    total: row.total != null ? Number(row.total) : undefined,
    stopSequence: row.stop_sequence ?? undefined,
    notes: row.notes ?? undefined,
    deliveredAt: row.delivered_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    customer: mapCustomerEmbed(row.customers),
    items: (row.order_items ?? []).map(mapOrderItemFromDb),
  };
}

export function mapOrderCreateToDb(
  payload: CreateOrderPayload,
  ownerId: string,
): OrderInsertRow {
  return {
    owner_id: ownerId,
    customer_id: payload.customerId,
    order_date: payload.orderDate,
    status: payload.status,
    notes: payload.notes ?? null,
    total: calculateItemsTotal(payload.items),
  };
}

export function mapOrderUpdateToDb(payload: UpdateOrderPayload): Partial<OrderInsertRow> {
  return {
    ...(payload.customerId !== undefined && { customer_id: payload.customerId }),
    ...(payload.orderDate !== undefined && { order_date: payload.orderDate }),
    ...(payload.status !== undefined && { status: payload.status }),
    ...(payload.notes !== undefined && { notes: payload.notes || null }),
    ...(payload.items !== undefined && { total: calculateItemsTotal(payload.items) }),
  };
}

export function mapOrderItemsToDb(
  orderId: string,
  items: OrderItemInput[],
): OrderItemInsertRow[] {
  return items.map((item) => ({
    order_id: orderId,
    product: item.product,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));
}
