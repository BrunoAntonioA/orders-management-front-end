import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientsService } from '../../clients/services/clients.service';
import { DeliveryService } from '../../delivery/services/delivery.service';
import { OrdersService } from '../../orders/services/orders.service';
import { ReportSnapshot } from '../models/reports.model';
import { buildReportSnapshot } from '../utils/reports.builder';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly ordersService = inject(OrdersService);
  private readonly clientsService = inject(ClientsService);
  private readonly deliveryService = inject(DeliveryService);

  getReport(): Observable<ReportSnapshot> {
    return forkJoin({
      orders: this.ordersService.getOrders(),
      clients: this.clientsService.getClients(),
      deliveries: this.deliveryService.getDeliveries(),
    }).pipe(map((data) => buildReportSnapshot(data.orders, data.clients, data.deliveries)));
  }
}
