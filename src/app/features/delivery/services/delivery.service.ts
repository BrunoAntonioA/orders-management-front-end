import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { OwnerService } from '../../../core/services/owner.service';
import { ordersApi } from '../../orders/config/orders-api.config';
import {
  mapDeliveryCreateToDb,
  mapDeliveryFromDb,
} from '../../../shared/models/delivery.mapper';
import { DeliveryRouteRow } from '../../../shared/models/delivery-row.model';
import { mapOrderFromDb } from '../../../shared/models/order.mapper';
import { OrderRow } from '../../../shared/models/order-row.model';
import { OrderWithCustomer } from '../../orders/models/order.model';
import {
  requireFirstRow,
  SUPABASE_WRITE_HEADERS,
  toServiceError,
} from '../../../shared/utils/supabase-http.utils';
import { deliveryApi } from '../config/delivery-api.config';
import {
  CreateDeliveryPayload,
  DeliveryRoute,
} from '../models/delivery.model';

export interface DeliveryWithOrders extends DeliveryRoute {
  orders: OrderWithCustomer[];
}

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly http = inject(HttpClient);
  private readonly ownerService = inject(OwnerService);

  getDeliveries(): Observable<DeliveryRoute[]> {
    return this.http
      .get<DeliveryRouteRow[]>(deliveryApi.url, {
        params: {
          select: deliveryApi.select,
          order: deliveryApi.listOrder,
        },
      })
      .pipe(
        map((rows) => (rows ?? []).map(mapDeliveryFromDb)),
        catchError((error) => throwError(() => toServiceError(error, 'Could not load deliveries.'))),
      );
  }

  getDeliveryWithOrders(id: string): Observable<DeliveryWithOrders> {
    return forkJoin({
      delivery: this.getDeliveryById(id),
      orders: this.getOrdersForRoute(id),
    }).pipe(map(({ delivery, orders }) => ({ ...delivery, orders })));
  }

  getDeliveryById(id: string): Observable<DeliveryRoute> {
    return this.http
      .get<DeliveryRouteRow[]>(deliveryApi.url, {
        params: {
          select: deliveryApi.select,
          ...deliveryApi.filterById(id),
        },
      })
      .pipe(
        map((rows) => mapDeliveryFromDb(requireFirstRow(rows, 'Delivery not found.'))),
        catchError((error) => throwError(() => toServiceError(error, 'Delivery not found.'))),
      );
  }

  createDelivery(payload: CreateDeliveryPayload): Observable<DeliveryRoute> {
    return this.ownerService.getOwnerId().pipe(
      switchMap((ownerId) =>
        this.http.post<DeliveryRouteRow[]>(
          deliveryApi.url,
          mapDeliveryCreateToDb(payload, ownerId),
          { headers: SUPABASE_WRITE_HEADERS },
        ),
      ),
      map((rows) => mapDeliveryFromDb(requireFirstRow(rows, 'Delivery was created but not returned.'))),
      catchError((error) => throwError(() => toServiceError(error, 'Could not create delivery.'))),
    );
  }

  deleteDelivery(id: string): Observable<void> {
    return this.http
      .delete<void>(deliveryApi.url, { params: deliveryApi.filterById(id) })
      .pipe(
        catchError((error) => throwError(() => toServiceError(error, 'Could not delete delivery.'))),
      );
  }

  getAssignableOrders(): Observable<OrderWithCustomer[]> {
    return this.http
      .get<OrderRow[]>(ordersApi.url, {
        params: {
          select: ordersApi.selectWithRelations,
          ...ordersApi.filterAssignable,
          order: ordersApi.listOrder,
        },
      })
      .pipe(
        map((rows) => (rows ?? []).map(mapOrderFromDb)),
        catchError((error) =>
          throwError(() => toServiceError(error, 'Could not load available orders.')),
        ),
      );
  }

  addOrderToDelivery(deliveryId: string, orderId: string): Observable<void> {
    return this.getOrdersForRoute(deliveryId).pipe(
      switchMap((orders) => {
        const nextStop =
          orders.reduce((max, order) => Math.max(max, order.stopSequence ?? 0), 0) + 1;

        return this.http.patch<void>(
          ordersApi.url,
          {
            route_id: deliveryId,
            stop_sequence: nextStop,
            updated_at: new Date().toISOString(),
          },
          {
            headers: SUPABASE_WRITE_HEADERS,
            params: ordersApi.filterById(orderId),
          },
        );
      }),
      catchError((error) => throwError(() => toServiceError(error, 'Could not add order.'))),
    );
  }

  removeOrderFromDelivery(orderId: string): Observable<void> {
    return this.http
      .patch<void>(
        ordersApi.url,
        {
          route_id: null,
          stop_sequence: null,
          updated_at: new Date().toISOString(),
        },
        {
          headers: SUPABASE_WRITE_HEADERS,
          params: ordersApi.filterById(orderId),
        },
      )
      .pipe(
        catchError((error) => throwError(() => toServiceError(error, 'Could not remove order.'))),
      );
  }

  private getOrdersForRoute(routeId: string): Observable<OrderWithCustomer[]> {
    return this.http
      .get<OrderRow[]>(ordersApi.url, {
        params: {
          select: ordersApi.selectWithRelations,
          ...ordersApi.filterByRouteId(routeId),
          order: ordersApi.routeOrderList,
        },
      })
      .pipe(map((rows) => (rows ?? []).map(mapOrderFromDb)));
  }
}
