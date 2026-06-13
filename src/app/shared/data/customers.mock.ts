import {
  CreateCustomerPayload,
  Customer,
  UpdateCustomerPayload,
} from '../models/customer.model';

const OWNER_ID = '00000000-0000-4000-8000-000000000001';

let customers: Customer[] = [
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

function generateId(): string {
  return `c${crypto.randomUUID().slice(1)}`;
}

export const customersMockStore = {
  getAll(): Customer[] {
    return customers.map((customer) => ({ ...customer }));
  },

  getById(id: string): Customer | undefined {
    const customer = customers.find((entry) => entry.id === id);
    return customer ? { ...customer } : undefined;
  },

  create(payload: CreateCustomerPayload): Customer {
    const now = new Date().toISOString();
    const customer: Customer = {
      id: generateId(),
      ownerId: OWNER_ID,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      addressHint: payload.addressHint,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };

    customers = [customer, ...customers];
    return { ...customer };
  },

  update(id: string, payload: UpdateCustomerPayload): Customer {
    const index = customers.findIndex((entry) => entry.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    const current = customers[index];
    const updated: Customer = {
      ...current,
      firstName: payload.firstName ?? current.firstName,
      lastName: payload.lastName ?? current.lastName,
      phone: payload.phone !== undefined ? payload.phone : current.phone,
      email: payload.email !== undefined ? payload.email : current.email,
      address: payload.address ?? current.address,
      addressHint:
        payload.addressHint !== undefined ? payload.addressHint : current.addressHint,
      notes: payload.notes !== undefined ? payload.notes : current.notes,
      updatedAt: new Date().toISOString(),
    };

    customers = customers.map((entry) => (entry.id === id ? updated : entry));
    return { ...updated };
  },

  delete(id: string, hasOrders: (customerId: string) => boolean): void {
    if (hasOrders(id)) {
      throw new Error('Cannot delete a client with existing orders');
    }

    const exists = customers.some((entry) => entry.id === id);
    if (!exists) {
      throw new Error('Customer not found');
    }

    customers = customers.filter((entry) => entry.id !== id);
  },
};
