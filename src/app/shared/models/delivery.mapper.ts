import { CreateDeliveryPayload, DeliveryRoute } from '../../features/delivery/models/delivery.model';
import { DeliveryRouteInsertRow, DeliveryRouteRow } from './delivery-row.model';

export function mapDeliveryFromDb(row: DeliveryRouteRow): DeliveryRoute {
  return {
    id: row.id,
    ownerId: row.owner_id,
    routeDate: row.route_date,
    name: row.name ?? undefined,
    status: row.status,
    driver: row.driver ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDeliveryCreateToDb(
  payload: CreateDeliveryPayload,
  ownerId: string,
): DeliveryRouteInsertRow {
  return {
    owner_id: ownerId,
    route_date: payload.routeDate,
    status: 'planned',
    name: payload.name ?? null,
    driver: payload.driver ?? null,
    notes: payload.notes ?? null,
  };
}
