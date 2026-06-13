import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { OwnerService } from '../../../core/services/owner.service';
import { ordersApi } from '../config/orders-api.config';
import {
  mapOrderCreateToDb,
  mapOrderFromDb,
  mapOrderItemsToDb,
  mapOrderUpdateToDb,
} from '../../../shared/models/order.mapper';
import { OrderRow } from '../../../shared/models/order-row.model';
import {
  CreateOrderPayload,
  OrderItemInput,
  OrderWithCustomer,
  UpdateOrderPayload,
} from '../models/order.model';
import {
  requireFirstRow,
  SUPABASE_WRITE_HEADERS,
  toServiceError,
} from '../../../shared/utils/supabase-http.utils';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly ownerService = inject(OwnerService);

  getOrders(): Observable<OrderWithCustomer[]> {
    return this.http
      .get<OrderRow[]>(ordersApi.url, {
        params: {
          select: ordersApi.selectWithRelations,
          order: ordersApi.listOrder,
        },
      })
      .pipe(
        map((rows) => (rows ?? []).map(mapOrderFromDb)),
        catchError((error) => throwError(() => toServiceError(error, 'Could not load orders.'))),
      );
  }

  getOrderById(id: string): Observable<OrderWithCustomer> {
    return this.http
      .get<OrderRow[]>(ordersApi.url, {
        params: {
          select: ordersApi.selectWithRelations,
          ...ordersApi.filterById(id),
        },
      })
      .pipe(
        map((rows) => mapOrderFromDb(requireFirstRow(rows, 'Order not found.'))),
        catchError((error) => throwError(() => toServiceError(error, 'Order not found.'))),
      );
  }

  createOrder(payload: CreateOrderPayload): Observable<OrderWithCustomer> {
    return this.ownerService.getOwnerId().pipe(
      switchMap((ownerId) =>
        this.http.post<OrderRow[]>(
          ordersApi.url,
          mapOrderCreateToDb(payload, ownerId),
          { headers: SUPABASE_WRITE_HEADERS },
        ),
      ),
      map((rows) => requireFirstRow(rows, 'Order was created but not returned.')),
      switchMap((order) =>
        this.insertOrderItems(order.id, payload.items).pipe(map(() => order.id)),
      ),
      switchMap((orderId) => this.getOrderById(orderId)),
      catchError((error) => throwError(() => toServiceError(error, 'Could not create order.'))),
    );
  }

  updateOrder(id: string, payload: UpdateOrderPayload): Observable<OrderWithCustomer> {
    const patchBody = {
      ...mapOrderUpdateToDb(payload),
      updated_at: new Date().toISOString(),
    };

    const patch$ = this.http.patch<OrderRow[]>(ordersApi.url, patchBody, {
      headers: SUPABASE_WRITE_HEADERS,
      params: ordersApi.filterById(id),
    });

    const items$ = payload.items
      ? this.replaceOrderItems(id, payload.items)
      : of(undefined);

    return patch$.pipe(
      switchMap(() => items$),
      switchMap(() => this.getOrderById(id)),
      catchError((error) => throwError(() => toServiceError(error, 'Could not update order.'))),
    );
  }

  markAsDelivered(id: string): Observable<OrderWithCustomer> {
    return this.http
      .patch<OrderRow[]>(
        ordersApi.url,
        {
          status: 'delivered',
          delivered_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          headers: SUPABASE_WRITE_HEADERS,
          params: ordersApi.filterById(id),
        },
      )
      .pipe(
        switchMap(() => this.getOrderById(id)),
        catchError((error) =>
          throwError(() => toServiceError(error, 'Could not mark order as delivered.')),
        ),
      );
  }

  hasOrdersForCustomer(customerId: string): Observable<boolean> {
    return this.http
      .get<{ id: string }[]>(ordersApi.url, {
        params: {
          select: 'id',
          ...ordersApi.filterByCustomerId(customerId),
          limit: 1,
        },
      })
      .pipe(map((rows) => (rows?.length ?? 0) > 0));
  }

  private insertOrderItems(orderId: string, items: OrderItemInput[]): Observable<void> {
    if (items.length === 0) {
      return of(undefined);
    }

    return this.http.post<void>(ordersApi.itemsUrl, mapOrderItemsToDb(orderId, items), {
      headers: SUPABASE_WRITE_HEADERS,
    });
  }

  private replaceOrderItems(orderId: string, items: OrderItemInput[]): Observable<void> {
    const delete$ = this.http.delete<void>(ordersApi.itemsUrl, {
      params: ordersApi.filterItemsByOrderId(orderId),
    });

    return delete$.pipe(switchMap(() => this.insertOrderItems(orderId, items)));
  }
}
