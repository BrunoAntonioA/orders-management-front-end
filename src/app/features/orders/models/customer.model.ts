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
