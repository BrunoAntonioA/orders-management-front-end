export interface Customer {
  id: string;
  ownerId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address: string;
  addressHint?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address: string;
  addressHint?: string;
  notes?: string;
}

export interface UpdateCustomerPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  addressHint?: string;
  notes?: string;
}

export function customerFullName(customer: Pick<Customer, 'firstName' | 'lastName'>): string {
  return `${customer.firstName} ${customer.lastName}`;
}
