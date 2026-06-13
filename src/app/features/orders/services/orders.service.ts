import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ordersMockStore } from '../data/orders.mock';
import {
  CreateOrderPayload,
  OrderWithCustomer,
  UpdateOrderPayload,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  getOrders(): Observable<OrderWithCustomer[]> {
    // return this.http.get<OrderWithCustomer[]>(this.baseUrl);
    return of(ordersMockStore.getAll()).pipe(delay(250));
  }

  getOrderById(id: string): Observable<OrderWithCustomer> {
    // return this.http.get<OrderWithCustomer>(`${this.baseUrl}/${id}`);
    const order = ordersMockStore.getById(id);
    if (!order) {
      return throwError(() => new Error('Order not found'));
    }
    return of(order).pipe(delay(200));
  }

  createOrder(payload: CreateOrderPayload): Observable<OrderWithCustomer> {
    // return this.http.post<OrderWithCustomer>(this.baseUrl, payload);
    return of(ordersMockStore.create(payload)).pipe(delay(300));
  }

  updateOrder(id: string, payload: UpdateOrderPayload): Observable<OrderWithCustomer> {
    // return this.http.patch<OrderWithCustomer>(`${this.baseUrl}/${id}`, payload);
    try {
      return of(ordersMockStore.update(id, payload)).pipe(delay(300));
    } catch (error) {
      return throwError(() => error);
    }
  }

  markAsDelivered(id: string): Observable<OrderWithCustomer> {
    // return this.http.post<OrderWithCustomer>(`${this.baseUrl}/${id}/deliver`, {});
    return this.updateOrder(id, { status: 'delivered' });
  }
}
