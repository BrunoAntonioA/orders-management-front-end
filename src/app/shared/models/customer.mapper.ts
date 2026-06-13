import { Customer } from './customer.model';
import { CustomerRow } from './customer-row.model';
import {
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from './customer.model';

export function mapCustomerFromDb(row: CustomerRow): Customer {
  return {
    id: row.id,
    ownerId: row.owner_id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    address: row.address,
    addressHint: row.address_hint ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CustomerInsertRow = Pick<
  CustomerRow,
  'owner_id' | 'first_name' | 'last_name' | 'address'
> &
  Partial<Pick<CustomerRow, 'phone' | 'email' | 'address_hint' | 'notes'>>;

export function mapCustomerToDb(
  payload: CreateCustomerPayload,
  ownerId: string,
): CustomerInsertRow {
  return {
    owner_id: ownerId,
    first_name: payload.firstName,
    last_name: payload.lastName,
    address: payload.address,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    address_hint: payload.addressHint ?? null,
    notes: payload.notes ?? null,
  };
}

export function mapCustomerUpdateToDb(
  payload: UpdateCustomerPayload,
): Partial<CustomerInsertRow> {
  return {
    ...(payload.firstName !== undefined && { first_name: payload.firstName }),
    ...(payload.lastName !== undefined && { last_name: payload.lastName }),
    ...(payload.address !== undefined && { address: payload.address }),
    ...(payload.phone !== undefined && { phone: payload.phone || null }),
    ...(payload.email !== undefined && { email: payload.email || null }),
    ...(payload.addressHint !== undefined && { address_hint: payload.addressHint || null }),
    ...(payload.notes !== undefined && { notes: payload.notes || null }),
  };
}
