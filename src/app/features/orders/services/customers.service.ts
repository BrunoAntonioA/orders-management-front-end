import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Customer } from '../models/customer.model';
import { ordersMockStore } from '../data/orders.mock';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  getCustomers(): Observable<Customer[]> {
    // return this.http.get<Customer[]>(this.baseUrl);
    return of(ordersMockStore.getCustomers()).pipe(delay(200));
  }

  getCustomerById(id: string): Observable<Customer> {
    // return this.http.get<Customer>(`${this.baseUrl}/${id}`);
    const customer = ordersMockStore.getCustomerById(id);
    if (!customer) {
      return throwError(() => new Error('Customer not found'));
    }
    return of(customer).pipe(delay(200));
  }
}
