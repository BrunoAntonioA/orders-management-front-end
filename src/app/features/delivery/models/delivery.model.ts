export type DeliveryStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface DeliveryRoute {
  id: string;
  ownerId: string;
  routeDate: string;
  name?: string;
  status: DeliveryStatus;
  driver?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryPayload {
  routeDate: string;
  name?: string;
  driver?: string;
  notes?: string;
}

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
