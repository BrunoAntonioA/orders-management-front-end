import { DeliveryStatus } from '../../features/delivery/models/delivery.model';

export interface DeliveryRouteRow {
  id: string;
  owner_id: string;
  route_date: string;
  name: string | null;
  status: DeliveryStatus;
  driver: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type DeliveryRouteInsertRow = Pick<
  DeliveryRouteRow,
  'owner_id' | 'route_date' | 'status'
> &
  Partial<Pick<DeliveryRouteRow, 'name' | 'driver' | 'notes'>>;
