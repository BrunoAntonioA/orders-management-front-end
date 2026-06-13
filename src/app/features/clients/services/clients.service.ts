import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { customersMockStore } from '../../../shared/data/customers.mock';
import { ordersMockStore } from '../../orders/data/orders.mock';
import {
  CreateCustomerPayload,
  Customer,
  UpdateCustomerPayload,
} from '../../../shared/models/customer.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  getClients(): Observable<Customer[]> {
    // return this.http.get<Customer[]>(this.baseUrl);
    return of(customersMockStore.getAll()).pipe(delay(200));
  }

  getClientById(id: string): Observable<Customer> {
    // return this.http.get<Customer>(`${this.baseUrl}/${id}`);
    const client = customersMockStore.getById(id);
    if (!client) {
      return throwError(() => new Error('Client not found'));
    }
    return of(client).pipe(delay(200));
  }

  createClient(payload: CreateCustomerPayload): Observable<Customer> {
    // return this.http.post<Customer>(this.baseUrl, payload);
    return of(customersMockStore.create(payload)).pipe(delay(300));
  }

  updateClient(id: string, payload: UpdateCustomerPayload): Observable<Customer> {
    // return this.http.patch<Customer>(`${this.baseUrl}/${id}`, payload);
    try {
      return of(customersMockStore.update(id, payload)).pipe(delay(300));
    } catch (error) {
      return throwError(() => error);
    }
  }

  deleteClient(id: string): Observable<void> {
    // return this.http.delete<void>(`${this.baseUrl}/${id}`);
    try {
      customersMockStore.delete(id, (customerId) =>
        ordersMockStore.hasOrdersForCustomer(customerId),
      );
      return of(undefined).pipe(delay(300));
    } catch (error) {
      return throwError(() => error);
    }
  }
}
