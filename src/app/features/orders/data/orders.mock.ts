import { Customer } from '../models/customer.model';
import {
  CreateOrderPayload,
  CustomerSummary,
  OrderItem,
  OrderWithCustomer,
  UpdateOrderPayload,
} from '../models/order.model';

const OWNER_ID = '00000000-0000-4000-8000-000000000001';

const customers: Customer[] = [
  {
    id: 'c1111111-1111-4111-8111-111111111111',
    ownerId: OWNER_ID,
    firstName: 'María',
    lastName: 'García',
    phone: '+54 11 4567-8901',
    email: 'maria.garcia@email.com',
    address: 'Av. Corrientes 1234, CABA',
    addressHint: '3B, timbre azul',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    ownerId: OWNER_ID,
    firstName: 'Carlos',
    lastName: 'López',
    phone: '+54 11 2345-6789',
    email: 'carlos.lopez@email.com',
    address: 'Calle Falsa 742, San Isidro',
    addressHint: 'Portón negro',
    createdAt: '2026-01-12T14:30:00Z',
    updatedAt: '2026-01-12T14:30:00Z',
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    ownerId: OWNER_ID,
    firstName: 'Ana',
    lastName: 'Martínez',
    phone: '+54 11 9876-5432',
    address: 'Av. Santa Fe 3500, Palermo',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'c4444444-4444-4444-8444-444444444444',
    ownerId: OWNER_ID,
    firstName: 'Roberto',
    lastName: 'Fernández',
    phone: '+54 11 5555-1234',
    email: 'roberto.f@email.com',
    address: 'Maipú 450, Microcentro',
    addressHint: 'Oficina 12, piso 5',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z',
  },
];

let orders: OrderWithCustomer[] = [
  {
    id: 'o1111111-1111-4111-8111-111111111111',
    ownerId: OWNER_ID,
    customerId: customers[0].id,
    orderDate: '2026-06-10',
    status: 'delivered',
    total: 4500,
    notes: 'Entregar antes del mediodía',
    deliveredAt: '2026-06-10T14:30:00Z',
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-06-10T14:30:00Z',
    customer: toSummary(customers[0]),
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
    customerId: customers[1].id,
    orderDate: '2026-06-11',
    status: 'pending',
    total: 3200,
    createdAt: '2026-06-11T09:15:00Z',
    updatedAt: '2026-06-11T09:15:00Z',
    customer: toSummary(customers[1]),
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
    customerId: customers[2].id,
    orderDate: '2026-06-12',
    status: 'created',
    total: 5400,
    createdAt: '2026-06-12T07:45:00Z',
    updatedAt: '2026-06-12T07:45:00Z',
    customer: toSummary(customers[2]),
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
  getCustomers(): Customer[] {
    return customers.map((customer) => ({ ...customer }));
  },

  getCustomerById(id: string): Customer | undefined {
    const customer = customers.find((entry) => entry.id === id);
    return customer ? { ...customer } : undefined;
  },

  getAll(): OrderWithCustomer[] {
    return orders.map((order) => structuredClone(order));
  },

  getById(id: string): OrderWithCustomer | undefined {
    const order = orders.find((entry) => entry.id === id);
    return order ? structuredClone(order) : undefined;
  },

  create(payload: CreateOrderPayload): OrderWithCustomer {
    const customer = customers.find((entry) => entry.id === payload.customerId);
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
    const customer = customers.find((entry) => entry.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const items = payload.items
      ? buildItems(id, payload.items)
      : current.items;
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
