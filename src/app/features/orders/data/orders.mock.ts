import { customersMockStore } from '../../../shared/data/customers.mock';
import { Customer } from '../../../shared/models/customer.model';
import {
  CreateOrderPayload,
  CustomerSummary,
  OrderItem,
  OrderWithCustomer,
  UpdateOrderPayload,
} from '../models/order.model';

const OWNER_ID = '00000000-0000-4000-8000-000000000001';

let orders: OrderWithCustomer[] = [
  {
    id: 'o1111111-1111-4111-8111-111111111111',
    ownerId: OWNER_ID,
    customerId: 'c1111111-1111-4111-8111-111111111111',
    orderDate: '2026-06-10',
    status: 'delivered',
    total: 4500,
    notes: 'Entregar antes del mediodía',
    deliveredAt: '2026-06-10T14:30:00Z',
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-06-10T14:30:00Z',
    customer: toSummary(customersMockStore.getById('c1111111-1111-4111-8111-111111111111')!),
    items: [
      {
        id: 'i1111111-1111-4111-8111-111111111111',
        orderId: 'o1111111-1111-4111-8111-111111111111',
        product: 'Agua mineral 20L',
        quantity: 3,
        unitPrice: 800,
      },
      {
        id: 'i1111111-1111-4111-8111-111111111112',
        orderId: 'o1111111-1111-4111-8111-111111111111',
        product: 'Soda 2L',
        quantity: 6,
        unitPrice: 450,
      },
    ],
  },
  {
    id: 'o2222222-2222-4222-8222-222222222222',
    ownerId: OWNER_ID,
    customerId: 'c2222222-2222-4222-8222-222222222222',
    orderDate: '2026-06-11',
    status: 'pending',
    total: 3200,
    createdAt: '2026-06-11T09:15:00Z',
    updatedAt: '2026-06-11T09:15:00Z',
    customer: toSummary(customersMockStore.getById('c2222222-2222-4222-8222-222222222222')!),
    items: [
      {
        id: 'i2222222-2222-4222-8222-222222222222',
        orderId: 'o2222222-2222-4222-8222-222222222222',
        product: 'Agua mineral 20L',
        quantity: 4,
        unitPrice: 800,
      },
    ],
  },
  {
    id: 'o3333333-3333-4333-8333-333333333333',
    ownerId: OWNER_ID,
    customerId: 'c3333333-3333-4333-8333-333333333333',
    orderDate: '2026-06-12',
    status: 'created',
    total: 5400,
    createdAt: '2026-06-12T07:45:00Z',
    updatedAt: '2026-06-12T07:45:00Z',
    customer: toSummary(customersMockStore.getById('c3333333-3333-4333-8333-333333333333')!),
    items: [
      {
        id: 'i3333333-3333-4333-8333-333333333333',
        orderId: 'o3333333-3333-4333-8333-333333333333',
        product: 'Agua mineral 20L',
        quantity: 2,
        unitPrice: 800,
      },
      {
        id: 'i3333333-3333-4333-8333-333333333334',
        orderId: 'o3333333-3333-4333-8333-333333333333',
        product: 'Jugo naranja 1L',
        quantity: 10,
        unitPrice: 380,
      },
    ],
  },
];

function toSummary(customer: Customer): CustomerSummary {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    addressHint: customer.addressHint,
  };
}

function resolveCustomer(customerId: string): CustomerSummary {
  const customer = customersMockStore.getById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return toSummary(customer);
}

function withFreshCustomer(order: OrderWithCustomer): OrderWithCustomer {
  return {
    ...structuredClone(order),
    customer: resolveCustomer(order.customerId),
  };
}

function generateId(prefix: string): string {
  const segment = crypto.randomUUID().slice(0, 8);
  return `${prefix}${segment}-${crypto.randomUUID().slice(9)}`;
}

function calculateTotal(items: { quantity: number; unitPrice: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function buildItems(orderId: string, items: CreateOrderPayload['items']): OrderItem[] {
  return items.map((item) => ({
    id: generateId('i'),
    orderId,
    product: item.product,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));
}

export const ordersMockStore = {
  hasOrdersForCustomer(customerId: string): boolean {
    return orders.some((order) => order.customerId === customerId);
  },

  getCustomers(): Customer[] {
    return customersMockStore.getAll();
  },

  getCustomerById(id: string): Customer | undefined {
    return customersMockStore.getById(id);
  },

  getAll(): OrderWithCustomer[] {
    return orders.map(withFreshCustomer);
  },

  getById(id: string): OrderWithCustomer | undefined {
    const order = orders.find((entry) => entry.id === id);
    return order ? withFreshCustomer(order) : undefined;
  },

  create(payload: CreateOrderPayload): OrderWithCustomer {
    const customer = customersMockStore.getById(payload.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const now = new Date().toISOString();
    const orderId = generateId('o');
    const items = buildItems(orderId, payload.items);
    const order: OrderWithCustomer = {
      id: orderId,
      ownerId: OWNER_ID,
      customerId: payload.customerId,
      orderDate: payload.orderDate,
      status: payload.status,
      total: calculateTotal(items),
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
      customer: toSummary(customer),
      items,
    };

    orders = [order, ...orders];
    return structuredClone(order);
  },

  update(id: string, payload: UpdateOrderPayload): OrderWithCustomer {
    const index = orders.findIndex((entry) => entry.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }

    const current = orders[index];
    const customerId = payload.customerId ?? current.customerId;
    const customer = customersMockStore.getById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const items = payload.items ? buildItems(id, payload.items) : current.items;
    const now = new Date().toISOString();

    const updated: OrderWithCustomer = {
      ...current,
      customerId,
      orderDate: payload.orderDate ?? current.orderDate,
      status: payload.status ?? current.status,
      notes: payload.notes !== undefined ? payload.notes : current.notes,
      total: calculateTotal(items),
      updatedAt: now,
      deliveredAt:
        (payload.status ?? current.status) === 'delivered' && !current.deliveredAt
          ? now
          : current.deliveredAt,
      customer: toSummary(customer),
      items,
    };

    orders = orders.map((entry) => (entry.id === id ? updated : entry));
    return structuredClone(updated);
  },
};
