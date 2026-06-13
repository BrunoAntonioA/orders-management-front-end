import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { OwnerService } from '../../../core/services/owner.service';
import { customersApi } from '../../../shared/config/customers-api.config';
import {
  mapCustomerFromDb,
  mapCustomerToDb,
  mapCustomerUpdateToDb,
} from '../../../shared/models/customer.mapper';
import { CustomerRow } from '../../../shared/models/customer-row.model';
import {
  CreateCustomerPayload,
  Customer,
  UpdateCustomerPayload,
} from '../../../shared/models/customer.model';
import {
  requireFirstRow,
  SUPABASE_WRITE_HEADERS,
  toServiceError,
} from '../../../shared/utils/supabase-http.utils';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly ownerService = inject(OwnerService);

  getClients(): Observable<Customer[]> {
    return this.http
      .get<CustomerRow[]>(customersApi.url, {
        params: {
          select: customersApi.select,
          order: customersApi.listOrder,
        },
      })
      .pipe(
        map((rows) => (rows ?? []).map(mapCustomerFromDb)),
        catchError((error) => throwError(() => toServiceError(error, 'Could not load clients.'))),
      );
  }

  getClientById(id: string): Observable<Customer> {
    return this.http
      .get<CustomerRow[]>(customersApi.url, {
        params: {
          select: customersApi.select,
          ...customersApi.filterById(id),
        },
      })
      .pipe(
        map((rows) => mapCustomerFromDb(requireFirstRow(rows, 'Client not found.'))),
        catchError((error) => throwError(() => toServiceError(error, 'Client not found.'))),
      );
  }

  createClient(payload: CreateCustomerPayload): Observable<Customer> {
    return this.ownerService.getOwnerId().pipe(
      switchMap((ownerId) =>
        this.http.post<CustomerRow[]>(
          customersApi.url,
          mapCustomerToDb(payload, ownerId),
          { headers: SUPABASE_WRITE_HEADERS },
        ),
      ),
      map((rows) => mapCustomerFromDb(requireFirstRow(rows, 'Client was created but not returned.'))),
      catchError((error) => throwError(() => toServiceError(error, 'Could not create client.'))),
    );
  }

  updateClient(id: string, payload: UpdateCustomerPayload): Observable<Customer> {
    return this.http
      .patch<CustomerRow[]>(
        customersApi.url,
        {
          ...mapCustomerUpdateToDb(payload),
          updated_at: new Date().toISOString(),
        },
        {
          headers: SUPABASE_WRITE_HEADERS,
          params: customersApi.filterById(id),
        },
      )
      .pipe(
        map((rows) => mapCustomerFromDb(requireFirstRow(rows, 'Client was updated but not returned.'))),
        catchError((error) => throwError(() => toServiceError(error, 'Could not update client.'))),
      );
  }

  deleteClient(id: string): Observable<void> {
    return this.http
      .delete<void>(customersApi.url, {
        params: customersApi.filterById(id),
      })
      .pipe(
        catchError((error) => throwError(() => toServiceError(error, 'Could not delete client.'))),
      );
  }
}
