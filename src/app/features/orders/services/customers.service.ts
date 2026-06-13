import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../../shared/models/customer.model';
import { ClientsService } from '../../clients/services/clients.service';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly clientsService = inject(ClientsService);

  getCustomers(): Observable<Customer[]> {
    return this.clientsService.getClients();
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.clientsService.getClientById(id);
  }
}
